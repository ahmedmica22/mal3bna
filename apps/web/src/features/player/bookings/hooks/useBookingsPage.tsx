import { useLanguage } from '../../../../store/LanguageStore';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { bookingApi, reviewApi, trustApi } from '../../../../services/api';
import { useToast } from '../../../../components/feedback/ToastContext';
import type { Booking } from '../../../../types/domain';

export function useBookingsPage() {
  const { translate, locale } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');

  // Cancel Modal state
  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);
  const [cancelPreview, setCancelPreview] = useState<{
    refundPiastres: number;
    message: string;
    forfeitDeposit?: boolean;
  } | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState('');

  // Review Modal state
  const [reviewModalBooking, setReviewModalBooking] = useState<Booking | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  // Dispute Modal state
  const [disputeModalBooking, setDisputeModalBooking] = useState<Booking | null>(null);
  const [disputeMessage, setDisputeMessage] = useState('');
  const [disputeLoading, setDisputeLoading] = useState(false);

  const query = useQuery({
    queryKey: ['player-bookings'],
    queryFn: () => bookingApi.list(),
    refetchInterval: 3000,
    refetchOnWindowFocus: true,
  });

  const bookings = query.data ?? [];

  const filtered = [...bookings]
    .sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (aTime !== bTime) return bTime - aTime;
      return new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime();
    })
    .filter((b) => {
      if (tab === 'upcoming') return ['confirmed', 'held'].includes(b.status);
      if (tab === 'completed') return ['completed', 'arrived'].includes(b.status);
      if (tab === 'cancelled')
        return ['cancelled', 'expired', 'no_show', 'no_show_pending'].includes(b.status);
      return true;
    });

  async function openCancelModal(booking: Booking) {
    setCancelModalBooking(booking);
    setCancelLoading(true);
    setCancelError('');
    try {
      const preview = await bookingApi.cancelPreview(booking.id);
      setCancelPreview(preview);
    } catch (err) {
      setCancelError(err instanceof Error ? err.message : 'Could not fetch cancellation preview');
    } finally {
      setCancelLoading(false);
    }
  }

  async function confirmCancel() {
    if (!cancelModalBooking) return;
    setCancelLoading(true);
    setCancelError('');
    try {
      await bookingApi.cancel(cancelModalBooking.id, crypto.randomUUID());
      await queryClient.invalidateQueries({ queryKey: ['player-bookings'] });
      setCancelModalBooking(null);
      setCancelPreview(null);
      toast.success(
        translate('Your reservation was cancelled and refund ledger recorded.'),
        translate('Booking Cancelled'),
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Cancellation failed';
      setCancelError(msg);
      toast.error(msg, translate('Cancellation Error'));
    } finally {
      setCancelLoading(false);
    }
  }

  async function submitReview() {
    if (!reviewModalBooking) return;
    setReviewLoading(true);
    try {
      await reviewApi.create(reviewModalBooking.id, reviewRating, reviewComment);
      await queryClient.invalidateQueries({ queryKey: ['player-bookings'] });
      setReviewModalBooking(null);
      setReviewComment('');
      toast.success(
        translate('Thank you! Your verified match review has been posted.'),
        translate('Review Published'),
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Review submission failed',
        translate('Review Error'),
      );
    } finally {
      setReviewLoading(false);
    }
  }

  async function submitDispute() {
    if (!disputeModalBooking) return;
    setDisputeLoading(true);
    try {
      await trustApi.createDispute(disputeModalBooking.id, disputeMessage);
      await queryClient.invalidateQueries({ queryKey: ['player-bookings'] });
      setDisputeModalBooking(null);
      setDisputeMessage('');
      toast.info(
        translate('Your dispute was recorded. Admin will review within 48 hours.'),
        translate('Dispute Submitted'),
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Dispute submission failed',
        translate('Dispute Error'),
      );
    } finally {
      setDisputeLoading(false);
    }
  }

  return {
    view: 'Content',
    props: {
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
    },
  } as const;
}
