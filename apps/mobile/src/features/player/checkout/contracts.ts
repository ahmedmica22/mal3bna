import { Venue, Court, AvailabilitySlot } from '../../../types/domain';
import type { SlotRun } from '../../../utils/slots';

export interface CheckoutModalProps {
  visible: boolean;
  pendingBooking?: boolean;
  paymentError?: string;
  confirmedCode: string | null;
  venue: Venue | null;
  court: Court | null;
  startsAt: string;
  hours: number;
  totalPiastres: number;
  depositPiastres: number;
  dueAtVenuePiastres: number;
  runs?: SlotRun[];
  selectedSlots?: AvailabilitySlot[];
  paymentOption: 'deposit' | 'full';
  onSelectPaymentOption: (opt: 'deposit' | 'full') => void;
  holdSeconds: number;
  isSubmitting: boolean;
  onSubmit: () => void;
  onSuccessDone: () => void;
  onClose: () => void;
}
