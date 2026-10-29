import { useLanguage } from '../../../../store/LanguageStore';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ownerApi } from '../../../../services/api';
import { useToast } from '../../../../components/feedback/ToastContext';
import { useManualBookingState } from './useManualBookingState';
import { useBlockCourtState } from './useBlockCourtState';

export function useOwnerBookingsPage() {
  const { translate, locale } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const venueQuery = useQuery({
    queryKey: ['owner-venue'],
    queryFn: () => ownerApi.mine(),
  });

  const bookingsQuery = useQuery({
    queryKey: ['owner-bookings'],
    queryFn: () => ownerApi.bookings(),
    refetchInterval: 4000,
  });

  const courts = venueQuery.data?.courts ?? [];
  const bookings = bookingsQuery.data ?? [];
  const [quickCode, setQuickCode] = useState('');
  const handledParamRef = useRef<string | null>(null);

  const manualState = useManualBookingState({ courts, queryClient, toast, translate });
  const blockState = useBlockCourtState({ courts, queryClient, toast, translate });

  // Auto-check in if redirected via QR code URL ?checkin=CODE or ?code=CODE
  const checkinParam = searchParams.get('checkin') || searchParams.get('code');
  useEffect(() => {
    if (checkinParam && handledParamRef.current !== checkinParam) {
      handledParamRef.current = checkinParam;
      void handleQuickCheckIn(checkinParam);
      // clean param without refreshing
      searchParams.delete('checkin');
      searchParams.delete('code');
      setSearchParams(searchParams, { replace: true });
    }
  }, [checkinParam, bookings]);

  // Quick QR / Code Check-in
  async function handleQuickCheckIn(rawInput?: string) {
    const text = (rawInput ?? quickCode).trim();
    if (!text) return;
    let target = text.replace(/^#/, '');
    try {
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed === 'object') {
        target = parsed.code || parsed.bookingCode || parsed.id || target;
      }
    } catch {
      // not JSON
    }
    const cleanTarget = target.toLowerCase();
    const match = bookings.find(
      (b) =>
        b.bookingCode?.toLowerCase() === cleanTarget ||
        b.id.toLowerCase() === cleanTarget,
    );
    const identifier = match?.id || target;
    await handleArrive(identifier);
    setQuickCode('');
  }

  // Match-day actions
  async function handleArrive(id: string) {
    setActionLoadingId(id);
    try {
      await ownerApi.arrive(id);
      await queryClient.invalidateQueries({ queryKey: ['owner-bookings'] });
      toast.success(
        translate('Player arrived and checked in for kickoff.'),
        translate('Player Checked In'),
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Action failed',
        translate('Check-In Failed'),
      );
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleCollect(id: string) {
    setActionLoadingId(id);
    try {
      await ownerApi.collect(id);
      await queryClient.invalidateQueries({ queryKey: ['owner-bookings'] });
      toast.success(translate('Cash payment collected at venue.'), translate('Payment Collected'));
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Action failed',
        translate('Collection Failed'),
      );
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleComplete(id: string) {
    setActionLoadingId(id);
    try {
      await ownerApi.complete(id);
      await queryClient.invalidateQueries({ queryKey: ['owner-bookings'] });
      toast.success(translate('Match completed and verified.'), translate('Match Completed'));
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Action failed',
        translate('Completion Failed'),
      );
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleNoShow(id: string) {
    setActionLoadingId(id);
    try {
      await ownerApi.reportNoShow(id);
      await queryClient.invalidateQueries({ queryKey: ['owner-bookings'] });
      await queryClient.invalidateQueries({ queryKey: ['owner-stats'] });
      toast.warning(
        translate('No-show reported. Player has 48h dispute deadline.'),
        translate('No-Show Reported'),
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Action failed', translate('Report Failed'));
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleCancel(id: string) {
    setActionLoadingId(id);
    try {
      await ownerApi.cancelBooking(id, crypto.randomUUID());
      await queryClient.invalidateQueries({ queryKey: ['owner-bookings'] });
      await queryClient.invalidateQueries({ queryKey: ['owner-stats'] });
      toast.info(
        translate('Booking cancelled. 100% full refund issued.'),
        translate('Booking Cancelled'),
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Cancellation failed',
        translate('Cancel Failed'),
      );
    } finally {
      setActionLoadingId(null);
    }
  }

  if (bookingsQuery.isLoading) return { view: 'Loading', props: { translate } } as const;

  return {
    view: 'Content',
    props: {
      actionLoadingId,
      ...blockState,
      ...manualState,
      bookings,
      courts,
      quickCode,
      setQuickCode,
      handleQuickCheckIn,
      handleArrive,
      handleCancel,
      handleCollect,
      handleComplete,
      handleNoShow,
      locale,
      translate,
    },
  } as const;
}
