import { describe, expect, it } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { PublicVenueController } from './public-venue.controller';
import { VenueService } from '../application/venue.service';
import { PrismaOwnerOperationsService } from '../infrastructure/prisma-owner-operations.service';
import { quoteResponseSchema, venueResponseSchema } from './response-schemas';

describe('public discovery HTTP contracts', () => {
  it('returns 404 rather than a successful error object for an unavailable venue', async () => {
    const controller = new PublicVenueController(
      {
        getVenue: async () => null,
      } as unknown as VenueService,
      {} as unknown as PrismaOwnerOperationsService,
    );
    await expect(controller.venue('missing')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('documents serialized coordinates and rejects private owner/commission fields', () => {
    const fixture = {
      id: 'b926e33c-4e7b-47af-a70f-d11e0494bffb',
      areaId: 'b926e33c-4e7b-47af-a70f-d11e0494bffc',
      name: 'Court',
      description: '',
      phone: '01000000000',
      latitude: '30.01',
      longitude: '31.2',
      address: 'Cairo',
      timeZone: 'Africa/Cairo',
      status: 'approved',
      maxHoursPerBooking: 4,
      courts: [],
    };
    expect(venueResponseSchema.parse(fixture)).toEqual(fixture);
    expect(venueResponseSchema.safeParse({ ...fixture, commissionBp: 1000 }).success).toBe(false);
    expect(venueResponseSchema.safeParse({ ...fixture, ownerId: fixture.id }).success).toBe(false);
  });

  it('retains server-owned quote breakdown and integer piastre amounts', () => {
    const fixture = {
      breakdown: [
        {
          startsAt: '2026-10-25T17:00:00.000Z',
          endsAt: '2026-10-25T18:00:00.000Z',
          pricePiastres: 35000,
        },
      ],
      totalPiastres: 35000,
      depositPiastres: 10500,
      dueAtVenuePiastres: 24500,
    };
    expect(quoteResponseSchema.parse(fixture)).toEqual(fixture);
    expect(quoteResponseSchema.safeParse({ ...fixture, totalPiastres: 35000.5 }).success).toBe(
      false,
    );
  });
});
