import type { ManagePhotosModalProps } from '../../features/owner/photos/contracts';
import { useManagePhotosModal } from '../../features/owner/photos/hooks/useManagePhotosModal';
import { ManagePhotosModalContent } from '../../features/owner/photos/views/ManagePhotosModalContent';
export function ManagePhotosModal(props: ManagePhotosModalProps) {
  const state = useManagePhotosModal(props);
  switch (state.view) {
    case 'Content':
      return <ManagePhotosModalContent {...state.props} />;
  }
}
