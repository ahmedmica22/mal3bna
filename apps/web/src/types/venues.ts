export type Venue = {
  maxHoursPerBooking?: number;
  id: string;
  name: string;
  address?: string;
  description?: string;
  phone?: string;
  status?: string;
  areaId?: string;
  area?: {
    id: string;
    nameEn: string;
    nameAr: string;
    city?: {
      id: string;
      nameEn: string;
      nameAr: string;
    };
  };
  commissionBp?: number;
  latitude?: number;
  longitude?: number;
  courts?: Court[];
  reviews?: Review[];
  photos?: Array<{
    sortOrder?: number;
    file?: { storageKey?: string; mimeType?: string };
    storageKey?: string;
  }>;
};

export type Court = {
  id: string;
  name: string;
  sport?: 'football' | 'padel';
  size?: number | null;
  surface?: string;
  isIndoor?: boolean;
  isActive?: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected' | string;
  rejectionReason?: string | null;
  price?: number;
  priceRules?: PriceRule[];
  photos?: Array<{
    sortOrder?: number;
    file?: { storageKey?: string; mimeType?: string };
    storageKey?: string;
  }>;
  venue?: { id: string; name: string; owner?: { id: string; name: string; email: string } };
  createdAt?: string;
};

export type Area = {
  id: string;
  nameEn: string;
  nameAr: string;
  cityId?: string;
  city?: {
    id: string;
    nameEn: string;
    nameAr: string;
  };
};

export type PriceRule = {
  id?: string;
  dayOfWeek: number;
  startMinute: number;
  endMinute: number;
  pricePiastres: number;
};

export type Review = {
  id: string;
  rating: number;
  comment?: string;
  text?: string;
  authorName?: string;
  ownerReply?: string | null;
  createdAt?: string;
};
