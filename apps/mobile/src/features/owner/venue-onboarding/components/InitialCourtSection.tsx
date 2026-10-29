import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Theme } from '../../../../constants/theme';
import type { OwnerAddVenueScreenContentProps } from '../types';
export function InitialCourtSection({
  courtName,
  hourlyPriceEgp,
  isIndoor,
  setCourtName,
  setHourlyPriceEgp,
  setIsIndoor,
  setSize,
  setSport,
  setSurface,
  size,
  sport,
  styles,
  surface,
}: Pick<
  OwnerAddVenueScreenContentProps,
  | 'courtName'
  | 'hourlyPriceEgp'
  | 'isIndoor'
  | 'setCourtName'
  | 'setHourlyPriceEgp'
  | 'setIsIndoor'
  | 'setSize'
  | 'setSport'
  | 'setSurface'
  | 'size'
  | 'sport'
  | 'styles'
  | 'surface'
>) {
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>3. INITIAL PITCH & STANDARD RATE</Text>
      <Text style={styles.sectionSubtitle}>
        Configure your first bookable court. Platform schedules 24-hour round-the-clock
        availability.
      </Text>

      <Text style={styles.label}>Pitch Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Pitch 1 (Turf)"
        placeholderTextColor={Theme.colors.textMuted}
        value={courtName}
        onChangeText={setCourtName}
      />

      <Text style={styles.label}>Sport *</Text>
      <View style={styles.chipsRow}>
        <TouchableOpacity
          style={[styles.chip, sport === 'football' && styles.chipActive]}
          onPress={() => setSport('football')}
        >
          <Text style={[styles.chipText, sport === 'football' && styles.chipTextActive]}>
            ⚽ Football
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.chip, sport === 'padel' && styles.chipActive]}
          onPress={() => setSport('padel')}
        >
          <Text style={[styles.chipText, sport === 'padel' && styles.chipTextActive]}>
            🎾 Padel
          </Text>
        </TouchableOpacity>
      </View>

      {sport === 'football' ? (
        <>
          <Text style={styles.label}>Football Pitch Size</Text>
          <View style={styles.chipsRow}>
            {[5, 7, 11].map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.chip, size === s && styles.chipActive]}
                onPress={() => setSize(s)}
              >
                <Text style={[styles.chipText, size === s && styles.chipTextActive]}>
                  {s}-a-side
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      ) : null}

      <Text style={styles.label}>Surface Type</Text>
      <View style={styles.chipsRow}>
        {['Artificial Turf', 'Natural Grass', 'Glass Court', 'Acrylic'].map((surf) => (
          <TouchableOpacity
            key={surf}
            style={[styles.chip, surface === surf && styles.chipActive]}
            onPress={() => setSurface(surf)}
          >
            <Text style={[styles.chipText, surface === surf && styles.chipTextActive]}>{surf}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Indoor or Outdoor</Text>
      <View style={styles.chipsRow}>
        <TouchableOpacity
          style={[styles.chip, !isIndoor && styles.chipActive]}
          onPress={() => setIsIndoor(false)}
        >
          <Text style={[styles.chipText, !isIndoor && styles.chipTextActive]}>☀️ Outdoor</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.chip, isIndoor && styles.chipActive]}
          onPress={() => setIsIndoor(true)}
        >
          <Text style={[styles.chipText, isIndoor && styles.chipTextActive]}>
            🏠 Covered / Indoor
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Hourly Rate (EGP) *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 500"
        placeholderTextColor={Theme.colors.textMuted}
        keyboardType="numeric"
        value={hourlyPriceEgp}
        onChangeText={setHourlyPriceEgp}
      />
      <Text style={styles.helperText}>
        Player can select up to 4 consecutive hours. 24h slots provisioned automatically.
      </Text>
    </View>
  );
}
