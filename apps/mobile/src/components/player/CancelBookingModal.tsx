import type { Booking } from '../../types/domain';
import { AppSheet, Panel, Copy, Title, Action, Shimmer, useMobileDesign } from '../common/MobileDesign';
export function CancelBookingModal({
  booking,
  refundPiastres,
  loading,
  error,
  onConfirmCancel,
  onClose,
}: {
  booking: Booking | null;
  refundPiastres?: number;
  loading?: boolean;
  error?: boolean;
  onConfirmCancel: (booking: Booking) => void;
  onClose: () => void;
}) {
  const { t, money } = useMobileDesign();
  if (!booking) return null;
  return (
    <AppSheet title={t('cancelPreview')} onClose={onClose}>
      <Copy>
        {booking.venueName} · #{booking.bookingCode}
      </Copy>
      {loading ? (
        <Panel>
          <Shimmer width={100} height={16} borderRadius={6} />
          <Shimmer width={140} height={32} borderRadius={8} />
        </Panel>
      ) : error ? (
        <Copy>{t('error')}</Copy>
      ) : (
        <Panel>
          <Copy>{t('refund')}</Copy>
          <Title>{money(refundPiastres)}</Title>
        </Panel>
      )}
      <Copy>{t('policy')}</Copy>
      <Action secondary label={t('keep')} onPress={onClose} />
      <Action
        label={t('confirmCancel')}
        disabled={loading || error || refundPiastres === undefined}
        onPress={() => onConfirmCancel(booking)}
      />
    </AppSheet>
  );
}
