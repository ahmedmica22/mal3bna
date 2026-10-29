import { Link } from 'react-router-dom';
import { StatePanel } from '../../../../components/feedback/StatePanel';
import { ShimmerBookingCard } from '../../../../components/feedback/Shimmer';
import { Plus, ArrowRight } from 'lucide-react';
import type { BookingsContentProps } from '../types';
import { BookingList } from '../components/BookingList';
import { CancelBookingDialog } from '../components/CancelBookingDialog';
import { ReviewBookingDialog } from '../components/ReviewBookingDialog';
import { DisputeBookingDialog } from '../components/DisputeBookingDialog';

export function BookingsContent({
  cancelError,
  cancelLoading,
  cancelModalBooking,
  cancelPreview,
  confirmCancel,
  disputeLoading,
  disputeMessage,
  disputeModalBooking,
  filtered,
  locale,
  openCancelModal,
  query,
  reviewComment,
  reviewLoading,
  reviewModalBooking,
  reviewRating,
  setCancelModalBooking,
  setCancelPreview,
  setDisputeMessage,
  setDisputeModalBooking,
  setReviewComment,
  setReviewModalBooking,
  setReviewRating,
  setTab,
  submitDispute,
  submitReview,
  tab,
  translate,
}: BookingsContentProps) {
  return (
    <main className="page w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <p className="eyebrow text-xs font-black text-emerald-700 uppercase tracking-wider mb-1 dark:text-lime-400">
            {translate('MATCH SCHEDULE')}
          </p>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight dark:text-slate-100">
            {translate('My Bookings')}
          </h1>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            to="/"
            className="button inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-extrabold bg-lime-400 hover:bg-lime-300 text-slate-950 transition-all shadow-md shadow-lime-400/20"
          >
            <Plus size={16} />
            <span>{translate('Book New Match')}</span>
          </Link>
        </div>
      </div>

      {/* Modern Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 border-b border-slate-200 dark:border-white/10">
        {(['all', 'upcoming', 'completed', 'cancelled'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer capitalize whitespace-nowrap ${
              tab === t
                ? 'bg-lime-400 text-slate-950 shadow-md shadow-lime-400/20'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Loading Skeleton */}
      {query.isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <ShimmerBookingCard key={i} />
          ))}
        </div>
      )}

      {/* Error State */}
      {query.isError && (
        <StatePanel
          title={translate('Could not load bookings')}
          action={
            <button
              className="button px-4 py-2 rounded-xl text-xs font-bold bg-lime-400 text-slate-950"
              onClick={() => void query.refetch()}
            >
              {translate('Try again')}
            </button>
          }
        >
          {translate('Check your network connection and try again.')}
        </StatePanel>
      )}

      {/* Empty State */}
      {query.isSuccess && filtered.length === 0 && (
        <StatePanel title={translate('No bookings found in this view.')}>
          {translate('Ready for a match?')}{' '}
          <Link
            to="/"
            className="text-emerald-700 font-bold hover:underline inline-flex items-center gap-1 dark:text-lime-400"
          >
            <span>{translate('Explore nearby courts')}</span>
            <ArrowRight size={14} />
          </Link>
        </StatePanel>
      )}

      {/* Bookings List */}
      {
        <BookingList
          {...{
            filtered,
            locale,
            openCancelModal,
            query,
            setDisputeModalBooking,
            setReviewModalBooking,
            translate,
          }}
        />
      }

      {/* Cancel Modal */}
      {
        <CancelBookingDialog
          {...{
            cancelError,
            cancelLoading,
            cancelModalBooking,
            cancelPreview,
            confirmCancel,
            setCancelModalBooking,
            setCancelPreview,
            translate,
          }}
        />
      }

      {/* Review Modal */}
      {
        <ReviewBookingDialog
          {...{
            reviewComment,
            reviewLoading,
            reviewModalBooking,
            reviewRating,
            setReviewComment,
            setReviewModalBooking,
            setReviewRating,
            submitReview,
            translate,
          }}
        />
      }

      {/* Dispute Modal */}
      {
        <DisputeBookingDialog
          {...{
            disputeLoading,
            disputeMessage,
            disputeModalBooking,
            setDisputeMessage,
            setDisputeModalBooking,
            submitDispute,
            translate,
          }}
        />
      }
    </main>
  );
}
