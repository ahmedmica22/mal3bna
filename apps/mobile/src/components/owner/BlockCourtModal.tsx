import { WalkInModal } from './WalkInModal';
import type { WalkInInput } from '../../hooks/useWalkInForm';
import type { Venue } from '../../types/domain';
export function BlockCourtModal(props: {
  visible: boolean;
  venue?: Venue | null;
  onConfirm: (input: WalkInInput) => Promise<boolean>;
  onClose: () => void;
}) {
  return <WalkInModal {...props} block />;
}
