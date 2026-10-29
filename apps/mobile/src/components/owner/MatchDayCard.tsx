import { useState } from 'react';
import { OwnerBookingActionSheet } from '../../features/owner/bookings/views/OwnerBookingActionSheet';
import { View } from 'react-native';
import { Panel, Title, Copy, Action, useMobileDesign } from '../common/MobileDesign';
import type { Booking } from '../../types/domain';
export function MatchDayCard({
  booking,
  onChanged,
  onArrive,
  onCollectCash,
  onComplete,
}: {
  booking: Booking;
  onChanged?: () => void;
  onArrive: (id: string) => void;
  onCollectCash: (id: string) => void;
  onComplete: (id: string) => void;
}) {
  const { t, money, lang } = useMobileDesign();
  const [action, setAction] = useState<'ownerCancel' | 'noShow' | null>(null);
  const blocked = booking.kind === 'block';
  const time = new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-GB', {
    timeZone: 'Africa/Cairo',
    hour: '2-digit',
    minute: '2-digit',
  });
  return (
    <Panel>
      <Copy accent>
        {time.format(new Date(booking.startsAt))} –{' '}
        {booking.endsAt ? time.format(new Date(booking.endsAt)) : ''}
      </Copy>
      <Title small>{blocked ? t('block') : (booking.customerName ?? booking.bookingCode)}</Title>
      <Copy>
        {booking.courtName} · {booking.status}
      </Copy>
      {booking.isTestPayment && <Copy>{t('test')}</Copy>}
      {!blocked && (
        <Copy>
          {t('dueAtVenue')}: {money(booking.dueAtVenuePiastres)}
        </Copy>
      )}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {!blocked && booking.status === 'confirmed' && (
          <Action label={t('checkIn')} onPress={() => onArrive(booking.id)} />
        )}
        {!blocked &&
          ['confirmed', 'arrived', 'completed'].includes(booking.status) &&
          (booking.dueAtVenuePiastres ?? 0) > 0 && (
            <Action secondary label={t('collect')} onPress={() => onCollectCash(booking.id)} />
          )}
        {!blocked &&
          booking.status === 'arrived' &&
          booking.endsAt &&
          Date.parse(booking.endsAt) <= Date.now() && (
            <Action secondary label={t('complete')} onPress={() => onComplete(booking.id)} />
          )}
        {!blocked && ['held', 'confirmed', 'arrived'].includes(booking.status) && (
          <Action secondary label={t('ownerCancel')} onPress={() => setAction('ownerCancel')} />
        )}
        {!blocked &&
          booking.kind !== 'manual' &&
          ['confirmed', 'arrived'].includes(booking.status) && (
            <Action secondary label={t('noShow')} onPress={() => setAction('noShow')} />
          )}
      </View>
      <OwnerBookingActionSheet
        id={booking.id}
        action={action}
        onClose={() => setAction(null)}
        onChanged={onChanged}
      />
    </Panel>
  );
}
