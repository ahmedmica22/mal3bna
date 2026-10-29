export interface AddCourtModalProps {
  visible: boolean;
  venueId: string;
  token: string | null;
  onClose: () => void;
  onCourtAdded: () => void;
  onToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, msg: string) => void;
}
