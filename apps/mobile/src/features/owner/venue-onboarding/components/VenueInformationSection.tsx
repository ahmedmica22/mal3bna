import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { ShimmerAreaChips } from '../../../../components/common/Shimmer';
import { Theme } from '../../../../constants/theme';
import type { OwnerAddVenueScreenContentProps } from '../types';
export function VenueInformationSection({
  address,
  areas,
  description,
  loadingAreas,
  maxHours,
  phone,
  selectedAreaId,
  setAddress,
  setDescription,
  setMaxHours,
  setPhone,
  setSelectedAreaId,
  setVenueName,
  styles,
  venueName,
}: Pick<
  OwnerAddVenueScreenContentProps,
  | 'address'
  | 'areas'
  | 'description'
  | 'loadingAreas'
  | 'maxHours'
  | 'phone'
  | 'selectedAreaId'
  | 'setAddress'
  | 'setDescription'
  | 'setMaxHours'
  | 'setPhone'
  | 'setSelectedAreaId'
  | 'setVenueName'
  | 'styles'
  | 'venueName'
>) {
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>1. VENUE INFORMATION</Text>

      <Text style={styles.label}>Venue Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Al Forsan Sports Arena"
        placeholderTextColor={Theme.colors.textMuted}
        value={venueName}
        onChangeText={setVenueName}
      />

      <Text style={styles.label}>Cairo District / Area *</Text>
      {loadingAreas ? (
        <ShimmerAreaChips count={4} />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {areas.map((a) => {
            const active = a.id === selectedAreaId;
            return (
              <TouchableOpacity
                key={a.id}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setSelectedAreaId(a.id)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{a.nameEn}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      <Text style={styles.label}>Full Street Address *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 15 South 90th Street, New Cairo"
        placeholderTextColor={Theme.colors.textMuted}
        value={address}
        onChangeText={setAddress}
      />

      <Text style={styles.label}>Contact Phone / WhatsApp *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. +20 100 123 4567"
        placeholderTextColor={Theme.colors.textMuted}
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <Text style={styles.label}>Description & Amenities</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Describe your pitch surfaces, floodlights, parking, locker rooms, cafe..."
        placeholderTextColor={Theme.colors.textMuted}
        multiline
        numberOfLines={3}
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Max Consecutive Hours per Match (Platform Max: 4)</Text>
      <View style={styles.chipsRow}>
        {['2', '3', '4'].map((h) => (
          <TouchableOpacity
            key={h}
            style={[styles.chip, maxHours === h && styles.chipActive]}
            onPress={() => setMaxHours(h)}
          >
            <Text style={[styles.chipText, maxHours === h && styles.chipTextActive]}>
              {h} Hours {h === '4' ? '(Max)' : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
