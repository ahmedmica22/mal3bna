import { describe, expect, it } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { calculatePrice } from './domain/price-calculator';
import { PrismaVenueReadService } from './infrastructure/prisma-venue-read.service';
import { createTestVenueFixture, cleanupTestVenueFixture } from '../../test/integration-fixtures';

const integration = process.env.RUN_INTEGRATION === '1' ? describe : describe.skip;

integration('venue read-side integration', () => {
  it('reads approved venues, courts, and quotes prices accurately', async () => {
    const prisma = new PrismaClient();
    let fixture: Awaited<ReturnType<typeof createTestVenueFixture>> | undefined;
    try {
      fixture = await createTestVenueFixture(prisma);

      const venue = await prisma.venue.findUniqueOrThrow({
        where: { id: fixture.venue.id },
        include: { courts: { include: { priceRules: true } } },
      });
      expect(venue.courts).toHaveLength(2);

      const court = venue.courts[0];
      if (!court) throw new Error('Test court missing');

      const prices = calculatePrice(
        court.priceRules.map((rule) => ({ ...rule, pricePiastres: rule.pricePiastres })),
        new Date('2026-10-29T21:00:00.000Z'),
        2,
        'Africa/Cairo',
      );
      expect(prices).toHaveLength(2);
      expect(prices.every((item) => item.pricePiastres > 0)).toBe(true);

      const readService = new PrismaVenueReadService(prisma);
      const venues = await readService.listVenues({ sport: 'football' });
      expect(venues.some((v) => v.id === fixture?.venue.id)).toBe(true);

      const quote = await readService.quote(court.id, new Date('2026-10-29T21:00:00.000Z'), 2);
      expect(quote.breakdown).toHaveLength(2);
      expect(quote.totalPiastres).toBeGreaterThan(0);
    } finally {
      if (fixture) {
        await cleanupTestVenueFixture(prisma, fixture);
      }
      await prisma.$disconnect();
    }
  });
});
