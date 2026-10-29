import { ReactNode } from 'react';
import { useLanguage } from '../../store/LanguageStore';
import { Shimmer } from './Shimmer';

export function StatePanel({
  title,
  children,
  action,
  className = '',
  loading,
}: {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
  loading?: boolean;
}) {
  const { translate } = useLanguage();
  const translatedTitle = translate(title);
  const isLoading =
    loading ??
    /loading|جاري التحميل|تحميل|calculating/i.test(title);

  if (isLoading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className={`state-panel rounded-2xl border border-slate-200 bg-white backdrop-blur-md p-8 text-center max-w-md mx-auto my-6 flex flex-col items-center justify-center gap-4 shadow-lg shadow-emerald-950/5 dark:border-white/10 dark:bg-[#13221f]/80 dark:shadow-black/20 ${className}`}
      >
        {/* Shimmer pulse beacon */}
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-lime-400/15 border border-lime-400/40 flex items-center justify-center text-emerald-700 dark:text-lime-300">
            <span className="w-3.5 h-3.5 rounded-full bg-lime-400 animate-ping" />
          </div>
        </div>

        {/* Title */}
        <strong className="text-base font-bold text-slate-900 dark:text-slate-100">
          {translatedTitle}
        </strong>

        {/* Realistic shimmer skeleton bars */}
        <div className="w-full space-y-2 pt-1">
          <Shimmer className="h-3.5 w-4/5 mx-auto rounded-md" />
          <Shimmer className="h-3.5 w-3/5 mx-auto rounded-md" />
        </div>

        {children && (
          <p className="text-sm text-slate-500 max-w-sm m-0 leading-relaxed dark:text-slate-400">
            {typeof children === 'string' ? translate(children) : children}
          </p>
        )}
        {action && <div className="mt-2">{action}</div>}
      </div>
    );
  }

  return (
    <div
      className={`state-panel rounded-2xl border border-slate-200 bg-white backdrop-blur-md p-8 text-center max-w-md mx-auto my-6 flex flex-col items-center justify-center gap-3 shadow-lg shadow-emerald-950/5 dark:border-white/10 dark:bg-[#13221f]/60 dark:shadow-black/20 ${className}`}
    >
      <strong className="text-base font-bold text-slate-900 dark:text-slate-100">
        {translatedTitle}
      </strong>
      {children && (
        <p className="text-sm text-slate-500 max-w-sm m-0 leading-relaxed dark:text-slate-400">
          {typeof children === 'string' ? translate(children) : children}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
