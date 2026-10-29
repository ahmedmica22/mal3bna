import { describe, expect, it } from 'vitest';
import { calculatePrice } from './price-calculator';

describe('PriceCalculator', () => {
  it('prices each hour independently across midnight in the venue timezone', () => {
    const rules = [
      {
        id: 'a',
        courtId: 'c',
        dayOfWeek: 4,
        startMinute: 1380,
        endMinute: 1440,
        pricePiastres: 1000,
        validFrom: new Date(0),
        validTo: null,
      },
      {
        id: 'b',
        courtId: 'c',
        dayOfWeek: 5,
        startMinute: 0,
        endMinute: 60,
        pricePiastres: 2000,
        validFrom: new Date(0),
        validTo: null,
      },
    ];
    const result = calculatePrice(rules, new Date('2026-10-29T21:00:00.000Z'), 2, 'Africa/Cairo');
    expect(result.map((item) => item.pricePiastres)).toEqual([1000, 2000]);
  });

  it('uses the currently valid version when price rules overlap in history', () => {
    const rules = [
      {
        id: 'old',
        courtId: 'c',
        dayOfWeek: 1,
        startMinute: 0,
        endMinute: 60,
        pricePiastres: 1000,
        validFrom: new Date(0),
        validTo: new Date('2026-01-01'),
      },
      {
        id: 'new',
        courtId: 'c',
        dayOfWeek: 1,
        startMinute: 0,
        endMinute: 60,
        pricePiastres: 2000,
        validFrom: new Date('2026-01-01'),
        validTo: null,
      },
    ];
    expect(
      calculatePrice(rules, new Date('2026-01-05T00:00:00.000Z'), 1, 'UTC')[0]?.pricePiastres,
    ).toBe(2000);
  });
});
