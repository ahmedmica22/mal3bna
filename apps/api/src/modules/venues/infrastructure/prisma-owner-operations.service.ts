import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { DomainError } from '../../../domain/errors';
import { PrismaBookingService } from '../../bookings/infrastructure/prisma-booking.service';

@Injectable()
export class PrismaOwnerOperationsService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly bookingService: PrismaBookingService,
  ) {}
  private async court(ownerId: string, courtId: string) {
    const court = await this.prisma.court.findFirst({
      where: { id: courtId, venue: { ownerId, archivedAt: null } },
      include: { venue: true },
    });
    if (!court) throw new DomainError('NOT_FOUND', 'Court not found');
    return court;
  }
  async bookings(ownerId: string, from?: Date, to?: Date) {
    const rows = await this.prisma.reservation.findMany({
      where: {
        venue: { ownerId },
        ...(from || to
          ? { startsAt: { ...(from ? { gte: from } : {}), ...(to ? { lt: to } : {}) } }
          : {}),
      },
      orderBy: { startsAt: 'asc' },
      select: {
        id: true,
        bookingCode: true,
        courtId: true,
        startsAt: true,
        endsAt: true,
        status: true,
        kind: true,
        customerName: true,
        customerPhone: true,
        totalPiastres: true,
        depositPiastres: true,
        paidPiastres: true,
        dueAtVenuePiastres: true,
        venueCollectedAt: true,
        court: { select: { name: true } },
        player: { select: { name: true } },
        payments: { select: { method: true } },
      },
    });
    return rows.map(({ court, player, payments, ...booking }) => ({
      ...booking,
      courtName: court.name,
      customerName: booking.customerName ?? player?.name ?? null,
      isTestPayment: payments.some((payment) => payment.method === 'fake'),
    }));
  }
  async arrive(ownerId: string, id: string, now = new Date()) {
    const cleanId = id.trim().replace(/^#/, '');
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanId);
    const booking = await this.prisma.reservation.findFirst({
      where: {
        venue: { ownerId },
        status: { in: ['confirmed', 'arrived'] },
        ...(isUuid ? { OR: [{ id: cleanId }, { bookingCode: cleanId }] } : { bookingCode: cleanId }),
      },
      include: {
        player: { select: { name: true, phone: true, email: true } },
        court: { select: { name: true } },
        venue: { select: { name: true } },
      },
    });
    if (!booking) throw new DomainError('NOT_FOUND', 'Booking not found');
    const updated =
      booking.status === 'arrived'
        ? booking
        : await this.prisma.reservation.update({
            where: { id: booking.id },
            data: { status: 'arrived', arrivedAt: now },
            include: {
              player: { select: { name: true, phone: true, email: true } },
              court: { select: { name: true } },
              venue: { select: { name: true } },
            },
          });
    return {
      id: updated.id,
      bookingCode: updated.bookingCode,
      status: updated.status,
      customerName: updated.customerName ?? updated.player?.name ?? null,
      customerPhone: updated.customerPhone ?? updated.player?.phone ?? null,
      startsAt: updated.startsAt,
      courtName: updated.court.name,
      venueName: updated.venue.name,
      dueAtVenuePiastres: updated.dueAtVenuePiastres,
    };
  }
  async publicCheckIn(idOrCode: string, now = new Date()) {
    const cleanId = idOrCode.trim().replace(/^#/, '');
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanId);
    const booking = await this.prisma.reservation.findFirst({
      where: {
        status: { in: ['confirmed', 'arrived'] },
        ...(isUuid ? { OR: [{ id: cleanId }, { bookingCode: cleanId }] } : { bookingCode: cleanId }),
      },
      include: {
        player: { select: { name: true, phone: true, email: true } },
        court: { select: { name: true } },
        venue: { select: { name: true } },
      },
    });
    if (!booking) throw new DomainError('NOT_FOUND', 'Active reservation not found');
    const updated =
      booking.status === 'arrived'
        ? booking
        : await this.prisma.reservation.update({
            where: { id: booking.id },
            data: { status: 'arrived', arrivedAt: now },
            include: {
              player: { select: { name: true, phone: true, email: true } },
              court: { select: { name: true } },
              venue: { select: { name: true } },
            },
          });
    return {
      id: updated.id,
      bookingCode: updated.bookingCode,
      status: updated.status,
      customerName: updated.customerName ?? updated.player?.name ?? null,
      customerPhone: updated.customerPhone ?? updated.player?.phone ?? null,
      startsAt: updated.startsAt,
      endsAt: updated.endsAt,
      courtName: updated.court.name,
      venueName: updated.venue.name,
      dueAtVenuePiastres: updated.dueAtVenuePiastres,
      alreadyArrived: booking.status === 'arrived',
    };
  }
  async complete(ownerId: string, id: string, now = new Date()) {
    const booking = await this.prisma.reservation.findFirst({
      where: { id, venue: { ownerId }, status: { in: ['arrived', 'confirmed'] } },
    });
    if (!booking) throw new DomainError('NOT_FOUND', 'Booking not found');
    if (now < booking.endsAt)
      throw new DomainError('TOO_EARLY', 'Booking cannot complete before its end');
    return this.prisma.reservation.update({
      where: { id },
      data: { status: 'completed', completedAt: now },
    });
  }
  async collect(ownerId: string, id: string, now = new Date()) {
    const booking = await this.prisma.reservation.findFirst({
      where: { id, venue: { ownerId }, status: { in: ['confirmed', 'arrived', 'completed'] } },
    });
    if (!booking) throw new DomainError('NOT_FOUND', 'Booking not found');
    const cashToCollect = booking.dueAtVenuePiastres;
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.reservation.update({
        where: { id },
        data: {
          venueCollectedAt: now,
          collectedBy: ownerId,
          paidPiastres: booking.paidPiastres + cashToCollect,
          dueAtVenuePiastres: 0,
        },
      });
      await tx.auditLog.create({
        data: {
          actorId: ownerId,
          actorRole: 'owner',
          action: 'booking.cash_collected',
          targetType: 'reservation',
          targetId: booking.id,
          newValue: {
            collectedCashPiastres: cashToCollect,
            totalPaidPiastres: booking.paidPiastres + cashToCollect,
          },
        },
      });
      return updated;
    });
  }
  async manual(
    ownerId: string,
    input: {
      courtId: string;
      startsAt: Date;
      hours: number;
      customerName: string;
      customerPhone?: string | undefined;
      totalPiastres: number;
    },
  ) {
    const court = await this.court(ownerId, input.courtId);
    const endsAt = new Date(input.startsAt.getTime() + input.hours * 3_600_000);
    await this.prisma.reservation.updateMany({
      where: {
        courtId: court.id,
        status: 'held',
        holdExpiresAt: { lte: new Date() },
      },
      data: { status: 'expired' },
    });
    return this.prisma.reservation.create({
      data: {
        courtId: court.id,
        venueId: court.venueId,
        kind: 'manual',
        status: 'confirmed',
        startsAt: input.startsAt,
        endsAt,
        customerName: input.customerName,
        ...(input.customerPhone ? { customerPhone: input.customerPhone } : {}),
        totalPiastres: input.totalPiastres,
        depositPiastres: 0,
        dueAtVenuePiastres: input.totalPiastres,
        commissionBp: 0,
        priceBreakdown: [],
        bookingCode: `M-${Date.now().toString(36).toUpperCase()}`,
      },
    });
  }
  async block(
    ownerId: string,
    input: { courtId: string; startsAt: Date; hours: number; reason: string },
  ) {
    const court = await this.court(ownerId, input.courtId);
    const endsAt = new Date(input.startsAt.getTime() + input.hours * 3_600_000);
    await this.prisma.reservation.updateMany({
      where: {
        courtId: court.id,
        status: 'held',
        holdExpiresAt: { lte: new Date() },
      },
      data: { status: 'expired' },
    });
    return this.prisma.reservation.create({
      data: {
        courtId: court.id,
        venueId: court.venueId,
        kind: 'block',
        status: 'confirmed',
        startsAt: input.startsAt,
        endsAt,
        totalPiastres: 0,
        depositPiastres: 0,
        dueAtVenuePiastres: 0,
        commissionBp: 0,
        priceBreakdown: [],
        bookingCode: `B-${Date.now().toString(36).toUpperCase()}`,
        blockReason: input.reason,
      },
    });
  }

  async balance(ownerId: string) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [entries, collectedCashRows, todayCashRows] = await Promise.all([
      this.prisma.ledgerEntry.groupBy({
        by: ['account'],
        where: { venue: { ownerId } },
        _sum: { amountPiastres: true },
      }),
      this.prisma.reservation.aggregate({
        where: {
          venue: { ownerId },
          venueCollectedAt: { not: null },
        },
        _sum: {
          paidPiastres: true,
          depositPiastres: true,
          totalPiastres: true,
        },
      }),
      this.prisma.reservation.aggregate({
        where: {
          venue: { ownerId },
          venueCollectedAt: { gte: todayStart },
        },
        _sum: {
          paidPiastres: true,
          depositPiastres: true,
          totalPiastres: true,
        },
      }),
    ]);

    let availablePiastres = 0;
    let pendingPiastres = 0;
    let releasedPiastres = 0;

    for (const row of entries) {
      const sum = row._sum.amountPiastres ?? 0;
      if (row.account === 'VENUE_BALANCE') {
        availablePiastres += sum;
        if (sum > 0) releasedPiastres += sum;
      } else if (row.account === 'HELD') {
        if (sum > 0) pendingPiastres += sum;
      }
    }

    const cashCollectedPiastres = Math.max(
      0,
      (collectedCashRows._sum.paidPiastres ?? 0) - (collectedCashRows._sum.depositPiastres ?? 0),
    );
    const todayCashCollectedPiastres = Math.max(
      0,
      (todayCashRows._sum.paidPiastres ?? 0) - (todayCashRows._sum.depositPiastres ?? 0),
    );

    return {
      availablePiastres: Math.max(0, availablePiastres),
      pendingPiastres: Math.max(0, pendingPiastres),
      releasedPiastres: Math.max(0, releasedPiastres),
      cashCollectedPiastres,
      todayCashCollectedPiastres,
      totalEarnedPiastres: Math.max(0, releasedPiastres) + cashCollectedPiastres,
    };
  }

  payouts(ownerId: string) {
    return this.prisma.payout.findMany({
      where: { venue: { ownerId } },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        amountPiastres: true,
        periodStart: true,
        periodEnd: true,
        status: true,
        paidAt: true,
        paymentReference: true,
      },
    });
  }

  async report(ownerId: string, from?: Date, to?: Date) {
    const venue = await this.prisma.venue.findFirst({
      where: { ownerId },
      include: {
        courts: { where: { isActive: true } },
        openingHours: true,
      },
    });

    if (!venue || venue.courts.length === 0) {
      return {
        totalHours: 0,
        bookedHours: 0,
        rate: 0,
      };
    }

    const now = new Date();
    const startDate = from ?? new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const endDate = to ?? new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

    const reservations = await this.prisma.reservation.findMany({
      where: {
        venueId: venue.id,
        status: { in: ['held', 'confirmed', 'arrived', 'completed'] },
        startsAt: { gte: startDate, lt: endDate },
      },
      select: { startsAt: true, endsAt: true },
    });

    let bookedHours = 0;
    for (const r of reservations) {
      const diffMs = r.endsAt.getTime() - r.startsAt.getTime();
      const h = Math.max(0, Math.round(diffMs / (1000 * 60 * 60)));
      bookedHours += h;
    }

    const daysDiff = Math.max(
      1,
      Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
    );

    let avgDailyHours = 16;
    if (venue.openingHours && venue.openingHours.length > 0) {
      const sumDaily = venue.openingHours.reduce((acc, oh) => {
        const hours = Math.max(0, (oh.closeMinute - oh.openMinute) / 60);
        return acc + hours;
      }, 0);
      avgDailyHours = Math.max(1, sumDaily / venue.openingHours.length);
    }

    const totalHours = Math.round(avgDailyHours * daysDiff * venue.courts.length);
    const rate =
      totalHours > 0 ? Math.min(1, Math.round((bookedHours / totalHours) * 1000) / 1000) : 0;

    return {
      totalHours,
      bookedHours,
      rate,
    };
  }

  closurePreview(ownerId: string, courtId: string, now = new Date()) {
    return this.prisma.reservation.findMany({
      where: {
        court: { id: courtId, venue: { ownerId } },
        startsAt: { gte: now },
        status: { in: ['held', 'confirmed', 'arrived'] },
      },
      orderBy: { startsAt: 'asc' },
      select: { id: true, bookingCode: true, startsAt: true, endsAt: true, totalPiastres: true },
    });
  }

  async closeCourt(ownerId: string, courtId: string, confirm: boolean, now = new Date()) {
    const court = await this.court(ownerId, courtId);
    const affected = await this.closurePreview(ownerId, courtId, now);
    if (!confirm) return { courtId, affected, requiresConfirmation: affected.length > 0 };
    for (const booking of affected)
      await this.bookingService.operatorCancel(
        ownerId,
        'owner',
        booking.id,
        `court-close:${booking.id}`,
      );
    await this.prisma.$transaction(async (tx) => {
      await tx.court.update({ where: { id: court.id }, data: { isActive: false } });
      await tx.auditLog.create({
        data: {
          actorId: ownerId,
          actorRole: 'owner',
          action: 'court.closed',
          targetType: 'court',
          targetId: courtId,
          newValue: { cancelledReservationIds: affected.map((booking) => booking.id) },
        },
      });
    });
    return { courtId, affected: affected.length, closed: true };
  }

  async getProfile(ownerId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: ownerId },
      include: {
        ownerProfile: {
          include: { photoFile: { select: { storageKey: true } } },
        },
      },
    });
    if (!user) throw new DomainError('NOT_FOUND', 'Owner not found');
    return {
      userId: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      photoUrl: user.ownerProfile?.photoFile?.storageKey ?? null,
      photoFileId: user.ownerProfile?.photoFileId ?? null,
    };
  }

  async updateProfile(
    ownerId: string,
    input: {
      photoUrl?: string | undefined;
      photoFileId?: string | undefined;
      name?: string | undefined;
      phone?: string | undefined;
    },
  ) {
    let resolvedPhotoFileId = input.photoFileId;
    if (input.photoUrl) {
      const file = await this.prisma.file.create({
        data: {
          uploadedBy: ownerId,
          purpose: 'player_photo',
          visibility: 'public',
          storageKey: input.photoUrl,
          mimeType: input.photoUrl.startsWith('data:image/png')
            ? 'image/png'
            : input.photoUrl.startsWith('data:image/webp')
              ? 'image/webp'
              : 'image/jpeg',
          size: Math.max(1024, Math.round(input.photoUrl.length * 0.75)),
        },
      });
      resolvedPhotoFileId = file.id;
    }

    if (input.name || input.phone !== undefined) {
      await this.prisma.user.update({
        where: { id: ownerId },
        data: {
          ...(input.name ? { name: input.name } : {}),
          ...(input.phone !== undefined ? { phone: input.phone } : {}),
        },
      });
    }

    const profile = await this.prisma.ownerProfile.upsert({
      where: { userId: ownerId },
      create: {
        userId: ownerId,
        photoFileId: resolvedPhotoFileId ?? null,
      },
      update: {
        ...(resolvedPhotoFileId !== undefined ? { photoFileId: resolvedPhotoFileId } : {}),
      },
      include: {
        photoFile: { select: { storageKey: true } },
      },
    });

    const user = await this.prisma.user.findUnique({ where: { id: ownerId } });

    return {
      userId: ownerId,
      name: user?.name,
      email: user?.email,
      phone: user?.phone,
      photoUrl: profile.photoFile?.storageKey ?? null,
      photoFileId: profile.photoFileId,
    };
  }
}
