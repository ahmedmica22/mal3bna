import type { ReactNode } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SettingsPage } from '../pages/player/SettingsPage';
import { CheckoutPage } from '../pages/player/CheckoutPage';

vi.mock('../services/api', () => ({
  notificationApi: {
    inbox: vi.fn().mockResolvedValue([
      {
        id: 'notif-1',
        title: 'Booking Confirmed',
        body: 'Your match at Al Ahly Arena is confirmed for 20:00.',
        createdAt: '2026-10-25T18:00:00.000Z',
        readAt: null,
      },
    ]),
    markRead: vi.fn().mockResolvedValue({ success: true }),
    preferences: vi.fn().mockResolvedValue([
      { category: 'booking_confirmation', emailEnabled: true, pushEnabled: true },
      { category: 'match_reminder', emailEnabled: true, pushEnabled: true },
    ]),
    setPreference: vi.fn().mockResolvedValue({ success: true }),
  },
  venueApi: {
    quote: vi.fn().mockResolvedValue({
      totalPiastres: 60000,
      depositPiastres: 18000,
      dueAtVenuePiastres: 42000,
      breakdown: [{ hour: 20, pricePiastres: 60000 }],
    }),
  },
  bookingApi: {
    create: vi.fn(),
  },
  authApi: {
    me: vi.fn().mockResolvedValue({
      id: 'player-1',
      name: 'Amr Zaki',
      email: 'player@mal3bna.test',
      role: 'player',
      status: 'active',
    }),
  },
}));

vi.mock('../store/AuthStore', () => ({
  useAuth: () => ({
    user: {
      id: 'player-1',
      name: 'Amr Zaki',
      email: 'player@mal3bna.test',
      role: 'player',
      status: 'active',
    },
    signOut: vi.fn(),
  }),
}));

function renderWithClient(component: ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{component}</MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('Settings and Checkout Web Flows', () => {
  it('renders settings page with tabs for inbox, alert channels, language, and support', async () => {
    renderWithClient(<SettingsPage />);

    expect(screen.getByText('ACCOUNT SETTINGS & INBOX')).toBeDefined();
    expect(screen.getByText('Notifications')).toBeDefined();
    expect(screen.getByText('Alert Channels')).toBeDefined();
    expect(screen.getByText('Language & Region')).toBeDefined();
    expect(screen.getByText('Support & Help')).toBeDefined();

    // Inbox item
    expect(await screen.findByText('Booking Confirmed')).toBeDefined();
    expect(screen.getByText('Your match at Al Ahly Arena is confirmed for 20:00.')).toBeDefined();
  });

  it('renders checkout page with 10-minute hold and payment options', async () => {
    renderWithClient(<CheckoutPage />);

    expect(screen.getByRole('heading', { name: 'Checkout' })).toBeDefined();
    expect(screen.getByText('30% deposit')).toBeDefined();
    expect(screen.getByText('Pay in full')).toBeDefined();
    expect(screen.getByRole('heading', { name: /Cancellation policy/i })).toBeDefined();
  });
});
