import { User } from 'lucide-react';
import type { OwnerBookingsContentProps } from '../types';

import type { OwnerBooking } from '../../../../types/domain';
export function OwnerBookingRow({
  booking,
  actionLoadingId,
  handleArrive,
  handleCancel,
  handleCollect,
  handleComplete,
  handleNoShow,
  locale,
  translate,
}: Pick<
  OwnerBookingsContentProps,
  | 'actionLoadingId'
  | 'handleArrive'
  | 'handleCancel'
  | 'handleCollect'
  | 'handleComplete'
  | 'handleNoShow'
  | 'locale'
  | 'translate'
> & { booking: OwnerBooking }) {
  const dueAtVenue = (booking.dueAtVenuePiastres ?? booking.amountDuePiastres ?? 0) / 100;
  const isLoading = actionLoadingId === booking.id;

  const getStatusBadge = () => {
    if (booking.status === 'confirmed')
      return 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-400';
    if (booking.status === 'arrived')
      return 'bg-sky-500/15 border-sky-500/30 text-sky-700 dark:text-sky-400';
    if (booking.status === 'completed')
      return 'bg-slate-700/50 border-slate-600 text-slate-600 dark:text-slate-300';
    if (booking.status === 'no_show_pending')
      return 'bg-amber-500/15 border-amber-500/30 text-amber-800 dark:text-amber-400';
    return 'bg-rose-500/15 border-rose-500/30 text-rose-700 dark:text-rose-400';
  };

  return (
    <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors">
      <td className="p-4">
        <span className="font-mono font-bold text-emerald-700 text-sm block dark:text-lime-400">
          {booking.bookingCode ?? booking.id.slice(0, 8).toUpperCase()}
        </span>
      </td>

      <td className="p-4">
        <strong className="text-slate-900 block text-sm dark:text-slate-100">
          {booking.courtName ?? translate('Court')}
        </strong>
        {booking.customerName && (
          <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 dark:text-slate-400">
            <User size={11} />
            {booking.customerName} {booking.customerPhone ? `(${booking.customerPhone})` : ''}
          </span>
        )}
      </td>

      <td className="p-4 text-slate-600 font-medium dark:text-slate-300">
        {new Date(booking.startsAt).toLocaleTimeString(locale, {
          hour: 'numeric',
          minute: '2-digit',
          timeZone: 'Africa/Cairo',
        })}
        {' - '}
        {new Date(booking.endsAt).toLocaleTimeString(locale, {
          hour: 'numeric',
          minute: '2-digit',
          timeZone: 'Africa/Cairo',
        })}
      </td>

      <td className="p-4">
        <span
          className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold border capitalize ${getStatusBadge()}`}
        >
          {translate(booking.status)}
        </span>
      </td>

      <td className="p-4">
        <p className="mb-1 text-xs text-slate-600 dark:text-slate-300">
          {translate('PAID ONLINE')}: {((booking.paidPiastres ?? 0) / 100).toFixed(2)}{' '}
          {translate('EGP')}
        </p>
        {booking.isTestPayment && (
          <span className="mb-1 block text-xs font-bold text-amber-800 dark:text-amber-300">
            {translate('Test payment')}
          </span>
        )}
        {dueAtVenue > 0 ? (
          <strong className="text-amber-800 font-extrabold text-sm dark:text-amber-400">
            {dueAtVenue.toFixed(0)} {translate('EGP')}
          </strong>
        ) : (
          <span className="text-emerald-700 font-semibold text-[11px] dark:text-emerald-400">
            {translate('Fully Settled')}
          </span>
        )}
      </td>

      <td className="p-4 text-end">
        <div className="flex gap-1.5 justify-end flex-wrap items-center">
          {booking.status === 'confirmed' && (
            <>
              <button
                type="button"
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-lime-400 hover:bg-lime-300 text-slate-950 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                disabled={isLoading}
                onClick={() => void handleArrive(booking.id)}
              >
                {translate('✓ Arrived')}
              </button>
              {dueAtVenue > 0 && (
                <button
                  type="button"
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  disabled={isLoading}
                  onClick={() => void handleCollect(booking.id)}
                >
                  {translate('Collect Cash')}
                </button>
              )}
              <button
                type="button"
                className="px-2 py-1 rounded-lg text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-800 border border-amber-500/30 transition-all cursor-pointer disabled:opacity-50 dark:text-amber-300"
                disabled={isLoading}
                onClick={() => void handleNoShow(booking.id)}
              >
                {translate('No-Show')}
              </button>
              <button
                type="button"
                className="px-2 py-1 rounded-lg text-xs font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-700 border border-rose-500/30 transition-all cursor-pointer disabled:opacity-50 dark:text-rose-300"
                disabled={isLoading}
                onClick={() => void handleCancel(booking.id)}
              >
                {translate('Cancel')}
              </button>
            </>
          )}

          {booking.status === 'arrived' && (
            <>
              <button
                type="button"
                className="px-3 py-1 rounded-lg text-xs font-extrabold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                disabled={isLoading}
                onClick={() => void handleComplete(booking.id)}
              >
                {translate('✓ Complete Match')}
              </button>
              {dueAtVenue > 0 && (
                <button
                  type="button"
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  disabled={isLoading}
                  onClick={() => void handleCollect(booking.id)}
                >
                  {translate('Collect Cash')}
                </button>
              )}
            </>
          )}

          {booking.status === 'completed' && (
            <span className="text-slate-500 font-semibold">{translate('Finished')}</span>
          )}
        </div>
      </td>
    </tr>
  );
}
