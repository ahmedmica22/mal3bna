import { useId, type ReactNode } from 'react';
export function DashboardPanel({ title, eyebrow, action, children, className = '' }: { title: string; eyebrow?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  const id = useId();
  return <section aria-labelledby={id} className={`min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-white/10 dark:bg-[#13221f] ${className}`}>
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>{eyebrow && <p className="mb-1 text-[10px] font-bold uppercase tracking-[.15em] text-slate-500 dark:text-slate-400">{eyebrow}</p>}<h2 id={id} className="text-lg font-extrabold tracking-tight text-slate-950 dark:text-white">{title}</h2></div>
      {action}
    </div>
    {children}
  </section>;
}
