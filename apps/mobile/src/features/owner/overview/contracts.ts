import { Venue, OwnerProfileData } from '../../../types/domain';
import { ThemeType } from '../../../constants/theme';
import { Language } from '../../../constants/translations';
export interface OwnerHeroBannerProps {
  venue: Venue | null;
  ownerProfile?: OwnerProfileData | null;
  onUploadPhoto?: () => void;
  onSignOut?: () => void;
  onAddWalkIn: () => void;
  onLockMaintenance: () => void;
  onAddCourt?: () => void;
  onEditVenue?: () => void;
  onOpenPhotos?: () => void;
  theme?: ThemeType;
  lang?: Language;
}
