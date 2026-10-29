import type { Court } from './venues';

export type AdminBooking = {
  isTestPayment?: boolean;
  id: string;
  bookingCode: string;
  kind: 'booking' | 'manual' | 'block';
  status: string;
  startsAt: string;
  endsAt: string;
  totalPiastres: number;
  depositPiastres?: number;
  paidPiastres: number;
  dueAtVenuePiastres: number;
  venueCollectedAt?: string | null;
  createdAt: string;
  playerId: string | null;
  customerName: string | null;
  court: { id: string; name: string; sport: string; size: number | null };
  venue: { id: string; name: string };
  player: { id: string; name: string } | null;
};

export type AdminBookingPage = {
  items: AdminBooking[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  stats?: {
    confirmed: number;
    held: number;
    totalPiastres: number;
  };
};

export type AdminFinanceOverview = {
  totalGmvPiastres: number;
  totalBookingsCount: number;
  venueCashCollectedPiastres: number;
  venueCashBookingsCount: number;
  commissionEarnedPiastres: number;
  onlineVolumePiastres: number;
  settledPayoutsPiastres: number;
  pendingCashAtVenuesPiastres: number;
};

export type AdminVenue = {
  id: string;
  name: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  phone?: string;
  address?: string;
  commissionBp?: number;
  owner?: { id: string; email: string; name: string };
  ownerEmail?: string;
  ownerName?: string;
  cityName?: string;
  areaName?: string;
  courtsCount?: number;
  courts?: Court[];
  createdAt?: string;
};

export type AdminUser = {
  id: string;
  email: string;
  role: 'player' | 'owner' | 'admin';
  status: 'active' | 'blocked' | 'suspended' | 'pending';
  name: string;
  createdAt: string;
};

export type AdminDispute = {
  id: string;
  reservationId: string;
  playerMessage: string;
  status: 'open' | 'upheld' | 'overturned';
  createdAt: string;
  reservation?: {
    id: string;
    bookingCode: string;
    startsAt: string;
    endsAt: string;
    status: string;
    court?: { name: string; sport: string };
    venue?: { name: string };
    player?: { id: string; name: string; email: string };
  };
};

export type AdminAppeal = {
  id: string;
  message: string;
  status: 'open' | 'rejected' | 'unblocked' | 'strikes_removed';
  createdAt: string;
  player?: { id: string; name: string; email: string };
};

export type StuckItem = {
  id: string;
  reservationId: string;
  amountPiastres: number;
  attempts: number;
  lastError: string | null;
  updatedAt: string;
};
