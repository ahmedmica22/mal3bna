import { ScrollView } from 'react-native';
import type { PlayerProfileScreenContentProps } from '../types';
import { PlayerProfileAvatarHeader } from '../components/PlayerProfileAvatarHeader';
import { PlayerProfileDetailsCard } from '../components/PlayerProfileDetailsCard';
import { PlayerProfilePreferencesCard } from '../components/PlayerProfilePreferencesCard';
import { PlayerProfileScreenAppSettingsCard } from '../components/PlayerProfileScreenAppSettingsCard';
import { PlayerProfileSignoutCard } from '../components/PlayerProfileSignoutCard';
import { StrikeWarningCard } from '../components/StrikeWarningCard';

export function PlayerProfileScreenContent({
  isRtl,
  lang,
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
  userName,
  userPhone,
  userEmail,
  onUpdateProfile,
  activeStrikesCount,
}: PlayerProfileScreenContentProps) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Avatar & Basic Identity */}
      <PlayerProfileAvatarHeader
        userName={userName}
        userEmail={userEmail}
        photoUrl={photoUrl}
        pickProfilePhoto={pickProfilePhoto}
        isRtl={isRtl}
        theme={theme}
        styles={styles}
        profileTitle={t.profileTitle}
        uploadPhotoText={t.uploadPhoto}
      />

      {/* Personal Info Edit Card */}
      <PlayerProfileDetailsCard
        userName={userName}
        userPhone={userPhone}
        userEmail={userEmail}
        isRtl={isRtl}
        lang={lang}
        theme={theme}
        themeMode={themeMode}
        styles={styles}
        onUpdateProfile={onUpdateProfile}
      />

      {/* Strikes Warning Meter */}
      <StrikeWarningCard count={activeStrikesCount} />

      {/* Sports & Play Attributes */}
      <PlayerProfilePreferencesCard
        preferredFoot={preferredFoot}
        playingStyle={playingStyle}
        padelLevel={padelLevel}
        onOpenSelectFoot={onOpenSelectFoot}
        onOpenSelectStyle={onOpenSelectStyle}
        onOpenSelectLevel={onOpenSelectLevel}
        isRtl={isRtl}
        theme={theme}
        styles={styles}
        title={t.playerAttributes}
        labels={{
          preferredFoot: t.preferredFoot,
          playingStyle: t.playingStyle,
          padelLevel: t.padelLevel,
        }}
      />

      {/* App Theme & Language Settings */}
      <PlayerProfileScreenAppSettingsCard
        {...{ isRtl, lang, onToggleLang, onToggleTheme, styles, t, theme, themeMode }}
      />

      {/* Signout & Account Actions */}
      <PlayerProfileSignoutCard
        onLogout={onLogout}
        onDeleteAccount={onDeleteAccount}
        isRtl={isRtl}
        themeMode={themeMode}
        signOutText={t.signOut}
        deleteAccountText={t.deleteAccount}
        deleteAccountConfirmText={t.deleteAccountConfirm}
      />
    </ScrollView>
  );
}
