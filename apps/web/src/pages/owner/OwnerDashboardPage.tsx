import { StatePanel } from '../../components/feedback/StatePanel';
import { useOwnerDashboardPage } from '../../features/owner/dashboard/hooks/useOwnerDashboardPage';
import { OwnerDashboardContent } from '../../features/owner/dashboard/views/OwnerDashboardContent';

export function OwnerDashboardPage() {
  const state = useOwnerDashboardPage();
  switch (state.view) {
    case 'Loading': {
      const { translate } = state.props;
      return <StatePanel title={translate('Loading venue dashboard…')} />;
    }
    case 'Content':
      return <OwnerDashboardContent {...state.props} />;
    case 'Error':
      return <StatePanel title={state.props.translate('Unable to load your venue dashboard')} action={<button type="button" onClick={state.props.refresh} className="button">{state.props.translate('Retry')}</button>}>{state.props.translate('Check your connection and try again.')}</StatePanel>;
  }
}
