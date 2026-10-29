import {
  Text,
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import type { ManagePhotosModalContentProps } from '../types';
export function ManagePhotosModalContent({
  handleRemovePhoto,
  handleSave,
  isSubmitting,
  onClose,
  photoUrls,
  pickPhotos,
  styles,
  visible,
}: ManagePhotosModalContentProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.dragPill} />

          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>Venue Photos</Text>
              <Text style={styles.counterText}>
                {photoUrls.length} of 6 photos (Min: 2, Max: 6)
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Photos Preview Grid */}
            <Text style={styles.label}>Current Photos ({photoUrls.length}/6)</Text>
            {photoUrls.length > 0 ? (
              <View style={styles.photosGrid}>
                {photoUrls.map((url, idx) => (
                  <View key={idx} style={styles.photoCard}>
                    <Image source={{ uri: url }} style={styles.thumbImage} />
                    <View style={styles.photoBadge}>
                      <Text style={styles.photoBadgeText}>Photo {idx + 1}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.deletePhotoBtn}
                      onPress={() => handleRemovePhoto(idx)}
                    >
                      <Text style={styles.deletePhotoText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noPhotosText}>
                No photos uploaded yet. Please upload at least 2 photos.
              </Text>
            )}

            {/* Direct Device Upload if < 6 */}
            {photoUrls.length < 6 && (
              <TouchableOpacity style={styles.pickPhotoBtn} onPress={pickPhotos}>
                <Text style={styles.pickPhotoBtnText}>📷 Upload Photos from Device</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.saveBtn, isSubmitting && { opacity: 0.6 }]}
              disabled={isSubmitting}
              onPress={handleSave}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#0f172a" />
              ) : (
                <Text style={styles.saveBtnText}>
                  Save Venue Photos ({photoUrls.length} selected)
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
