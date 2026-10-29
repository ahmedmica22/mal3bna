import { Link } from 'react-router-dom';
import { useLanguage } from '../store/LanguageStore';
import { useAuth } from '../store/AuthStore';
import { homeForRole } from '../app/navigation';
import { Compass } from 'lucide-react';

export function NotFoundPage() {
  const { translate } = useLanguage();
  const { user } = useAuth();
  const homePath = homeForRole(user?.role);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-lime-400/10 dark:text-lime-400">
        <Compass size={32} />
      </div>
      <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 sm:text-5xl">404</h1>
      <p className="mt-2 text-lg font-bold text-slate-700 dark:text-slate-300">
        {translate('Page not found')}
      </p>
      <p className="mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
        {translate('The page you are looking for does not exist or has been moved.')}
      </p>
      <Link
        to={homePath}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-emerald-500 dark:bg-lime-400 dark:text-slate-950 dark:hover:bg-lime-300"
      >
        <span>{translate('Back to Home')}</span>
      </Link>
    </div>
  );
}
