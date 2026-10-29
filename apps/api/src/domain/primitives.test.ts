import { describe, expect, it } from 'vitest';
import { Money } from './money';
import { TimeRange } from './time-range';

describe('domain primitives', () => {
  it('keeps money integer and non-negative', () => {
    expect(Money.fromPiastres(1250).add(Money.fromPiastres(50)).piastres).toBe(1300);
    expect(() => Money.fromPiastres(-1)).toThrow();
  });
  it('uses half-open time ranges', () => {
    const first = TimeRange.from(
      new Date('2026-01-01T10:00:00Z'),
      new Date('2026-01-01T11:00:00Z'),
    );
    const adjacent = TimeRange.from(
      new Date('2026-01-01T11:00:00Z'),
      new Date('2026-01-01T12:00:00Z'),
    );
    expect(first.overlaps(adjacent)).toBe(false);
  });
});
