import { CheckCircle2, Clock, Trophy } from 'lucide-react';

import type { AdminBookingsContentProps } from '../types';
import type { AdminBooking } from '../../../../types/domain';
export function AdminBookingRow({
  booking,
  cairoDateTime,
  statusTone,
  translate,
}: Pick<AdminBookingsContentProps, 'cairoDateTime' | 'statusTone' | 'translate'> & {
  booking: AdminBooking;
}) {
  const tone = statusTone[booking.status] ?? {
    badge: 'bg-slate-500/15 text-slate-400 border border-slate-500/30',
    dot: 'bg-slate-500',
  };
  return (
    <tr key={booking.id} className="text-slate-200 hover:bg-white/[0.02] transition-colors">
      {/* Booking Code & Kind Badge */}
      <td className="px-4 py-3.5 truncate">
        <div className="font-mono text-xs font-black text-lime-400 tracking-wider truncate">
          {booking.bookingCode}
        </div>
        <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/5 text-slate-400 border border-white/5">
          {translate(booking.kind)}
        </span>
      </td>

      {/* Venue & Court */}
      <td className="px-4 py-3.5 min-w-0">
        <strong className="block text-sm font-bold text-white mb-0.5 truncate">
          {booking.venue.name}
        </strong>
        <span className="text-xs text-slate-400 flex items-center gap-1.5 truncate">
          <Trophy size={11} className="text-lime-400 shrink-0" />
          <span className="truncate">
            {booking.court.name} · {translate(booking.court.sport)}
            {booking.court.size ? ` ${booking.court.size}` : ''}
          </span>
        </span>
      </td>

      {/* Player / Customer */}
      <td className="px-4 py-3.5 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 text-slate-300 flex items-center justify-center text-xs font-black shrink-0">
            {(booking.player?.name ?? booking.customerName ?? 'P').slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 truncate">
            <span className="block text-xs font-bold text-white truncate">
              {booking.player?.name ?? booking.customerName ?? translate('Court block')}
            </span>
            {!booking.player && booking.kind === 'manual' && (
              <span className="text-[10px] text-amber-400 font-semibold block truncate">
                {translate('Walk-in guest')}
              </span>
            )}
          </div>
        </div>
      </td>

      {/* Kickoff Cairo Time */}
      <td className="px-4 py-3.5 text-xs text-slate-300 font-semibold">
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <Clock size={12} className="text-slate-400 shrink-0" />
          <span>{cairoDateTime.format(new Date(booking.startsAt))}</span>
        </div>
      </td>

      {/* Status Pill Badge */}
      <td className="px-4 py-3.5 whitespace-nowrap">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${tone.badge}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${tone.dot}`} />
          <span>{translate(booking.status)}</span>
        </span>
      </td>

      {/* Financials / Paid & Remaining */}
      <td className="px-4 py-3.5 whitespace-nowrap text-end font-semibold">
        <div className="text-sm font-black text-white">
          {(booking.paidPiastres / 100).toFixed(2)} / {(booking.totalPiastres / 100).toFixed(2)}{' '}
          <span className="text-xs text-slate-400 font-normal">{translate('EGP')}</span>
        </div>
        {booking.venueCollectedAt && (
          <span className="mt-1 text-xs font-bold text-emerald-400 flex items-center justify-end gap-1">
            <CheckCircle2 size={11} />
            <span>{translate('Venue cash collected')}</span>
          </span>
        )}
        {!booking.venueCollectedAt && booking.dueAtVenuePiastres > 0 && (
          <span className="mt-1 block text-xs font-semibold text-amber-400">
            ⏳ {translate('Due at venue')}: {(booking.dueAtVenuePiastres / 100).toFixed(0)}{' '}
            {translate('EGP')}
          </span>
        )}
        {booking.isTestPayment && (
          <span className="mt-1 block text-[11px] font-medium text-amber-300">
            {translate('Test payment')}
          </span>
        )}
      </td>
    </tr>
  );
}
