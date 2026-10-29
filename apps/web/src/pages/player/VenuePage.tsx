import { StatePanel } from '../../components/feedback/StatePanel';
import { useVenuePage } from '../../features/player/venues/hooks/useVenuePage';
import { VenueContent } from '../../features/player/venues/views/VenueContent';

export function VenuePage() {
  const state = useVenuePage();
  switch (state.view) {
    case 'Loading': {
      const { translate } = state.props;
      return <StatePanel title={translate('Loading venue details…')} />;
    }
    case 'Unavailable': {
      const { translate } = state.props;
      return <StatePanel title={translate('Venue unavailable.')} />;
    }
    case 'Content':
      return <VenueContent {...state.props} />;
  }
}
