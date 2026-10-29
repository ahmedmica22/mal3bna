import type { AdminPageHeaderProps } from '../../types/ui';

export type { AdminPageHeaderProps };

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  children,
  className = '',
}: AdminPageHeaderProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${className}`}
    >
      <div>
        <p className="eyebrow text-xs font-black text-emerald-700 uppercase tracking-wider mb-1 dark:text-lime-400">
          {eyebrow}
        </p>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight dark:text-slate-100">
          {title}
        </h1>
        {description && (
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed dark:text-slate-400">
            {description}
          </p>
        )}
      </div>

      {children && (
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">{children}</div>
      )}
    </div>
  );
}
