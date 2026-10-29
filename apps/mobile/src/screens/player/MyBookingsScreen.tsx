import { BookingActionSheet } from '../../features/bookings/views/BookingActionSheet';
import type { BookingAction } from '../../features/bookings/hooks/useBookingAction';
import { useState } from 'react';
import { View } from 'react-native';
import { Screen, Title, Copy, Action, ShimmerBookingCard, useMobileDesign } from '../../components/common/MobileDesign';
import { PlayerBookingCard } from '../../components/player/PlayerBookingCard';
import type { Booking } from '../../types/domain';
import type { ThemeType } from '../../constants/theme';
import type { Language } from '../../constants/translations';
export function MyBookingsScreen({
  bookings, error,
  loading,
  onCancelPress,
  onRefresh,
}: {
  bookings: Booking[];
  error?:string;
  loading: boolean;
  onCancelPress: (booking: Booking) => void;
  onRefresh?: () => void;
  theme?: ThemeType;
  lang?: Language;
}) {
  const [selected, setSelected] = useState<Booking | null>(null);
  const [action, setAction] = useState<BookingAction>('review');
  const { t, theme, lang, columns } = useMobileDesign();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const list = [...bookings]
    .sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (aTime !== bTime) return bTime - aTime;
      return new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime();
    })
    .filter(
      (booking) =>
        filter === 'all' ||
        (filter === 'completed'
          ? booking.status === 'completed'
          : ['held', 'confirmed', 'arrived'].includes(booking.status)),
    );
  return (
    <>
      <Screen onRefresh={onRefresh} refreshing={loading}>
        <Copy accent>mal3bna / {t('player')}</Copy>
        <Title>{t('myBookings')}</Title>
        <Copy>{t('cairo')}</Copy>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          {(['all', 'upcoming', 'completed'] as const).map((key) => (
            <Action
              key={key}
              label={
                key === 'upcoming'
                  ? lang === 'ar'
                    ? 'القادمة'
                    : 'Upcoming'
                  : key === 'completed'
                    ? t('completed')
                    : lang === 'ar'
                      ? 'الكل'
                      : 'All'
              }
              secondary={filter !== key}
              onPress={() => setFilter(key)}
            />
          ))}
        </View>
        {error && <><Copy>{error}</Copy>{onRefresh && <Action label={t('retry')} onPress={onRefresh} />}</>}
      {loading && !bookings.length ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <View key={i} style={{ width: columns > 1 ? '48.5%' : '100%' }}>
              <ShimmerBookingCard />
            </View>
          ))}
        </View>
      ) : list.length === 0 ? (
          <Copy>{t('noBookings')}</Copy>
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
            {list.map((booking) => (
              <View key={booking.id} style={{ width: columns > 1 ? '48.5%' : '100%' }}>
                <PlayerBookingCard
                  booking={booking}
                  onCancelPress={onCancelPress}
                  theme={theme}
                  lang={lang}
                  onAction={(type) => {
                    setAction(type);
                    setSelected(booking);
                  }}
                />
              </View>
            ))}
          </View>
        )}
      </Screen>
      <BookingActionSheet
        booking={selected}
        action={action}
        onClose={() => setSelected(null)}
        onChanged={() => onRefresh?.()}
      />
    </>
  );
}
