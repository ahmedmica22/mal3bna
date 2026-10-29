import { StatePanel } from '../../../components/feedback/StatePanel';
import { useAdminStuckSection } from '../../../features/admin/reconciliation/hooks/useAdminStuckSection';
import { AdminStuckSectionContent } from '../../../features/admin/reconciliation/views/AdminStuckSectionContent';

export function AdminStuckSection() {
  const state = useAdminStuckSection();
  switch (state.view) {
    case 'Loading': {
      const { translate } = state.props;
      return <StatePanel title={translate('Loading reconciliation items…')} />;
    }
    case 'Content':
      return <AdminStuckSectionContent {...state.props} />;
  }
}
