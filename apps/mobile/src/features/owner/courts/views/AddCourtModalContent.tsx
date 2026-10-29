import {
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Theme } from '../../../../constants/theme';
import type { AddCourtModalContentProps } from '../types';
export function AddCourtModalContent({
  courtName,
  courtPhotos,
  handleSave,
  hourlyPriceEgp,
  isIndoor,
  isSubmitting,
  onClose,
  pickPhotos,
  setCourtName,
  setCourtPhotos,
  setHourlyPriceEgp,
  setIsIndoor,
  setSize,
  setSport,
  setSurface,
  size,
  sport,
  styles,
  surface,
  visible,
}: AddCourtModalContentProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.dragPill} />

          <View style={styles.headerRow}>
            <Text style={styles.title}>Add New Pitch / Court</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.label}>Pitch Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Pitch B (FIFA Turf)"
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
                <Text style={styles.label}>Pitch Size</Text>
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

            <Text style={styles.label}>Surface</Text>
            <View style={styles.chipsRow}>
              {['Artificial Turf', 'Natural Grass', 'Glass Double', 'Acrylic'].map((surf) => (
                <TouchableOpacity
                  key={surf}
                  style={[styles.chip, surface === surf && styles.chipActive]}
                  onPress={() => setSurface(surf)}
                >
                  <Text style={[styles.chipText, surface === surf && styles.chipTextActive]}>
                    {surf}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Court Environment</Text>
            <View style={styles.chipsRow}>
              <TouchableOpacity
                style={[styles.chip, !isIndoor && styles.chipActive]}
                onPress={() => setIsIndoor(false)}
              >
                <Text style={[styles.chipText, !isIndoor && styles.chipTextActive]}>
                  ☀️ Outdoor
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.chip, isIndoor && styles.chipActive]}
                onPress={() => setIsIndoor(true)}
              >
                <Text style={[styles.chipText, isIndoor && styles.chipTextActive]}>
                  🏠 Indoor / Covered
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Standard Hourly Rate (EGP) *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 500"
              placeholderTextColor={Theme.colors.textMuted}
              keyboardType="numeric"
              value={hourlyPriceEgp}
              onChangeText={setHourlyPriceEgp}
            />

            {/* Court Photos (Min 2, Max 6) */}
            <View style={styles.photoHeaderRow}>
              <Text style={styles.label}>Court Photos (Min 2, Max 6) *</Text>
              <Text style={styles.photoCounter}>{courtPhotos.length}/6 photos</Text>
            </View>
            <Text style={styles.helperText}>
              Select 2 to 6 photos representing this pitch from your device:
            </Text>

            {courtPhotos.length < 6 && (
              <TouchableOpacity style={styles.pickPhotoBtn} onPress={pickPhotos}>
                <Text style={styles.pickPhotoBtnText}>📷 Upload Photos from Device</Text>
              </TouchableOpacity>
            )}

            {courtPhotos.length > 0 ? (
              <View style={styles.photoPreviewRow}>
                {courtPhotos.map((url, idx) => (
                  <View key={idx} style={styles.photoThumbWrap}>
                    <Image source={{ uri: url }} style={styles.photoThumb} />
                    <TouchableOpacity
                      style={styles.removePhotoBtn}
                      onPress={() => setCourtPhotos(courtPhotos.filter((_, i) => i !== idx))}
                    >
                      <Text style={styles.removePhotoBtnText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noPhotosText}>
                No photos selected yet. Please upload at least 2 photos.
              </Text>
            )}

            <Text style={styles.approvalNote}>
              🛡️ Note: All new pitches require Super Admin verification before accepting player
              bookings.
            </Text>

            <TouchableOpacity
              style={[styles.saveBtn, isSubmitting && { opacity: 0.6 }]}
              disabled={isSubmitting}
              onPress={handleSave}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#0f172a" />
              ) : (
                <Text style={styles.saveBtnText}>Submit Court for Super Admin Approval</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
