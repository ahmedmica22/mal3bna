import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { OwnerBookingsPage } from '../pages/owner/OwnerBookingsPage';
import { ownerApi } from '../services/api';

vi.mock('../services/api', () => ({
  ownerApi: {
    mine: vi.fn().mockResolvedValue({
      id: '10000000-0000-4000-8000-000000000001',
      name: 'Al Ahly Arena - New Cairo',
      courts: [
        {
          id: '20000000-0000-4000-8000-000000000001',
          name: 'Pitch 1 - FIFA 5v5 Turf',
          sport: 'football',
        },
      ],
    }),
    bookings: vi.fn().mockResolvedValue([
      {
        id: 'booking-1',
        bookingCode: 'MLB-MATCH-01',
        courtId: '20000000-0000-4000-8000-000000000001',
        courtName: 'Pitch 1 - FIFA 5v5 Turf',
        startsAt: '2026-10-26T18:00:00.000Z',
        endsAt: '2026-10-26T19:00:00.000Z',
        status: 'confirmed',
        customerName: 'Ahmed Hassan',
        totalPiastres: 60000,
        dueAtVenuePiastres: 42000,
      },
    ]),
    arrive: vi.fn().mockResolvedValue({ status: 'arrived' }),
    collect: vi.fn().mockResolvedValue({ collected: true }),
    complete: vi.fn().mockResolvedValue({ status: 'completed' }),
    reportNoShow: vi.fn().mockResolvedValue({ status: 'no_show_pending' }),
    cancelBooking: vi.fn().mockResolvedValue({ status: 'cancelled' }),
    manualBooking: vi.fn().mockResolvedValue({ id: 'manual-1' }),
    blockCourt: vi.fn().mockResolvedValue({ id: 'block-1' }),
  },
}));

function renderOwnerBookings() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <OwnerBookingsPage />
      </BrowserRouter>
    </QueryClientProvider>,
  );
}

describe('Owner Operations Web Flow', () => {
  it('renders match-day bookings with check-in, collect cash, and complete actions', async () => {
    renderOwnerBookings();

    await waitFor(() => {
      expect(screen.getByText('MLB-MATCH-01')).toBeDefined();
      expect(screen.getByText('Pitch 1 - FIFA 5v5 Turf')).toBeDefined();
      expect(screen.getByText('420 EGP')).toBeDefined();
    });

    // Check Arrived button exists
    const arriveBtn = screen.getByText('✓ Arrived');
    expect(arriveBtn).toBeDefined();

    // Click Arrived
    fireEvent.click(arriveBtn);
    await waitFor(() => {
      expect(ownerApi.arrive).toHaveBeenCalledWith('booking-1');
    });

    // Collect Cash button exists and functions
    const collectBtn = screen.getByText('Collect Cash');
    fireEvent.click(collectBtn);
    await waitFor(() => {
      expect(ownerApi.collect).toHaveBeenCalledWith('booking-1');
    });
  });

  it('opens and submits manual walk-in booking modal', async () => {
    renderOwnerBookings();

    await waitFor(() => {
      expect(screen.getByText('+ Add Walk-In Booking')).toBeDefined();
    });

    const addManualBtn = screen.getByText('+ Add Walk-In Booking');
    fireEvent.click(addManualBtn);

    expect(screen.getByText('Add Walk-In / Phone Booking')).toBeDefined();
    const customerInput = screen.getByPlaceholderText('e.g. Captain Mahmoud');
    fireEvent.change(customerInput, { target: { value: 'Captain Mahmoud' } });

    const submitBtn = screen.getByText('Confirm Walk-In Booking');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(ownerApi.manualBooking).toHaveBeenCalled();
    });
  });
});
