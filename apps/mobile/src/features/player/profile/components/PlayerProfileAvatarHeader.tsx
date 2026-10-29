import { View, Text, TouchableOpacity, Image } from 'react-native';
import type { ThemeType } from '../../../../constants/theme';
import type { PlayerProfileStyles } from '../styles';

interface PlayerProfileAvatarHeaderProps {
  userName: string;
  userEmail?: string | undefined;
  photoUrl?: string | null | undefined;
  pickProfilePhoto: () => void;
  isRtl: boolean;
  theme: ThemeType;
  styles: PlayerProfileStyles;
  profileTitle: string;
  uploadPhotoText: string;
}

export function PlayerProfileAvatarHeader({
  userName,
  userEmail,
  photoUrl,
  pickProfilePhoto,
  isRtl,
  theme,
  styles,
  profileTitle,
  uploadPhotoText,
}: PlayerProfileAvatarHeaderProps) {
  return (
    <View style={[styles.avatarHeader, isRtl && styles.rowRtl]}>
      <View style={styles.avatarContainer}>
        {photoUrl ? (
          <Image
            source={{ uri: photoUrl }}
            style={[styles.avatarImage, { borderColor: theme.colors.lime }]}
          />
        ) : (
          <View
            style={[
              styles.avatarFallback,
              {
                backgroundColor: theme.colors.cardSecondary,
                borderColor: theme.colors.cardBorder,
              },
            ]}
          >
            <Text style={[styles.avatarInitial, { color: theme.colors.lime }]}>
              {userName ? userName.charAt(0).toUpperCase() : 'P'}
            </Text>
          </View>
        )}
        <TouchableOpacity
          style={[styles.avatarBadge, { backgroundColor: theme.colors.lime }]}
          onPress={pickProfilePhoto}
        >
          <Text style={styles.avatarBadgeText}>📷</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.headerInfo, { alignItems: isRtl ? 'flex-end' : 'flex-start' }]}>
        <Text style={[styles.eyebrow, { color: theme.colors.lime }]}>{profileTitle}</Text>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{userName}</Text>
        {userEmail ? (
          <Text style={{ color: theme.colors.textSecondary, fontSize: 12, marginTop: 2 }}>
            {userEmail}
          </Text>
        ) : null}
        <TouchableOpacity
          style={[
            styles.changePhotoBtn,
            { backgroundColor: theme.colors.limeGlow, borderColor: theme.colors.limeBorder },
          ]}
          onPress={pickProfilePhoto}
        >
          <Text style={[styles.changePhotoBtnText, { color: theme.colors.lime }]}>
            {uploadPhotoText}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
