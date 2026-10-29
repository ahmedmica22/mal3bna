export interface OwnerAddVenueScreenProps {
  token: string | null;
  ownerName?: string;
  onVenueCreated: () => void;
  onSignOut: () => void;
  onToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, msg: string) => void;
}
