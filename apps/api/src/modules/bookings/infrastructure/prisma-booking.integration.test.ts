import { describe, expect, it } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { PrismaBookingService } from './prisma-booking.service';
import { FakePaymentGateway } from '../application/fake-payment.gateway';
import { WebhookService } from './webhook.service';
import { createHmac } from 'node:crypto';
import { TrustService } from '../../trust/trust.service';
import {
  createTestVenueFixture,
  cleanupTestVenueFixture,
} from '../../../test/integration-fixtures';

describe.skipIf(!process.env.RUN_INTEGRATION)('Prisma booking integration', () => {
  it('uses PostgreSQL exclusion authority for 50 concurrent requests', async () => {
    const prisma = new PrismaClient();
    const gateway = new FakePaymentGateway();
    const service = new PrismaBookingService(prisma, gateway);
    let fixture: Awaited<ReturnType<typeof createTestVenueFixture>> | undefined;

    try {
      fixture = await createTestVenueFixture(prisma);
      const court = fixture.court1;

      const player = await prisma.user.create({
        data: {
          email: `booking-${Date.now()}@example.test`,
          passwordHash: 'test',
          role: 'player',
          status: 'active',
          name: 'Booking Test',
          language: 'en',
          emailVerifiedAt: new Date(),
        },
      });

      const startsAt = new Date(Date.now() + 3 * 24 * 60 * 60_000);
      startsAt.setUTCMinutes(0, 0, 0);
      const input = {
        playerId: player.id,
        courtId: court.id,
        venueId: court.venueId,
        startsAt,
        hours: 1,
        totalPiastres: 1,
        depositPiastres: 1,
        paymentOption: 'deposit' as const,
      };
      const results = await Promise.allSettled(
        Array.from({ length: 50 }, (_, i) =>
          service.create(input, `integration-${Date.now()}-${i}`),
        ),
      );
      expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
      const reservations = await prisma.reservation.findMany({
        where: { playerId: player.id },
        select: { id: true },
      });
      const reservationIds = reservations.map((item) => item.id);
      await prisma.payment.deleteMany({ where: { reservationId: { in: reservationIds } } });
      await prisma.reservation.deleteMany({ where: { id: { in: reservationIds } } });
      await prisma.idempotencyRecord.deleteMany({ where: { actorScope: player.id } });
      // Audit rows are intentionally immutable; retain the test actor and audit evidence.
    } finally {
      if (fixture) {
        await cleanupTestVenueFixture(prisma, fixture);
      }
      await prisma.$disconnect();
    }
  }, 60000);

  it('confirms a signed payment once, records HELD, and refunds a late cancellation idempotently', async () => {
    const prisma = new PrismaClient();
    const gateway = new FakePaymentGateway();
    const service = new PrismaBookingService(prisma, gateway);
    const webhooks = new WebhookService(prisma, gateway);
    let fixture: Awaited<ReturnType<typeof createTestVenueFixture>> | undefined;

    try {
      fixture = await createTestVenueFixture(prisma);
      const court = fixture.court1;

      const player = await prisma.user.create({
        data: {
          email: `payment-${Date.now()}@example.test`,
          passwordHash: 'test',
          role: 'player',
          status: 'active',
          name: 'Payment Test',
          language: 'en',
          emailVerifiedAt: new Date(),
        },
      });

      const startsAt = new Date(Date.now() + 4 * 24 * 60 * 60_000);
      startsAt.setUTCMinutes(0, 0, 0);
      const booking = await service.create(
        {
          playerId: player.id,
          courtId: court.id,
          venueId: court.venueId,
          startsAt,
          hours: 1,
          totalPiastres: 1,
          depositPiastres: 1,
          paymentOption: 'full',
        },
        `payment-${Date.now()}`,
      );
      const payment = await prisma.payment.findFirstOrThrow({
        where: { reservationId: booking.id },
      });
      const payload = {
        eventId: `event-${Date.now()}`,
        gatewaySessionId: payment.gatewaySessionId,
        amountPiastres: payment.amountPiastres,
        currency: 'EGP' as const,
        status: 'paid' as const,
      };
      const raw = JSON.stringify(payload);
      const signature = createHmac('sha256', 'local-webhook-secret').update(raw).digest('hex');
      expect(
        (await webhooks.receive(payload, raw, signature, 'local-webhook-secret')).accepted,
      ).toBe(true);
      expect(
        (await webhooks.receive(payload, raw, signature, 'local-webhook-secret')).duplicate,
      ).toBe(true);
      expect(
        await prisma.ledgerEntry.count({ where: { paymentId: payment.id, type: 'payment_held' } }),
      ).toBe(1);
      const cancelled = await service.cancel(
        player.id,
        booking.id,
        `cancel-${Date.now()}`,
        new Date(startsAt.getTime() - 60 * 60_000),
      );
      expect(cancelled.refundPiastres).toBeGreaterThan(0);
      const entries = await prisma.ledgerEntry.findMany({
        where: { reservationId: booking.id, account: 'HELD' },
      });
      expect(entries.reduce((sum, entry) => sum + entry.amountPiastres, 0)).toBe(0);
    } finally {
      if (fixture) {
        await cleanupTestVenueFixture(prisma, fixture);
      }
      await prisma.$disconnect();
    }
  }, 60000);

  it('persists disputed and undisputed no-show outcomes with refund and ledger effects', async () => {
    const prisma = new PrismaClient();
    const gateway = new FakePaymentGateway();
    const bookings = new PrismaBookingService(prisma, gateway);
    const webhooks = new WebhookService(prisma, gateway);
    const trust = new TrustService(prisma, gateway);
    let fixture: Awaited<ReturnType<typeof createTestVenueFixture>> | undefined;

    try {
      fixture = await createTestVenueFixture(prisma);
      const owner = fixture.owner;
      const court = fixture.court1;
      const baseOffsetDays = 10 + (Date.now() % 15);

      const admin = await prisma.user.create({
        data: {
          email: `no-show-admin-${Date.now()}@example.test`,
          passwordHash: 'test',
          role: 'admin',
          status: 'active',
          name: 'No-show Admin',
          language: 'en',
          emailVerifiedAt: new Date(),
        },
      });

      const createPaidBooking = async (suffix: string, offsetDays: number) => {
        const player = await prisma.user.create({
          data: {
            email: `no-show-${suffix}-${Date.now()}@example.test`,
            passwordHash: 'test',
            role: 'player',
            status: 'active',
            name: `No-show ${suffix}`,
            language: 'en',
            emailVerifiedAt: new Date(),
          },
        });
        let startsAt = new Date();
        for (let attempt = 0; attempt < 20; attempt += 1) {
          const candidate = new Date(Date.now() + (offsetDays + attempt) * 24 * 60 * 60_000);
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
        const booking = await bookings.create(
          {
            playerId: player.id,
            courtId: court.id,
            venueId: court.venueId,
            startsAt,
            hours: 1,
            totalPiastres: 1000,
            depositPiastres: 300,
            paymentOption: 'full',
          },
          `no-show-${suffix}-${Date.now()}`,
        );
        const payment = await prisma.payment.findFirstOrThrow({
          where: { reservationId: booking.id },
        });
        const payload = {
          eventId: `no-show-event-${suffix}-${Date.now()}`,
          gatewaySessionId: payment.gatewaySessionId,
          amountPiastres: payment.amountPiastres,
          currency: 'EGP' as const,
          status: 'paid' as const,
        };
        const raw = JSON.stringify(payload);
        const signature = createHmac('sha256', 'local-webhook-secret').update(raw).digest('hex');
        await webhooks.receive(payload, raw, signature, 'local-webhook-secret');
        return { booking, player, payment };
      };

      const disputed = await createPaidBooking('disputed', baseOffsetDays);
      const reportAt = new Date(disputed.booking.startsAt.getTime() + 15 * 60_000);
      const report = await bookings.reportNoShow(owner.id, disputed.booking.id, reportAt);
      expect(report.status).toBe('no_show_pending');
      await trust.createDispute(
        disputed.player.id,
        disputed.booking.id,
        'I was present at the court',
      );
      await trust.decideDispute(
        admin.id,
        report.disputeId,
        'overturned',
        'Venue report overturned',
      );
      expect(
        (await prisma.reservation.findUniqueOrThrow({ where: { id: disputed.booking.id } })).status,
      ).toBe('confirmed');
      expect(await prisma.strike.count({ where: { reservationId: disputed.booking.id } })).toBe(0);

      const undisputed = await createPaidBooking('undisputed', baseOffsetDays + 2);
      const undisputedReportAt = new Date(undisputed.booking.startsAt.getTime() + 15 * 60_000);
      await bookings.reportNoShow(owner.id, undisputed.booking.id, undisputedReportAt);
      const finalized = await bookings.finalizeNoShows(
        new Date(undisputedReportAt.getTime() + 49 * 60 * 60_000),
      );
      expect(finalized).toBe(1);
      expect(
        (await prisma.reservation.findUniqueOrThrow({ where: { id: undisputed.booking.id } }))
          .status,
      ).toBe('no_show');
      expect(await prisma.strike.count({ where: { reservationId: undisputed.booking.id } })).toBe(
        1,
      );
      expect(
        await prisma.refund.count({
          where: { reservationId: undisputed.booking.id, status: 'succeeded' },
        }),
      ).toBe(1);
      expect(
        await prisma.ledgerEntry.count({
          where: { reservationId: undisputed.booking.id, type: 'refund' },
        }),
      ).toBe(1);
      expect(
        await prisma.ledgerEntry.count({
          where: { reservationId: undisputed.booking.id, type: 'venue_release' },
        }),
      ).toBe(1);
    } finally {
      if (fixture) {
        await cleanupTestVenueFixture(prisma, fixture);
      }
      await prisma.$disconnect();
    }
  }, 60000);
});
