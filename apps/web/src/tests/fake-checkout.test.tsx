import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { CheckoutPage } from '../pages/player/CheckoutPage';
import { ToastProvider } from '../components/feedback/ToastContext';
import { bookingApi, venueApi } from '../services/api';

const fixture = vi.hoisted(() => ({
  booking: {
    id: 'booking-test',
    bookingCode: 'TEST-CODE',
    status: 'held',
    startsAt: '2026-11-01T15:00:00Z',
    endsAt: '2026-11-01T16:00:00Z',
    holdExpiresAt: new Date(Date.now() + 600000).toISOString(),
    totalPiastres: 100000,
    depositPiastres: 30000,
    paymentOption: 'deposit',
    paidPiastres: 0,
  },
}));
vi.mock('../store/AuthStore', () => ({
  useAuth: () => ({ user: { role: 'player', name: 'Player', email: 'player@example.test' } }),
}));
vi.mock('../services/api', () => ({
  bookingApi: { create: vi.fn(), get: vi.fn(), fakePayment: vi.fn() },
  venueApi: {
    quote: vi.fn().mockResolvedValue({
      totalPiastres: 100000,
      depositPiastres: 30000,
      dueAtVenuePiastres: 70000,
      breakdown: [],
    }),
  },
}));

function mount() {
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <MemoryRouter
        initialEntries={[
          '/checkout/new?venueId=venue&courtId=court&startsAt=2026-11-01T15:00:00Z&hours=1',
        ]}
      >
        <ToastProvider>
          <CheckoutPage />
        </ToastProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(venueApi.quote).mockResolvedValue({
    totalPiastres: 100000,
    depositPiastres: 30000,
    dueAtVenuePiastres: 70000,
    breakdown: [],
  });
  fixture.booking.status = 'held';
  fixture.booking.paidPiastres = 0;
  vi.mocked(bookingApi.create).mockResolvedValue({ ...fixture.booking } as never);
  vi.mocked(bookingApi.get).mockImplementation(async () => ({ ...fixture.booking }) as never);
});
afterEach(cleanup);

it('confirms only after the server acknowledges the test payment, and permits failure retry', async () => {
  mount();
  await screen.findAllByText(/1,000/);
  const checkbox = screen.getByRole('checkbox');
  fireEvent.click(checkbox);
  const reserve = screen.getByRole('button', { name: 'Reserve and continue to payment' });
  await waitFor(() => expect(reserve.hasAttribute('disabled')).toBe(false));
  fireEvent.click(reserve);
  await screen.findByRole('heading', { name: 'Payment pending' });
  vi.mocked(bookingApi.fakePayment).mockResolvedValueOnce({
    outcome: 'failure',
    isTestPayment: true,
    booking: { ...fixture.booking },
  } as never);
  fireEvent.click(screen.getByRole('button', { name: 'Simulate Failure' }));
  await screen.findByText('Payment failed');
  expect(screen.queryByText('BOOKING CONFIRMED')).toBeNull();
  let acknowledge!: (value: Awaited<ReturnType<typeof bookingApi.fakePayment>>) => void;
  vi.mocked(bookingApi.fakePayment).mockReturnValueOnce(
    new Promise((resolve) => {
      acknowledge = resolve;
    }),
  );
  fireEvent.click(screen.getByRole('button', { name: 'Pay 30% deposit' }));
  await screen.findByText('Confirming test payment…');
  expect(screen.queryByText('BOOKING CONFIRMED')).toBeNull();
  fixture.booking.status = 'confirmed';
  fixture.booking.paidPiastres = 30000;
  await act(async () => {
    acknowledge({
      outcome: 'success',
      isTestPayment: true,
      booking: { ...fixture.booking },
    } as never);
  });
  await screen.findByText('BOOKING CONFIRMED');
  expect(screen.getByText('TEST-CODE')).toBeDefined();
  expect(screen.getByText('Test payment — no real money charged.')).toBeDefined();
});
