import { Inject, Injectable } from '@nestjs/common';
import { VENUE_READER, type VenueReader } from './venue-reader';

@Injectable()
export class VenueService {
  constructor(@Inject(VENUE_READER) private readonly prismaVenues: VenueReader) {}

  listCities() {
    return this.prismaVenues.listCities();
  }

  listAreas(cityId?: string) {
    return this.prismaVenues.listAreas(cityId);
  }

  listVenues(filters: { areaId?: string; search?: string; sport?: 'football' | 'padel'; size?: 5 | 7 | 11 }) {
    return this.prismaVenues.listVenues(filters);
  }

  getVenue(id: string) {
    return this.prismaVenues.getVenue(id);
  }

  quote(courtId: string, startsAt: Date, hours: number) {
    return this.prismaVenues.quote(courtId, startsAt, hours);
  }

  availability(courtId: string, date: Date) {
    return this.prismaVenues.availability(courtId, date);
  }
}
