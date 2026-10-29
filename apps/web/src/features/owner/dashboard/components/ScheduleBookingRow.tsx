import { Link } from 'react-router-dom';
import { ArrowUpRight, LockKeyhole } from 'lucide-react';
import { StatusBadge } from '../../../../components/ui/StatusBadge';
import { venueDate } from '../../../../utils/venue-time';
import type { OwnerBooking } from '../../../../types/domain';
import type { OwnerDashboardContentProps } from '../types';

export function ScheduleBookingRow({ booking, translate, scheduleDate, time, money }: Pick<OwnerDashboardContentProps, 'translate' | 'scheduleDate' | 'time' | 'money'> & { booking: OwnerBooking }) {
  const blocked = booking.kind === 'block';
  return <li className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center">
    <div className="flex min-w-0 flex-1 items-start gap-3">
      <div className={`flex w-16 shrink-0 flex-col items-center rounded-2xl border px-2 py-3 ${blocked ? 'border-slate-200 bg-slate-100 text-slate-500 dark:border-white/10 dark:bg-white/5' : 'border-emerald-100 bg-emerald-50 text-emerald-800 dark:border-lime-400/15 dark:bg-lime-400/5 dark:text-lime-300'}`}><span className="text-sm font-black" dir="ltr">{time(booking.startsAt)}</span><span className="mt-1 text-[10px] opacity-70" dir="ltr">{time(booking.endsAt)}</span></div>
      <div className="min-w-0 space-y-1.5"><div className="flex flex-wrap items-center gap-2"><h3 className="break-words text-sm font-bold text-slate-950 dark:text-white">{blocked ? translate('Court blocked') : booking.customerName ?? translate('Player Captain')}</h3>{blocked ? <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400"><LockKeyhole size={12} aria-hidden="true" />{translate('Unavailable')}</span> : <StatusBadge status={booking.status} />}</div><p className="break-words text-xs text-slate-500 dark:text-slate-400">{booking.courtName ?? translate('Court')} · <span className="font-mono">#{booking.bookingCode ?? booking.id.slice(0, 8)}</span></p>
      {venueDate(booking.startsAt) !== scheduleDate && <p className="text-[10px] text-amber-700 dark:text-amber-300">{translate('Continues from previous day')}</p>}
      {venueDate(new Date(Date.parse(booking.endsAt) - 1)) > scheduleDate && <p className="text-[10px] text-amber-700 dark:text-amber-300">{translate('Ends next day')}</p>}
      {booking.isTestPayment && <p className="text-[10px] font-bold text-amber-700 dark:text-amber-300">{translate('Test payment')}</p>}</div>
    </div>
    <div className="flex items-center justify-between gap-3 ps-[76px] sm:ps-0"><div className="text-start sm:text-end">{!blocked && <><p className="text-xs font-extrabold text-slate-900 dark:text-slate-100">{money(booking.dueAtVenuePiastres ?? booking.amountDuePiastres ?? 0)}</p><p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">{translate(booking.status === 'held' ? 'Payment pending' : 'Due at venue')}</p></>}</div><Link to="/owner/bookings" aria-label={translate('Manage reservation {{code}}', { code: booking.bookingCode ?? booking.id.slice(0, 8) })} className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"><ArrowUpRight size={17} aria-hidden="true" /></Link></div>
  </li>;
}
