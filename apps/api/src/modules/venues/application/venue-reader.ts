import type { Area, City, Sport } from '../domain/venue.types';
import type { HourPrice } from '../domain/price-calculator';

export const VENUE_READER = Symbol('VENUE_READER');
export interface VenueFilters {
  areaId?: string;
  search?: string;
  sport?: Sport;
  size?: 5 | 7 | 11;
}
export interface PublicCourtReadModel {
  id: string;
  name: string;
  sport: Sport;
  size: number | null;
  surface: string | null;
  isIndoor: boolean;
}
export interface PublicVenueReadModel {
  id: string;
  areaId: string;
  name: string;
  description: string;
  phone: string;
  latitude: string | { toString(): string };
  longitude: string | { toString(): string };
  address: string;
  timeZone: string;
  status: string;
  maxHoursPerBooking: number;
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
  courts: PublicCourtReadModel[];
}
export interface CourtQuoteReadModel {
  breakdown: HourPrice[];
  totalPiastres: number;
  depositPiastres: number;
  dueAtVenuePiastres: number;
}
export interface VenueReader {
  listCities(): Promise<City[]>;
  listAreas(cityId?: string): Promise<Area[]>;
  listVenues(filters: VenueFilters): Promise<PublicVenueReadModel[]>;
  getVenue(id: string): Promise<PublicVenueReadModel | null>;
  quote(courtId: string, startsAt: Date, hours: number): Promise<CourtQuoteReadModel>;
  availability(
    courtId: string,
    date: Date,
  ): Promise<Array<HourPrice & { status: 'available' | 'booked' | 'past' }>>;
}
