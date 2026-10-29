import { StatePanel } from '../../components/feedback/StatePanel';
import { useOwnerProfilePage } from '../../features/owner/profile/hooks/useOwnerProfilePage';
import { OwnerProfileContent } from '../../features/owner/profile/views/OwnerProfileContent';

export function OwnerProfilePage() {
  const state = useOwnerProfilePage();
  switch (state.view) {
    case 'Loading': {
      const { translate } = state.props;
      return <StatePanel title={translate('Loading owner profile…')} />;
    }
    case 'Content':
      return <OwnerProfileContent {...state.props} />;
  }
}
