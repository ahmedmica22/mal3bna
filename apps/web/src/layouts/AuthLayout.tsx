import { useLanguage } from '../store/LanguageStore';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { BrandIcon } from '../components/common/BrandIcon';

export function AuthLayout({ children }: { children: ReactNode }) {
  const { translate } = useLanguage();
  return (
    <div className="auth-background min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-radial from-[#152c27] via-[#0b1715] to-[#070d0b] text-slate-900 dark:text-slate-100">
      <Link
        to="/"
        className="auth-brand text-2xl font-black mb-8 flex items-center gap-3 hover:opacity-90 transition-opacity"
      >
        <BrandIcon size={40} />
        <span className="bg-gradient-to-r from-lime-300 to-emerald-400 bg-clip-text text-transparent">
          {translate('mal3bna')}
        </span>
        <span className="text-xs text-slate-500 font-normal px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 dark:text-slate-400 dark:bg-white/5 dark:border-white/10">
          Egypt
        </span>
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
