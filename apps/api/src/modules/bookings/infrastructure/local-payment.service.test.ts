import { afterEach, describe, expect, it, vi } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { LocalPaymentService } from './local-payment.service';
import { PrismaBookingService } from './prisma-booking.service';
import { WebhookService } from './webhook.service';
import { FakePaymentGateway } from '../application/fake-payment.gateway';
import { AdminService } from '../../admin/admin.service';
import { PrismaOwnerOperationsService } from '../../venues/infrastructure/prisma-owner-operations.service';
import {
  createTestVenueFixture,
  cleanupTestVenueFixture,
} from '../../../test/integration-fixtures';

afterEach(() => vi.unstubAllEnvs());

it('disables local checkout in production before accessing the database', async () => {
  vi.stubEnv('NODE_ENV', 'production');
  const service = new LocalPaymentService(
    {} as PrismaClient,
    {} as WebhookService,
    new FakePaymentGateway(),
  );
  await expect(service.simulate('player', 'booking', 'success', 'key')).rejects.toMatchObject({
    code: 'NOT_FOUND',
  });
});

describe.skipIf(process.env.RUN_INTEGRATION !== '1')('Local test payment persistence', () => {
  it('keeps pending/failed attempts unconfirmed, confirms deposit/full once, and exposes test receipts to owner/admin', async () => {
    const prisma = new PrismaClient();
    const gateway = new FakePaymentGateway();
    const bookings = new PrismaBookingService(prisma, gateway);
    const simulator = new LocalPaymentService(prisma, new WebhookService(prisma, gateway), gateway);
    const fixture = await createTestVenueFixture(prisma);
    try {
      const player = await prisma.user.create({
        data: {
          email: `fake-checkout-${Date.now()}@example.test`,
          passwordHash: 'integration-fixture',
          role: 'player',
          status: 'active',
          name: 'Fake checkout test',
          emailVerifiedAt: new Date(),
        },
      });
      for (const [offset, paymentOption] of (['deposit', 'full'] as const).entries()) {
        const startsAt = new Date(Date.now() + (5 + offset) * 86400000);
        startsAt.setUTCMinutes(0, 0, 0);
        const booking = await bookings.create(
          {
            playerId: player.id,
            venueId: fixture.venue.id,
            courtId: fixture.court1.id,
            startsAt,
            hours: 1,
            totalPiastres: 1,
            depositPiastres: 1,
            paymentOption,
          },
          `fake-checkout-create-${paymentOption}-${Date.now()}`,
        );
        expect((await gateway.verifyPayment(`fake-${booking.id}`)).paid).toBe(false);
        await expect(
          simulator.simulate(fixture.owner.id, booking.id, 'success', 'foreign-booking'),
        ).rejects.toMatchObject({ code: 'NOT_FOUND' });
        await simulator.simulate(player.id, booking.id, 'pending', `${booking.id}:pending`);
        expect((await bookings.get(player.id, booking.id)).status).toBe('held');
        await simulator.simulate(player.id, booking.id, 'failure', `${booking.id}:failure`);
        expect(await prisma.ledgerEntry.count({ where: { reservationId: booking.id } })).toBe(0);
        await simulator.simulate(player.id, booking.id, 'success', `${booking.id}:success`);
        await simulator.simulate(player.id, booking.id, 'success', `${booking.id}:success`);
        await expect(
          simulator.simulate(player.id, booking.id, 'failure', `${booking.id}:success`),
        ).rejects.toMatchObject({ code: 'IDEMPOTENCY_KEY_REUSED' });
        const confirmed = await bookings.get(player.id, booking.id);
        expect(confirmed.status).toBe('confirmed');
        expect(confirmed.paidPiastres).toBe(
          paymentOption === 'full' ? confirmed.totalPiastres : confirmed.depositPiastres,
        );
        expect(
          await prisma.ledgerEntry.count({
            where: { reservationId: booking.id, type: 'payment_held' },
          }),
        ).toBe(1);
        const ownerRows = await new PrismaOwnerOperationsService(prisma, bookings).bookings(
          fixture.owner.id,
        );
        expect(ownerRows.find((row) => row.id === booking.id)).toMatchObject({
          isTestPayment: true,
          status: 'confirmed',
          courtName: fixture.court1.name,
        });
        const adminRows = await new AdminService(prisma, bookings).listBookings(1, 100);
        expect(adminRows.items.find((row) => row.id === booking.id)).toMatchObject({
          isTestPayment: true,
          status: 'confirmed',
        });
      }
    } finally {
      await cleanupTestVenueFixture(prisma, fixture);
      await prisma.$disconnect();
    }
  }, 60000);
});
