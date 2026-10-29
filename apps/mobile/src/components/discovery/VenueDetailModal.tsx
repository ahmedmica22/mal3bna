import type { VenueDetailModalProps } from '../../features/player/venue-details/contracts';
import { useVenueDetailModal } from '../../features/player/venue-details/hooks/useVenueDetailModal';
import { VenueDetailModalContent } from '../../features/player/venue-details/views/VenueDetailModalContent';
export function VenueDetailModal(props: VenueDetailModalProps) {
  const state = useVenueDetailModal(props);
  if (!state) return null;
  switch (state.view) {
    case 'Content':
      return <VenueDetailModalContent {...state.props} />;
  }
}
