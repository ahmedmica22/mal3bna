import { OwnerPendingBanner } from '../../components/owner/OwnerPendingBanner';
import { StatePanel } from '../../components/feedback/StatePanel';
import { useOwnerVenuePage } from '../../features/owner/venue/hooks/useOwnerVenuePage';
import { OwnerVenueOnboarding } from '../../features/owner/venue/views/OwnerVenueOnboarding';
import { OwnerVenueContent } from '../../features/owner/venue/views/OwnerVenueContent';

export function OwnerVenuePage() {
  const state = useOwnerVenuePage();
  switch (state.view) {
    case 'Loading': {
      const { translate } = state.props;
      return <StatePanel title={translate('Loading venue setup…')} />;
    }
    case 'Pending': {
      const { meQuery, toast, translate, user, venueQuery } = state.props;
      return (
        <OwnerPendingBanner
          userName={user?.name}
          onRefresh={() => {
            void meQuery.refetch();
            void venueQuery.refetch();
            toast.info(translate('Checking approval status...'), translate('Status Check'));
          }}
        />
      );
    }
    case 'Onboarding':
      return <OwnerVenueOnboarding {...state.props} />;
    case 'Content':
      return <OwnerVenueContent {...state.props} />;
  }
}
