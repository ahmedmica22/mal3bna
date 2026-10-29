import { roleNavigation } from '../../app/navigation';
import { useHeader } from '../../hooks/useHeader';
import { AppBrand } from './AppBrand';
import { HeaderActions } from './HeaderActions';
import { NavigationLinks } from './NavigationLinks';

export function TopBar({
  dark,
  onTheme,
  fluid = false,
}: {
  dark: boolean;
  onTheme: () => void;
  fluid?: boolean;
}) {
  const header = useHeader();
  const items = header.user ? roleNavigation[header.user.role] : roleNavigation.player.slice(0, 1);
  return (
    <header className="topbar sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl dark:border-white/10 dark:bg-[#0b1715]/90">
      <div
        className={`mx-auto flex items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8 xl:px-10 ${
          fluid ? 'w-full max-w-full' : 'max-w-7xl'
        }`}
      >
        <AppBrand role={header.user?.role} />
        <nav
          aria-label={header.translate('Main navigation')}
          className="hidden items-center gap-1 rounded-2xl bg-slate-50 p-1 dark:bg-white/5 lg:flex"
        >
          <NavigationLinks items={items} />
        </nav>
        <HeaderActions header={header} dark={dark} onTheme={onTheme} />
      </div>
      {header.menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label={header.translate('Mobile navigation')}
          className="space-y-1 border-t border-slate-200 p-4 dark:border-white/10 lg:hidden"
        >
          <NavigationLinks items={items} variant="mobile" />
        </nav>
      )}
    </header>
  );
}
