import { View } from 'react-native';
import {
  AppSheet,
  Panel,
  Title,
  Copy,
  Action,
  useMobileDesign,
} from '../../../components/common/MobileDesign';
import type { SettingsModalContentProps } from '../types';
export function SettingsModalContent(p: SettingsModalContentProps) {
  const { t } = useMobileDesign();
  if (!p.visible) return null;
  return (
    <AppSheet title={t('settings')} onClose={p.onClose}>
      <Panel>
        <Title small>{p.userName ?? 'mal3bna'}</Title>
        {p.userEmail && <Copy>{p.userEmail}</Copy>}
        <Copy>{p.userRole ? t(p.userRole === 'owner' ? 'owner' : 'player') : ''}</Copy>
      </Panel>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Action
            label={t('dark')}
            secondary={p.themeMode !== 'dark'}
            onPress={() => p.onToggleTheme('dark')}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Action
            label={t('light')}
            secondary={p.themeMode !== 'light'}
            onPress={() => p.onToggleTheme('light')}
          />
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Action
            label="English"
            secondary={p.lang !== 'en'}
            onPress={() => p.onToggleLang('en')}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Action
            label="العربية"
            secondary={p.lang !== 'ar'}
            onPress={() => p.onToggleLang('ar')}
          />
        </View>
      </View>
      {p.onOpenAccount && <Action label={t('account')} onPress={p.onOpenAccount} />}
      {p.onSignOut && (
        <Action
          secondary
          label={p.t.signOut ?? 'Sign out'}
          onPress={() => {
            p.onSignOut?.();
            p.onClose();
          }}
        />
      )}
    </AppSheet>
  );
}
