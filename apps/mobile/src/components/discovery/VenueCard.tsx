import { Image, Pressable, View, Text } from 'react-native';
import { Panel, Title, Copy, useMobileDesign } from '../common/MobileDesign';
import type { Venue } from '../../types/domain';
import type { ThemeType } from '../../constants/theme';
import type { Language } from '../../constants/translations';
export function VenueCard({
  venue,
  onPress,
}: {
  venue: Venue;
  onPress: () => void;
  theme?: ThemeType;
  lang?: Language;
}) {
  const { theme, t } = useMobileDesign();
  const photo = venue.photos?.[0]?.file?.storageKey ?? venue.photos?.[0]?.storageKey;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={venue.name} onPress={onPress}>
      <Panel>
        <View
          style={{
            borderRadius: 18,
            overflow: 'hidden',
            height: 170,
            backgroundColor: theme.colors.cardSecondary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {photo ? (
            <Image
              source={{ uri: photo }}
              style={{ width: '100%', height: '100%' }}
              accessibilityLabel={venue.name}
            />
          ) : (
            <Text style={{ fontSize: 52 }}>⚽</Text>
          )}
          <View
            style={{
              position: 'absolute',
              bottom: 12,
              start: 12,
              backgroundColor: theme.colors.bg,
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 20,
            }}
          >
            <Copy accent>
              {Array.from(new Set(venue.courts?.map((court) => court.sport).filter(Boolean)))
                .map((sport) => t(sport === 'padel' ? 'padel' : 'football'))
                .join(' / ') || t('venues')}
            </Copy>
          </View>
        </View>
        <Title small>{venue.name}</Title>
        <Copy>
          {venue.area?.nameEn
            ? `📍 ${venue.area.nameEn}${venue.address ? ` • ${venue.address}` : ''}`
            : (venue.address ?? '')}
        </Copy>
        <View style={{ borderTopWidth: 1, borderColor: theme.colors.divider, paddingTop: 12 }}>
          <Copy accent>{t('slot')} →</Copy>
        </View>
      </Panel>
    </Pressable>
  );
}
