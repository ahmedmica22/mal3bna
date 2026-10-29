import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SlotPicker } from '../features/bookings/SlotPicker';
import { FakeGatewayPanel } from '../features/payments/FakeGatewayPanel';

describe('Player Web Flow', () => {
  it('renders available slots, supports consecutive selection, and calculates total price', () => {
    const onSelect = vi.fn();
    const mockSlots = [
      {
        startsAt: '2026-10-26T18:00:00.000Z',
        endsAt: '2026-10-26T19:00:00.000Z',
        status: 'available' as const,
        pricePiastres: 60000,
      },
      {
        startsAt: '2026-10-26T19:00:00.000Z',
        endsAt: '2026-10-26T20:00:00.000Z',
        status: 'available' as const,
        pricePiastres: 60000,
      },
      {
        startsAt: '2026-10-26T20:00:00.000Z',
        endsAt: '2026-10-26T21:00:00.000Z',
        status: 'booked' as const,
        pricePiastres: 60000,
      },
    ];

    render(<SlotPicker slots={mockSlots} onSelect={onSelect} />);

    // Check available and unavailable slots
    expect(screen.getByText('Available slots')).toBeDefined();
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);

    // Booked slot should be disabled
    expect(buttons[2]?.hasAttribute('disabled')).toBe(true);

    // Click first slot
    fireEvent.click(buttons[0]!);
    expect(onSelect).toHaveBeenCalled();

    // Click second slot (consecutive 2 hours)
    fireEvent.click(buttons[1]!);
    expect(screen.getByText('2 consecutive hours')).toBeDefined();
    expect(screen.getByText('1200.00 EGP')).toBeDefined();
  });

  it('handles FakeGateway interactive payment simulation and triggers callback', async () => {
    const onComplete = vi.fn();
    render(<FakeGatewayPanel onComplete={onComplete} />);

    expect(screen.getByText('FAKEGATEWAY LOCAL CHECKOUT')).toBeDefined();
    const payDepositBtn = screen.getByText('Pay 30% deposit');
    fireEvent.click(payDepositBtn);

    expect(onComplete).toHaveBeenCalledWith('success');
    expect(await screen.findByText('Payment confirmed')).toBeDefined();
  });
});
