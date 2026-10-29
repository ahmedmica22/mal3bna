import { styles } from '../styles';
import type { PlayerProfileScreenProps } from '../contracts';
import * as ImagePicker from 'expo-image-picker';
import { translations } from '../../../../constants/translations';
export function createPlayerProfileScreenModel({
  userName,
  userPhone,
  userEmail,
  photoUrl,
  preferredFoot,
  playingStyle,
  padelLevel,
  onPhotoUploaded,
  onOpenSelectFoot,
  onOpenSelectStyle,
  onOpenSelectLevel,
  onUpdateProfile,
  theme,
  themeMode,
  lang,
  onToggleTheme,
  onToggleLang,
  onLogout,
  onDeleteAccount,
  activeStrikesCount,
}: PlayerProfileScreenProps) {
  const t = translations[lang];
  const isRtl = lang === 'ar';

  async function pickProfilePhoto() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: false,
      quality: 0.7,
      base64: true,
    });
    if (!result.canceled && result.assets && result.assets[0]) {
      const asset = result.assets[0];
      const dataUrl = asset.base64 ? `data:${asset.mimeType ?? 'image/jpeg'};base64,${asset.base64}` : asset.uri;
      onPhotoUploaded(dataUrl);
    }
  }

  return {
    view: 'Content',
    props: {
      isRtl,
      lang,
      userName,
      userPhone,
      userEmail,
      onUpdateProfile,
      onLogout,
      onDeleteAccount,
      onOpenSelectFoot,
      onOpenSelectLevel,
      onOpenSelectStyle,
      onToggleLang,
      onToggleTheme,
      padelLevel,
      photoUrl,
      pickProfilePhoto,
      playingStyle,
      preferredFoot,
      styles,
      t,
      theme,
      themeMode,
      activeStrikesCount: activeStrikesCount ?? 0,
    },
  } as const;
}
