export interface ManagePhotosModalProps {
  visible: boolean;
  venueId: string;
  initialPhotos?: string[];
  token: string | null;
  onClose: () => void;
  onPhotosUpdated: () => void;
  onToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, msg: string) => void;
}
