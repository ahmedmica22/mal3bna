import { Link } from 'react-router-dom';
import { ArrowUpRight, CalendarDays, MapPin, RefreshCw } from 'lucide-react';
import { StatusBadge } from '../../../../components/ui/StatusBadge';
import type { OwnerDashboardContentProps } from '../types';

export function OwnerDashboardHeader({ venue, translate, refresh, refreshing, dayLabel, today }: Pick<OwnerDashboardContentProps, 'venue' | 'translate' | 'refresh' | 'refreshing' | 'dayLabel' | 'today'>) {
  return (
    <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0 space-y-3">
        <p className="text-[11px] font-black uppercase tracking-[.2em] text-emerald-700 dark:text-lime-400">{translate('VENUE OPERATIONS')}</p>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white">{venue?.name ?? translate('Your venue overview')}</h1>
          {venue?.status && <StatusBadge status={venue.status} />}
        </div>
        <p className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"><MapPin size={14} aria-hidden="true" />{venue?.address ?? translate('Your venue, at a glance.')}</p>
        <p className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"><CalendarDays size={14} aria-hidden="true" />{dayLabel(today)}<span aria-hidden="true">·</span>{translate('Africa/Cairo Time')}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={refresh} disabled={refreshing} aria-label={translate('Refresh dashboard')} className="flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"><RefreshCw size={16} aria-hidden="true" className={refreshing ? 'animate-spin motion-reduce:animate-none' : ''} /></button>
        <Link to="/owner/venue" className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">{translate('Manage venue')}<ArrowUpRight size={15} aria-hidden="true" /></Link>
        <Link to="/owner/calendar" className="flex min-h-11 items-center gap-2 rounded-xl bg-lime-400 px-4 text-xs font-extrabold text-slate-950 transition hover:bg-lime-300"><CalendarDays size={16} aria-hidden="true" />{translate('Open full calendar')}</Link>
      </div>
    </header>
  );
}
