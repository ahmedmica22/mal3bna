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
      className={`brand flex shrink-0 items-center gap-2.5 ${className}`}
    >
      <BrandIcon size={34} />
      <span className="text-xl font-black tracking-tight text-emerald-700 dark:text-emerald-300">
        {translate('mal3bna')}
      </span>
      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
        مصر
      </span>
    </Link>
  );
}
