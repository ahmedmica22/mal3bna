import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { DashboardPanel } from './DashboardPanel';
import type { OwnerDashboardContentProps } from '../types';

export function VenueActivity({ stats, translate, formatNumber, dayLabel, today }: Pick<OwnerDashboardContentProps, 'stats' | 'translate' | 'formatNumber' | 'dayLabel' | 'today'>) {
  const max = Math.max(1, ...stats.week.map((day) => day.hours));
  const total = stats.week.reduce((value, day) => value + day.hours, 0);
  return <DashboardPanel title={translate('Court activity')} eyebrow={translate('LAST 7 DAYS')} action={<span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:bg-lime-400/10 dark:text-lime-300">{translate('{{count}} booked hours', { count: formatNumber(total) })}</span>}>
    <ol className="grid grid-cols-7 gap-2 sm:gap-3" aria-label={translate('Booked hours by day')}>{stats.week.map((day) => <li key={day.date} className="flex min-w-0 flex-col items-center gap-2"><span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{formatNumber(day.hours)}</span><div className="flex h-28 w-full max-w-10 items-end overflow-hidden rounded-lg bg-slate-100 dark:bg-white/5" aria-hidden="true"><div style={{ height: `${day.hours / max * 100}%` }} className={`w-full rounded-lg ${day.date === today ? 'bg-lime-400' : 'bg-emerald-500/65 dark:bg-emerald-400/50'}`} /></div><span className="max-w-full truncate text-[10px] text-slate-500 dark:text-slate-400">{dayLabel(day.date, true)}</span></li>)}</ol>
    <p className="mt-5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{translate('Reserved court hours, not occupancy. Cancelled bookings and blocks are excluded.')}</p>
    <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 dark:border-white/10"><div><p className="text-2xl font-extrabold text-slate-950 dark:text-white">{formatNumber(stats.todayBookings)}</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{translate("Today's matches")}</p></div><div><p className="text-2xl font-extrabold text-slate-950 dark:text-white">{formatNumber(stats.upcomingBookings)}</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{translate('Upcoming matches')}</p></div></div>
    <Link to="/owner/balance" className="mt-5 flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 dark:border-white/10 dark:text-slate-200">{translate('View financial reports')}<ArrowUpRight size={14} aria-hidden="true" /></Link>
  </DashboardPanel>;
}
