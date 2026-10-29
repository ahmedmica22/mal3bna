import { styles } from '../styles';
import type { OwnerHeroBannerProps } from '../contracts';
import { Theme } from '../../../../constants/theme';
import { translations } from '../../../../constants/translations';
export function createOwnerHeroBannerModel({
  venue,
  ownerProfile,
  onUploadPhoto,
  onSignOut,
  onAddWalkIn,
  onLockMaintenance,
  onAddCourt,
  onEditVenue,
  onOpenPhotos,
  theme = Theme,
  lang = 'en',
}: OwnerHeroBannerProps) {
  const isApproved = venue?.status === 'approved';
  const isPending = venue?.status === 'pending';
  const t = translations[lang];
  const isRtl = lang === 'ar';

  return {
    view: 'Content',
    props: {
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
    },
  } as const;
}
