import { Outlet } from 'react-router-dom';
import { roleNavigation } from '../app/navigation';
import { TopBar } from '../components/layout/TopBar';
import { NavigationLinks } from '../components/layout/NavigationLinks';
import { useTheme } from '../store/ThemeStore';
import { useLanguage } from '../store/LanguageStore';

export function DashboardLayout({ role }: { role: 'owner' | 'admin' }) {
  const { dark, toggleTheme } = useTheme();
  const { translate } = useLanguage();
  return (
    <div
      className={`app dashboard min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0b1715] dark:text-[#f3faf4] ${dark ? 'dark' : 'light'}`}
    >
      <TopBar dark={dark} onTheme={toggleTheme} fluid />
      <div className="flex w-full flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 xl:px-10 md:flex-row">
        <aside className="flex h-fit w-full shrink-0 flex-col gap-1.5 rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-white/10 dark:bg-[#13221f]/70 md:sticky md:top-24 md:w-60">
          <p
            className={`eyebrow mb-2 text-[11px] font-black ${role === 'admin' ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-700 dark:text-lime-400'}`}
          >
            {translate(role === 'admin' ? 'ADMIN CONTROL' : 'OWNER SPACE')}
          </p>
          <NavigationLinks
            items={roleNavigation[role]}
            variant="sidebar"
            tone={role === 'admin' ? 'rose' : 'green'}
          />
        </aside>
        <main className="dashboard-content min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
