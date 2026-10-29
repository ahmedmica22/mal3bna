import { useMemo, useState } from 'react';
import { FlatList, View, ScrollView } from 'react-native';
import {
  Title,
  Copy,
  Field,
  Action,
  ShimmerVenueCard,
  useMobileDesign,
} from '../../components/common/MobileDesign';
import { VenueCard } from '../../components/discovery/VenueCard';
import type { ExploreScreenProps } from '../../types/components';

export type { ExploreScreenProps };

export function ExploreScreen({
  venues,
  areas = [],
  areaFilter = 'all',
  onSelectArea,
  error,
  onRetry,
  loading,
  sportFilter,
  onSelectSport,
  onSelectVenue,
}: ExploreScreenProps) {
  const { t, columns, rtl, width } = useMobileDesign();
  const [query, setQuery] = useState('');
  const [internalArea, setInternalArea] = useState<'all' | string>('all');

  const activeArea = onSelectArea ? areaFilter : internalArea;
  const setActiveArea = (id: 'all' | string) => {
    if (onSelectArea) {
      onSelectArea(id);
    } else {
      setInternalArea(id);
    }
  };

  const filtered = useMemo(
    () =>
      venues.filter((venue) => {
        // Area filter check
        if (activeArea !== 'all') {
          const matchArea = venue.areaId === activeArea || venue.area?.id === activeArea;
          if (!matchArea) return false;
        }

        // Search query check
        if (!query.trim()) return true;
        const term = query.trim().toLocaleLowerCase();
        const name = venue.name.toLocaleLowerCase();
        const address = (venue.address ?? '').toLocaleLowerCase();
        const areaNameEn = (venue.area?.nameEn ?? '').toLocaleLowerCase();
        const areaNameAr = (venue.area?.nameAr ?? '').toLocaleLowerCase();
        return (
          name.includes(term) ||
          address.includes(term) ||
          areaNameEn.includes(term) ||
          areaNameAr.includes(term)
        );
      }),
    [venues, activeArea, query],
  );

  return (
    <FlatList
      key={columns}
      style={{ flex: 1 }}
      data={loading ? [] : filtered}
      keyExtractor={(venue) => venue.id}
      numColumns={columns}
      initialNumToRender={6}
      maxToRenderPerBatch={4}
      windowSize={5}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        padding: width >= 650 ? 28 : 16,
        paddingBottom: 110,
        width: '100%',
        maxWidth: 1180,
        alignSelf: 'center',
        direction: rtl ? 'rtl' : 'ltr',
      }}
      columnWrapperStyle={columns > 1 ? { gap: 16 } : undefined}
      renderItem={({ item }) => (
        <View
          style={{
            width: columns === 3 ? '31.8%' : columns === 2 ? '48.5%' : '100%',
            marginBottom: 16,
          }}
        >
          <VenueCard venue={item} onPress={() => onSelectVenue(item)} />
        </View>
      )}
      ListHeaderComponent={
        <View style={{ gap: 20, marginBottom: 20 }}>
          <Copy accent>mal3bna / {t('venues')}</Copy>
          <Title>{t('discover')}</Title>
          <Copy>{t('discoverNote')}</Copy>

          {/* Search Input (search by name, address, or Cairo area) */}
          <Field
            label={t('search')}
            value={query}
            onChangeText={setQuery}
            placeholder={
              rtl
                ? 'ابحث بالاسم أو المنطقة (المعادي، الزمالك...)'
                : 'Search by name, address, or area (e.g. Maadi, Zamalek...)'
            }
          />

          {/* Sport Selector */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {(['all', 'football', 'padel'] as const).map((sport) => (
              <Action
                key={sport}
                label={t(sport)}
                secondary={sportFilter !== sport}
                onPress={() => onSelectSport(sport)}
              />
            ))}
          </View>

          {/* Area Selector (Filter by Area) */}
          {areas.length > 0 && (
            <View style={{ marginTop: 4, gap: 6 }}>
              <View>
                <Copy accent>{'📍 ' + t('filterByArea')}</Copy>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  flexDirection: rtl ? 'row-reverse' : 'row',
                  gap: 8,
                  paddingVertical: 2,
                }}
              >
                <Action
                  label={t('allAreas')}
                  secondary={activeArea !== 'all'}
                  onPress={() => setActiveArea('all')}
                />
                {areas.map((a) => (
                  <Action
                    key={a.id}
                    label={rtl ? a.nameAr || a.nameEn : a.nameEn}
                    secondary={activeArea !== a.id}
                    onPress={() => setActiveArea(a.id)}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {error && (
            <>
              <Copy>{t(typeof error === 'string' ? error : 'error')}</Copy>
              {onRetry && <Action label={t('retry')} onPress={onRetry} />}
            </>
          )}
        </View>
      }
      ListEmptyComponent={
        loading ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <View
                key={i}
                style={{ width: columns === 3 ? '31.8%' : columns === 2 ? '48.5%' : '100%' }}
              >
                <ShimmerVenueCard />
              </View>
            ))}
          </View>
        ) : !error ? (
          <Copy>{t('noResults')}</Copy>
        ) : undefined
      }
    />
  );
}
