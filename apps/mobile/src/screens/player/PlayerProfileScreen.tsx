import type { PlayerProfileScreenProps } from '../../features/player/profile/contracts';
import { createPlayerProfileScreenModel } from '../../features/player/profile/model/createPlayerProfileScreenModel';
import { PlayerProfileScreenContent } from '../../features/player/profile/views/PlayerProfileScreenContent';
export function PlayerProfileScreen(props: PlayerProfileScreenProps) {
  const state = createPlayerProfileScreenModel(props);
  switch (state.view) {
    case 'Content':
      return <PlayerProfileScreenContent {...state.props} />;
  }
}
