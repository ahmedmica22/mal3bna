import { Dialog } from '../../../../components/ui/Dialog';

import type { BookingsContentProps } from '../types';

export function DisputeBookingDialog({
  disputeLoading,
  disputeMessage,
  disputeModalBooking,
  setDisputeMessage,
  setDisputeModalBooking,
  submitDispute,
  translate,
}: Pick<
  BookingsContentProps,
  | 'disputeLoading'
  | 'disputeMessage'
  | 'disputeModalBooking'
  | 'setDisputeMessage'
  | 'setDisputeModalBooking'
  | 'submitDispute'
  | 'translate'
>) {
  return (
    <>
      {disputeModalBooking && (
        <Dialog label={translate('Dispute No-Show')} onClose={() => setDisputeModalBooking(null)}>
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 dark:bg-[#13221f] dark:border-white/15">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
                {translate('Dispute No-Show')}
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed dark:text-slate-400">
                {translate('You have 48 hours to submit your explanation for')}{' '}
                <strong className="text-amber-800 dark:text-amber-400">
                  #{disputeModalBooking.bookingCode}
                </strong>
                {translate('. Super admin will review and either uphold or overturn the strike.')}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 dark:text-slate-300">
                {translate('Your Explanation')}
              </label>
              <textarea
                rows={4}
                value={disputeMessage}
                onChange={(e) => setDisputeMessage(e.target.value)}
                placeholder={translate('We arrived on time but the pitch was locked...')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 dark:bg-[#0b1715] dark:border-white/15 dark:text-slate-100"
              />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                className="button px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-100 text-slate-700 transition-all cursor-pointer dark:bg-white/10 dark:hover:bg-white/15 dark:text-slate-200"
                onClick={() => setDisputeModalBooking(null)}
              >
                {translate('Cancel')}
              </button>
              <button
                type="button"
                className="button px-4 py-2 rounded-xl text-xs font-extrabold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/25 transition-all cursor-pointer disabled:opacity-50"
                disabled={disputeLoading || !disputeMessage.trim()}
                onClick={() => void submitDispute()}
              >
                {disputeLoading ? translate('Submitting…') : translate('Submit Dispute to Admin')}
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
}
