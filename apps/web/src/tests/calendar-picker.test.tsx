import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DatePicker } from '../components/ui/DatePicker';
import { DateTimePicker } from '../components/ui/DateTimePicker';

describe('Modern Calendar & DateTime Pickers', () => {
  it('renders DatePicker trigger and opens interactive calendar on click', () => {
    const handleChange = vi.fn();
    render(<DatePicker value="2026-10-25" onChange={handleChange} />);

    // Trigger button should be rendered with formatted date
    const trigger = screen.getByRole('button', { name: /oct 25, 2026/i });
    expect(trigger).toBeDefined();

    // Open calendar
    fireEvent.click(trigger);

    // Dialog should be open with month header
    expect(screen.getByRole('dialog', { name: /calendar date picker/i })).toBeDefined();
    expect(screen.getByText('October 2026')).toBeDefined();

    // Select a day (e.g., day 28)
    const day28 = screen.getByRole('button', { name: '28' });
    fireEvent.click(day28);

    expect(handleChange).toHaveBeenCalledWith('2026-10-28');
  });

  it('renders DateTimePicker and allows selecting both date and kickoff hour slot', () => {
    const handleChange = vi.fn();
    render(<DateTimePicker value="2026-10-25T18:00" onChange={handleChange} />);

    // Trigger button should be present
    const trigger = screen.getByRole('button', { name: /18:00/i });
    expect(trigger).toBeDefined();

    // Open picker
    fireEvent.click(trigger);

    expect(screen.getByRole('dialog', { name: /datetime calendar picker/i })).toBeDefined();
    expect(screen.getByText('Kickoff Slot')).toBeDefined();

    // Click slot "20:00"
    const slot20 = screen.getByRole('button', { name: '20:00' });
    fireEvent.click(slot20);

    expect(handleChange).toHaveBeenCalledWith('2026-10-25T20:00');
  });
});
