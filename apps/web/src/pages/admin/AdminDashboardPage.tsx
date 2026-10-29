import { StatePanel } from '../../components/feedback/StatePanel';
import { useAdminDashboardPage } from '../../features/admin/dashboard/hooks/useAdminDashboardPage';
import { AdminDashboardContent } from '../../features/admin/dashboard/views/AdminDashboardContent';

export function AdminDashboardPage() {
  const state = useAdminDashboardPage();
  switch (state.view) {
    case 'Loading': {
      const { translate } = state.props;
      return <StatePanel title={translate('Loading super admin dashboard…')} />;
    }
    case 'Content':
      return <AdminDashboardContent {...state.props} />;
  }
}
