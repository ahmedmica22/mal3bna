import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { GuestRoute } from '../routes/GuestRoute';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import { NotFoundPage } from '../pages/NotFoundPage';

let mockAuthState: {
  user: { id: string; email: string; role: 'player' | 'owner' | 'admin'; fullName: string } | null;
  loading: boolean;
} = {
  user: null,
  loading: false,
};

vi.mock('../store/AuthStore', () => ({
  useAuth: () => mockAuthState,
}));

function LocationDisplay() {
  const location = useLocation();
  return (
    <div>
      <div data-testid="location-pathname">{location.pathname}</div>
      <div data-testid="location-state">{JSON.stringify(location.state)}</div>
    </div>
  );
}

describe('Route Guards & Navigation Security', () => {
  it('GuestRoute: allows unauthenticated visitors to view the login/register forms', () => {
    mockAuthState = { user: null, loading: false };

    render(
      <MemoryRouter initialEntries={['/auth/login']}>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/auth/login" element={<div>Guest Login Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Guest Login Page')).toBeDefined();
  });

  it('GuestRoute: redirects authenticated player to home / or to state.from', () => {
    mockAuthState = {
      user: { id: 'p1', email: 'player@example.com', role: 'player', fullName: 'Player One' },
      loading: false,
    };

    render(
      <MemoryRouter initialEntries={['/auth/login']}>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/auth/login" element={<div>Guest Login Page</div>} />
          </Route>
          <Route path="/" element={<div>Player Home Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.queryByText('Guest Login Page')).toBeNull();
    expect(screen.getByText('Player Home Page')).toBeDefined();
  });

  it('GuestRoute: redirects authenticated owner to /owner', () => {
    mockAuthState = {
      user: { id: 'o1', email: 'owner@example.com', role: 'owner', fullName: 'Owner One' },
      loading: false,
    };

    render(
      <MemoryRouter initialEntries={['/auth/login']}>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/auth/login" element={<div>Guest Login Page</div>} />
          </Route>
          <Route path="/owner" element={<div>Owner Dashboard</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.queryByText('Guest Login Page')).toBeNull();
    expect(screen.getByText('Owner Dashboard')).toBeDefined();
  });

  it('ProtectedRoute: redirects unauthenticated guest to /auth/login and saves target in state.from', () => {
    mockAuthState = { user: null, loading: false };

    render(
      <MemoryRouter initialEntries={['/checkout/booking-123']}>
        <Routes>
          <Route element={<ProtectedRoute allowedRoles={['player']} />}>
            <Route path="/checkout/:bookingId" element={<div>Checkout Page</div>} />
          </Route>
          <Route path="/auth/login" element={<LocationDisplay />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.queryByText('Checkout Page')).toBeNull();
    expect(screen.getByTestId('location-pathname').textContent).toBe('/auth/login');
    expect(screen.getByTestId('location-state').textContent).toContain('/checkout/booking-123');
  });

  it('ProtectedRoute: denies access when user role is not in allowedRoles (owner accessing player bookings)', () => {
    mockAuthState = {
      user: { id: 'o1', email: 'owner@example.com', role: 'owner', fullName: 'Owner One' },
      loading: false,
    };

    render(
      <MemoryRouter initialEntries={['/bookings']}>
        <Routes>
          <Route element={<ProtectedRoute allowedRoles={['player']} />}>
            <Route path="/bookings" element={<div>Player Bookings Page</div>} />
          </Route>
          <Route path="/owner" element={<div>Owner Dashboard</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.queryByText('Player Bookings Page')).toBeNull();
    expect(screen.getByText('Owner Dashboard')).toBeDefined();
  });

  it('NotFoundPage: displays 404 message and provides role-aware return link', () => {
    mockAuthState = {
      user: { id: 'p1', email: 'player@example.com', role: 'player', fullName: 'Player One' },
      loading: false,
    };

    render(
      <MemoryRouter initialEntries={['/some/non-existent/route']}>
        <NotFoundPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('404')).toBeDefined();
    expect(screen.getByText(/page not found/i)).toBeDefined();
    const returnLink = screen.getByRole('link', { name: /back to home/i });
    expect(returnLink.getAttribute('href')).toBe('/');
  });
});
