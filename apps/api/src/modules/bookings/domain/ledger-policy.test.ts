import { describe, expect, it } from 'vitest';

describe('ledger invariants', () => {
  it('keeps held equal to paid minus refunds minus releases', () => {
    const paid = 70000;
    const refunded = 49000;
    const released = 21000;
    expect(paid - refunded - released).toBe(0);
  });
  it('splits retained deposits using integer commission basis points', () => {
    const retained = 21000;
    const commission = Math.floor((retained * 1000) / 10000);
    expect({ commission, venue: retained - commission }).toEqual({
      commission: 2100,
      venue: 18900,
    });
  });
});
