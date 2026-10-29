import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { calculatePrice } from '../domain/price-calculator';
import { businessConstants } from '@court-booking/config';
import type { VenueReader } from '../application/venue-reader';

const caFormatterCache = new Map<string, Intl.DateTimeFormat>();
const usClockCache = new Map<string, Intl.DateTimeFormat>();

function getCaFormatter(timeZone: string): Intl.DateTimeFormat {
  let f = caFormatterCache.get(timeZone);
  if (!f) {
    f = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    caFormatterCache.set(timeZone, f);
  }
  return f;
}

function getUsClock(timeZone: string): Intl.DateTimeFormat {
  let f = usClockCache.get(timeZone);
  if (!f) {
    f = new Intl.DateTimeFormat('en-US', {
      timeZone,
      weekday: 'short',
      hour: '2-digit',
      hourCycle: 'h23',
    });
    usClockCache.set(timeZone, f);
  }
  return f;
}

@Injectable()
export class PrismaVenueReadService implements VenueReader {
  constructor(private readonly prisma: PrismaClient) {}
  listCities() {
    return this.prisma.city.findMany({
      where: { isActive: true },
      select: { id: true, nameEn: true, nameAr: true, isActive: true },
    });
  }
  listAreas(cityId?: string) {
    return this.prisma.area.findMany({
      where: { ...(cityId ? { cityId } : {}), isActive: true },
      select: { id: true, cityId: true, nameEn: true, nameAr: true, isActive: true },
    });
  }
  listVenues(filters: { areaId?: string; search?: string; sport?: 'football' | 'padel'; size?: 5 | 7 | 11 }) {
    return this.prisma.venue.findMany({
      where: {
        status: 'approved',
        ...(filters.areaId ? { areaId: filters.areaId } : {}),
        ...(filters.search
          ? {
              OR: [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { address: { contains: filters.search, mode: 'insensitive' } },
                { area: { nameEn: { contains: filters.search, mode: 'insensitive' } } },
                { area: { nameAr: { contains: filters.search, mode: 'insensitive' } } },
              ],
            }
          : {}),
        courts: {
          some: {
            isActive: true,
            approvalStatus: 'approved',
            ...(filters.sport ? { sport: filters.sport } : {}),
            ...(filters.size ? { size: filters.size } : {}),
          },
        },
      },
      select: {
        id: true,
        areaId: true,
        name: true,
        description: true,
        phone: true,
        latitude: true,
        longitude: true,
        address: true,
        timeZone: true,
        status: true,
        maxHoursPerBooking: true,
        area: {
          select: {
            id: true,
            nameEn: true,
            nameAr: true,
            city: {
              select: {
                id: true,
                nameEn: true,
                nameAr: true,
              },
            },
          },
        },
        courts: {
          where: { isActive: true, approvalStatus: 'approved' },
          select: {
            id: true,
            name: true,
            sport: true,
            size: true,
            surface: true,
            isIndoor: true,
            photos: {
              select: {
                sortOrder: true,
                file: { select: { storageKey: true, mimeType: true } },
              },
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
        photos: {
          select: {
            sortOrder: true,
            file: { select: { storageKey: true, mimeType: true } },
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  }
  getVenue(id: string) {
    return this.prisma.venue.findFirst({
      where: { id, status: 'approved' },
      select: {
        id: true,
        areaId: true,
        name: true,
        description: true,
        phone: true,
        latitude: true,
        longitude: true,
        address: true,
        timeZone: true,
        status: true,
        maxHoursPerBooking: true,
        area: {
          select: {
            id: true,
            nameEn: true,
            nameAr: true,
            city: {
              select: {
                id: true,
                nameEn: true,
                nameAr: true,
              },
            },
          },
        },
        courts: {
          where: { isActive: true, approvalStatus: 'approved' },
          select: {
            id: true,
            name: true,
            sport: true,
            size: true,
            surface: true,
            isIndoor: true,
            photos: {
              select: {
                sortOrder: true,
                file: { select: { storageKey: true, mimeType: true } },
              },
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
        photos: {
          select: {
            sortOrder: true,
            file: { select: { storageKey: true, mimeType: true } },
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  }
  async quote(courtId: string, startsAt: Date, hours: number) {
    const court = await this.prisma.court.findFirst({
      where: { id: courtId, isActive: true, approvalStatus: 'approved' },
      include: { venue: true, priceRules: true },
    });
    if (!court || court.venue.status !== 'approved') throw new Error('Venue not bookable');
    if (hours > court.venue.maxHoursPerBooking) throw new Error('Too many hours');
    const breakdown = calculatePrice(court.priceRules, startsAt, hours, court.venue.timeZone);
    const totalPiastres = breakdown.reduce((sum, item) => sum + item.pricePiastres, 0);
    const depositPiastres = Math.floor((totalPiastres * 30 + 50) / 100);
    return {
      breakdown,
      totalPiastres,
      depositPiastres,
      dueAtVenuePiastres: totalPiastres - depositPiastres,
    };
  }
  async availability(courtId: string, date: Date) {
    if (!Number.isFinite(date.getTime())) throw new Error('Invalid date');
    const day = date.toISOString().slice(0, 10);
    const court = await this.prisma.court.findFirst({
      where: { id: courtId, isActive: true, approvalStatus: 'approved' },
      include: { venue: { include: { openingHours: true } }, priceRules: true },
    });
    if (!court || court.venue.status !== 'approved') return [];
    const now = Date.now();

    if (typeof this.prisma.reservation?.updateMany === 'function') {
      await this.prisma.reservation.updateMany({
        where: { courtId, status: 'held', holdExpiresAt: { lte: new Date(now) } },
        data: { status: 'expired' },
      });
    }

    const start = Date.parse(day + 'T00:00:00Z') - 86_400_000;
    const end = start + 3 * 86_400_000;
    const reservations = await this.prisma.reservation.findMany({
      where: {
        courtId,
        startsAt: { lt: new Date(end) },
        endsAt: { gt: new Date(start) },
        status: { in: ['held', 'confirmed', 'arrived', 'completed', 'no_show_pending', 'no_show'] },
      },
      select: { startsAt: true, endsAt: true, status: true, holdExpiresAt: true },
    });
    const formatter = getCaFormatter(court.venue.timeZone);
    const clock = getUsClock(court.venue.timeZone);
    const slots = [];
    for (let instant = start; instant < end; instant += 3_600_000) {
      const startsAt = new Date(instant);
      if (formatter.format(startsAt) !== day) continue;
      const parts = clock.formatToParts(startsAt);
      const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(
        parts.find((p) => p.type === 'weekday')!.value,
      );
      const minute = Number(parts.find((p) => p.type === 'hour')!.value) * 60;
      const open = court.venue.openingHours.some(
        (rule) =>
          (rule.dayOfWeek === weekday &&
            minute >= rule.openMinute &&
            minute + 60 <= rule.closeMinute) ||
          (rule.dayOfWeek === (weekday + 6) % 7 &&
            minute + 1440 >= rule.openMinute &&
            minute + 1500 <= rule.closeMinute),
      );
      if (!open) continue;
      let pricePiastres: number;
      try {
        pricePiastres = calculatePrice(court.priceRules, startsAt, 1, court.venue.timeZone)[0]!
          .pricePiastres;
      } catch {
        continue;
      }
      const occupied = reservations.some(
        (item) =>
          item.startsAt.getTime() < instant + 3_600_000 &&
          item.endsAt.getTime() > instant &&
          !(item.status === 'held' && item.holdExpiresAt && item.holdExpiresAt.getTime() <= now),
      );
      const outsideWindow =
        instant <= now + businessConstants.MIN_LEAD_MINUTES * 60_000 ||
        instant > now + businessConstants.MAX_ADVANCE_DAYS * 86_400_000;
      slots.push({
        startsAt,
        endsAt: new Date(instant + 3_600_000),
        status: occupied
          ? ('booked' as const)
          : outsideWindow
            ? ('past' as const)
            : ('available' as const),
        pricePiastres,
      });
    }
    return slots;
  }
}
