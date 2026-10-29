import { useSettingsPage } from '../../features/player/settings/hooks/useSettingsPage';
import { SettingsContent } from '../../features/player/settings/views/SettingsContent';

export function SettingsPage() {
  const state = useSettingsPage();
  switch (state.view) {
    case 'Content':
      return <SettingsContent {...state.props} />;
  }
}
