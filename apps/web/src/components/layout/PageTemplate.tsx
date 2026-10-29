import type { ReactNode } from 'react';
import type { PageHeaderProps } from '../../types/ui';

export type { PageHeaderProps };

export function PageHeader({ title, eyebrow, description, actions }: PageHeaderProps) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

export function PageTemplate({
  children,
  className = '',
  ...header
}: PageHeaderProps & { children: ReactNode; className?: string }) {
  return (
    <main className={`page ${className}`}>
      <PageHeader {...header} />
      {children}
    </main>
  );
}
