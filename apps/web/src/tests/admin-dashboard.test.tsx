import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';

vi.mock('../services/api', () => ({
  adminApi: {
    venues: vi.fn().mockResolvedValue([
      {
        id: 'venue-1',
        name: 'El Gezira Sports Hub',
        status: 'approved',
        ownerEmail: 'owner@mal3bna.test',
        commissionBp: 1200,
      },
      {
        id: 'venue-2',
        name: 'Zamalek Padel Club',
        status: 'pending',
        ownerEmail: 'pending@mal3bna.test',
        commissionBp: 1500,
      },
    ]),
    users: vi.fn().mockResolvedValue([
      { id: 'user-1', name: 'Player One', email: 'p1@test.com', role: 'player', status: 'active' },
      { id: 'user-2', name: 'Owner One', email: 'o1@test.com', role: 'owner', status: 'active' },
    ]),
    disputes: vi.fn().mockResolvedValue([
      {
        id: 'disp-1',
        reservationId: 'res-1',
        playerMessage: 'Pitch lights turned off midway.',
        status: 'open',
        reservation: { bookingCode: 'MLB-DISP-99' },
      },
    ]),
    appeals: vi.fn().mockResolvedValue([]),
    payouts: vi.fn().mockResolvedValue([
      {
        id: 'payout-1',
        venueId: 'venue-1',
        periodStart: '2026-10-01',
        periodEnd: '2026-10-15',
        amountPiastres: 500000,
        status: 'draft',
        createdAt: '2026-10-16T00:00:00.000Z',
      },
    ]),
    stuckItems: vi.fn().mockResolvedValue([]),
  },
}));

function renderDashboard() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AdminDashboardPage />
      </BrowserRouter>
    </QueryClientProvider>,
  );
}

describe('Super Admin Dashboard', () => {
  it('renders executive metrics, operational alert queues, and management cards', async () => {
    renderDashboard();

    // Check title & console badges
    await waitFor(() => {
      expect(screen.getByText('SUPER ADMIN CONSOLE')).toBeDefined();
      expect(screen.getByText('Marketplace Control Center')).toBeDefined();
    });

    // Check KPI metrics
    expect(screen.getByText('Total Venues')).toBeDefined();
    expect(screen.getByText('1 active')).toBeDefined();
    expect(screen.getByText('1 pending')).toBeDefined();

    expect(screen.getByText('Users')).toBeDefined();
    expect(screen.getByText('1 players')).toBeDefined();
    expect(screen.getByText('1 owners')).toBeDefined();

    expect(screen.getByText('Open Disputes')).toBeDefined();
    expect(screen.getByText('5,000.00 EGP')).toBeDefined();

    // Check priority action alert banner
    expect(screen.getByText(/Action Required/i)).toBeDefined();

    // Check management modules
    expect(screen.getByText('Venue Approval Queue & Commission Rates')).toBeDefined();
    expect(screen.getByText('Disputes & Strike Appeals Arbitration')).toBeDefined();
    expect(screen.getByText('Venue Payout Batching & Bank Disbursals')).toBeDefined();
  });
});
