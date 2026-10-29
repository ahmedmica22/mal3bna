import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../store/LanguageStore';
import type { NavigationItem } from '../../app/navigation';

export function NavigationLinks({
  items,
  variant = 'desktop',
  tone = 'green',
}: {
  items: readonly NavigationItem[];
  variant?: 'desktop' | 'mobile' | 'sidebar';
  tone?: 'green' | 'rose';
}) {
  const { translate } = useLanguage();
  return (
    <>
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={Boolean(end)}
          className={({ isActive }) =>
            [
              'flex items-center gap-2.5 rounded-xl text-xs font-bold transition-colors focus-visible:outline-offset-2',
              variant === 'desktop' ? 'px-3 py-2' : 'px-3.5 py-3',
              isActive
                ? tone === 'rose'
                  ? 'active bg-rose-500 text-white'
                  : 'active bg-emerald-100 text-emerald-900 dark:bg-lime-400 dark:text-slate-950'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white',
            ].join(' ')
          }
        >
          <Icon size={variant === 'mobile' ? 18 : 15} aria-hidden="true" />
          <span>{translate(label)}</span>
        </NavLink>
      ))}
    </>
  );
}
