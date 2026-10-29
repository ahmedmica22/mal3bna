export type AvailabilitySlot = {
  startsAt: string;
  endsAt: string;
  status?: 'available' | 'held' | 'booked' | 'past';
  available?: boolean;
  pricePiastres?: number;
};

export type Booking = {
  isTestPayment?: boolean;
  id: string;
  bookingCode: string;
  createdAt?: string;
  status:
    | 'held'
    | 'confirmed'
    | 'arrived'
    | 'completed'
    | 'no_show_pending'
    | 'no_show'
    | 'cancelled'
    | 'expired';
  courtId: string;
  courtName?: string;
  sport?: 'football' | 'padel';
  size?: number | null;
  venueId: string;
  venueName?: string;
  venueAddress?: string;
  startsAt: string;
  endsAt: string;
  totalPiastres: number;
  depositPiastres: number;
  paidPiastres?: number;
  dueAtVenuePiastres?: number;
  venueCollectedAt?: string | null;
  paymentOption?: 'deposit' | 'full';
  holdExpiresAt?: string | null;
  dispute?: { id: string; status: string; playerMessage?: string } | null;
  review?: { id: string; rating: number; comment?: string } | null;
};
