import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AdminVenuesPage } from '../pages/admin/AdminVenuesPage';
import { AdminOperationsPage } from '../pages/admin/AdminOperationsPage';
import { adminApi } from '../services/api';

vi.mock('../store/AuthStore', () => ({
  useAuth: () => ({
    user: { id: 'admin-1', role: 'admin', fullName: 'Super Admin' },
    loading: false,
  }),
}));

vi.mock('../services/api', () => ({
  adminApi: {
    venues: vi.fn().mockResolvedValue([
      {
        id: 'venue-pending-1',
        name: 'El Gezira Sports Hub (Pending Approval)',
        status: 'pending',
        ownerEmail: 'owner.pending@mal3bna.test',
        address: 'Zamalek, Cairo',
        commissionBp: 1200,
        courts: [{ id: 'court-1', name: 'Zamalek Nile Court', sport: 'football' }],
      },
    ]),
    decideVenue: vi.fn().mockResolvedValue({ status: 'approved' }),
    changeCommission: vi.fn().mockResolvedValue({ newBp: 1500 }),
    users: vi.fn().mockResolvedValue([
      {
        id: 'usr-101',
        name: 'Ahmed Hassan',
        email: 'player@mal3bna.test',
        role: 'player',
        status: 'active',
      },
      {
        id: 'usr-202',
        name: 'Mohamed Salah',
        email: 'owner@mal3bna.test',
        role: 'owner',
        status: 'active',
      },
    ]),
    setUserStatus: vi.fn().mockResolvedValue({ status: 'suspended' }),
    disputes: vi.fn().mockResolvedValue([
      {
        id: 'dispute-1',
        reservationId: 'res-1',
        playerMessage: 'Gate was locked when we arrived.',
        status: 'open',
        reservation: {
          bookingCode: 'MLB-DISP-01',
          player: { name: 'Ahmed Hassan' },
          venue: { name: 'Al Ahly Arena' },
        },
      },
    ]),
    decideDispute: vi.fn().mockResolvedValue({ decision: 'overturned' }),
    appeals: vi.fn().mockResolvedValue([]),
    payouts: vi.fn().mockResolvedValue([]),
    stuckItems: vi.fn().mockResolvedValue([]),
  },
}));

import { ActionDialogProvider } from '../components/feedback/ActionDialogProvider';
import { ToastProvider } from '../components/feedback/ToastContext';

function renderWithClient(component: ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ToastProvider>
          <ActionDialogProvider>{component}</ActionDialogProvider>
        </ToastProvider>
      </BrowserRouter>
    </QueryClientProvider>,
  );
}

describe('Admin Operations Web Flow', () => {
  it('renders venue approval queue and approves pending venue', async () => {
    renderWithClient(<AdminVenuesPage />);

    await waitFor(() => {
      expect(screen.getByText('El Gezira Sports Hub (Pending Approval)')).toBeDefined();
      expect(screen.getByText('owner.pending@mal3bna.test')).toBeDefined();
      expect(screen.getByText('12.0%')).toBeDefined();
    });

    const approveBtn = screen.getByText('✓ Approve');
    fireEvent.click(approveBtn);

    await waitFor(() => {
      expect(adminApi.decideVenue).toHaveBeenCalledWith('venue-pending-1', 'approved', undefined);
    });
  });

  it('renders disputes queue and allows overturning no-show strike', async () => {
    const prompt = vi.spyOn(window, 'prompt').mockReturnValue('Review test');
    renderWithClient(<AdminOperationsPage kind="disputes" />);

    await waitFor(() => {
      expect(screen.getByText('MLB-DISP-01')).toBeDefined();
      expect(screen.getByText('"Gate was locked when we arrived."')).toBeDefined();
    });

    const overturnBtn = screen.getByText('✓ Overturn (Clear Strike)');
    fireEvent.click(overturnBtn);

    const noteInput = await screen.findByLabelText(/resolution note/i);
    fireEvent.change(noteInput, { target: { value: 'Review test note' } });
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));

    await waitFor(() => {
      expect(adminApi.decideDispute).toHaveBeenCalledWith(
        'dispute-1',
        'overturned',
        expect.any(String),
      );
    });
    prompt.mockRestore();
  });

  it('renders user directory and filters users by name or id', async () => {
    renderWithClient(<AdminOperationsPage kind="users" />);

    // Check directory header and initial users
    await waitFor(() => {
      expect(screen.getByText('User Directory')).toBeDefined();
      expect(screen.getByText('Ahmed Hassan')).toBeDefined();
      expect(screen.getByText('Mohamed Salah')).toBeDefined();
      expect(screen.getByText('usr-101')).toBeDefined();
      expect(screen.getByText('usr-202')).toBeDefined();
    });

    const searchInput = screen.getByPlaceholderText('Search users by name or ID…');

    // 1. Search by Name
    fireEvent.change(searchInput, { target: { value: 'Mohamed' } });
    expect(screen.queryByText('Ahmed Hassan')).toBeNull();
    expect(screen.getByText('Mohamed Salah')).toBeDefined();

    // 2. Search by ID
    fireEvent.change(searchInput, { target: { value: 'usr-101' } });
    expect(screen.getByText('Ahmed Hassan')).toBeDefined();
    expect(screen.queryByText('Mohamed Salah')).toBeNull();

    // 3. Search with non-matching query
    fireEvent.change(searchInput, { target: { value: 'non-existing' } });
    expect(screen.getByText('No users matching "non-existing"')).toBeDefined();

    // 4. Clear search
    const clearBtn = screen.getByText('Clear Search');
    fireEvent.click(clearBtn);
    expect(screen.getByText('Ahmed Hassan')).toBeDefined();
    expect(screen.getByText('Mohamed Salah')).toBeDefined();
  });
});
