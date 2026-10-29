import { styles } from '../styles';
import type { SettingsModalProps } from '../contracts';
import { translations } from '../../../constants/translations';
export function createSettingsModalModel({
  visible,
  onOpenAccount,
  theme,
  themeMode,
  lang,
  userName,
  userEmail,
  userRole,
  onToggleTheme,
  onToggleLang,
  onSignOut,
  onClose,
}: SettingsModalProps) {
  const t = translations[lang];
  const isRtl = lang === 'ar';

  return {
    view: 'Content',
    props: {
      isRtl,
      lang,
      onClose,
      onSignOut,
      onToggleLang,
      onToggleTheme,
      styles,
      t,
      theme,
      themeMode,
      userEmail,
      userName,
      userRole,
      visible,
      onOpenAccount,
    },
  } as const;
}
