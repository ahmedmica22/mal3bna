import { ThemeType, ThemeMode } from '../../../constants/theme';
import { Language } from '../../../constants/translations';
export interface PlayerProfileScreenProps {
  userName: string;
  userPhone?: string;
  userEmail?: string;
  onUpdateProfile?: (data: { name?: string; phone?: string | null }) => Promise<unknown>;
  photoUrl?: string | null;
  preferredFoot: string;
  playingStyle: string;
  padelLevel: string;
  onPhotoUploaded: (url: string) => void;
  onOpenSelectFoot: () => void;
  onOpenSelectStyle: () => void;
  onOpenSelectLevel: () => void;
  theme: ThemeType;
  themeMode: ThemeMode;
  lang: Language;
  onToggleTheme: (mode: ThemeMode) => void;
  onToggleLang: (lang: Language) => void;
  onLogout: () => void;
  onDeleteAccount?: () => void;
  hasActiveBookings?: boolean;
  activeStrikesCount?: number;
}
