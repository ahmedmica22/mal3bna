import { Dialog } from '../../../../components/ui/Dialog';
import { StatePanel } from '../../../../components/feedback/StatePanel';
import type { BookingsContentProps } from '../types';

export function CancelBookingDialog({
  cancelError,
  cancelLoading,
  cancelModalBooking,
  cancelPreview,
  confirmCancel,
  setCancelModalBooking,
  setCancelPreview,
  translate,
}: Pick<
  BookingsContentProps,
  | 'cancelError'
  | 'cancelLoading'
  | 'cancelModalBooking'
  | 'cancelPreview'
  | 'confirmCancel'
  | 'setCancelModalBooking'
  | 'setCancelPreview'
  | 'translate'
>) {
  return (
    <>
      {cancelModalBooking && (
        <Dialog
          label={translate('Cancel Reservation')}
          onClose={() => {
            setCancelModalBooking(null);
            setCancelPreview(null);
          }}
        >
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 dark:bg-[#13221f] dark:border-white/15">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
                {translate('Cancel Reservation')}
              </h2>
              <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">
                {translate('Booking:')}{' '}
                <strong className="text-emerald-700 dark:text-lime-400">
                  {cancelModalBooking.bookingCode}
                </strong>{' '}
                ({cancelModalBooking.venueName})
              </p>
            </div>

            {cancelLoading && !cancelPreview && (
              <StatePanel title={translate('Calculating refund preview…')} />
            )}

            {cancelPreview && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 dark:bg-[#0b1715] dark:border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {translate('Refund Amount:')}
                  </span>
                  <strong className="text-lg font-black text-emerald-700 dark:text-lime-400">
                    {(cancelPreview.refundPiastres / 100).toFixed(2)} {translate('EGP')}
                  </strong>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed dark:text-slate-400">
                  {cancelPreview.message}
                </p>
              </div>
            )}

            {cancelError && (
              <p className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-700 text-xs font-semibold dark:text-rose-300">
                {cancelError}
              </p>
            )}

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                className="button px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-100 text-slate-700 transition-all cursor-pointer dark:bg-white/10 dark:hover:bg-white/15 dark:text-slate-200"
                onClick={() => {
                  setCancelModalBooking(null);
                  setCancelPreview(null);
                }}
              >
                {translate('Keep Booking')}
              </button>
              <button
                type="button"
                className="button px-4 py-2 rounded-xl text-xs font-extrabold bg-rose-500 hover:bg-rose-400 text-white shadow-lg shadow-rose-500/25 transition-all cursor-pointer disabled:opacity-50"
                disabled={cancelLoading}
                onClick={() => void confirmCancel()}
              >
                {cancelLoading ? translate('Cancelling…') : translate('Confirm Cancellation')}
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
}
