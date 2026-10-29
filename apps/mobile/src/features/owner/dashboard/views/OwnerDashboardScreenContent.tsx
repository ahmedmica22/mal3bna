import { BookingScanner } from '../../scanner/BookingScanner';
import { parseCheckInQr } from '../../../../utils/checkin-qr';
import { useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import {
  Screen,
  Panel,
  Title,
  Copy,
  Action,
  Field,
  ShimmerBookingCard,
  ShimmerCourtCard,
  ShimmerCourtPills,
  useMobileDesign,
} from '../../../../components/common/MobileDesign';
import { MatchDayCard } from '../../../../components/owner/MatchDayCard';
import { getUpcomingDays, venueDate } from '../../../../utils/venue-time';
import type { OwnerDashboardScreenContentProps } from '../types';
export function OwnerDashboardScreenContent(p: OwnerDashboardScreenContentProps) {
  const { t, money, columns, compact, theme, lang } = useMobileDesign();
  const [date, setDate] = useState(() => venueDate());
  const [scanning, setScanning] = useState(false);
  const [search, setSearch] = useState('');
  const [court, setCourt] = useState('all');
  const all = p.allBookings ?? p.todaysMatches;
  const games = all.filter((booking) => booking.kind !== 'block');
  const schedule = all
    .filter(
      (booking) =>
        !['cancelled', 'expired'].includes(booking.status) &&
        (search.trim()
          ? `${booking.bookingCode ?? ''} ${booking.customerName ?? ''} ${booking.customerPhone ?? ''}`
              .toLowerCase()
              .includes(search.toLowerCase().trim())
          : venueDate(booking.startsAt) <= date &&
            venueDate(new Date(Date.parse(booking.endsAt ?? booking.startsAt) - 1)) >= date) &&
        (court === 'all' || booking.courtId === court),
    )
    .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
  return (
    <Screen>
      <Copy accent>mal3bna / {t('owner')}</Copy>
      <Title>{p.venue?.name}</Title>
      <Copy>
        {p.venue?.address} · {t('cairo')}
      </Copy>
      {p.mode !== 'schedule' && (
        <>
          <View
            style={{ backgroundColor: theme.colors.lime, borderRadius: 28, padding: 24, gap: 12 }}
          >
            <Text style={{ color: theme.colors.limeDark, fontSize: 16, fontWeight: '800' }}>
              {t('earnings')}
            </Text>
            <View style={{ backgroundColor: theme.colors.bg, padding: 18, borderRadius: 18 }}>
              <Title>{money(p.balance?.totalEarnedPiastres)}</Title>
              <Copy>{t('earningsNote')}</Copy>
            </View>
            <Text style={{ color: theme.colors.limeDark }}>
              {t('cash')}: {money(p.balance?.cashCollectedPiastres)}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {[
              { label: t('cashDue'), value: `${p.cashDueTodayEgp} EGP` },
              { label: t('courts'), value: String(p.venue?.courts?.length ?? 0) },
              { label: t('available'), value: money(p.balance?.availablePiastres) },
              { label: t('pendingFunds'), value: money(p.balance?.pendingPiastres) },
              { label: t('bookings'), value: String(games.length) },
              {
                label: t('completed'),
                value: String(games.filter((b) => b.status === 'completed').length),
              },
            ].map((item) => (
              <View
                key={item.label}
                style={{ width: compact ? '100%' : columns === 3 ? '31.8%' : '47.5%' }}
              >
                <Panel>
                  <Copy>{item.label}</Copy>
                  <Title small>{item.value}</Title>
                </Panel>
              </View>
            ))}
          </View>
        </>
      )}
      <Panel>
        <Title small>{t('schedule')}</Title>
        <Action
          secondary
          label={lang === 'ar' ? 'مسح رمز الحجز QR' : 'Scan booking QR'}
          onPress={() => setScanning(true)}
        />
        <Field label={t('lookup')} value={search} onChangeText={setSearch} />
        <Copy>{t('scheduleNote')}</Copy>
        {games.some((booking) => booking.isTestPayment) && <Copy>{t('paymentNote')}</Copy>}
        <ScrollView
          horizontal
          contentContainerStyle={{ gap: 8 }}
          showsHorizontalScrollIndicator={false}
        >
          {getUpcomingDays(14).map((day, i) => (
            <Action
              key={day.date}
              label={i === 0 ? t('today') : i === 1 ? t('tomorrow') : day.date.slice(5)}
              secondary={date !== day.date}
              onPress={() => setDate(day.date)}
            />
          ))}
        </ScrollView>
        <ScrollView
          horizontal
          contentContainerStyle={{ gap: 8 }}
          showsHorizontalScrollIndicator={false}
        >
          <Action
            label={t('allCourts')}
            secondary={court !== 'all'}
            onPress={() => setCourt('all')}
          />
          {(!p.venue?.courts || p.venue.courts.length === 0) ? (
            <ShimmerCourtPills />
          ) : (
            p.venue.courts.map((item) => (
              <Action
                key={item.id}
                label={item.name}
                secondary={court !== item.id}
                onPress={() => setCourt(item.id)}
              />
            ))
          )}
        </ScrollView>
        {p.loading ? (
          <View style={{ gap: 12 }}>
            <ShimmerBookingCard />
            <ShimmerBookingCard />
          </View>
        ) : !schedule.length ? (
          <Copy>{t('noMatches')}</Copy>
        ) : (
          schedule.map((booking) => (
            <MatchDayCard
              key={booking.id}
              booking={booking}
              onChanged={p.onRefresh}
              onArrive={p.onArrive}
              onCollectCash={p.onCollectCash}
              onComplete={p.onComplete}
            />
          ))
        )}
        <Action label={t('walkIn')} onPress={p.onAddWalkIn} />
        <Action secondary label={t('block')} onPress={p.onLockMaintenance} />
      </Panel>
      {p.mode !== 'schedule' && (
        <Panel>
          <Title small>{t('courtOverview')}</Title>
          {p.loading ? (
            <View style={{ gap: 8, paddingVertical: 8 }}>
              <ShimmerCourtCard />
            </View>
          ) : !p.venue?.courts?.length ? (
            <Copy>{lang === 'ar' ? 'لا توجد ملاعب مهيأة' : 'No courts configured'}</Copy>
          ) : (
            p.venue.courts.map((item) => (
              <View
                key={item.id}
                style={{
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderColor: theme.colors.divider,
                }}
              >
                <Title small>{item.name}</Title>
                <Copy>
                  {t(item.sport === 'padel' ? 'padel' : 'football')} ·{' '}
                  {games.filter((booking) => booking.courtId === item.id).length} {t('bookings')}
                </Copy>
              </View>
            ))
          )}
        </Panel>
      )}
      {scanning && (
        <BookingScanner
          onClose={() => setScanning(false)}
          onRead={async (raw) => {
            setScanning(false);
            const parsed = parseCheckInQr(raw);
            const target = parsed.id || parsed.code;
            setSearch(parsed.code || target);
            if (p.onArrive && target) {
              await p.onArrive(target);
            }
          }}
        />
      )}
    </Screen>
  );
}
