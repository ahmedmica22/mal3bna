import { StatePanel } from '../../components/feedback/StatePanel';
import { useAdminBookingsPage } from '../../features/admin/bookings/hooks/useAdminBookingsPage';
import { AdminBookingsContent } from '../../features/admin/bookings/views/AdminBookingsContent';

export function AdminBookingsPage() {
  const state = useAdminBookingsPage();
  switch (state.view) {
    case 'Loading': {
      const { translate } = state.props;
      return <StatePanel title={translate('Loading all court bookings…')} />;
    }
    case 'Error': {
      const { bookings, translate } = state.props;
      return (
        <StatePanel
          title={translate('Bookings could not be loaded.')}
          action={
            <button className="button" onClick={() => void bookings.refetch()} type="button">
              {translate('Try again')}
            </button>
          }
        />
      );
    }
    case 'Content':
      return <AdminBookingsContent {...state.props} />;
  }
}
