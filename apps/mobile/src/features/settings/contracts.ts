import { ThemeType, ThemeMode } from '../../constants/theme';
import { Language } from '../../constants/translations';
export interface SettingsModalProps {
  visible: boolean;
  theme: ThemeType;
  themeMode: ThemeMode;
  lang: Language;
  userName?: string | null;
  userEmail?: string | null;
  userRole?: string | null;
  onToggleTheme: (mode: ThemeMode) => void;
  onToggleLang: (lang: Language) => void;
  onSignOut?: () => void;
  onClose: () => void;
  onOpenAccount?: () => void;
}
