import { Text, View, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SignOutIcon } from '../../../../components/common/TabIcons';
import type { OwnerAddVenueScreenContentProps } from '../types';
import { VenueInformationSection } from '../components/VenueInformationSection';
import { InitialCourtSection } from '../components/InitialCourtSection';
export function OwnerAddVenueScreenContent({
  address,
  areas,
  courtName,
  description,
  handleRemovePhoto,
  handleSubmit,
  hourlyPriceEgp,
  isIndoor,
  isSubmitting,
  loadingAreas,
  maxHours,
  onSignOut,
  ownerName,
  phone,
  photoUrls,
  pickPhotos,
  selectedAreaId,
  setAddress,
  setCourtName,
  setDescription,
  setHourlyPriceEgp,
  setIsIndoor,
  setMaxHours,
  setPhone,
  setSelectedAreaId,
  setSize,
  setSport,
  setSurface,
  setVenueName,
  size,
  sport,
  styles,
  surface,
  venueName,
}: OwnerAddVenueScreenContentProps) {
  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {/* Header Banner */}
      <View style={styles.headerCard}>
        <View style={styles.badgeRow}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>✓ ACCOUNT APPROVED</Text>
          </View>
        </View>
        <Text style={styles.headerTitle}>Add Your Venue & Details</Text>
        <Text style={styles.headerSubtitle}>
          Welcome{ownerName ? `, ${ownerName}` : ''}! Your owner account has been approved by the
          Super Admin. Please fill in your venue details, upload 2 to 3 photos, and configure your
          first pitch.
        </Text>
      </View>

      {/* Section 1: Venue Information */}
      <VenueInformationSection
        {...{
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
        }}
      />

      {/* Section 2: Venue Photos (Min 2, Max 6) */}
      <View style={styles.sectionCard}>
        <View style={styles.badgeRow}>
          <Text style={styles.sectionTitle}>2. VENUE PHOTOS (MIN 2, MAX 6) *</Text>
          <View style={styles.photoCountBadge}>
            <Text style={styles.photoCountText}>{photoUrls.length}/6 Photos</Text>
          </View>
        </View>
        <Text style={styles.sectionSubtitle}>
          Upload between 2 and 6 photos showing your pitch, turf condition, and amenities.
        </Text>

        {/* Thumbnail Preview Grid */}
        {photoUrls.length > 0 ? (
          <View style={styles.photosGrid}>
            {photoUrls.map((url, idx) => (
              <View key={idx} style={styles.photoThumb}>
                <Image source={{ uri: url }} style={styles.thumbImage} />
                <View style={styles.photoNumberBadge}>
                  <Text style={styles.photoNumberText}>Photo {idx + 1}</Text>
                </View>
                <TouchableOpacity
                  style={styles.removePhotoBtn}
                  onPress={() => handleRemovePhoto(idx)}
                >
                  <Text style={styles.removePhotoText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noPhotosText}>
            No photos uploaded yet. Please upload 2 to 6 photos.
          </Text>
        )}

        {/* Direct Device Upload if < 6 */}
        {photoUrls.length < 6 && (
          <TouchableOpacity style={styles.pickPhotoBtn} onPress={pickPhotos}>
            <Text style={styles.pickPhotoBtnText}>📷 Upload Photos from Device</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Section 3: Initial Pitch & Rates */}
      <InitialCourtSection
        {...{
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
        }}
      />

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && { opacity: 0.6 }]}
          disabled={isSubmitting}
          onPress={handleSubmit}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#0f172a" />
          ) : (
            <Text style={styles.submitButtonText}>
              Send Venue & Photos for Super Admin Approval
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.signOutButton,
            {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 14,
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderWidth: 1,
              borderColor: 'rgba(248, 113, 113, 0.3)',
              marginTop: 10,
            },
          ]}
          onPress={onSignOut}
          activeOpacity={0.8}
        >
          <SignOutIcon color="#fca5a5" size={16} />
          <Text style={[styles.signOutText, { color: '#fca5a5', fontWeight: '800', fontSize: 13 }]}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
