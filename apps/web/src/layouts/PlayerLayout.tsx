import { Outlet } from 'react-router-dom';
import { TopBar } from '../components/layout/TopBar';
import { useTheme } from '../store/ThemeStore';

export function PlayerLayout() {
  const { dark, toggleTheme } = useTheme();
  return (
    <div
      className={`app min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0b1715] dark:text-[#f3faf4] transition-colors duration-200 ${dark ? 'dark' : 'light'}`}
    >
      <TopBar dark={dark} onTheme={toggleTheme} fluid />
      <Outlet />
    </div>
  );
}
