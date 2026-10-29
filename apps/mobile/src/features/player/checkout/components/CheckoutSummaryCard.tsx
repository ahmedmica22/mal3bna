import { Text, View } from 'react-native';
import { useMobileDesign } from '../../../../components/common/MobileDesign';
import type { CheckoutModalContentProps } from '../types';

export function CheckoutSummaryCard({
  booking: p,
  formatMoney,
}: {
  booking: CheckoutModalContentProps;
  formatMoney: (value: number) => string;
}) {
  const { theme, t, lang, rtl } = useMobileDesign();
  const locale = lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-EG';
  const dateFormat = new Intl.DateTimeFormat(locale, {
    timeZone: 'Africa/Cairo',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const timeFormat = new Intl.DateTimeFormat(locale, {
    timeZone: 'Africa/Cairo',
    hour: 'numeric',
    minute: '2-digit',
  });
  const intervals = p.runs?.length ? p.runs : [{ startsAt: p.startsAt, hours: p.hours }];
  const now = p.paymentOption === 'full' ? p.totalPiastres : p.depositPiastres;
  const atVenue = p.paymentOption === 'full' ? 0 : p.dueAtVenuePiastres;
  const align = rtl ? ('right' as const) : ('left' as const);
  return (
    <View style={{ borderRadius: 28, padding: 20, backgroundColor: theme.colors.card, gap: 12 }}>
      <Text
        style={{
          color: theme.colors.textMuted,
          fontSize: 12,
          fontWeight: '700',
          letterSpacing: 1,
          textAlign: align,
        }}
      >
        {p.startsAt ? dateFormat.format(new Date(p.startsAt)) : ''}
      </Text>
      <Text
        style={{
          color: theme.colors.textPrimary,
          fontSize: 20,
          fontWeight: '800',
          textAlign: align,
        }}
      >
        {p.venue?.name}
      </Text>
      {intervals.map((interval) => (
        <Text
          key={interval.startsAt}
          style={{
            color: theme.colors.textPrimary,
            fontSize: 23,
            fontWeight: '800',
            textAlign: align,
          }}
        >
          {timeFormat.format(new Date(interval.startsAt))} –{' '}
          {timeFormat.format(new Date(Date.parse(interval.startsAt) + interval.hours * 3_600_000))}
        </Text>
      ))}
      <Text
        style={{ color: theme.colors.textMuted, fontSize: 13, lineHeight: 20, textAlign: align }}
      >
        {[
          p.court?.name,
          `${p.hours} ${t('hours')}`,
          p.venue?.area
            ? rtl
              ? p.venue.area.nameAr || p.venue.area.nameEn
              : p.venue.area.nameEn
            : '',
          t('cairo'),
        ]
          .filter(Boolean)
          .join(' · ')}
      </Text>
      {p.court?.sport !== 'padel' && p.court?.size ? (
        <View
          style={{
            alignSelf: rtl ? 'flex-end' : 'flex-start',
            backgroundColor: theme.colors.limeGlow,
            borderRadius: 10,
            paddingVertical: 6,
            paddingHorizontal: 10,
          }}
        >
          <Text style={{ color: theme.colors.lime, fontWeight: '800', fontSize: 12 }}>
            {t('size')}: {p.court.size}
          </Text>
        </View>
      ) : null}
      {p.court?.sport !== 'padel' && p.court?.size && p.court.size !== 5 ? (
        <Text style={{ color: theme.colors.amber, fontSize: 13, textAlign: align }}>
          {t('sizeWarning')}
        </Text>
      ) : null}
      <View
        style={{
          backgroundColor: theme.colors.cardSecondary,
          borderRadius: 20,
          overflow: 'hidden',
          marginTop: 8,
        }}
      >
        {[
          { label: t('total'), value: p.totalPiastres, highlight: true },
          { label: t('dueNow'), value: now, highlight: false },
          { label: t('dueAtVenue'), value: atVenue, highlight: false },
        ].map((row, index) => (
          <View
            key={index}
            style={{
              flexDirection: rtl ? 'row-reverse' : 'row',
              alignItems: 'center',
              gap: 14,
              padding: 17,
              backgroundColor: row.highlight ? theme.colors.limeGlow : undefined,
              borderTopWidth: index ? 1 : 0,
              borderColor: theme.colors.divider,
            }}
          >
            <Text
              style={{ flex: 1, color: theme.colors.textSecondary, fontSize: 14, textAlign: align }}
            >
              {row.label}
            </Text>
            <Text
              style={{
                color: theme.colors.textPrimary,
                fontSize: row.highlight ? 20 : 16,
                fontWeight: row.highlight ? '800' : '600',
                flexShrink: 1,
              }}
            >
              {formatMoney(row.value)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
