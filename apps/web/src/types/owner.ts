export type OwnerBooking = {
  kind?: 'booking' | 'manual' | 'block';
  isTestPayment?: boolean;
  id: string;
  bookingCode?: string;
  courtId: string;
  courtName?: string;
  startsAt: string;
  endsAt: string;
  status: string;
  customerName?: string;
  customerPhone?: string;
  totalPiastres?: number;
  depositPiastres?: number;
  paidPiastres?: number;
  dueAtVenuePiastres?: number;
  venueCollectedAt?: string | null;
  paymentOption?: 'deposit' | 'full';
  amountDuePiastres?: number;
};

export type OwnerBalance = {
  availablePiastres?: number;
  pendingPiastres?: number;
  releasedPiastres?: number;
  cashCollectedPiastres?: number;
  todayCashCollectedPiastres?: number;
  totalEarnedPiastres?: number;
};

export type OwnerProfileData = {
  userId?: string;
  name?: string;
  email?: string;
  phone?: string | null;
  photoUrl?: string | null;
  photoFileId?: string | null;
};

export type Payout = {
  id: string;
  venueId: string;
  periodStart: string;
  periodEnd: string;
  amountPiastres: number;
  status: 'draft' | 'approved' | 'paid';
  paidAt?: string | null;
  paymentReference?: string | null;
  createdAt: string;
};

export type OccupancyReport = {
  totalHours: number;
  bookedHours: number;
  rate: number;
};
