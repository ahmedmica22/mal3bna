import { useLanguage } from '../../../../store/LanguageStore';
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { bookingApi, venueApi } from '../../../../services/api';
import { useAuth } from '../../../../store/AuthStore';
import { useToast } from '../../../../components/feedback/ToastContext';

export function useCheckoutPage() {
  const { translate, locale } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const venueId = params.get('venueId') ?? '';
  const courtId = params.get('courtId') ?? params.get('court') ?? '';
  const startsAt = params.get('startsAt') ?? '';
  const hours = Number(params.get('hours') ?? '1');
  const venueName = params.get('venueName') ?? 'Cairo Venue';
  const courtName = params.get('courtName') ?? 'Selected Court';

  const [paymentOption, setPaymentOption] = useState<'deposit' | 'full'>('deposit');
  const [createdBooking, setCreatedBooking] = useState<Awaited<
    ReturnType<typeof bookingApi.create>
  > | null>(null);
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const [bookingError, setBookingError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 10-minute hold countdown timer
  const [secondsRemaining, setSecondsRemaining] = useState(600);

  useEffect(() => {
    if (!createdBooking?.holdExpiresAt) return;
    const update = () =>
      setSecondsRemaining(
        Math.max(0, Math.ceil((Date.parse(createdBooking.holdExpiresAt!) - Date.now()) / 1000)),
      );
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [createdBooking]);
  const bookingStatus = useQuery({
    queryKey: ['checkout-status', createdBooking?.id],
    queryFn: () => bookingApi.get(createdBooking!.id),
    enabled: Boolean(createdBooking),
    refetchInterval: createdBooking && secondsRemaining > 0 ? 2000 : false,
  });
  const isConfirmed = ['confirmed', 'arrived', 'completed'].includes(
    bookingStatus.data?.status ?? createdBooking?.status ?? '',
  );

  const timerText = `${Math.floor(secondsRemaining / 60)
    .toString()
    .padStart(2, '0')}:${(secondsRemaining % 60).toString().padStart(2, '0')}`;

  const isWithin24Hours = startsAt
    ? new Date(startsAt).getTime() - Date.now() < 24 * 3600 * 1000
    : false;

  // Quote query for verified prices
  const quote = useQuery({
    queryKey: ['quote', courtId, startsAt, hours],
    queryFn: () =>
      venueApi.quote(courtId, `?startsAt=${encodeURIComponent(startsAt)}&hours=${hours}`),
    enabled: Boolean(courtId && startsAt && hours),
  });

  const totalPiastres = quote.data?.totalPiastres ?? 0;
  const depositPiastres = quote.data?.depositPiastres ?? 0;
  const dueNowPiastres = paymentOption === 'full' ? totalPiastres : depositPiastres;
  const dueAtVenuePiastres = paymentOption === 'full' ? 0 : (quote.data?.dueAtVenuePiastres ?? 0);

  async function reserveBooking() {
    if (isSubmitting) return;

    if (!user) {
      toast.warning(
        translate('Please sign in with your player account to complete your booking.'),
        translate('Sign In Required'),
      );
      navigate(`/auth/login?redirect=${encodeURIComponent(location.pathname + location.search)}`);
      return;
    }

    if (user.role !== 'player') {
      const msg = 'Only player accounts can book pitches. Please log out and sign in as a player.';
      setBookingError(msg);
      toast.warning(msg, translate('Player Account Required'));
      return;
    }

    if (!venueId || !courtId || !startsAt) {
      toast.error(translate('Missing court or time slot selection.'), translate('Booking Error'));
      return;
    }

    setIsSubmitting(true);
    setBookingError('');
    try {
      if (!quote.data) throw new Error('Price unavailable. Please return to the venue and retry.');

      const booking = await bookingApi.create(
        {
          courtId,
          venueId,
          startsAt,
          hours,
          totalPiastres,
          depositPiastres,
          paymentOption,
        },
        idempotencyKey,
      );

      // Creating a hold opens the card step. Payment is submitted only by that form.
      setCreatedBooking(booking);
      queryClient.setQueryData(['checkout-status', booking.id], booking);
      void queryClient.invalidateQueries({ queryKey: ['availability'] });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not complete booking.';
      setBookingError(msg);
      toast.error(msg, translate('Booking Failed'));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function simulatePayment(outcome: 'success' | 'failure' | 'pending') {
    if (!createdBooking) return;
    setBookingError('');
    try {
      const result = await bookingApi.fakePayment(
        createdBooking.id,
        outcome,
        `${createdBooking.id}:${outcome}`,
      );
      const next = { ...result.booking, isTestPayment: true };
      setCreatedBooking(next);
      queryClient.setQueryData(['checkout-status', createdBooking.id], next);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['player-bookings'] }),
        queryClient.invalidateQueries({ queryKey: ['bookings'] }),
        queryClient.invalidateQueries({ queryKey: ['availability'] }),
      ]);
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : translate('Payment failed'));
      throw error;
    }
  }

  if (
    createdBooking &&
    !isConfirmed &&
    (secondsRemaining <= 0 || bookingStatus.data?.status === 'expired')
  ) {
    return { view: 'Expired', props: { translate, venueId } } as const;
  }

  if (createdBooking && !isConfirmed) {
    return {
      view: 'Payment',
      props: {
        bookingError,
        createdBooking,
        courtName,
        venueName,
        locale,
        paymentOption,
        simulatePayment,
        timerText,
        translate,
      },
    } as const;
  }
  if (createdBooking && isConfirmed) {
    return {
      view: 'Confirmation',
      props: { courtName, createdBooking, dueAtVenuePiastres, hours, translate, venueName },
    } as const;
  }

  return {
    view: 'Content',
    props: {
      bookingError,
      courtId,
      courtName,
      depositPiastres,
      dueAtVenuePiastres,
      dueNowPiastres,
      hours,
      isSubmitting,
      isWithin24Hours,
      locale,
      paymentOption,
      quote,
      reserveBooking,
      setPaymentOption,
      startsAt,
      totalPiastres,
      translate,
      user,
      venueId,
      venueName,
    },
  } as const;
}
