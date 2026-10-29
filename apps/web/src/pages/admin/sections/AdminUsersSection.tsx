import { StatePanel } from '../../../components/feedback/StatePanel';
import { useAdminUsersSection } from '../../../features/admin/users/hooks/useAdminUsersSection';
import { AdminUsersSectionContent } from '../../../features/admin/users/views/AdminUsersSectionContent';

export function AdminUsersSection() {
  const state = useAdminUsersSection();
  switch (state.view) {
    case 'Loading': {
      const { translate } = state.props;
      return <StatePanel title={translate('Loading users…')} />;
    }
    case 'Content':
      return <AdminUsersSectionContent {...state.props} />;
  }
}
