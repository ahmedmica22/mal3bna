import { useState, useRef, useEffect } from 'react';
import { Venue, Court, Booking, AvailabilitySlot } from '../../../types/domain';
import type { SlotRun } from '../../../utils/slots';
import { bookingService } from '../../../services/booking.service';
import { errorMessage } from '../../../utils/errors';
import type { ShowToastFn } from '../../../hooks/useToast';

interface CheckoutDetails {
  venue: Venue | null;
  court: Court | null;
  startsAt: string;
  hours: number;
  totalPiastres: number;
  depositPiastres: number;
  dueAtVenuePiastres: number;
  runs?: SlotRun[];
  selectedSlots?: AvailabilitySlot[];
}

interface UsePlayerBookingWorkflowOptions {
  token: string | null;
  showToast: ShowToastFn;
  loadPlayerBookings: () => Promise<void>;
}

export function usePlayerBookingWorkflow({
  token,
  showToast,
  loadPlayerBookings,
}: UsePlayerBookingWorkflowOptions) {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [checkoutDetails, setCheckoutDetails] = useState<CheckoutDetails | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentOption, setPaymentOption] = useState<'deposit' | 'full'>('deposit');
  const [holdSeconds, setHoldSeconds] = useState(600);
  const [confirmedBookingCode, setConfirmedBookingCode] = useState<string | null>(null);
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<Booking | null>(null);
  const [paymentError, setPaymentError] = useState('');
  const bookingKey = useRef('');

  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);
  const [cancelPreview, setCancelPreview] = useState<Awaited<
    ReturnType<typeof bookingService.cancelPreview>
  > | null>(null);
  const [cancelError, setCancelError] = useState(false);

  useEffect(() => {
    if (!token) {
      setIsCheckoutOpen(false);
      setCheckoutDetails(null);
      setCancelModalBooking(null);
    }
  }, [token]);

  useEffect(() => {
    setPendingBooking(null);
    setPaymentError('');
    bookingKey.current = 'mobile-' + Date.now() + '-' + Math.random().toString(36).slice(2);
  }, [checkoutDetails]);

  useEffect(() => {
    if (!pendingBooking?.holdExpiresAt) return;
    const update = () =>
      setHoldSeconds(
        Math.max(0, Math.ceil((Date.parse(pendingBooking.holdExpiresAt!) - Date.now()) / 1000)),
      );
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [pendingBooking]);

  useEffect(() => {
    let active = true;
    setCancelPreview(null);
    setCancelError(false);
    if (cancelModalBooking) {
      bookingService
        .cancelPreview(cancelModalBooking.id, token)
        .then((preview) => {
          if (active) setCancelPreview(preview);
        })
        .catch(() => {
          if (active) setCancelError(true);
        });
    }
    return () => {
      active = false;
    };
  }, [cancelModalBooking, token]);

  async function handleCompleteBooking() {
    const details = checkoutDetails;
    if (!details?.court || !details.venue || !token || isBookingSubmitting) return;
    setIsBookingSubmitting(true);
    setPaymentError('');
    try {
      if (pendingBooking) {
        const verified =
          pendingBooking.status === 'confirmed'
            ? pendingBooking
            : (await bookingService.confirmFakePayment(pendingBooking.id, token)).booking;
        if (verified.status !== 'confirmed') {
          throw new Error('Payment is pending. Retry from this checkout.');
        }
        setConfirmedBookingCode(verified.bookingCode ?? pendingBooking.bookingCode ?? '');
        void loadPlayerBookings();
        return;
      }

      const runsToBook: SlotRun[] =
        details.runs && details.runs.length > 0
          ? details.runs
          : [
              {
                startsAt: details.startsAt,
                hours: details.hours,
                totalPiastres: details.totalPiastres,
                depositPiastres: details.depositPiastres,
                dueAtVenuePiastres: details.dueAtVenuePiastres,
                slots: [],
              },
            ];

      const confirmedCodes: string[] = [];
      for (let i = 0; i < runsToBook.length; i++) {
        const run = runsToBook[i];
        const runKey = `${bookingKey.current}-r${i}`;
        const created = await bookingService.createBooking(
          {
            courtId: details.court.id,
            venueId: details.venue.id,
            startsAt: run.startsAt,
            hours: run.hours,
            totalPiastres: run.totalPiastres,
            depositPiastres: run.depositPiastres,
            paymentOption,
          },
          token,
          runKey,
        );

        const verified =
          created.status === 'confirmed'
            ? created
            : (await bookingService.confirmFakePayment(created.id, token)).booking;

        if (verified.status !== 'confirmed') {
          throw new Error('Payment is pending. Retry from this checkout.');
        }

        const code = verified.bookingCode ?? created.bookingCode;
        if (code) confirmedCodes.push(code);
      }

      setConfirmedBookingCode(confirmedCodes.join(', '));
      void loadPlayerBookings();
    } catch (err) {
      setPaymentError(errorMessage(err, 'Could not confirm payment. Retry this checkout.'));
      showToast(
        'error',
        'Payment',
        errorMessage(err, 'Could not confirm payment. Retry this checkout.'),
      );
    } finally {
      setIsBookingSubmitting(false);
    }
  }

  async function handleConfirmCancel(b: Booking) {
    try {
      await bookingService.cancelBooking(b.id, token);
      await loadPlayerBookings();
      setCancelModalBooking(null);
      showToast('info', 'Cancelled', 'Booking cancelled. Check refund status in your bookings.');
    } catch (error) {
      showToast('error', 'Cancellation', errorMessage(error, 'Could not cancel booking.'));
    }
  }

  return {
    selectedVenue,
    setSelectedVenue,
    selectedCourt,
    setSelectedCourt,
    checkoutDetails,
    setCheckoutDetails,
    isCheckoutOpen,
    setIsCheckoutOpen,
    paymentOption,
    setPaymentOption,
    holdSeconds,
    setHoldSeconds,
    confirmedBookingCode,
    setConfirmedBookingCode,
    isBookingSubmitting,
    pendingBooking,
    paymentError,
    cancelModalBooking,
    setCancelModalBooking,
    cancelPreview,
    cancelError,
    handleCompleteBooking,
    handleConfirmCancel,
  };
}
