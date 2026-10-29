import { useLanguage } from '../store/LanguageStore';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../store/AuthStore';
import type { Role } from '../types/domain';

export function ProtectedRoute({ allowedRoles }: { allowedRoles?: Role[] } = {}) {
  const { translate } = useLanguage();
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="screen-state min-h-[60vh] flex flex-col items-center justify-center p-6"
      >
        <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg dark:border-white/10 dark:bg-[#13221f] space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-lime-400/15 border border-lime-400/40 mx-auto flex items-center justify-center">
            <span className="w-3.5 h-3.5 rounded-full bg-lime-400 animate-ping" />
          </div>
          <p className="font-bold text-slate-800 dark:text-slate-100">
            {translate('Loading your session…')}
          </p>
          <div className="space-y-2 pt-2">
            <div className="h-3.5 w-3/4 mx-auto rounded-md shimmer-wave" />
            <div className="h-3.5 w-1/2 mx-auto rounded-md shimmer-wave" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/auth/login"
        state={{ from: location.pathname + location.search }}
        replace
      />
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <Navigate
        to={user.role === 'owner' ? '/owner' : user.role === 'admin' ? '/admin' : '/'}
        replace
      />
    );
  }

  return <Outlet />;
}
