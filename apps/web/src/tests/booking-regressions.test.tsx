import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { SlotPicker } from '../features/bookings/SlotPicker';
import { occupiesVenueHour, venueDate } from '../utils/venue-time';

afterEach(cleanup);
const slots = Array.from({ length: 6 }, (_, hour) => ({
  startsAt: new Date(Date.UTC(2026, 9, 26, 16 + hour)).toISOString(),
  endsAt: new Date(Date.UTC(2026, 9, 26, 17 + hour)).toISOString(),
  status: 'available' as const,
  pricePiastres: 55000,
}));

describe('live browser booking regressions', () => {
  it('never labels non-adjacent hours as consecutive', () => {
    const changed = vi.fn();
    render(<SlotPicker slots={slots} onSelect={changed} />);
    fireEvent.click(screen.getAllByRole('button')[0]!);
    fireEvent.click(screen.getAllByRole('button')[2]!);
    expect(changed).toHaveBeenLastCalledWith([slots[2]]);
    expect(screen.queryByText('2 consecutive hours')).toBeNull();
  });
  it('enforces the venue selection limit', () => {
    const changed = vi.fn();
    render(<SlotPicker slots={slots} onSelect={changed} maxHours={2} />);
    for (const button of screen.getAllByRole('button').slice(0, 3)) fireEvent.click(button);
    expect(changed).toHaveBeenLastCalledWith(slots.slice(0, 2));
  });
  it('remounting for another court/date clears selected hours', () => {
    const view = render(<SlotPicker key="court-a" slots={slots} onSelect={vi.fn()} />);
    fireEvent.click(screen.getAllByRole('button')[0]!);
    view.rerender(<SlotPicker key="court-b" slots={slots} onSelect={vi.fn()} />);
    expect(screen.queryByText('1 hour selected')).toBeNull();
  });
  it('places a two-hour Cairo booking in both local hours, not UTC hours', () => {
    expect(
      occupiesVenueHour('2026-10-26T18:00:00Z', '2026-10-26T20:00:00Z', '2026-10-26', 21),
    ).toBe(true);
    expect(
      occupiesVenueHour('2026-10-26T18:00:00Z', '2026-10-26T20:00:00Z', '2026-10-26', 22),
    ).toBe(true);
    expect(
      occupiesVenueHour('2026-10-26T18:00:00Z', '2026-10-26T20:00:00Z', '2026-10-26', 18),
    ).toBe(false);
  });
  it('uses Cairo date across UTC midnight and observes winter offset', () => {
    expect(venueDate('2026-10-26T22:00:00Z')).toBe('2026-10-27');
    expect(
      occupiesVenueHour('2026-12-01T18:00:00Z', '2026-12-01T19:00:00Z', '2026-12-01', 20),
    ).toBe(true);
  });
});
