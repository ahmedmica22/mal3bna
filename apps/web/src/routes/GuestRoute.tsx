import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../store/AuthStore';

export function GuestRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (user) {
    const from = (location.state as { from?: string } | null)?.from;
    const defaultHome = user.role === 'owner' ? '/owner' : user.role === 'admin' ? '/admin' : '/';
    return <Navigate to={from || defaultHome} replace />;
  }

  return <Outlet />;
}
