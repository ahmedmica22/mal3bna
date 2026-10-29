import { View, ScrollView, Image } from 'react-native';
import {
  AppSheet,
  Title,
  Copy,
  Panel,
  Action,
  ShimmerCourtPills,
  ShimmerSlotGrid,
  ShimmerReviewCard,
  useMobileDesign,
} from '../../../../components/common/MobileDesign';
import type { VenueDetailModalContentProps } from '../types';

export function VenueDetailModalContent(p: VenueDetailModalContentProps) {
  const { t, money, lang, columns, theme } = useMobileDesign();
  const time = (value: string) =>
    new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-GB', {
      timeZone: 'Africa/Cairo',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).format(new Date(value));

  const selectedCount = p.selectedSlots.length;

  return (
    <AppSheet title={p.venue.name} onClose={p.onClose}>
      <Copy>{p.venue.address}</Copy>
      {p.venue.photos?.length ? (
        <ScrollView
          horizontal
          contentContainerStyle={{ gap: 10 }}
          showsHorizontalScrollIndicator={false}
        >
          {p.venue.photos.map((photo, index) => {
            const uri = photo.file?.storageKey ?? photo.storageKey;
            return uri ? (
              <Image
                key={index}
                source={{ uri }}
                accessibilityLabel={p.venue.name}
                style={{ width: 260, height: 160, borderRadius: 18 }}
              />
            ) : null;
          })}
        </ScrollView>
      ) : null}
      {p.venue.description && <Copy>{p.venue.description}</Copy>}
      <Copy accent>{t('cairo')}</Copy>

      {/* Date Selector */}
      <Title small>{t('date')}</Title>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {p.upcomingDays.map((day, i) => (
          <Action
            key={day.date}
            label={i === 0 ? t('today') : i === 1 ? t('tomorrow') : day.date.slice(5)}
            secondary={day.date !== p.selectedDate}
            onPress={() => p.setSelectedDate(day.date)}
          />
        ))}
      </ScrollView>

      {/* Court Selector */}
      <Title small>{t('court')}</Title>
      {!p.venue.courts || p.venue.courts.length === 0 ? (
        <ShimmerCourtPills />
      ) : (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {p.venue.courts.map((court) => (
            <Action
              key={court.id}
              label={court.name}
              secondary={p.activeCourt?.id !== court.id}
              onPress={() => p.onSelectCourt(court)}
            />
          ))}
        </View>
      )}

      {/* Slots Selector - Sequential Multi-Select */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title small>{t('slot')}</Title>
        {selectedCount > 0 && (
          <Copy accent>
            {selectedCount}{' '}
            {lang === 'ar'
              ? 'فترات متتالية'
              : `${selectedCount} sequential slot${selectedCount > 1 ? 's' : ''}`}
          </Copy>
        )}
      </View>
      <Copy>
        {lang === 'ar'
          ? 'اختر حتى 4 فترات متتالية للمباراة'
          : 'Select up to 4 sequential slots for your match'}
      </Copy>

      {p.loadingSlots ? (
        <ShimmerSlotGrid columns={columns} />
      ) : p.slots.length === 0 ? (
        <Copy>{t(p.error ? 'error' : 'noSlots')}</Copy>
      ) : (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {p.slots.map((slot) => {
            const isSelected = p.selectedSlots.some((s) => s.startsAt === slot.startsAt);
            const isAvailable = slot.status === 'available' && slot.available !== false;
            return (
              <View key={slot.startsAt} style={{ width: columns > 1 ? '23%' : '30.5%' }}>
                <Action
                  label={`${time(slot.startsAt)}\n${isAvailable ? money(slot.pricePiastres) : t('booked')}`}
                  secondary={!isSelected}
                  disabled={!isAvailable}
                  onPress={() => p.toggleSlot(slot)}
                />
              </View>
            );
          })}
        </View>
      )}

      {/* Selected Slots Badges */}
      {selectedCount > 0 && (
        <View style={{ gap: 8 }}>
          <Copy>
            {lang === 'ar' ? 'الفترات المختارة:' : 'Selected hours:'}
          </Copy>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
            {p.selectedSlots.map((s) => (
              <View
                key={s.startsAt}
                style={{
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.lime,
                  borderWidth: 1,
                  borderRadius: 12,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                }}
              >
                <Copy accent style={{ fontWeight: '800' }}>
                  {time(s.startsAt)} ({money(s.pricePiastres)})
                </Copy>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Price & Summary Panel */}
      <Panel>
        <Copy>{t('total')}</Copy>
        <Title small>
          {selectedCount > 0 ? money(p.totalPiastres) : '—'}
        </Title>
        {selectedCount > 0 && (
          <Copy>
            {lang === 'ar'
              ? `العربون (30%): ${money(p.depositPiastres)} · المتبقي بالملعب: ${money(p.dueAtVenuePiastres)}`
              : `Deposit (30%): ${money(p.depositPiastres)} · Due at venue: ${money(p.dueAtVenuePiastres)}`}
          </Copy>
        )}
        {p.activeCourt?.size && (
          <Copy>
            {t('size')}: {p.activeCourt.size}
          </Copy>
        )}
        <Copy>{t('policy')}</Copy>
        <Action
          label={t('continue')}
          disabled={!p.eligible || p.loadingSlots}
          onPress={p.handleProceed}
        />
      </Panel>

      {/* Reviews */}
      <Title small>{t('venueReviews')}</Title>
      {p.reviewsLoading ? (
        <View style={{ gap: 10 }}>
          <ShimmerReviewCard />
          <ShimmerReviewCard />
        </View>
      ) : p.reviewsError ? (
        <Copy>{t('error')}</Copy>
      ) : p.reviews.length === 0 ? (
        <Copy>{t('noItems')}</Copy>
      ) : (
        p.reviews.map((review) => (
          <Panel key={review.id}>
            <Copy accent>{review.rating} / 5 ★</Copy>
            {review.comment && <Copy>{review.comment}</Copy>}
            {review.ownerReply && <Copy>{review.ownerReply}</Copy>}
          </Panel>
        ))
      )}
    </AppSheet>
  );
}
