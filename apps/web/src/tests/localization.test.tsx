import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LanguageProvider, useLanguage } from '../store/LanguageStore';
import { LoginPage } from '../pages/auth/LoginPage';
import { HomePage } from '../pages/player/HomePage';
import { AdminBookingsPage } from '../pages/admin/AdminBookingsPage';
import { DatePicker } from '../components/ui/DatePicker';
import { authApi } from '../services/api';
import { webArabic } from '../../../../packages/i18n/src/web-ar';

const account = vi.hoisted(() => ({ user: null as { id: string; language: 'en' | 'ar' } | null }));
vi.mock('../store/AuthStore', () => ({ useAuth: () => ({ user: account.user, signIn: vi.fn() }) }));
vi.mock('../services/api', () => ({
  authApi: { updateLanguage: vi.fn().mockResolvedValue({}) },
  venueApi: {
    list: vi.fn().mockResolvedValue([{ id: 'venue', name: 'Original venue name', courts: [] }]),
  },
  adminApi: {
    bookings: vi.fn().mockResolvedValue({
      page: 1,
      pageSize: 50,
      total: 1,
      totalPages: 1,
      items: [
        {
          id: 'booking',
          bookingCode: 'TEST-123',
          kind: 'booking',
          status: 'confirmed',
          startsAt: '2026-10-27T15:00:00Z',
          paidPiastres: 30000,
          totalPiastres: 100000,
          venue: { name: 'Original venue name' },
          court: { name: 'Original court', sport: 'football' },
          player: { name: 'Original player' },
        },
      ],
    }),
  },
}));

function Switcher() {
  const { setLanguage } = useLanguage();
  return (
    <>
      <button onClick={() => void setLanguage('ar')}>Arabic switch</button>
      <button onClick={() => void setLanguage('en')}>English switch</button>
    </>
  );
}

function mount(children: React.ReactNode) {
  return render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <MemoryRouter>
        <LanguageProvider>
          <Switcher />
          {children}
        </LanguageProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  localStorage.clear();
  account.user = null;
  vi.clearAllMocks();
});
afterEach(cleanup);

describe('Arabic localization', () => {
  it('updates auth and discovery copy together without clearing typed form values', async () => {
    mount(
      <>
        <LoginPage />
        <HomePage />
      </>,
    );
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'existing@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Arabic switch' }));
    expect(screen.getByRole('heading', { name: 'جاهز للعب؟' })).toBeDefined();
    expect(screen.getByRole('heading', { name: 'ملاعب القاهرة' })).toBeDefined();
    expect((screen.getByLabelText('البريد الإلكتروني') as HTMLInputElement).value).toBe(
      'existing@example.com',
    );
    expect(document.documentElement.dir).toBe('rtl');
    expect(document.documentElement.lang).toBe('ar');
    expect(localStorage.getItem('mal3bna_lang')).toBe('ar');
    await waitFor(() => expect(screen.getByText('Original venue name')).toBeDefined());
    fireEvent.click(screen.getByRole('button', { name: 'English switch' }));
    expect(screen.getByRole('heading', { name: 'Ready to play?' })).toBeDefined();
    expect(document.documentElement.dir).toBe('ltr');
  });

  it('translates admin booking labels, sports, and statuses while preserving customer data', async () => {
    localStorage.setItem('mal3bna_lang', 'ar');
    mount(<AdminBookingsPage />);
    await screen.findByRole('heading', { name: 'جميع حجوزات الملاعب' });
    expect(screen.getByText('مؤكد')).toBeDefined();
    expect(screen.getByText('Original player')).toBeDefined();
    expect(screen.getByText('Original venue name')).toBeDefined();
    expect(screen.queryByText('All court bookings')).toBeNull();
  });

  it('localizes calendar month and weekday labels', () => {
    mount(<DatePicker value="2026-10-27" onChange={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Arabic switch' }));
    fireEvent.click(screen.getByRole('button', { name: /الثلاثاء، 27 أكتوبر 2026/ }));
    expect(screen.getAllByText(/أكتوبر 2026/).length).toBeGreaterThan(0);
    expect(screen.getByText('أحد')).toBeDefined();
  });

  it('saves the signed-in account preference and contains a complete application catalog', async () => {
    account.user = { id: 'player', language: 'en' };
    mount(<LoginPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Arabic switch' }));
    await waitFor(() => expect(authApi.updateLanguage).toHaveBeenCalledWith('ar'));
    expect(Object.keys(webArabic).length).toBeGreaterThan(900);
    expect(webArabic['Invalid email, phone number, or password']).toContain('كلمة المرور');
  });
});
