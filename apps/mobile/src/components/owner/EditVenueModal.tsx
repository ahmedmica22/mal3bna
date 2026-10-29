import type { EditVenueModalProps } from '../../features/owner/venue-edit/contracts';
import { useEditVenueModal } from '../../features/owner/venue-edit/hooks/useEditVenueModal';
import { EditVenueModalContent } from '../../features/owner/venue-edit/views/EditVenueModalContent';
export function EditVenueModal(props: EditVenueModalProps) {
  const state = useEditVenueModal(props);
  switch (state.view) {
    case 'Content':
      return <EditVenueModalContent {...state.props} />;
  }
}
