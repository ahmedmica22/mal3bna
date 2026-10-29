import {
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Theme } from '../../../../constants/theme';
import type { EditVenueModalContentProps } from '../types';
export function EditVenueModalContent({
  address,
  description,
  handleSave,
  isSubmitting,
  maxHours,
  name,
  onClose,
  phone,
  setAddress,
  setDescription,
  setMaxHours,
  setName,
  setPhone,
  styles,
  visible,
}: EditVenueModalContentProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.dragPill} />

          <View style={styles.headerRow}>
            <Text style={styles.title}>Edit Venue Details</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.label}>Venue Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Venue Name"
              placeholderTextColor={Theme.colors.textMuted}
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Contact Phone / WhatsApp *</Text>
            <TextInput
              style={styles.input}
              placeholder="+20 100 000 0000"
              placeholderTextColor={Theme.colors.textMuted}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />

            <Text style={styles.label}>Street Address *</Text>
            <TextInput
              style={styles.input}
              placeholder="Address in Cairo"
              placeholderTextColor={Theme.colors.textMuted}
              value={address}
              onChangeText={setAddress}
            />

            <Text style={styles.label}>Description & Facilities</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Venue description, amenities, parking..."
              placeholderTextColor={Theme.colors.textMuted}
              multiline
              numberOfLines={3}
              value={description}
              onChangeText={setDescription}
            />

            <Text style={styles.label}>Max Hours per Reservation</Text>
            <View style={styles.chipsRow}>
              {['2', '3', '4', '6'].map((h) => (
                <TouchableOpacity
                  key={h}
                  style={[styles.chip, maxHours === h && styles.chipActive]}
                  onPress={() => setMaxHours(h)}
                >
                  <Text style={[styles.chipText, maxHours === h && styles.chipTextActive]}>
                    {h} Hours
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.saveBtn, isSubmitting && { opacity: 0.6 }]}
              disabled={isSubmitting}
              onPress={handleSave}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#0f172a" />
              ) : (
                <Text style={styles.saveBtnText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
