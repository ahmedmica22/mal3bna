import { useState } from 'react';
import { BookingQr } from '../common/BookingQr';
import { Action } from '../common/MobileDesign';
import type { BookingAction } from '../../features/bookings/hooks/useBookingAction';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Booking } from '../../types/domain';
import { Theme, ThemeType } from '../../constants/theme';
import { Language, translations } from '../../constants/translations';
import type { PlayerBookingCardProps } from '../../types/components';

export type { PlayerBookingCardProps };

export function PlayerBookingCard({
  booking,
  onCancelPress,
  onAction,
  theme = Theme,
  lang = 'en',
}: PlayerBookingCardProps) {
  const [showQr, setShowQr] = useState(false);
  const isConfirmed = booking.status === 'confirmed';
  const t = translations[lang];
  const isRtl = lang === 'ar';

  const statusLabel =
    booking.status === 'confirmed'
      ? t.statusConfirmed
      : booking.status === 'arrived'
        ? t.statusArrived
        : booking.status === 'completed'
          ? t.statusCompleted
          : booking.status === 'cancelled'
            ? t.statusCancelled
            : booking.status.toUpperCase();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.cardBorder,
        },
      ]}
    >
      <View style={[styles.header, isRtl && styles.rowRtl]}>
        <Text style={[styles.code, { color: theme.colors.lime }]}>
          #{booking.bookingCode ?? booking.id.slice(0, 8)}
        </Text>
        <View
          style={[
            styles.badge,
            isConfirmed
              ? { backgroundColor: theme.colors.emeraldGlow, borderColor: theme.colors.emerald }
              : { backgroundColor: theme.colors.inputBg, borderColor: theme.colors.cardBorder },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              { color: isConfirmed ? theme.colors.emerald : theme.colors.textMuted },
            ]}
          >
            {statusLabel}
          </Text>
        </View>
      </View>

      <Text
        style={[
          styles.pitchTitle,
          { color: theme.colors.textPrimary, textAlign: isRtl ? 'right' : 'left' },
        ]}
      >
        {booking.courtName ?? 'Court Pitch'}
      </Text>
      <Text
        style={[
          styles.venueSub,
          { color: theme.colors.textMuted, textAlign: isRtl ? 'right' : 'left' },
        ]}
      >
        {booking.venueName ?? 'Sports Venue'}
      </Text>

      <View style={[styles.timeRow, isRtl && styles.rowRtl]}>
        <Text style={[styles.timeText, { color: theme.colors.textSecondary }]}>
          🕒{' '}
          {new Date(booking.startsAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
            timeZone: 'Africa/Cairo',
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })}{' '}
          at{' '}
          {new Date(booking.startsAt).toLocaleTimeString([], {
            timeZone: 'Africa/Cairo',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>

      {onAction && booking.status === 'completed' && !booking.review && (
        <Action
          secondary
          label={lang === 'ar' ? 'كتابة تقييم' : 'Write a review'}
          onPress={() => onAction('review')}
        />
      )}
      {onAction &&
        booking.status === 'no_show_pending' &&
        (!booking.dispute || booking.dispute.status === 'open') && (
          <Action
            secondary
            label={lang === 'ar' ? 'اعتراض على عدم الحضور' : 'Dispute no-show'}
            onPress={() => onAction('dispute')}
          />
        )}
      {onAction && booking.status === 'held' && (
        <Action
          label={lang === 'ar' ? 'استكمال الدفع' : 'Resume payment'}
          onPress={() => onAction('resume')}
        />
      )}
      {booking.bookingCode && ['confirmed', 'arrived'].includes(booking.status) && (
        <>
          <Action
            secondary
            label={lang === 'ar' ? 'رمز الحجز QR' : 'Booking QR code'}
            onPress={() => setShowQr((value) => !value)}
          />
          {showQr && (
            <BookingQr
              code={booking.bookingCode ?? booking.id.slice(0, 8)}
              booking={booking}
            />
          )}
        </>
      )}
      <View style={[styles.footer, isRtl && styles.rowRtl]}>
        <Text style={{ color: theme.colors.textMuted, fontSize: 13 }}>
          {lang === 'ar' ? 'الإجمالي: ' : 'Total: '}
          <Text style={{ color: theme.colors.textPrimary, fontWeight: '800' }}>
            {((booking.totalPiastres ?? 0) / 100).toFixed(0)} EGP
          </Text>
        </Text>

        {isConfirmed && (
          <TouchableOpacity onPress={() => onCancelPress(booking)}>
            <Text style={styles.cancelText}>{t.cancelBooking}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rowRtl: {
    flexDirection: 'row-reverse',
  },
  code: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  pitchTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  venueSub: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 10,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 10,
  },
  cancelText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '700',
  },
});
