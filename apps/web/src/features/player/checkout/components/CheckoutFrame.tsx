import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function CheckoutFrame({
  title,
  backTo,
  backLabel,
  footer,
  children,
  subtitle,
  sidebar,
}: {
  title: string;
  backTo: string;
  backLabel: string;
  footer?: ReactNode;
  children: ReactNode;
  subtitle?: string;
  sidebar?: ReactNode;
}) {
  return (
    <main
      className={`mx-auto w-full px-4 pt-6 text-slate-900 dark:text-slate-100 sm:px-7 sm:pt-10 ${footer ? 'max-w-6xl pb-64 lg:pb-14' : sidebar ? 'max-w-6xl pb-12' : 'max-w-[680px] pb-12'}`}
    >
      <header className="mb-6 flex items-center gap-4 sm:mb-8">
        <Link
          to={backTo}
          aria-label={backLabel}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-slate-200/60 transition hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 dark:bg-white/[0.07] dark:hover:bg-white/10"
        >
          <ArrowLeft size={22} className="rtl:rotate-180" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>
      </header>
      <div
        className={
          footer || sidebar
            ? 'grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8'
            : ''
        }
      >
        <div className="min-w-0 space-y-5">{children}</div>
        {sidebar}
        {footer && (
          <footer className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-slate-50/95 backdrop-blur-xl dark:border-white/10 dark:bg-[#0b1715]/95 lg:sticky lg:inset-auto lg:top-24 lg:z-auto lg:max-h-[calc(100dvh-7rem)] lg:overflow-y-auto lg:rounded-[28px] lg:border lg:bg-white lg:shadow-xl lg:shadow-emerald-950/5 dark:lg:bg-[#13221f]">
            <div
              className="mx-auto w-full max-w-[680px] space-y-4 px-4 pt-4 sm:px-7 lg:px-6 lg:pt-6"
              style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}
            >
              {footer}
            </div>
          </footer>
        )}
      </div>
    </main>
  );
}
