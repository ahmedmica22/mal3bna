import { StatePanel } from '../../../components/feedback/StatePanel';
import { useAdminDisputesSection } from '../../../features/admin/disputes/hooks/useAdminDisputesSection';
import { AdminDisputesSectionContent } from '../../../features/admin/disputes/views/AdminDisputesSectionContent';

export function AdminDisputesSection() {
  const state = useAdminDisputesSection();
  switch (state.view) {
    case 'Loading': {
      const { translate } = state.props;
      return <StatePanel title={translate('Loading disputes and appeals…')} />;
    }
    case 'Content':
      return <AdminDisputesSectionContent {...state.props} />;
  }
}
