import { createHash } from 'node:crypto';
import { DomainError } from '../../../domain/errors';
import type { BookingInput, Reservation } from '../domain/booking.types';

export function hashBookingInput(input: BookingInput): string {
  return createHash('sha256')
    .update(JSON.stringify({ ...input, startsAt: input.startsAt.toISOString() }))
    .digest('hex');
}

export function toReservation(row: {
  id: string;
  bookingCode: string;
  playerId: string | null;
  courtId: string;
  venueId: string;
  startsAt: Date;
  endsAt: Date;
  status:
    | 'held'
    | 'confirmed'
    | 'arrived'
    | 'completed'
    | 'no_show_pending'
    | 'no_show'
    | 'expired'
    | 'cancelled';
  holdExpiresAt: Date | null;
  totalPiastres: number;
  depositPiastres: number;
  paidPiastres: number;
  paymentOption: 'deposit' | 'full' | null;
}): Reservation {
  if (!row.playerId || !row.holdExpiresAt || !row.paymentOption) {
    throw new DomainError('NOT_FOUND', 'Booking not found');
  }
  return {
    id: row.id,
    bookingCode: row.bookingCode,
    playerId: row.playerId,
    courtId: row.courtId,
    venueId: row.venueId,
    startsAt: row.startsAt,
    endsAt: row.endsAt,
    status: row.status,
    holdExpiresAt: row.holdExpiresAt,
    totalPiastres: row.totalPiastres,
    depositPiastres: row.depositPiastres,
    paidPiastres: row.paidPiastres,
    paymentOption: row.paymentOption,
  };
}

export interface RawBookingListItem {
  id: string;
  bookingCode: string;
  customerName: string | null;
  customerPhone: string | null;
  courtId: string;
  venueId: string;
  startsAt: Date;
  endsAt: Date;
  createdAt: Date;
  status: string;
  holdExpiresAt: Date | null;
  totalPiastres: number;
  depositPiastres: number;
  paidPiastres: number;
  dueAtVenuePiastres: number;
  paymentOption: 'deposit' | 'full' | null;
  player: { name: string | null; phone: string | null; email: string | null } | null;
  court: { id: string; name: string; sport: string; size: number | null };
  venue: { id: string; name: string; address: string };
  dispute: { id: string; status: string; playerMessage: string } | null;
  review: { id: string; rating: number; comment: string | null } | null;
  payments: Array<{ method: string }>;
}

export function toBookingListItem(row: RawBookingListItem) {
  return {
    id: row.id,
    bookingCode: row.bookingCode,
    customerName: row.customerName ?? row.player?.name ?? null,
    customerPhone: row.customerPhone ?? row.player?.phone ?? null,
    customerEmail: row.player?.email ?? null,
    courtId: row.courtId,
    courtName: row.court.name,
    sport: row.court.sport,
    size: row.court.size,
    venueId: row.venueId,
    venueName: row.venue.name,
    venueAddress: row.venue.address,
    startsAt: row.startsAt.toISOString(),
    endsAt: row.endsAt.toISOString(),
    createdAt: row.createdAt.toISOString(),
    status: row.status,
    holdExpiresAt: row.holdExpiresAt?.toISOString() ?? null,
    totalPiastres: row.totalPiastres,
    depositPiastres: row.depositPiastres,
    paidPiastres: row.paidPiastres,
    isTestPayment: row.payments.some((payment) => payment.method === 'fake'),
    dueAtVenuePiastres: row.dueAtVenuePiastres,
    paymentOption: row.paymentOption,
    dispute: row.dispute ? { id: row.dispute.id, status: row.dispute.status } : null,
    review: row.review
      ? { id: row.review.id, rating: row.review.rating, comment: row.review.comment }
      : null,
  };
}
