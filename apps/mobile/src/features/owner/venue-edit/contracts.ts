import { Venue } from '../../../types/domain';
export interface EditVenueModalProps {
  visible: boolean;
  venue: Venue | null;
  token: string | null;
  onClose: () => void;
  onVenueUpdated: () => void;
  onToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, msg: string) => void;
}
