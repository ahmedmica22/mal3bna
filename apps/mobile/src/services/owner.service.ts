import { request, ApiError } from './api';
import { Venue, Court, Booking, OwnerBalance, OwnerProfileData } from '../types/domain';

export const ownerService = {
  block: (input: { courtId: string; startsAt: string; hours: number; reason: string }) =>
    request('/owner/blocks', { method: 'POST', body: JSON.stringify(input) }),
  cancel: (id: string, token?: string | null) =>
    request(
      `/owner/bookings/${id}/cancel`,
      {
        method: 'POST',
        headers: { 'Idempotency-Key': `mobile-owner-cancel:${id}:${Date.now()}` },
      },
      token,
    ),
  noShow: (id: string, token?: string | null) =>
    request(`/owner/bookings/${id}/no-show`, { method: 'POST' }, token),
  async getProfile(token: string | null): Promise<OwnerProfileData | null> {
    if (!token) return null;
    try {
      return await request<OwnerProfileData>('/owner/profile', {}, token);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null;
      throw error;
    }
  },

  async updateProfile(
    token: string | null,
    data: {
      name?: string;
      phone?: string;
      photoUrl?: string;
    },
  ): Promise<OwnerProfileData> {
    if (!token) throw new Error('Authentication required');
    return await request<OwnerProfileData>(
      '/owner/profile',
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      },
      token,
    );
  },

  async getVenue(token: string | null): Promise<Venue | null> {
    if (!token) return null;
    try {
      return await request<Venue>('/owner/venues/mine', {}, token);
    } catch {
      return null;
    }
  },

  async registerVenue(
    input: {
      name: string;
      areaId: string;
      address: string;
      phone: string;
      description: string;
      latitude?: number;
      longitude?: number;
      maxHoursPerBooking?: number;
    },
    token: string | null,
  ): Promise<Venue> {
    if (!token) throw new Error('Authentication required');
    return await request<Venue>(
      '/owner/venues',
      {
        method: 'POST',
        body: JSON.stringify({
          name: input.name,
          areaId: input.areaId,
          address: input.address,
          phone: input.phone,
          description: input.description,
          latitude: input.latitude ?? 30.0444,
          longitude: input.longitude ?? 31.2357,
          ...(input.maxHoursPerBooking ? { maxHoursPerBooking: input.maxHoursPerBooking } : {}),
        }),
      },
      token,
    );
  },

  async updateVenue(
    venueId: string,
    input: {
      name?: string;
      phone?: string;
      address?: string;
      description?: string;
      maxHoursPerBooking?: number;
    },
    token: string | null,
  ): Promise<Venue> {
    if (!token) throw new Error('Authentication required');
    return await request<Venue>(
      `/owner/venues/${venueId}`,
      {
        method: 'PATCH',
        body: JSON.stringify(input),
      },
      token,
    );
  },

  async uploadPhotos(
    venueId: string,
    photos: Array<{ url: string; mimeType?: string }>,
    token: string | null,
  ): Promise<void> {
    if (!token) throw new Error('Authentication required');
    await request(
      '/owner/venues/' + venueId + '/photos',
      { method: 'POST', body: JSON.stringify({ photos }) },
      token,
    );
  },

  async submitVenue(venueId: string, token: string | null): Promise<void> {
    if (!token) throw new Error('Authentication required');
    await request(`/owner/venues/${venueId}/submit`, { method: 'POST' }, token);
  },

  async addCourt(
    venueId: string,
    input: {
      name: string;
      sport: 'football' | 'padel';
      size?: number;
      surface?: string;
      isIndoor?: boolean;
      hourlyPriceEgp?: number;
      photos: Array<{ url: string; mimeType?: string }>;
    },
    token: string | null,
  ): Promise<Court> {
    if (!token) throw new Error('Authentication required');
    return await request<Court>(
      `/owner/venues/${venueId}/courts`,
      {
        method: 'POST',
        body: JSON.stringify(input),
      },
      token,
    );
  },

  async uploadCourtPhotos(
    venueId: string,
    courtId: string,
    photos: Array<{ url: string; mimeType?: string }>,
    token: string | null,
  ): Promise<void> {
    if (!token) throw new Error('Authentication required');
    await request(
      '/owner/venues/' + venueId + '/courts/' + courtId + '/photos',
      {
        method: 'POST',
        body: JSON.stringify({ photos }),
      },
      token,
    );
  },

  async setOpeningHours(
    venueId: string,
    dayOfWeek: number,
    openMinute: number,
    closeMinute: number,
    token: string | null,
  ): Promise<void> {
    if (!token) throw new Error('Authentication required');
    await request(
      `/owner/venues/${venueId}/opening-hours`,
      {
        method: 'POST',
        body: JSON.stringify({ dayOfWeek, openMinute, closeMinute }),
      },
      token,
    );
  },

  async setPriceRules(
    venueId: string,
    courtId: string,
    rules: Array<{
      dayOfWeek: number;
      startMinute: number;
      endMinute: number;
      pricePiastres: number;
    }>,
    token: string | null,
  ): Promise<void> {
    if (!token) throw new Error('Authentication required');
    await request(
      `/owner/venues/${venueId}/courts/${courtId}/price-rules`,
      {
        method: 'POST',
        body: JSON.stringify({ rules }),
      },
      token,
    );
  },

  async getBookings(token: string | null): Promise<Booking[]> {
    if (!token) return [];
    return request<Booking[]>('/owner/bookings', {}, token);
  },

  async getBalance(token: string | null): Promise<OwnerBalance> {
    if (!token) return {};
    return request<OwnerBalance>('/owner/balance', {}, token);
  },

  async markArrived(id: string, token: string | null): Promise<void> {
    if (!token) throw new Error('Authentication required');
    await request(`/owner/bookings/${id}/arrive`, { method: 'POST' }, token);
  },

  async collectCash(id: string, token: string | null): Promise<void> {
    if (!token) throw new Error('Authentication required');
    await request(`/owner/bookings/${id}/collect`, { method: 'POST' }, token);
  },

  async completeBooking(id: string, token: string | null): Promise<void> {
    if (!token) throw new Error('Authentication required');
    await request(`/owner/bookings/${id}/complete`, { method: 'POST' }, token);
  },

  async createManualBooking(
    input: {
      courtId: string;
      startsAt: string;
      hours: number;
      customerName: string;
      customerPhone?: string;
      totalPiastres: number;
    },
    token: string | null,
  ): Promise<Booking> {
    if (!token) throw new Error('Authentication required');
    return await request(
      '/owner/manual-bookings',
      {
        method: 'POST',
        body: JSON.stringify(input),
      },
      token,
    );
  },
};
