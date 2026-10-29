import { Venue, Court, AvailabilitySlot } from '../../../types/domain';
import type { SlotRun } from '../../../utils/slots';

export interface VenueCheckoutDetails {
  court: Court;
  startsAt: string;
  hours: number;
  totalPiastres: number;
  depositPiastres: number;
  dueAtVenuePiastres: number;
  runs: SlotRun[];
  selectedSlots: AvailabilitySlot[];
}

export interface VenueDetailModalProps {
  venue: Venue | null;
  selectedCourt: Court | null;
  onSelectCourt: (court: Court) => void;
  onProceedToCheckout: (details: VenueCheckoutDetails) => void;
  onClose: () => void;
}
