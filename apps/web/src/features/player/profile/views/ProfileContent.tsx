import type { ProfileContentProps } from '../types';
import { ProfileHeader } from '../components/ProfileHeader';
import { ProfileTrustStrikesBanner } from '../components/ProfileTrustStrikesBanner';
import { ProfilePersonalInfoCard } from '../components/ProfilePersonalInfoCard';
import { ProfilePlayerSportsPreferencesForm } from '../components/ProfilePlayerSportsPreferencesForm';
import { ProfileDangerZoneCard } from '../components/ProfileDangerZoneCard';

export function ProfileContent({
  activeStrikes,
  appealMessage,
  appealSubmitted,
  footOptions,
  handleAppeal,
  handleDeleteAccount,
  handlePhotoUpload,
  handleSave,
  isBlocked,
  isDeletingAccount,
  isSaving,
  isSubmittingAppeal,
  isUploadingPhoto,
  padelLevel,
  padelOptions,
  photoUrl,
  playingStyle,
  position1,
  preferredFoot,
  saveSuccess,
  setAppealMessage,
  setPadelLevel,
  setPlayingStyle,
  setPosition1,
  setPreferredFoot,
  setShowDeleteModal,
  showDeleteModal,
  styleOptions,
  translate,
  user,
  name,
  setName,
  phone,
  setPhone,
  isEditingInfo,
  setIsEditingInfo,
  isSavingInfo,
  handleSaveAccountInfo,
  hasActiveBookings,
  activeBookingsCount,
}: ProfileContentProps) {
  return (
    <main className="page w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-8 space-y-6">
      {/* Header with Avatar Upload */}
      <ProfileHeader {...{ handlePhotoUpload, isUploadingPhoto, photoUrl, translate, user }} />

      {/* Trust & Strikes Banner */}
      <ProfileTrustStrikesBanner
        {...{
          activeStrikes,
          appealMessage,
          appealSubmitted,
          handleAppeal,
          isBlocked,
          isSubmittingAppeal,
          setAppealMessage,
          translate,
        }}
      />

      {/* Account Info Cards */}
      <ProfilePersonalInfoCard
        user={user}
        translate={translate}
        onSave={async (data) => {
          setName(data.name);
          setPhone(data.phone ?? '');
          await handleSaveAccountInfo();
        }}
      />

      {/* Player Sports Preferences Form */}
      <ProfilePlayerSportsPreferencesForm
        {...{
          footOptions,
          handleSave,
          isSaving,
          padelLevel,
          padelOptions,
          playingStyle,
          position1,
          preferredFoot,
          saveSuccess,
          setPadelLevel,
          setPlayingStyle,
          setPosition1,
          setPreferredFoot,
          styleOptions,
          translate,
        }}
      />

      {/* Danger Zone: Delete Account */}
      <ProfileDangerZoneCard
        translate={translate}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        isDeletingAccount={isDeletingAccount}
        handleDeleteAccount={handleDeleteAccount}
        hasActiveBookings={hasActiveBookings}
        activeBookingsCount={activeBookingsCount}
      />
    </main>
  );
}
