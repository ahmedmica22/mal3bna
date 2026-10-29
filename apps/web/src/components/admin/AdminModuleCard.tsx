import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { AdminModuleCardProps } from '../../types/ui';

export type { AdminModuleCardProps };

export function AdminModuleCard({
  to,
  eyebrow,
  title,
  description,
  footerLeft,
  footerRight,
  tone = 'rose',
}: AdminModuleCardProps) {
  const toneClasses = {
    rose: {
      eyebrow: 'text-rose-700 dark:text-rose-400',
      hoverBorder: 'hover:border-rose-400/40',
      iconHover: 'group-hover:text-rose-700 dark:group-hover:text-rose-400',
      actionText: 'text-rose-700 dark:text-rose-400',
    },
    sky: {
      eyebrow: 'text-sky-700 dark:text-sky-400',
      hoverBorder: 'hover:border-sky-400/40',
      iconHover: 'group-hover:text-sky-700 dark:group-hover:text-sky-400',
      actionText: 'text-sky-700 dark:text-sky-400',
    },
    amber: {
      eyebrow: 'text-amber-800 dark:text-amber-400',
      hoverBorder: 'hover:border-amber-400/40',
      iconHover: 'group-hover:text-amber-800 dark:group-hover:text-amber-400',
      actionText: 'text-amber-800 dark:text-amber-400',
    },
    emerald: {
      eyebrow: 'text-emerald-700 dark:text-emerald-400',
      hoverBorder: 'hover:border-emerald-400/40',
      iconHover: 'group-hover:text-emerald-700 dark:group-hover:text-emerald-400',
      actionText: 'text-emerald-700 dark:text-emerald-400',
    },
  }[tone];

  return (
    <Link
      to={to}
      className={`group p-6 rounded-3xl bg-white border border-slate-200  dark:bg-[#13221f]/70 dark:border-white/10 ${toneClasses.hoverBorder} transition-all hover:bg-white shadow-lg flex flex-col justify-between gap-4 dark:hover:bg-[#13221f]`}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold uppercase tracking-wider ${toneClasses.eyebrow}`}>
            {eyebrow}
          </span>
          <ArrowUpRight
            size={18}
            className={`text-slate-500 ${toneClasses.iconHover} group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all`}
          />
        </div>
        <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed dark:text-slate-400">{description}</p>
      </div>

      <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-bold dark:border-white/5 dark:text-slate-300">
        <span>{footerLeft}</span>
        <span className={`${toneClasses.actionText} group-hover:underline`}>{footerRight}</span>
      </div>
    </Link>
  );
}
