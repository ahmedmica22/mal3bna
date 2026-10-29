import { Link } from 'react-router-dom';
import { Globe, LogOut, Menu, Moon, Sun, X } from 'lucide-react';
import { profileForRole } from '../../app/navigation';
import type { useHeader } from '../../hooks/useHeader';

export function HeaderActions({
  header,
  dark,
  onTheme,
}: {
  header: ReturnType<typeof useHeader>;
  dark: boolean;
  onTheme: () => void;
}) {
  const { user, avatarUrl, translate, language, toggleLanguage, logout, menuOpen, setMenuOpen } =
    header;
  return (
    <div className="flex items-center gap-2.5">
      <button
        type="button"
        onClick={toggleLanguage}
        title={language === 'en' ? 'التبديل إلى العربية' : 'Switch to English'}
        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-emerald-400/50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-lime-400/40 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
      >
        <Globe size={14} aria-hidden="true" />
        {language === 'en' ? 'العربية' : 'EN'}
      </button>
      <button
        type="button"
        onClick={onTheme}
        aria-label={translate('Toggle theme')}
        title={translate(dark ? 'Light mode' : 'Dark mode')}
        className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-amber-500 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-amber-300 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
      >
        {dark ? <Sun size={17} /> : <Moon size={17} />}
      </button>
      {user ? (
        <div className="flex items-center gap-2 border-s border-slate-200 ps-2 dark:border-white/10">
          <Link to={profileForRole(user.role)} className="flex items-center gap-2">
            {avatarUrl ? (
              <img src={avatarUrl} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-700 dark:bg-lime-400/20 dark:text-lime-300">
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}
            <span className="hidden text-start sm:block">
              <strong className="block text-xs">{user.name.split(' ')[0]}</strong>
              <span className="block text-[10px] text-slate-500 dark:text-slate-400">
                {translate(user.role)}
              </span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => void logout()}
            aria-label={translate('Sign out')}
            className="rounded-xl p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10"
          >
            <LogOut size={16} />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Link
            to="/auth/login"
            className="rounded-xl bg-slate-100 hover:bg-slate-200 px-3.5 py-2 text-xs font-bold text-slate-800 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-200 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            {translate('Sign In')}
          </Link>
          <Link
            to="/auth/register"
            className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 dark:bg-lime-400 dark:hover:bg-lime-300 dark:text-slate-950 dark:shadow-lime-400/20 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            {translate('Register')}
          </Link>
        </div>
      )}
      <button
        type="button"
        aria-label={translate('Toggle navigation menu')}
        aria-expanded={menuOpen}
        aria-controls="mobile-navigation"
        onClick={() => setMenuOpen(!menuOpen)}
        className="rounded-xl p-2 lg:hidden"
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
    </div>
  );
}
