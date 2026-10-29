import { useEffect, useState } from 'react';
import { accountService } from '../../../services/account.service';
import { bookingService } from '../../../services/booking.service';
import { accessToken } from '../../../services/api';
import type { Booking } from '../../../types/domain';
import { errorMessage } from '../../../utils/errors';
export type BookingAction = 'review' | 'dispute' | 'resume';
export function useBookingAction(
  booking: Booking | null,
  action: BookingAction,
  onChanged: () => void,
) {
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    setError('');
    setDone(false);
    setMessage('');
    setRating(5);
  }, [booking?.id, action]);
  async function submit() {
    if (!booking || saving) return;
    setSaving(true);
    setError('');
    try {
      if (action === 'review')
        await accountService.review({
          reservationId: booking.id,
          rating,
          comment: message.trim() || undefined,
        });
      else if (action === 'dispute')
        await accountService.dispute({ reservationId: booking.id, playerMessage: message.trim() });
      else {
        const result = await bookingService.confirmFakePayment(booking.id, accessToken());
        if (result.booking.status !== 'confirmed')
          throw new Error('Payment remains pending. Retry from this booking.');
      }
      setDone(true);
      onChanged();
    } catch (error) {
      setError(errorMessage(error, 'Could not save this action.'));
    } finally {
      setSaving(false);
    }
  }
  return { rating, setRating, message, setMessage, saving, error, done, submit };
}
