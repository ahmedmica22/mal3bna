import { describe, expect, it } from 'vitest';
import { BookingService } from './booking.service';
import { FakePaymentGateway } from './fake-payment.gateway';
describe('BookingService', () => {
  it('allows exactly one winner for concurrent overlapping requests and replays idempotently', async () => {
    const service = new BookingService(new FakePaymentGateway());
    const base = {
      playerId: 'p',
      courtId: 'c',
      venueId: 'v',
      startsAt: new Date('2026-11-01T10:00:00.000Z'),
      hours: 1,
      totalPiastres: 1000,
      depositPiastres: 300,
      paymentOption: 'deposit' as const,
    };
    const replayFirst = await service.create(
      { ...base, startsAt: new Date('2026-11-01T09:00:00.000Z') },
      'replay-key',
    );
    expect(
      (
        await service.create(
          { ...base, startsAt: new Date('2026-11-01T09:00:00.000Z') },
          'replay-key',
        )
      ).id,
    ).toBe(replayFirst.id);
    const results = await Promise.allSettled(
      Array.from({ length: 50 }, (_, index) =>
        service.create({ ...base, playerId: `p-${index}` }, `key-${index}`),
      ),
    );
    expect(results.filter((item) => item.status === 'fulfilled')).toHaveLength(1);
  });
});
