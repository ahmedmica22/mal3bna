import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '../store/ThemeStore';
import { AuthStore } from '../store/AuthStore';
import { OwnerLayout } from '../layouts/OwnerLayout';
import { AdminLayout } from '../layouts/AdminLayout';

function renderWithProviders(component: ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthStore>
          <BrowserRouter>{component}</BrowserRouter>
        </AuthStore>
      </ThemeProvider>
    </QueryClientProvider>,
  );
}

describe('Theme and Layouts Verification', () => {
  it('OwnerLayout renders in dark mode by default with dashboard styling and sidebar navigation', () => {
    localStorage.clear();
    const { container } = renderWithProviders(<OwnerLayout />);

    const dashboard = container.querySelector('.app.dashboard');
    expect(dashboard).not.toBeNull();
    expect(dashboard?.classList.contains('dark')).toBe(true);

    expect(screen.getByText('OWNER SPACE')).toBeDefined();
    expect(screen.getByText('Today')).toBeDefined();
    expect(screen.getByText('Calendar')).toBeDefined();
    expect(screen.getByText('Bookings')).toBeDefined();
    expect(screen.getByText('Venue setup')).toBeDefined();
    expect(screen.getByText('Money')).toBeDefined();
  });

  it('AdminLayout renders in dark mode by default with dashboard styling and sidebar navigation', () => {
    localStorage.clear();
    const { container } = renderWithProviders(<AdminLayout />);

    const dashboard = container.querySelector('.app.dashboard');
    expect(dashboard).not.toBeNull();
    expect(dashboard?.classList.contains('dark')).toBe(true);

    expect(screen.getByText('ADMIN CONTROL')).toBeDefined();
    expect(screen.getByText('Overview')).toBeDefined();
    expect(screen.getByText('Venues')).toBeDefined();
    expect(screen.getByText('Users')).toBeDefined();
    expect(screen.getByText('Disputes')).toBeDefined();
    expect(screen.getByText('Payouts')).toBeDefined();
    expect(screen.getByText('Audit log')).toBeDefined();
  });

  it('toggles theme when clicking the theme button', () => {
    localStorage.clear();
    const { container } = renderWithProviders(<OwnerLayout />);

    const dashboard = container.querySelector('.app.dashboard');
    expect(dashboard?.classList.contains('dark')).toBe(true);

    const themeButton = screen.getByLabelText('Toggle theme');
    fireEvent.click(themeButton);

    expect(dashboard?.classList.contains('light')).toBe(true);
    expect(dashboard?.classList.contains('dark')).toBe(false);

    // Toggle back
    fireEvent.click(themeButton);
    expect(dashboard?.classList.contains('dark')).toBe(true);
  });
});
