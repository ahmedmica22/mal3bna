import { Text, View, TouchableOpacity, Image } from 'react-native';
import { SignOutIcon } from '../../../../components/common/TabIcons';
import type { OwnerHeroBannerContentProps } from '../types';
export function OwnerHeroBannerContent({
  isApproved,
  isPending,
  isRtl,
  lang,
  onAddCourt,
  onAddWalkIn,
  onEditVenue,
  onLockMaintenance,
  onOpenPhotos,
  onSignOut,
  onUploadPhoto,
  ownerProfile,
  styles,
  t,
  theme,
  venue,
}: OwnerHeroBannerContentProps) {
  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.cardBorder,
        },
      ]}
    >
      {/* Owner Profile Header Row */}
      <View style={[styles.profileRow, isRtl && styles.rowRtl]}>
        <TouchableOpacity
          style={styles.avatarTouchable}
          onPress={onUploadPhoto}
          activeOpacity={0.8}
          disabled={!onUploadPhoto}
        >
          {ownerProfile?.photoUrl ? (
            <Image
              source={{ uri: ownerProfile.photoUrl }}
              style={[styles.avatarImg, { borderColor: theme.colors.lime }]}
            />
          ) : (
            <View
              style={[
                styles.avatarFallback,
                { backgroundColor: theme.colors.limeGlow, borderColor: theme.colors.limeBorder },
              ]}
            >
              <Text style={[styles.avatarInitial, { color: theme.colors.lime }]}>
                {ownerProfile?.name ? ownerProfile.name.charAt(0).toUpperCase() : 'O'}
              </Text>
            </View>
          )}
          {onUploadPhoto && (
            <View style={[styles.cameraBadge, { backgroundColor: theme.colors.lime }]}>
              <Text style={styles.cameraIcon}>📷</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={[styles.profileInfo, { alignItems: isRtl ? 'flex-end' : 'flex-start' }]}>
          <Text style={[styles.ownerNameText, { color: theme.colors.textPrimary }]}>
            {ownerProfile?.name ?? t.courtOwner}
          </Text>
          <Text style={[styles.ownerRoleText, { color: theme.colors.textMuted }]} numberOfLines={1}>
            {ownerProfile?.email ?? 'Verified Venue Partner'}
          </Text>
          {onUploadPhoto && (
            <TouchableOpacity onPress={onUploadPhoto} style={styles.changePhotoLink}>
              <Text style={[styles.changePhotoLinkText, { color: theme.colors.lime }]}>
                {t.changePhoto}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {onSignOut && (
          <TouchableOpacity
            style={[
              styles.signOutBtn,
              {
                flexDirection: isRtl ? 'row-reverse' : 'row',
                alignItems: 'center',
                gap: 6,
                paddingHorizontal: 12,
                paddingVertical: 7,
                borderRadius: 12,
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                borderWidth: 1,
                borderColor: 'rgba(248, 113, 113, 0.35)',
              },
            ]}
            onPress={onSignOut}
            activeOpacity={0.8}
          >
            <SignOutIcon color="#fca5a5" size={13} />
            <Text style={[styles.signOutBtnText, { color: '#fca5a5', fontWeight: '800' }]}>
              {t.signOut}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={[styles.badgeRow, isRtl && styles.rowRtl]}>
        <View
          style={[
            styles.eyebrowChip,
            { backgroundColor: theme.colors.limeGlow, borderColor: theme.colors.limeBorder },
          ]}
        >
          <Text style={[styles.eyebrowText, { color: theme.colors.lime }]}>{t.venueOps}</Text>
        </View>

        {isApproved ? (
          <View style={styles.approvedBadge}>
            <Text style={styles.approvedBadgeText}>{t.approvedPublic}</Text>
          </View>
        ) : isPending ? (
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingBadgeText}>
              ⏳ {lang === 'ar' ? 'قيد المراجعة من المشرف' : 'Pending Admin Review'}
            </Text>
          </View>
        ) : (
          <View style={styles.draftBadge}>
            <Text style={styles.draftBadgeText}>Draft Venue</Text>
          </View>
        )}

        {onOpenPhotos && (
          <TouchableOpacity style={styles.editPill} onPress={onOpenPhotos}>
            <Text style={styles.editPillText}>📸 Photos</Text>
          </TouchableOpacity>
        )}
        {onEditVenue && (
          <TouchableOpacity style={styles.editPill} onPress={onEditVenue}>
            <Text style={styles.editPillText}>✏️ Edit Details</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text
        style={[
          styles.venueTitle,
          { color: theme.colors.textPrimary, textAlign: isRtl ? 'right' : 'left' },
        ]}
      >
        {venue?.name ?? 'My Venue'}
      </Text>
      <Text
        style={[
          styles.venueSub,
          { color: theme.colors.textMuted, textAlign: isRtl ? 'right' : 'left' },
        ]}
      >
        📍 {venue?.address ?? 'Cairo, Egypt'} • {venue?.courts?.length ?? 0} {t.pitchesCount} •{' '}
        {t.cairoTime}
      </Text>

      {venue?.description ? (
        <Text
          style={[
            styles.venueDesc,
            { color: theme.colors.textMuted, textAlign: isRtl ? 'right' : 'left' },
          ]}
          numberOfLines={2}
        >
          {venue.description}
        </Text>
      ) : null}

      <View style={[styles.actionRow, isRtl && styles.rowRtl]}>
        <TouchableOpacity
          style={[styles.primaryAction, { backgroundColor: theme.colors.lime }]}
          onPress={onAddWalkIn}
        >
          <Text
            style={[
              styles.primaryActionText,
              { color: theme.mode === 'dark' ? '#0f172a' : '#ffffff' },
            ]}
          >
            {t.walkInBooking}
          </Text>
        </TouchableOpacity>

        {onAddCourt && (
          <TouchableOpacity style={styles.secondaryAction} onPress={onAddCourt}>
            <Text style={[styles.secondaryActionText, { color: theme.colors.lime }]}>
              {t.addPitch}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.subtleAction} onPress={onLockMaintenance}>
          <Text style={styles.subtleActionText}>{t.lockSlot}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
