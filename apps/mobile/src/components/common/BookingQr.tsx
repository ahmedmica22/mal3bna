import QRCode from 'react-native-qrcode-svg';
import { View, Text } from 'react-native';
import { Copy, useMobileDesign } from './MobileDesign';
import type { BookingQrProps } from '../../types/components';

export type { BookingQrProps };

export function BookingQr({ code, booking }: BookingQrProps) {
  const { width, theme, lang, money } = useMobileDesign();

  const bookingCode = booking?.bookingCode || code;
  const bookingId = booking?.id || code;

  // Universal Match-Day Check-In Link:
  // When scanned by any iPhone/Android camera, it immediately opens the check-in confirmation page and marks the player as arrived.
  const webBaseUrl =
    process.env.EXPO_PUBLIC_WEB_URL ||
    (typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : 'http://192.168.1.105:5173');
  const qrPayload = `${webBaseUrl.replace(/\/$/, '')}/checkin?code=${encodeURIComponent(bookingCode)}`;

  const formattedDate = booking?.startsAt
    ? new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-EG', {
        timeZone: 'Africa/Cairo',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(booking.startsAt))
    : '';

  const due = booking?.dueAtVenuePiastres ?? 0;

  return (
    <View style={{ alignItems: 'center', gap: 10, padding: 12 }}>
      <View
        accessibilityLabel={`Booking QR ${bookingCode}`}
        style={{
          backgroundColor: '#ffffff',
          padding: 16,
          borderRadius: 22,
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.08)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 6,
        }}
      >
        <QRCode
          value={qrPayload}
          size={Math.max(100, Math.min(220, width - 120))}
          backgroundColor="#ffffff"
          color="#0b1715"
        />
      </View>

      <Text
        style={{
          color: theme.colors.lime,
          fontWeight: '900',
          fontSize: 18,
          letterSpacing: 1,
        }}
      >
        #{bookingCode}
      </Text>

      {/* Player & Match Info Banner */}
      <View
        style={{
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.cardBorder,
          borderWidth: 1,
          borderRadius: 16,
          padding: 12,
          width: '100%',
          maxWidth: 320,
          gap: 6,
          alignItems: 'center',
        }}
      >
        {booking?.customerName ? (
          <Copy accent style={{ fontWeight: '800' }}>
            👤 {booking.customerName} {booking.customerPhone ? `(${booking.customerPhone})` : ''}
          </Copy>
        ) : null}

        {booking?.venueName && booking?.courtName ? (
          <Copy style={{ fontWeight: '700' }}>
            🏟️ {booking.venueName} · {booking.courtName}
          </Copy>
        ) : null}

        {formattedDate ? (
          <Copy style={{ fontSize: 12 }}>
            🕒 {formattedDate} · {lang === 'ar' ? 'توقيت القاهرة' : 'Cairo time'}
          </Copy>
        ) : null}

        <View
          style={{
            marginTop: 4,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 8,
            backgroundColor: due > 0 ? theme.colors.amberGlow : theme.colors.emeraldGlow,
            borderColor: due > 0 ? theme.colors.amber : theme.colors.emerald,
            borderWidth: 1,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: '800',
              color: due > 0 ? theme.colors.amber : theme.colors.emerald,
            }}
          >
            {due > 0
              ? `${lang === 'ar' ? 'المتبقي بالملعب: ' : 'Due at Venue: '}${money(due)}`
              : lang === 'ar'
                ? '✓ مدفوع بالكامل'
                : '✓ Fully Paid Online'}
          </Text>
        </View>
      </View>
    </View>
  );
}
