import { lazy, Suspense } from 'react';
import { useLanguage } from '../store/LanguageStore';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import { RoleRoute } from '../routes/RoleRoute';
import { GuestRoute } from '../routes/GuestRoute';
import { PlayerLayout } from '../layouts/PlayerLayout';
import { OwnerLayout } from '../layouts/OwnerLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { HomePage } from '../pages/player/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';

import { StatePanel } from '../components/feedback/StatePanel';

import { useAuth } from '../store/AuthStore';

const VenuePage = lazy(() =>
  import('../pages/player/VenuePage').then((module) => ({ default: module.VenuePage })),
);
const CheckoutPage = lazy(() =>
  import('../pages/player/CheckoutPage').then((module) => ({ default: module.CheckoutPage })),
);
const BookingsPage = lazy(() =>
  import('../pages/player/BookingsPage').then((module) => ({ default: module.BookingsPage })),
);
const CheckInPage = lazy(() =>
  import('../pages/CheckInPage').then((module) => ({ default: module.CheckInPage })),
);
const LoginPage = lazy(() =>
  import('../pages/auth/LoginPage').then((module) => ({ default: module.LoginPage })),
);
const RegisterPage = lazy(() =>
  import('../pages/auth/RegisterPage').then((module) => ({ default: module.RegisterPage })),
);
const VerifyPage = lazy(() =>
  import('../pages/auth/VerifyPage').then((module) => ({ default: module.VerifyPage })),
);
const OwnerHomePage = lazy(() =>
  import('../pages/role/RoleHomePage').then((module) => ({ default: module.OwnerHomePage })),
);
const AdminDashboardPage = lazy(() =>
  import('../pages/admin/AdminDashboardPage').then((module) => ({
    default: module.AdminDashboardPage,
  })),
);
const OwnerCalendarPage = lazy(() =>
  import('../pages/owner/OwnerCalendarPage').then((module) => ({
    default: module.OwnerCalendarPage,
  })),
);
const AdminVenuesPage = lazy(() =>
  import('../pages/admin/AdminVenuesPage').then((module) => ({ default: module.AdminVenuesPage })),
);
const OwnerBookingsPage = lazy(() =>
  import('../pages/owner/OwnerBookingsPage').then((module) => ({
    default: module.OwnerBookingsPage,
  })),
);
const OwnerMoneyPage = lazy(() =>
  import('../pages/owner/OwnerMoneyPage').then((module) => ({ default: module.OwnerMoneyPage })),
);
const OwnerVenuePage = lazy(() =>
  import('../pages/owner/OwnerVenuePage').then((module) => ({ default: module.OwnerVenuePage })),
);
const OwnerProfilePage = lazy(() =>
  import('../pages/owner/OwnerProfilePage').then((module) => ({
    default: module.OwnerProfilePage,
  })),
);
const AdminOperationsPage = lazy(() =>
  import('../pages/admin/AdminOperationsPage').then((module) => ({
    default: module.AdminOperationsPage,
  })),
);
const ProfilePage = lazy(() =>
  import('../pages/player/ProfilePage').then((module) => ({ default: module.ProfilePage })),
);
const SettingsPage = lazy(() =>
  import('../pages/player/SettingsPage').then((module) => ({ default: module.SettingsPage })),
);
const AdminBookingsPage = lazy(() =>
  import('../pages/admin/AdminBookingsPage').then((module) => ({
    default: module.AdminBookingsPage,
  })),
);

function HomeRoute() {
  const { translate } = useLanguage();
  const { user, loading } = useAuth();
  if (loading) return <StatePanel title={translate('Loading your workspace…')} />;
  if (user?.role === 'owner') return <Navigate to="/owner" replace />;
  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  return <HomePage />;
}

export function Router() {
  return (
    <Suspense fallback={<StatePanel title="Loading…" />}>
      <Routes>
        <Route element={<PlayerLayout />}>
          {/* Public Visitor Routes */}
          <Route path="/" element={<HomeRoute />} />
          <Route path="/venues/:id" element={<VenuePage />} />
          <Route path="/checkin" element={<CheckInPage />} />

          {/* Guest Routes: Redirect if already logged in */}
          <Route element={<GuestRoute />}>
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/login" element={<Navigate to="/auth/login" replace />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/register" element={<Navigate to="/auth/register" replace />} />
            <Route path="/auth/verify" element={<VerifyPage />} />
          </Route>

          {/* Player Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['player']} />}>
            <Route path="/checkout/:bookingId" element={<CheckoutPage />} />
            <Route path="/checkout/new" element={<CheckoutPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/notifications" element={<SettingsPage />} />
          </Route>

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Owner-Only Protected Routes */}
        <Route element={<RoleRoute role="owner" />}>
          <Route element={<OwnerLayout />}>
            <Route path="/owner" element={<OwnerHomePage />} />
            <Route path="/owner/calendar" element={<OwnerCalendarPage />} />
            <Route path="/owner/bookings" element={<OwnerBookingsPage />} />
            <Route path="/owner/venue" element={<OwnerVenuePage />} />
            <Route path="/owner/balance" element={<OwnerMoneyPage />} />
            <Route path="/owner/profile" element={<OwnerProfilePage />} />
          </Route>
        </Route>

        {/* Admin-Only Protected Routes */}
        <Route element={<RoleRoute role="admin" />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/venues" element={<AdminVenuesPage />} />
            <Route path="/admin/bookings" element={<AdminBookingsPage />} />
            <Route path="/admin/users" element={<AdminOperationsPage kind="users" />} />
            <Route path="/admin/disputes" element={<AdminOperationsPage kind="disputes" />} />
            <Route path="/admin/payouts" element={<AdminOperationsPage kind="payouts" />} />
            <Route path="/admin/audit" element={<AdminOperationsPage kind="stuck" />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
