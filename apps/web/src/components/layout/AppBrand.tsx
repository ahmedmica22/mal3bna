import { Link } from 'react-router-dom';
import { homeForRole } from '../../app/navigation';
import { useLanguage } from '../../store/LanguageStore';
import { BrandIcon } from '../common/BrandIcon';
import type { Role } from '../../types/domain';

export function AppBrand({
  role,
  className = '',
}: {
  role?: Role | undefined;
  className?: string;
}) {
  const { translate } = useLanguage();
  return (
    <Link
      to={homeForRole(role)}
      className={`brand group flex shrink-0 items-center gap-2.5 transition-all duration-200 hover:scale-[1.02] ${className}`}
    >
      <div className="transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110">
        <BrandIcon size={34} />
      </div>
      <span className="text-xl font-black tracking-tight text-emerald-700 dark:text-emerald-300 group-hover:text-emerald-600 dark:group-hover:text-lime-300 transition-colors">
        {translate('mal3bna')}
      </span>
      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300 group-hover:border-lime-400/50 transition-colors">
        مصر
      </span>
    </Link>
  );
}
