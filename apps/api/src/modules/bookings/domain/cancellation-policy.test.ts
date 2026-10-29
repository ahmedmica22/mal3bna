import { describe, expect, it } from 'vitest';
import { CancellationPolicy } from './cancellation-policy';

describe('CancellationPolicy', () => {
  const policy = new CancellationPolicy();
  const now = new Date('2026-11-01T10:00:00Z');
  it('refunds all at exactly 24 hours', () => {
    expect(
      policy.decide({
        actor: 'player',
        now,
        startsAt: new Date('2026-11-02T10:00:00Z'),
        paidPiastres: 70000,
        depositPiastres: 21000,
      }).refundPiastres,
    ).toBe(70000);
  });
  it('retains only the deposit for a late full payment', () => {
    expect(
      policy.decide({
        actor: 'player',
        now,
        startsAt: new Date('2026-11-02T09:59:59Z'),
        paidPiastres: 70000,
        depositPiastres: 21000,
      }),
    ).toMatchObject({ refundPiastres: 49000, retainedPiastres: 21000 });
  });
  it('fully refunds an operator cancellation', () => {
    expect(
      policy.decide({
        actor: 'owner',
        now,
        startsAt: new Date('2026-11-01T11:00:00Z'),
        paidPiastres: 21000,
        depositPiastres: 21000,
      }).refundPiastres,
    ).toBe(21000);
  });
});
