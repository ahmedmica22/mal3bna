export type SportType = 'football' | 'padel';

export interface Court {
  id: string;
  name: string;
  sport?: SportType;
  size?: number | null;
  surface?: string;
  isIndoor?: boolean;
  isActive?: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected' | string;
  rejectionReason?: string | null;
  photos?: Array<{
    sortOrder?: number;
    file?: { storageKey?: string; mimeType?: string };
    storageKey?: string;
  }>;
  price?: number;
  priceRules?: Array<{ pricePiastres: number; validFrom?: string }>;
}

export interface Venue {
  photos?: Array<{ file?: { storageKey?: string }; storageKey?: string }>;
  id: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  status?: string;
  areaId?: string;
  area?: {
    id: string;
    nameEn: string;
    nameAr?: string;
    city?: {
      id: string;
      nameEn: string;
      nameAr?: string;
    };
  };
  maxHoursPerBooking?: number;
  courts?: Court[];
  openingHours?: Array<{ dayOfWeek: number; openMinute: number; closeMinute: number }>;
}

export interface Booking {
  createdAt?: string;
  paymentOption?: 'deposit' | 'full';
  venueId?: string;
  review?: { id: string; rating: number; comment: string | null } | null;
  dispute?: { id: string; status: string } | null;
  paidPiastres?: number;
  kind?: 'booking' | 'manual' | 'block';
  isTestPayment?: boolean;
  holdExpiresAt?: string;
  id: string;
  bookingCode?: string;
  courtId?: string;
  courtName?: string;
  venueName?: string;
  startsAt: string;
  endsAt?: string;
  status: 'confirmed' | 'arrived' | 'completed' | 'cancelled' | string;
  customerName?: string;
  customerPhone?: string;
  totalPiastres?: number;
  dueAtVenuePiastres?: number;
  depositPiastres?: number;
}

export interface OwnerBalance {
  totalEarnedPiastres?: number;
  cashCollectedPiastres?: number;
  todayCashCollectedPiastres?: number;
  availablePiastres?: number;
  pendingPiastres?: number;
  releasedPiastres?: number;
}

export interface ToastMessage {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface Area {
  id: string;
  nameEn: string;
  nameAr: string;
  cityId?: string;
}

export interface AvailabilitySlot {
  startsAt: string;
  endsAt: string;
  status: 'available' | 'booked' | 'past';
  available?: boolean;
  pricePiastres: number;
}

export interface OwnerProfileData {
  userId: string;
  name: string;
  email: string;
  phone?: string | null;
  photoUrl?: string | null;
  photoFileId?: string | null;
}
