import { describe, it, expect, vi, afterEach } from 'vitest';
import type { PrismaClient } from '@prisma/client';
import { PrismaVenueReadService } from './prisma-venue-read.service';
afterEach(() => vi.useRealTimers());
describe('availability browser regressions', () => {
  it('uses Cairo dates, opening hours, lead time and reservation overlap', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-26T10:00:00Z'));
    const prisma = {
      court: {
        findFirst: vi.fn().mockResolvedValue({
          venue: {
            status: 'approved',
            timeZone: 'Africa/Cairo',
            openingHours: [{ dayOfWeek: 1, openMinute: 8 * 60, closeMinute: 24 * 60 }],
          },
          priceRules: [
            {
              dayOfWeek: 1,
              startMinute: 0,
              endMinute: 1440,
              pricePiastres: 55000,
              validFrom: new Date('2026-01-01'),
              validTo: null,
            },
          ],
        }),
      },
      reservation: {
        findMany: vi.fn().mockResolvedValue([
          {
            startsAt: new Date('2026-10-26T18:00:00Z'),
            endsAt: new Date('2026-10-26T20:00:00Z'),
            status: 'arrived',
            holdExpiresAt: null,
          },
        ]),
      },
    };
    const service = new PrismaVenueReadService(prisma as unknown as PrismaClient);
    const slots = await service.availability('court', new Date('2026-10-26'));
    expect(slots).toHaveLength(16);
    expect(slots[0]?.startsAt.toISOString()).toBe('2026-10-26T05:00:00.000Z');
    expect(slots.find((s) => s.startsAt.getUTCHours() === 10)?.status).toBe('past');
    expect(slots.find((s) => s.startsAt.getUTCHours() === 11)?.status).toBe('available');
    expect(slots.filter((s) => s.status === 'booked')).toHaveLength(2);
  });
});
