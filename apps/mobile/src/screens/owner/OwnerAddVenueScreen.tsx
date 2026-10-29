import type { OwnerAddVenueScreenProps } from '../../features/owner/venue-onboarding/contracts';
import { useOwnerAddVenueScreen } from '../../features/owner/venue-onboarding/hooks/useOwnerAddVenueScreen';
import { OwnerAddVenueScreenContent } from '../../features/owner/venue-onboarding/views/OwnerAddVenueScreenContent';
export function OwnerAddVenueScreen(props: OwnerAddVenueScreenProps) {
  const state = useOwnerAddVenueScreen(props);
  switch (state.view) {
    case 'Content':
      return <OwnerAddVenueScreenContent {...state.props} />;
  }
}
