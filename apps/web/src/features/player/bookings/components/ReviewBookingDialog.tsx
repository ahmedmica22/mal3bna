import { Dialog } from '../../../../components/ui/Dialog';

import type { BookingsContentProps } from '../types';

export function ReviewBookingDialog({
  reviewComment,
  reviewLoading,
  reviewModalBooking,
  reviewRating,
  setReviewComment,
  setReviewModalBooking,
  setReviewRating,
  submitReview,
  translate,
}: Pick<
  BookingsContentProps,
  | 'reviewComment'
  | 'reviewLoading'
  | 'reviewModalBooking'
  | 'reviewRating'
  | 'setReviewComment'
  | 'setReviewModalBooking'
  | 'setReviewRating'
  | 'submitReview'
  | 'translate'
>) {
  return (
    <>
      {reviewModalBooking && (
        <Dialog label={translate('Review your Match')} onClose={() => setReviewModalBooking(null)}>
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 dark:bg-[#13221f] dark:border-white/15">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
                {translate('Review your Match')}
              </h2>
              <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">
                {translate('How was the pitch at')}{' '}
                <strong className="text-emerald-700 dark:text-lime-400">
                  {reviewModalBooking.venueName}
                </strong>
                ?
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2 dark:text-slate-300">
                {translate('Rating')}
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="text-2xl transition-all cursor-pointer hover:scale-110"
                    style={{ color: star <= reviewRating ? '#facc15' : 'var(--border-strong)' }}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 dark:text-slate-300">
                {translate('Comments (turf condition, lighting, amenities)')}
              </label>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder={translate('The pitch was in great condition...')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 dark:bg-[#0b1715] dark:border-white/15 dark:text-slate-100"
              />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                className="button px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-100 text-slate-700 transition-all cursor-pointer dark:bg-white/10 dark:hover:bg-white/15 dark:text-slate-200"
                onClick={() => setReviewModalBooking(null)}
              >
                {translate('Cancel')}
              </button>
              <button
                type="button"
                className="button px-4 py-2 rounded-xl text-xs font-extrabold bg-lime-400 hover:bg-lime-300 text-slate-950 shadow-lg shadow-lime-400/25 transition-all cursor-pointer disabled:opacity-50"
                disabled={reviewLoading}
                onClick={() => void submitReview()}
              >
                {reviewLoading ? translate('Submitting…') : translate('Submit Review')}
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
}
