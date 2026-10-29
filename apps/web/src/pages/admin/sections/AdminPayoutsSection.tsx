import { StatePanel } from '../../../components/feedback/StatePanel';
import { useAdminPayoutsSection } from '../../../features/admin/payouts/hooks/useAdminPayoutsSection';
import { AdminPayoutsSectionContent } from '../../../features/admin/payouts/views/AdminPayoutsSectionContent';

export function AdminPayoutsSection() {
  const state = useAdminPayoutsSection();
  switch (state.view) {
    case 'Loading': {
      const { translate } = state.props;
      return <StatePanel title={translate('Loading payouts & ledger…')} />;
    }
    case 'Content':
      return <AdminPayoutsSectionContent {...state.props} />;
  }
}
