export type Sport = 'football' | 'padel';
export type FootballSize = 5 | 7 | 11;

export interface City {
  id: string;
  nameEn: string;
  nameAr: string;
  isActive: boolean;
}
export interface Area {
  id: string;
  cityId: string;
  nameEn: string;
  nameAr: string;
  isActive: boolean;
}
export interface Court {
  id: string;
  venueId: string;
  name: string;
  sport: Sport;
  size: FootballSize | null;
  surface: string;
  isIndoor: boolean;
  isActive: boolean;
}
export interface OpeningHours {
  venueId: string;
  dayOfWeek: number;
  openMinute: number;
  closeMinute: number;
}
export interface PriceRule {
  id: string;
  courtId: string;
  dayOfWeek: number;
  startMinute: number;
  endMinute: number;
  pricePiastres: number;
  validFrom: Date;
  validTo: Date | null;
}
export interface Venue {
  id: string;
  ownerId: string;
  areaId: string;
  name: string;
  description: string;
  phone: string;
  timeZone: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  commissionBp: number;
  maxHoursPerBooking: number;
  courts: Court[];
  openingHours: OpeningHours[];
  priceRules: PriceRule[];
}
