import { StatusBadge } from '../../../../components/ui/StatusBadge';
import { MapPin, AlertCircle, Star } from 'lucide-react';
import type { BookingsContentProps } from '../types';

export function BookingList({
  filtered,
  locale,
  openCancelModal,
  query,
  setDisputeModalBooking,
  setReviewModalBooking,
  translate,
}: Pick<
  BookingsContentProps,
  | 'filtered'
  | 'locale'
  | 'openCancelModal'
  | 'query'
  | 'setDisputeModalBooking'
  | 'setReviewModalBooking'
  | 'translate'
>) {
  return (
    <>
      {query.isSuccess && filtered.length > 0 && (
        <div className="space-y-4">
          {filtered.map((b) => (
            <div
              key={b.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg backdrop-blur-md hover:border-lime-400/30 transition-all flex flex-col gap-4 dark:border-white/10 dark:bg-[#13221f]/80"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{b.sport === 'padel' ? '🎾' : '⚽'}</span>
                    <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">
                      {b.venueName ?? translate('Mal3bna Venue')}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1 dark:text-slate-400">
                    <span className="text-emerald-700 font-semibold dark:text-lime-300">
                      {b.courtName}
                    </span>
                    {b.venueAddress && (
                      <>
                        <span>•</span>
                        <MapPin size={12} className="text-slate-500" />
                        <span>{b.venueAddress}</span>
                      </>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-black/50 border border-slate-200 text-emerald-700 font-mono text-xs font-bold dark:border-white/10 dark:text-lime-400">
                    #{b.bookingCode}
                  </span>
                  {
                    <StatusBadge
                      status={b.status}
                      label={b.status === 'no_show' ? translate('No-Show Strike') : undefined}
                    />
                  }
                </div>
              </div>

              {/* Match Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs dark:bg-[#0b1715]/70 dark:border-white/5">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider mb-0.5">
                    {translate('KICKOFF')}
                  </span>
                  <strong className="text-slate-700 dark:text-slate-200">
                    {new Date(b.startsAt).toLocaleString(locale, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                      timeZone: 'Africa/Cairo',
                    })}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider mb-0.5">
                    {translate('TOTAL PRICE')}
                  </span>
                  <strong className="text-slate-700 dark:text-slate-200">
                    {((b.totalPiastres ?? 0) / 100).toFixed(0)} {translate('EGP')}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider mb-0.5">
                    {translate('PAID ONLINE')}
                  </span>
                  <span className="text-emerald-700 font-bold dark:text-lime-400">
                    {((b.paidPiastres ?? b.depositPiastres ?? 0) / 100).toFixed(0)}{' '}
                    {translate('EGP')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider mb-0.5">
                    {translate('VENUE DUE')}
                  </span>
                  {(b.dueAtVenuePiastres ?? 0) > 0 && b.status !== 'cancelled' ? (
                    <span className="text-amber-800 font-bold dark:text-amber-400">
                      {((b.dueAtVenuePiastres ?? 0) / 100).toFixed(0)} {translate('EGP')}
                    </span>
                  ) : (
                    <span className="text-slate-500 font-medium dark:text-slate-400">
                      {translate('0 EGP (Settled)')}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 justify-end items-center pt-1 border-t border-slate-200 dark:border-white/5">
                {['confirmed', 'held'].includes(b.status) && (
                  <button
                    type="button"
                    className="button px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-500/15 hover:bg-rose-500/25 text-rose-700 border border-rose-500/30 transition-all cursor-pointer dark:text-rose-300"
                    onClick={() => void openCancelModal(b)}
                  >
                    {translate('Cancel Booking')}
                  </button>
                )}

                {b.status === 'completed' && !b.review && (
                  <button
                    type="button"
                    className="button px-3.5 py-1.5 rounded-xl text-xs font-bold bg-lime-400 hover:bg-lime-300 text-slate-950 shadow-sm transition-all cursor-pointer inline-flex items-center gap-1.5"
                    onClick={() => setReviewModalBooking(b)}
                  >
                    <Star size={13} className="fill-slate-950" />
                    <span>{translate('Leave a Review')}</span>
                  </button>
                )}

                {b.status === 'completed' && b.review && (
                  <span className="text-xs text-amber-800 font-bold flex items-center gap-1 dark:text-amber-400">
                    {'★'.repeat(b.review.rating)} {translate('You reviewed this match')}
                  </span>
                )}

                {b.status === 'no_show_pending' && !b.dispute && (
                  <button
                    type="button"
                    className="button px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all cursor-pointer inline-flex items-center gap-1.5"
                    onClick={() => setDisputeModalBooking(b)}
                  >
                    <AlertCircle size={13} />
                    <span>{translate('Dispute No-Show (48h)')}</span>
                  </button>
                )}

                {b.status === 'no_show_pending' && b.dispute && (
                  <span className="text-xs text-sky-700 font-medium flex items-center gap-1 dark:text-sky-400">
                    {translate('⏳ Dispute under review by admin')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
