import type { SettingsModalProps } from '../../features/settings/contracts';
import { createSettingsModalModel } from '../../features/settings/model/createSettingsModalModel';
import { SettingsModalContent } from '../../features/settings/views/SettingsModalContent';
export function SettingsModal(props: SettingsModalProps) {
  const state = createSettingsModalModel(props);
  switch (state.view) {
    case 'Content':
      return <SettingsModalContent {...state.props} />;
  }
}
