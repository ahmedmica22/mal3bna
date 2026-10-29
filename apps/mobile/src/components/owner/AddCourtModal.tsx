import type { AddCourtModalProps } from '../../features/owner/courts/contracts';
import { useAddCourtModal } from '../../features/owner/courts/hooks/useAddCourtModal';
import { AddCourtModalContent } from '../../features/owner/courts/views/AddCourtModalContent';
export function AddCourtModal(props: AddCourtModalProps) {
  const state = useAddCourtModal(props);
  switch (state.view) {
    case 'Content':
      return <AddCourtModalContent {...state.props} />;
  }
}
