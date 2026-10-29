import { ReactNode } from 'react';
import { useLanguage } from '../../store/LanguageStore';

export function Badge({
  children,
  tone = 'neutral',
  className = '',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
  className?: string;
}) {
  const { translate } = useLanguage();
  const toneStyles = {
    success: 'bg-lime-400/15 text-emerald-700 border border-lime-400/30 dark:text-lime-400',
    warning: 'bg-amber-400/15 text-amber-800 border border-amber-400/30 dark:text-amber-400',
    danger: 'bg-rose-500/15 text-rose-700 border border-rose-500/30 dark:text-rose-400',
    neutral:
      'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-white/10 dark:text-slate-300 dark:border-white/15',
  }[tone];

  return (
    <span
      className={`badge badge-${tone} inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${toneStyles} ${className}`}
    >
      {typeof children === 'string' ? translate(children) : children}
    </span>
  );
}
