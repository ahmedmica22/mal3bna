import { PrismaClient, Role, UserStatus, VenueStatus, Sport } from '@prisma/client';

export interface TestVenueFixture {
  owner: { id: string; email: string };
  venue: { id: string; name: string };
  courts: Array<{ id: string; name: string; sport: Sport; venueId: string }>;
  court1: { id: string; name: string; sport: Sport; venueId: string };
  court2: { id: string; name: string; sport: Sport; venueId: string };
  area: { id: string; nameEn: string };
}

export async function createTestVenueFixture(
  prisma: PrismaClient,
  suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
): Promise<TestVenueFixture> {
  const area = await prisma.area.findFirstOrThrow();

  const owner = await prisma.user.create({
    data: {
      email: `owner-${suffix}@example.test`,
      passwordHash: 'test-hash',
      role: 'owner' as Role,
      status: 'active' as UserStatus,
      name: `Test Owner ${suffix}`,
      phone: `+2010${Math.floor(10000000 + Math.random() * 90000000)}`,
      language: 'en',
      emailVerifiedAt: new Date(),
    },
  });

  const venue = await prisma.venue.create({
    data: {
      ownerId: owner.id,
      areaId: area.id,
      name: `Test Venue ${suffix}`,
      description: 'Integration test venue',
      phone: `+2011${Math.floor(10000000 + Math.random() * 90000000)}`,
      latitude: 30.0444,
      longitude: 31.2357,
      address: 'Test Address 123',
      timeZone: 'Africa/Cairo',
      status: 'approved' as VenueStatus,
      commissionBp: 1000,
      maxHoursPerBooking: 4,
    },
  });

  for (let day = 0; day < 7; day++) {
    await prisma.openingHour.create({
      data: {
        venueId: venue.id,
        dayOfWeek: day,
        openMinute: 0,
        closeMinute: 1440,
      },
    });
  }

  const court1 = await prisma.court.create({
    data: {
      venueId: venue.id,
      name: `Court 1 Football ${suffix}`,
      sport: 'football' as Sport,
      size: 5,
      surface: 'turf',
      approvalStatus: 'approved',
      isActive: true,
    },
  });

  const court2 = await prisma.court.create({
    data: {
      venueId: venue.id,
      name: `Court 2 Padel ${suffix}`,
      sport: 'padel' as Sport,
      surface: 'glass',
      approvalStatus: 'approved',
      isActive: true,
    },
  });

  for (let day = 0; day < 7; day++) {
    await prisma.priceRule.create({
      data: {
        courtId: court1.id,
        dayOfWeek: day,
        startMinute: 0,
        endMinute: 1440,
        pricePiastres: 25000,
        validFrom: new Date('2026-01-01T00:00:00.000Z'),
      },
    });
    await prisma.priceRule.create({
      data: {
        courtId: court2.id,
        dayOfWeek: day,
        startMinute: 0,
        endMinute: 1440,
        pricePiastres: 35000,
        validFrom: new Date('2026-01-01T00:00:00.000Z'),
      },
    });
  }

  return {
    owner,
    venue,
    courts: [court1, court2],
    court1,
    court2,
    area,
  };
}

export async function cleanupTestVenueFixture(
  prisma: PrismaClient,
  fixture: { owner: { id: string }; venue: { id: string } },
): Promise<void> {
  try {
    await prisma.payment.deleteMany({ where: { reservation: { venueId: fixture.venue.id } } });
    await prisma.review.deleteMany({ where: { venueId: fixture.venue.id } });
    await prisma.ledgerEntry.deleteMany({ where: { venueId: fixture.venue.id } });
    await prisma.reservation.deleteMany({ where: { venueId: fixture.venue.id } });
    await prisma.priceRule.deleteMany({ where: { court: { venueId: fixture.venue.id } } });
    await prisma.court.deleteMany({ where: { venueId: fixture.venue.id } });
    await prisma.openingHour.deleteMany({ where: { venueId: fixture.venue.id } });
    await prisma.venue.delete({ where: { id: fixture.venue.id } });
    await prisma.session.deleteMany({ where: { userId: fixture.owner.id } });
    // Note: audit rows are intentionally immutable triggers in PostgreSQL;
    // user records referenced in audit log cannot be hard-deleted.
  } catch {
    // Continue if already deleted or cascade handled
  }
}
