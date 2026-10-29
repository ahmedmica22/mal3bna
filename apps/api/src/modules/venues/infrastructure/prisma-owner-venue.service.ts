import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { DomainError } from '../../../domain/errors';
import {
  assertValidVenuePhotoCount,
  assertValidCourtPhotoCount,
} from '../domain/venue-photos.policy';

@Injectable()
export class PrismaOwnerVenueService {
  constructor(private readonly prisma: PrismaClient) {}
  async register(
    ownerId: string,
    input: {
      areaId: string;
      name: string;
      description: string;
      phone: string;
      latitude: number;
      longitude: number;
      address: string;
    },
  ) {
    const owner = await this.prisma.user.findUnique({ where: { id: ownerId } });
    if (!owner) throw new DomainError('NOT_FOUND', 'Owner not found');
    if (owner.status === 'pending') {
      throw new DomainError(
        'FORBIDDEN',
        'Owner request is pending approval by the super admin. You cannot send venue info until approved.',
      );
    }
    if (owner.status !== 'active') {
      throw new DomainError('FORBIDDEN', 'Owner account is not active.');
    }

    const existing = await this.prisma.venue.findFirst({ where: { ownerId, archivedAt: null } });
    if (existing) throw new DomainError('CONFLICT', 'An owner may register only one venue');
    return this.prisma.$transaction(async (tx) => {
      const venue = await tx.venue.create({
        data: {
          ownerId,
          areaId: input.areaId,
          name: input.name,
          description: input.description,
          phone: input.phone,
          latitude: input.latitude,
          longitude: input.longitude,
          address: input.address,
          status: 'pending',
        },
      });
      await tx.auditLog.create({
        data: {
          actorId: ownerId,
          actorRole: 'owner',
          action: 'venue.registered',
          targetType: 'venue',
          targetId: venue.id,
        },
      });
      return venue;
    });
  }
  mine(ownerId: string) {
    return this.prisma.venue.findFirst({
      where: { ownerId, archivedAt: null },
      include: {
        courts: {
          include: {
            photos: {
              include: { file: true },
              orderBy: { sortOrder: 'asc' },
            },
            priceRules: {
              orderBy: { validFrom: 'desc' },
            },
          },
        },
        openingHours: true,
        photos: {
          include: { file: true },
          orderBy: { sortOrder: 'asc' },
        },
        documents: true,
      },
    });
  }
  async update(
    ownerId: string,
    venueId: string,
    input: {
      name?: string | undefined;
      description?: string | undefined;
      phone?: string | undefined;
      address?: string | undefined;
      maxHoursPerBooking?: number | undefined;
      areaId?: string | undefined;
    },
  ) {
    const venue = await this.ownedVenue(ownerId, venueId);
    const requiresReapproval = Boolean(input.areaId && input.areaId !== venue.areaId);

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.venue.update({
        where: { id: venueId },
        data: {
          ...(input.name ? { name: input.name } : {}),
          ...(input.description ? { description: input.description } : {}),
          ...(input.phone ? { phone: input.phone } : {}),
          ...(input.address ? { address: input.address } : {}),
          ...(input.maxHoursPerBooking ? { maxHoursPerBooking: input.maxHoursPerBooking } : {}),
          ...(input.areaId ? { areaId: input.areaId } : {}),
          ...(requiresReapproval ? { status: 'pending' } : {}),
        },
        include: {
          courts: {
            include: {
              priceRules: {
                orderBy: { validFrom: 'desc' },
              },
            },
          },
          openingHours: true,
          photos: {
            include: { file: true },
            orderBy: { sortOrder: 'asc' },
          },
          documents: true,
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: ownerId,
          actorRole: 'owner',
          action: 'venue.updated',
          targetType: 'venue',
          targetId: venueId,
        },
      });

      return updated;
    });
  }
  async uploadPhotos(
    ownerId: string,
    venueId: string,
    photos: Array<{ url: string; mimeType?: string | undefined }>,
  ) {
    await this.ownedVenue(ownerId, venueId);
    assertValidVenuePhotoCount(photos?.length ?? 0, 'upload');

    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.venuePhoto.findMany({
        where: { venueId },
        select: { fileId: true },
      });
      const fileIds = existing.map((p) => p.fileId);

      await tx.venuePhoto.deleteMany({ where: { venueId } });
      if (fileIds.length > 0) {
        await tx.file.deleteMany({ where: { id: { in: fileIds } } });
      }

      for (let i = 0; i < photos.length; i++) {
        const p = photos[i]!;
        const file = await tx.file.create({
          data: {
            uploadedBy: ownerId,
            purpose: 'venue_photo',
            visibility: 'public',
            storageKey: p.url,
            mimeType: p.mimeType ?? 'image/jpeg',
            size: p.url.length,
          },
        });
        await tx.venuePhoto.create({
          data: {
            venueId,
            fileId: file.id,
            sortOrder: i + 1,
          },
        });
      }

      await tx.auditLog.create({
        data: {
          actorId: ownerId,
          actorRole: 'owner',
          action: 'venue.photos_uploaded',
          targetType: 'venue',
          targetId: venueId,
        },
      });

      return tx.venue.findUnique({
        where: { id: venueId },
        include: {
          courts: {
            include: {
              priceRules: {
                orderBy: { validFrom: 'desc' },
              },
            },
          },
          openingHours: true,
          photos: {
            include: { file: true },
            orderBy: { sortOrder: 'asc' },
          },
          documents: true,
        },
      });
    });
  }

  async submit(ownerId: string, venueId: string) {
    const venue = await this.prisma.venue.findFirst({ where: { id: venueId, ownerId } });
    if (!venue) throw new DomainError('NOT_FOUND', 'Venue not found');
    if (venue.status !== 'pending')
      throw new DomainError('INVALID_STATE', 'Venue cannot be submitted');

    const photoCount = await this.prisma.venuePhoto.count({ where: { venueId } });
    assertValidVenuePhotoCount(photoCount, 'submission');

    return this.prisma.venue.update({ where: { id: venueId }, data: { status: 'pending' } });
  }
  private async ownedVenue(ownerId: string, venueId: string) {
    const venue = await this.prisma.venue.findFirst({
      where: { id: venueId, ownerId, archivedAt: null },
    });
    if (!venue) throw new DomainError('NOT_FOUND', 'Venue not found');
    return venue;
  }
  async createCourt(
    ownerId: string,
    venueId: string,
    input: {
      name: string;
      sport: 'football' | 'padel';
      size?: number | undefined;
      surface?: string | undefined;
      isIndoor?: boolean | undefined;
      hourlyPriceEgp?: number | undefined;
      photos: Array<{ url: string; mimeType?: string | undefined }>;
    },
  ) {
    await this.ownedVenue(ownerId, venueId);
    if (input.sport === 'football' && ![5, 7, 11].includes(input.size ?? 0))
      throw new DomainError('VALIDATION_FAILED', 'Football courts require size 5, 7, or 11');

    assertValidCourtPhotoCount(input.photos?.length ?? 0);

    return this.prisma.$transaction(async (tx) => {
      const court = await tx.court.create({
        data: {
          venueId,
          name: input.name,
          sport: input.sport,
          size: input.sport === 'padel' ? null : (input.size ?? null),
          ...(input.surface ? { surface: input.surface } : {}),
          isIndoor: input.isIndoor ?? false,
          approvalStatus: 'pending',
          isActive: false,
        },
      });

      for (let i = 0; i < input.photos.length; i++) {
        const p = input.photos[i]!;
        const file = await tx.file.create({
          data: {
            uploadedBy: ownerId,
            purpose: 'court_photo',
            visibility: 'public',
            storageKey: p.url,
            mimeType: p.mimeType ?? 'image/jpeg',
            size: 1024,
          },
        });
        await tx.courtPhoto.create({
          data: {
            courtId: court.id,
            fileId: file.id,
            sortOrder: i,
          },
        });
      }

      if (input.hourlyPriceEgp && input.hourlyPriceEgp > 0) {
        const validFrom = new Date(Date.now() - 60_000); // Initial court pricing active immediately
        for (let day = 0; day < 7; day++) {
          await tx.priceRule.create({
            data: {
              courtId: court.id,
              dayOfWeek: day,
              startMinute: 0,
              endMinute: 1440,
              pricePiastres: Math.round(input.hourlyPriceEgp * 100),
              validFrom,
            },
          });
        }
      }

      await tx.auditLog.create({
        data: {
          actorId: ownerId,
          actorRole: 'owner',
          action: 'court.created',
          targetType: 'court',
          targetId: court.id,
          newValue: {
            name: input.name,
            sport: input.sport,
            size: input.size,
            approvalStatus: 'pending',
            photoCount: input.photos.length,
          },
        },
      });

      return tx.court.findUniqueOrThrow({
        where: { id: court.id },
        include: {
          photos: {
            include: { file: true },
            orderBy: { sortOrder: 'asc' },
          },
          priceRules: true,
        },
      });
    });
  }

  async uploadCourtPhotos(
    ownerId: string,
    venueId: string,
    courtId: string,
    photos: Array<{ url: string; mimeType?: string | undefined }>,
  ) {
    await this.ownedVenue(ownerId, venueId);
    const court = await this.prisma.court.findFirst({
      where: { id: courtId, venueId },
    });
    if (!court) throw new DomainError('NOT_FOUND', 'Court not found');

    assertValidCourtPhotoCount(photos?.length ?? 0);

    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.courtPhoto.findMany({
        where: { courtId },
        select: { fileId: true },
      });
      const fileIds = existing.map((p) => p.fileId);

      await tx.courtPhoto.deleteMany({ where: { courtId } });
      if (fileIds.length > 0) {
        await tx.file.deleteMany({ where: { id: { in: fileIds } } });
      }

      for (let i = 0; i < photos.length; i++) {
        const p = photos[i]!;
        const file = await tx.file.create({
          data: {
            uploadedBy: ownerId,
            purpose: 'court_photo',
            visibility: 'public',
            storageKey: p.url,
            mimeType: p.mimeType ?? 'image/jpeg',
            size: 1024,
          },
        });
        await tx.courtPhoto.create({
          data: {
            courtId,
            fileId: file.id,
            sortOrder: i,
          },
        });
      }

      await tx.auditLog.create({
        data: {
          actorId: ownerId,
          actorRole: 'owner',
          action: 'court.photos_uploaded',
          targetType: 'court',
          targetId: courtId,
          newValue: { photoCount: photos.length },
        },
      });

      return tx.court.findUniqueOrThrow({
        where: { id: courtId },
        include: {
          photos: {
            include: { file: true },
            orderBy: { sortOrder: 'asc' },
          },
        },
      });
    });
  }
  async setOpeningHours(
    ownerId: string,
    venueId: string,
    dayOfWeek: number,
    openMinute: number,
    closeMinute: number,
  ) {
    await this.ownedVenue(ownerId, venueId);
    if (
      dayOfWeek < 0 ||
      dayOfWeek > 6 ||
      openMinute < 0 ||
      closeMinute > 1440 ||
      openMinute >= closeMinute
    )
      throw new DomainError('VALIDATION_FAILED', 'Opening hours are invalid');
    return this.prisma.openingHour.upsert({
      where: { venueId_dayOfWeek: { venueId, dayOfWeek } },
      update: { openMinute, closeMinute },
      create: { venueId, dayOfWeek, openMinute, closeMinute },
    });
  }
  async setPriceRules(
    ownerId: string,
    venueId: string,
    courtId: string,
    rules: Array<{
      dayOfWeek: number;
      startMinute: number;
      endMinute: number;
      pricePiastres: number;
    }>,
  ) {
    await this.ownedVenue(ownerId, venueId);
    const court = await this.prisma.court.findFirst({
      where: { id: courtId, venueId },
    });
    if (!court) throw new DomainError('NOT_FOUND', 'Court not found');
    const validFrom = new Date(Date.now() + 24 * 60 * 60_000);
    return this.prisma.$transaction(
      rules.map((rule) =>
        this.prisma.priceRule.create({
          data: {
            courtId,
            dayOfWeek: rule.dayOfWeek,
            startMinute: rule.startMinute,
            endMinute: rule.endMinute,
            pricePiastres: rule.pricePiastres,
            validFrom,
          },
        }),
      ),
    );
  }
}
