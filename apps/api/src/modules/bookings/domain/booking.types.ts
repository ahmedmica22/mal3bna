export type PaymentOption = 'deposit' | 'full';
export type ReservationStatus =
  | 'held'
  | 'confirmed'
  | 'arrived'
  | 'completed'
  | 'no_show_pending'
  | 'no_show'
  | 'expired'
  | 'cancelled';
export interface BookingInput {
  playerId: string;
  courtId: string;
  venueId: string;
  startsAt: Date;
  hours: number;
  totalPiastres: number;
  depositPiastres: number;
  paymentOption: PaymentOption;
}
export interface Reservation {
  id: string;
  bookingCode: string;
  playerId: string;
  courtId: string;
  venueId: string;
  startsAt: Date;
  endsAt: Date;
  status: ReservationStatus;
  holdExpiresAt: Date;
  totalPiastres: number;
  depositPiastres: number;
  paidPiastres: number;
  paymentOption: PaymentOption;
}
export interface IdempotencyResult {
  requestHash: string;
  response: Reservation;
}
