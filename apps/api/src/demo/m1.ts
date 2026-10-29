import { businessConstants } from '@court-booking/config';
import { Money } from '../domain/money';
import { TimeRange } from '../domain/time-range';

console.log(
  JSON.stringify(
    {
      milestone: 'M1',
      currency: 'EGP',
      timeZone: 'Africa/Cairo',
      constants: businessConstants,
      primitiveCheck: {
        totalPiastres: Money.fromPiastres(3000).add(Money.fromPiastres(7000)).piastres,
        adjacentSlotsOverlap: TimeRange.from(
          new Date('2026-01-01T10:00:00Z'),
          new Date('2026-01-01T11:00:00Z'),
        ).overlaps(
          TimeRange.from(new Date('2026-01-01T11:00:00Z'), new Date('2026-01-01T12:00:00Z')),
        ),
      },
    },
    null,
    2,
  ),
);
