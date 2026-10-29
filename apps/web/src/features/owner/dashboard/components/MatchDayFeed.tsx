import { Link } from 'react-router-dom';
import { ArrowUpRight, CalendarDays, ChevronLeft, ChevronRight, Clock3 } from 'lucide-react';
import { DatePicker } from '../../../../components/ui/DatePicker';
import { DashboardPanel } from './DashboardPanel';
import { ScheduleBookingRow } from './ScheduleBookingRow';
import type { OwnerDashboardContentProps } from '../types';

export function MatchDayFeed(props: Pick<OwnerDashboardContentProps, 'translate' | 'scheduleDate' | 'setScheduleDate' | 'previousDay' | 'nextDay' | 'goToday' | 'today' | 'dayLabel' | 'courtFilter' | 'setCourtFilter' | 'courts' | 'displayBookings' | 'time' | 'money' | 'formatNumber'>) {
  const { translate, scheduleDate, setScheduleDate, previousDay, nextDay, goToday, today, dayLabel, courtFilter, setCourtFilter, courts, displayBookings, formatNumber } = props;
  return <DashboardPanel title={translate('Venue schedule')} eyebrow={translate('THE DAILY LINEUP')} action={<Link to="/owner/calendar" className="flex min-h-8 items-center gap-1 text-xs font-bold text-emerald-700 dark:text-lime-400">{translate('Full calendar')}<ArrowUpRight size={15} aria-hidden="true" /></Link>}>
    <div className="mb-5 flex flex-wrap items-center gap-2 rounded-2xl bg-slate-50 p-3 dark:bg-black/15">
      <div className="flex min-w-0 flex-1 items-center gap-1.5">
        <button type="button" onClick={previousDay} aria-label={translate('Previous schedule day')} className="flex h-11 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"><ChevronLeft size={16} className="rtl:rotate-180" aria-hidden="true" /></button>
        <div className="min-w-0 flex-1"><DatePicker value={scheduleDate} onChange={setScheduleDate} /></div>
        <button type="button" onClick={nextDay} aria-label={translate('Next schedule day')} className="flex h-11 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"><ChevronRight size={16} className="rtl:rotate-180" aria-hidden="true" /></button>
      </div>
      <button type="button" onClick={goToday} disabled={scheduleDate === today} className="min-h-11 rounded-xl px-3 text-xs font-bold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50 dark:text-lime-400 dark:hover:bg-white/5">{translate('Today')}</button>
      <label className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"><span className="sr-only">{translate('Filter schedule by court')}</span><select value={courtFilter} onChange={(event) => setCourtFilter(event.target.value)} className="min-w-0 max-w-44 bg-transparent py-2 outline-none dark:[color-scheme:dark]"><option value="all">{translate('All courts')}</option>{courts.map((court) => <option value={court.id} key={court.id}>{court.name}</option>)}</select></label>
    </div>
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400"><p>{dayLabel(scheduleDate)} · {translate('Africa/Cairo Time')}</p><p>{translate('{{count}} reservations', { count: formatNumber(displayBookings.length) })}</p></div>
    {displayBookings.length === 0 ? <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 p-6 text-center dark:border-white/10"><CalendarDays size={30} className="mb-4 text-slate-400" aria-hidden="true" /><h3 className="text-sm font-bold text-slate-900 dark:text-white">{translate('Nothing scheduled for this day')}</h3><p className="mt-2 max-w-xs text-xs leading-relaxed text-slate-500 dark:text-slate-400">{translate('Try another date or court, or add a walk-in booking.')}</p><Link to="/owner/bookings" className="mt-5 rounded-xl bg-lime-400 px-4 py-3 text-xs font-bold text-slate-950">{translate('Add walk-in booking')}</Link></div> : <ol aria-label={translate('Scheduled reservations')} className="divide-y divide-slate-100 dark:divide-white/5">{displayBookings.map((booking) => <ScheduleBookingRow key={booking.id} booking={booking} {...{ translate, scheduleDate, time: props.time, money: props.money }} />)}</ol>}
    <p className="mt-4 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400"><Clock3 size={13} aria-hidden="true" />{translate('Confirmed bookings, holds and court blocks. Updates every 5 seconds.')}</p>
  </DashboardPanel>;
}
