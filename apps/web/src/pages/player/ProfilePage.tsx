import { StatePanel } from '../../components/feedback/StatePanel';
import { useProfilePage } from '../../features/player/profile/hooks/useProfilePage';
import { ProfileContent } from '../../features/player/profile/views/ProfileContent';

export function ProfilePage() {
  const state = useProfilePage();
  switch (state.view) {
    case 'Loading': {
      const { translate } = state.props;
      return <StatePanel title={translate('Loading profile…')} />;
    }
    case 'Content':
      return <ProfileContent {...state.props} />;
  }
}
