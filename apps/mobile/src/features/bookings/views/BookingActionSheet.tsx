import { View } from 'react-native';
import {
  AppSheet,
  Copy,
  Title,
  Action,
  Field,
  useMobileDesign,
} from '../../../components/common/MobileDesign';
import { useBookingAction, type BookingAction } from '../hooks/useBookingAction';
import type { Booking } from '../../../types/domain';
export function BookingActionSheet({
  booking,
  action,
  onClose,
  onChanged,
}: {
  booking: Booking | null;
  action: BookingAction;
  onClose: () => void;
  onChanged: () => void;
}) {
  const state = useBookingAction(booking, action, onChanged);
  const { t, money } = useMobileDesign();
  if (!booking) return null;
  return (
    <AppSheet title={t(action)} onClose={onClose}>
      <Copy>
        #{booking.bookingCode} · {booking.venueName}
      </Copy>
      {state.done ? (
        <>
          <Title small>{t(action === 'resume' ? 'confirmation' : 'sent')}</Title>
          <Action label={t('close')} onPress={onClose} />
        </>
      ) : (
        <>
          {action === 'review' && (
            <>
              <Copy>{t('rating')}</Copy>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <Action
                    key={value}
                    label={`${value} ★`}
                    secondary={state.rating !== value}
                    onPress={() => state.setRating(value)}
                  />
                ))}
              </View>
            </>
          )}
          {action !== 'resume' && (
            <Field
              label={t(action === 'review' ? 'reviewComment' : 'message')}
              value={state.message}
              onChangeText={state.setMessage}
              multiline
              maxLength={2000}
            />
          )}
          {action === 'resume' && (
            <>
              <Copy>{t('paymentNote')}</Copy>
              <Title small>
                {money(
                  booking.paymentOption === 'full'
                    ? booking.totalPiastres
                    : booking.depositPiastres,
                )}
              </Title>
            </>
          )}
          {state.error && <Copy>{state.error}</Copy>}
          <Action
            label={t(state.saving ? 'loading' : 'submit')}
            disabled={state.saving || (action === 'dispute' && !state.message.trim())}
            onPress={() => void state.submit()}
          />
        </>
      )}
    </AppSheet>
  );
}
