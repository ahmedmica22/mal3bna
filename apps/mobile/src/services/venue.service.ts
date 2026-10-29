import { request } from './api';
import { Venue, SportType, Area, AvailabilitySlot } from '../types/domain';
import { createPublicReadCache } from './public-read-cache';

const venueCache = createPublicReadCache<Venue[]>(30_000);
const areaCache = createPublicReadCache<Area[]>(300_000, 1);
const venueKey = (sport: string, area = 'all', search = '') =>
  JSON.stringify([sport, area, search.trim()]);

export const venueService = {
  cachedVenues(sport: 'all' | SportType = 'all', area = 'all') {
    return venueCache.peek(venueKey(sport, area));
  },
  async getVenues(
    sportFilter: 'all' | SportType = 'all',
    areaId = 'all',
    search = '',
    force = false,
  ): Promise<Venue[]> {
    // Avoid browser URLSearchParams/polyfill differences in native Expo builds.
    const params: string[] = [];
    if (sportFilter !== 'all') params.push(`sport=${encodeURIComponent(sportFilter)}`);
    if (areaId && areaId !== 'all') params.push(`areaId=${encodeURIComponent(areaId)}`);
    if (search.trim()) params.push(`search=${encodeURIComponent(search.trim())}`);
    const q = params.join('&');
    return venueCache.load(
      venueKey(sportFilter, areaId, search),
      async () => (await request<Venue[]>(`/public/venues${q ? `?${q}` : ''}`)) ?? [],
      force,
    );
  },

  async getAreas(): Promise<Area[]> {
    return areaCache.load('areas', async () => (await request<Area[]>('/public/areas')) ?? []);
  },

  async getAvailability(
    courtId: string,
    date: string,
    signal?: AbortSignal,
  ): Promise<AvailabilitySlot[]> {
    const slots = await request<AvailabilitySlot[]>(
      `/public/courts/${courtId}/availability?date=${date}`,
      { signal },
    );
    return slots ?? [];
  },

  async getQuote(courtId: string, startsAt: string, hours: number) {
    return await request<{
      breakdown: Array<{ startsAt: string; endsAt: string; pricePiastres: number }>;
      totalPiastres: number;
      depositPiastres: number;
      dueAtVenuePiastres: number;
    }>(`/public/courts/${courtId}/quote?startsAt=${encodeURIComponent(startsAt)}&hours=${hours}`);
  },
};
