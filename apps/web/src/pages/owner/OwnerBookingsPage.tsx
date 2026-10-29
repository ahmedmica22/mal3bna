import { StatePanel } from '../../components/feedback/StatePanel';
import { useOwnerBookingsPage } from '../../features/owner/bookings/hooks/useOwnerBookingsPage';
import { OwnerBookingsContent } from '../../features/owner/bookings/views/OwnerBookingsContent';

export function OwnerBookingsPage() {
  const state = useOwnerBookingsPage();
  switch (state.view) {
    case 'Loading': {
      const { translate } = state.props;
      return <StatePanel title={translate('Loading match-day operations…')} />;
    }
    case 'Content':
      return <OwnerBookingsContent {...state.props} />;
  }
}
