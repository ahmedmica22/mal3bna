import { Text, View } from 'react-native';
import { useMobileDesign } from '../../../../components/common/MobileDesign';

export function CheckoutPolicyCard() {
  const { theme, t, rtl } = useMobileDesign();
  const rules = [
    ['cancelEarly', 'cancelEarlyDetail'],
    ['cancelLate', 'cancelLateDetail'],
    ['cancelVenue', 'cancelVenueDetail'],
  ] as const;
  return (
    <View style={{ padding: 20, borderRadius: 26, backgroundColor: theme.colors.card, gap: 20 }}>
      <Text
        style={{
          color: theme.colors.textPrimary,
          fontSize: 18,
          fontWeight: '800',
          textAlign: rtl ? 'right' : 'left',
        }}
      >
        {t('cancellationTitle')}
      </Text>
      {rules.map(([title, detail]) => (
        <View key={title} style={{ flexDirection: rtl ? 'row-reverse' : 'row', gap: 12 }}>
          <View
            style={{
              width: 9,
              height: 9,
              marginTop: 5,
              borderRadius: 5,
              borderWidth: 2,
              borderColor: theme.colors.emerald,
            }}
          />
          <View style={{ flex: 1, gap: 5 }}>
            <Text
              style={{
                color: theme.colors.textPrimary,
                fontSize: 14,
                fontWeight: '700',
                textAlign: rtl ? 'right' : 'left',
              }}
            >
              {t(title)}
            </Text>
            <Text
              style={{
                color: theme.colors.textMuted,
                fontSize: 13,
                lineHeight: 20,
                textAlign: rtl ? 'right' : 'left',
              }}
            >
              {t(detail)}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
