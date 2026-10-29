import { describe, expect, it } from 'vitest';
import { StrikePolicy } from './strike-policy';

describe('StrikePolicy', () => {
  const policy = new StrikePolicy();
  it('warns at two and three and blocks at four', () => {
    expect(policy.evaluate(1)).toMatchObject({ warning: false, blocked: false });
    expect(policy.evaluate(2)).toMatchObject({ warning: true, blocked: false });
    expect(policy.evaluate(3)).toMatchObject({ warning: true, blocked: false });
    expect(policy.evaluate(4)).toMatchObject({ warning: false, blocked: true });
  });
  it('expires a strike six calendar months later', () => {
    expect(policy.expiryDate(new Date('2026-01-31T00:00:00Z')).toISOString()).toBe(
      '2026-07-31T00:00:00.000Z',
    );
  });
});
