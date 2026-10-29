import { describe, expect, it } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { ReviewsService } from './reviews.service';
import { PrismaOwnerOperationsService } from '../venues/infrastructure/prisma-owner-operations.service';
import { PrismaBookingService } from '../bookings/infrastructure/prisma-booking.service';
import { FakePaymentGateway } from '../bookings/application/fake-payment.gateway';
import { createTestVenueFixture, cleanupTestVenueFixture } from '../../test/integration-fixtures';

const integration = process.env.RUN_INTEGRATION === '1' ? describe : describe.skip;

integration('reviews and court closure integration', () => {
  it('creates, replies to, lists, and removes a review with ownership checks', async () => {
    const prisma = new PrismaClient();
    const reviews = new ReviewsService(prisma);
    let fixture: Awaited<ReturnType<typeof createTestVenueFixture>> | undefined;
    let reservationId: string | undefined;

    try {
      fixture = await createTestVenueFixture(prisma);
      const owner = fixture.owner;
      const court = fixture.court1;

      const admin = await prisma.user.create({
        data: {
          email: `review-admin-${Date.now()}@example.test`,
          passwordHash: 'test',
          role: 'admin',
          status: 'active',
          name: 'Review Admin',
          language: 'en',
          emailVerifiedAt: new Date(),
        },
      });
      const player = await prisma.user.create({
        data: {
          email: `review-player-${Date.now()}@example.test`,
          passwordHash: 'test',
          role: 'player',
          status: 'active',
          name: 'Review Player',
          language: 'en',
          emailVerifiedAt: new Date(),
        },
      });

      const reservation = await prisma.reservation.create({
        data: {
          courtId: court.id,
          venueId: court.venueId,
          kind: 'booking',
          status: 'completed',
          startsAt: new Date(Date.now() - 2 * 60 * 60_000),
          endsAt: new Date(Date.now() - 60 * 60_000),
          playerId: player.id,
          totalPiastres: 1000,
          depositPiastres: 300,
          paidPiastres: 1000,
          commissionBp: 1000,
          priceBreakdown: [],
          bookingCode: `R-${Date.now().toString(36)}`,
        },
      });
      reservationId = reservation.id;

      const review = await reviews.create(player.id, reservation.id, 5, 'Great court');
      await reviews.reply(owner.id, review.id, 'Thank you');
      expect(await reviews.listVenue(court.venueId)).toHaveLength(1);
      await reviews.remove(admin.id, review.id, 'Moderation test');
      expect(await reviews.listVenue(court.venueId)).toHaveLength(0);
    } finally {
      if (reservationId) {
        await prisma.review.deleteMany({ where: { reservationId } });
        await prisma.reservation.deleteMany({ where: { id: reservationId } });
      }
      if (fixture) {
        await cleanupTestVenueFixture(prisma, fixture);
      }
      await prisma.$disconnect();
    }
  }, 30000);

  it('previews and confirms a future court closure through the overlap owner path', async () => {
    const prisma = new PrismaClient();
    const gateway = new FakePaymentGateway();
    const bookingService = new PrismaBookingService(prisma, gateway);
    const operations = new PrismaOwnerOperationsService(prisma, bookingService);
    let fixture: Awaited<ReturnType<typeof createTestVenueFixture>> | undefined;
    let reservationId: string | undefined;

    try {
      fixture = await createTestVenueFixture(prisma);
      const owner = fixture.owner;
      const venue = fixture.venue;

      const court = await prisma.court.create({
        data: { venueId: venue.id, name: `Closure Test ${Date.now()}`, sport: 'football', size: 5 },
      });

      let startsAt = new Date();
      for (let attempt = 0; attempt < 10; attempt += 1) {
        const candidate = new Date(Date.now() + (18 + attempt) * 24 * 60 * 60_000);
        candidate.setUTCMinutes(0, 0, 0);
        const conflict = await prisma.reservation.count({
          where: {
            courtId: court.id,
            startsAt: { lt: new Date(candidate.getTime() + 60 * 60_000) },
            endsAt: { gt: candidate },
            status: {
              in: ['held', 'confirmed', 'arrived', 'completed', 'no_show', 'no_show_pending'],
            },
          },
        });
        if (conflict === 0) {
          startsAt = candidate;
          break;
        }
      }

      const reservation = await prisma.reservation.create({
        data: {
          courtId: court.id,
          venueId: court.venueId,
          kind: 'manual',
          status: 'confirmed',
          startsAt,
          endsAt: new Date(startsAt.getTime() + 60 * 60_000),
          customerName: 'Closure test',
          totalPiastres: 1000,
          depositPiastres: 0,
          dueAtVenuePiastres: 1000,
          commissionBp: 0,
          priceBreakdown: [],
          bookingCode: `C-${Date.now().toString(36)}`,
        },
      });
      reservationId = reservation.id;

      const preview = await operations.closeCourt(owner.id, court.id, false);
      expect(preview.requiresConfirmation).toBe(true);
      const closed = await operations.closeCourt(owner.id, court.id, true);
      expect(closed.closed).toBe(true);
      expect((await prisma.court.findUniqueOrThrow({ where: { id: court.id } })).isActive).toBe(
        false,
      );
    } finally {
      if (reservationId) {
        await prisma.reservation.deleteMany({ where: { id: reservationId } });
      }
      if (fixture) {
        await cleanupTestVenueFixture(prisma, fixture);
      }
      await prisma.$disconnect();
    }
  }, 30000);
});
