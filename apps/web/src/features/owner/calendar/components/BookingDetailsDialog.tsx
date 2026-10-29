import { Dialog } from '../../../../components/ui/Dialog';
import { VENUE_TIME_ZONE } from '../../../../utils/venue-time';
import { X } from 'lucide-react';
import type { OwnerCalendarContentProps } from '../types';

export function BookingDetailsDialog({
  inspectedBooking,
  locale,
  setInspectedBooking,
  translate,
}: Pick<
  OwnerCalendarContentProps,
  'inspectedBooking' | 'locale' | 'setInspectedBooking' | 'translate'
>) {
  return (
    <>
      {inspectedBooking && (
        <Dialog label={translate('Reservation Details')} onClose={() => setInspectedBooking(null)}>
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 dark:bg-[#13221f] dark:border-white/15">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-white/10">
              <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">
                {translate('Reservation Details')}
              </h2>
              <button
                type="button"
                onClick={() => setInspectedBooking(null)}
                aria-label={translate('Close reservation details')}
                className="text-slate-500 hover:text-white p-1 rounded-lg hover:bg-slate-100 transition-colors dark:text-slate-400 dark:hover:bg-white/10"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-white/5">
                <span className="text-slate-500 dark:text-slate-400">
                  {translate('Booking Code')}
                </span>
                <strong className="text-emerald-700 font-mono text-sm dark:text-lime-400">
                  #{inspectedBooking.bookingCode}
                </strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-white/5">
                <span className="text-slate-500 dark:text-slate-400">{translate('Court')}</span>
                <strong className="text-slate-700 dark:text-slate-200">
                  {inspectedBooking.courtName ?? translate('Court')}
                </strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-white/5">
                <span className="text-slate-500 dark:text-slate-400">{translate('Time')}</span>
                <strong className="text-slate-700 dark:text-slate-200">
                  {new Date(inspectedBooking.startsAt).toLocaleTimeString(locale, {
                    hour: 'numeric',
                    minute: '2-digit',
                    timeZone: VENUE_TIME_ZONE,
                  })}{' '}
                  -{' '}
                  {new Date(inspectedBooking.endsAt).toLocaleTimeString(locale, {
                    hour: 'numeric',
                    minute: '2-digit',
                    timeZone: VENUE_TIME_ZONE,
                  })}
                </strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-white/5">
                <span className="text-slate-500 dark:text-slate-400">{translate('Status')}</span>
                <strong className="text-slate-700 capitalize dark:text-slate-200">
                  {translate(inspectedBooking.status)}
                </strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-white/5">
                <span className="text-slate-500 dark:text-slate-400">
                  {translate('Total Price')}
                </span>
                <strong className="text-slate-700 dark:text-slate-200">
                  {((inspectedBooking.totalPiastres ?? 0) / 100).toFixed(0)} {translate('EGP')}
                </strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 dark:text-slate-400">
                  {translate('Due at Venue')}
                </span>
                <strong className="text-amber-800 font-extrabold text-sm dark:text-amber-400">
                  {(
                    (inspectedBooking.dueAtVenuePiastres ??
                      inspectedBooking.amountDuePiastres ??
                      0) / 100
                  ).toFixed(0)}{' '}
                  {translate('EGP')}
                </strong>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                className="button w-full py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-100 text-slate-700 transition-all cursor-pointer dark:bg-white/10 dark:hover:bg-white/15 dark:text-slate-200"
                onClick={() => setInspectedBooking(null)}
              >
                {translate('Close')}
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
}
