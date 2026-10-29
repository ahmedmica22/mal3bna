import { describe, expect, it } from 'vitest';
import { NoShowPolicy } from './no-show-policy';

describe('NoShowPolicy', () => {
  const p = new NoShowPolicy();
  const start = new Date('2026-12-01T10:00:00Z');
  const end = new Date('2026-12-01T11:00:00Z');
  it('accepts exactly the grace and report-window boundaries', () => {
    expect(p.canReport(start, end, new Date('2026-12-01T10:15:00Z'))).toBe(true);
    expect(p.canReport(start, end, new Date('2026-12-02T11:00:00Z'))).toBe(true);
    expect(p.canReport(start, end, new Date('2026-12-01T10:14:59Z'))).toBe(false);
    expect(p.canReport(start, end, new Date('2026-12-02T11:00:01Z'))).toBe(false);
  });
  it('opens a 48-hour dispute window', () => {
    expect(p.disputeDeadline(new Date('2026-12-01T12:00:00Z')).toISOString()).toBe(
      '2026-12-03T12:00:00.000Z',
    );
  });
});
