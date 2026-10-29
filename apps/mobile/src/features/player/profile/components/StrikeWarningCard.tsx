import { Text, View } from 'react-native';
import { useMobileDesign } from '../../../../components/common/MobileDesign';

export function StrikeWarningCard({ count }: { count: number }) {
  const { theme, t, rtl } = useMobileDesign();
  const warning = count > 0;
  const tone = warning ? theme.colors.amber : theme.colors.emerald;
  return (
    <View
      style={{
        padding: 18,
        borderRadius: 24,
        borderWidth: 1.5,
        borderColor: warning ? tone : theme.colors.cardBorder,
        backgroundColor: warning ? theme.colors.amberGlow : theme.colors.card,
        gap: 14,
        marginBottom: 16,
      }}
    >
      <View
        style={{ flexDirection: rtl ? 'row-reverse' : 'row', alignItems: 'flex-start', gap: 10 }}
      >
        <Text style={{ fontSize: 22 }}>{warning ? '⚠' : '✓'}</Text>
        <View style={{ flex: 1, minWidth: 0, gap: 6 }}>
          <Text
            style={{
              color: tone,
              fontSize: 17,
              fontWeight: '800',
              textAlign: rtl ? 'right' : 'left',
            }}
          >
            {t(warning ? 'strikeWarningTitle' : 'trustGood')}
          </Text>
          <Text
            style={{
              color: theme.colors.textSecondary,
              fontSize: 13,
              textAlign: rtl ? 'right' : 'left',
            }}
          >
            {t('strikeCount').replace('{count}', String(count))}
          </Text>
        </View>
      </View>
      <View
        accessible
        accessibilityLabel={t('strikeCount').replace('{count}', String(count))}
        style={{ flexDirection: rtl ? 'row-reverse' : 'row', gap: 7 }}
      >
        {[1, 2, 3, 4].map((position) => (
          <View
            key={position}
            style={{
              flex: 1,
              height: 7,
              borderRadius: 4,
              backgroundColor:
                position <= count
                  ? position === 4
                    ? theme.colors.rose
                    : tone
                  : theme.colors.divider,
            }}
          />
        ))}
      </View>
      <Text
        style={{
          color: theme.colors.textSecondary,
          fontSize: 13,
          lineHeight: 21,
          textAlign: rtl ? 'right' : 'left',
        }}
      >
        {t(warning ? 'strikeWarningBody' : 'trustGoodBody')}
      </Text>
    </View>
  );
}
