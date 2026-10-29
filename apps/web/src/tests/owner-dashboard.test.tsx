import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ApiError } from '@court-booking/api-client';
import { OwnerDashboardPage } from '../pages/owner/OwnerDashboardPage';
import { ownerApi } from '../services/api';
import type { OwnerBooking } from '../types/domain';

vi.mock('../services/api', () => ({
  authApi: { me: vi.fn().mockResolvedValue({ name: 'Venue Owner', role: 'owner', status: 'active' }) },
  ownerApi: { mine: vi.fn(), profile: vi.fn().mockResolvedValue({ name: 'Venue Owner' }), bookings: vi.fn(), balance: vi.fn() },
}));
const courts = [
  { id: 'court-1', name: 'Pitch 1', sport: 'football' as const, isActive: true, approvalStatus: 'approved' },
  { id: 'court-2', name: 'Padel Pro', sport: 'padel' as const, isActive: false, approvalStatus: 'approved' },
];
const reservation = (input: Partial<OwnerBooking> & Pick<OwnerBooking, 'id' | 'startsAt' | 'endsAt'>): OwnerBooking => ({ courtId: 'court-1', courtName: 'Pitch 1', kind: 'booking', status: 'confirmed', ...input });
const bookings = [
  reservation({ id: 'today', bookingCode: 'TODAY', startsAt: '2026-10-26T23:00:00Z', endsAt: '2026-10-27T00:00:00Z', customerName: 'Captain Tarek', dueAtVenuePiastres: 42000, isTestPayment: true }),
  reservation({ id: 'tomorrow', startsAt: '2026-10-27T23:00:00Z', endsAt: '2026-10-28T00:00:00Z', customerName: 'Tomorrow Captain' }),
  reservation({ id: 'completed', startsAt: '2026-10-25T12:00:00Z', endsAt: '2026-10-25T14:00:00Z', status: 'completed' }),
  reservation({ id: 'cancelled', startsAt: '2026-10-27T01:00:00Z', endsAt: '2026-10-27T02:00:00Z', status: 'cancelled', customerName: 'Cancelled Captain' }),
  reservation({ id: 'block', kind: 'block', courtId: 'court-2', courtName: 'Padel Pro', startsAt: '2026-10-27T03:00:00Z', endsAt: '2026-10-27T04:00:00Z' }),
  reservation({ id: 'overnight', kind: 'manual', startsAt: '2026-10-26T20:00:00Z', endsAt: '2026-10-26T22:00:00Z', customerName: 'Overnight Captain' }),
];
const balances = { totalEarnedPiastres: 1975000, availablePiastres: 1250000, releasedPiastres: 1250000, pendingPiastres: 250000, cashCollectedPiastres: 725000, todayCashCollectedPiastres: 10000 };
function mount() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  return render(<QueryClientProvider client={queryClient}><BrowserRouter><OwnerDashboardPage /></BrowserRouter></QueryClientProvider>);
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-26T22:30:00Z'));
  vi.mocked(ownerApi.mine).mockResolvedValue({ id: 'venue-101', name: 'Al Ahly Arena', status: 'approved', courts });
  vi.mocked(ownerApi.bookings).mockResolvedValue(bookings);
  vi.mocked(ownerApi.balance).mockResolvedValue(balances);
});
afterEach(() => { cleanup(); vi.useRealTimers(); vi.clearAllMocks(); });

describe('Owner venue overview', () => {
  it('shows real venue totals and API-reported earnings without fake occupancy', async () => {
    mount();
    await screen.findByRole('heading', { name: 'Al Ahly Arena' });
    await waitFor(() => expect(screen.getByTestId('venue-earnings').textContent).toContain('19,750'));
    const statistics = screen.getByRole('region', { name: 'Venue statistics' });
    expect(within(statistics).getByRole('link', { name: /Total bookings/ }).textContent).toContain('5');
    expect(within(statistics).getByRole('link', { name: /Reserved hours/ }).textContent).toContain('6');
    expect(within(statistics).getByRole('link', { name: /Active courts/ }).textContent).toContain('1 / 2');
    expect(screen.getByText('Includes test payments. Simulated amounts are not real income.')).toBeDefined();
    expect(screen.queryByText('75%')).toBeNull();
    expect(screen.getByRole('region', { name: 'Your courts' })).toBeDefined();
  });

  it('uses the Cairo date, includes overnight matches and blocks, and filters by court and day', async () => {
    mount();
    const schedule = await screen.findByRole('list', { name: 'Scheduled reservations' });
    expect(within(schedule).getByText('Captain Tarek')).toBeDefined();
    expect(within(schedule).getByText('02:00')).toBeDefined();
    expect(within(schedule).getByText('Overnight Captain')).toBeDefined();
    expect(within(schedule).getByText('Continues from previous day')).toBeDefined();
    expect(within(schedule).getByText('Court blocked')).toBeDefined();
    expect(within(schedule).queryByText('Tomorrow Captain')).toBeNull();
    expect(within(schedule).queryByText('Cancelled Captain')).toBeNull();
    fireEvent.change(screen.getByRole('combobox', { name: 'Filter schedule by court' }), { target: { value: 'court-2' } });
    expect(screen.queryByText('Captain Tarek')).toBeNull();
    expect(screen.getByText('Court blocked')).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: 'Next schedule day' }));
    expect(screen.getByText('Nothing scheduled for this day')).toBeDefined();
    fireEvent.change(screen.getByRole('combobox', { name: 'Filter schedule by court' }), { target: { value: 'all' } });
    expect(screen.getByText('Tomorrow Captain')).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: 'Today' }));
    expect(screen.getByText('Captain Tarek')).toBeDefined();
  });

  it('shows an earnings error instead of zero money and keeps the schedule available', async () => {
    vi.mocked(ownerApi.balance).mockRejectedValueOnce(new Error('offline'));
    mount();
    await screen.findByText('Earnings are unavailable');
    expect(screen.getByText('Captain Tarek')).toBeDefined();
    expect(screen.queryByTestId('venue-earnings')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Retry earnings' }));
    await screen.findByTestId('venue-earnings');
  });

  it('shows genuine empty statistics rather than fabricated revenue or occupancy', async () => {
    vi.mocked(ownerApi.bookings).mockResolvedValue([]);
    vi.mocked(ownerApi.balance).mockResolvedValue({ totalEarnedPiastres: 0, availablePiastres: 0, pendingPiastres: 0, cashCollectedPiastres: 0, todayCashCollectedPiastres: 0 });
    mount();
    await screen.findByText('Nothing scheduled for this day');
    await waitFor(() => expect(screen.getByTestId('venue-earnings').textContent).toContain('0.00'));
    expect(screen.queryByText('75%')).toBeNull();
  });

  it('offers retry when reservation data cannot load instead of showing false totals', async () => {
    vi.mocked(ownerApi.bookings).mockRejectedValueOnce(new ApiError(503, 'UNAVAILABLE', 'offline'));
    mount();
    await screen.findByText('Unable to load your venue dashboard');
    expect(screen.queryByRole('region', { name: 'Venue statistics' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    await screen.findByRole('heading', { name: 'Al Ahly Arena' });
  });
});
