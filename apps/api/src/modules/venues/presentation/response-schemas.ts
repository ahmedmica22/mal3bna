import { z } from 'zod';

export const cityResponseSchema = z
  .object({
    id: z.string().uuid(),
    nameEn: z.string(),
    nameAr: z.string(),
    isActive: z.boolean(),
  })
  .strict();
export const areaResponseSchema = cityResponseSchema.extend({ cityId: z.string().uuid() });
export const courtResponseSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string(),
    sport: z.enum(['football', 'padel']),
    size: z.union([z.literal(5), z.literal(7), z.literal(11)]).nullable(),
    surface: z.string(),
    isIndoor: z.boolean(),
  })
  .strict();
// Prisma Decimal serializes coordinates as strings on the wire.
export const venueResponseSchema = z
  .object({
    id: z.string().uuid(),
    areaId: z.string().uuid(),
    name: z.string(),
    description: z.string(),
    phone: z.string(),
    latitude: z.string(),
    longitude: z.string(),
    address: z.string(),
    timeZone: z.string(),
    status: z.literal('approved'),
    maxHoursPerBooking: z.number().int().positive(),
    area: z
      .object({
        id: z.string().uuid(),
        nameEn: z.string(),
        nameAr: z.string(),
        city: z
          .object({
            id: z.string().uuid(),
            nameEn: z.string(),
            nameAr: z.string(),
          })
          .optional(),
      })
      .optional(),
    courts: z.array(courtResponseSchema),
  })
  .strict();
export const hourPriceResponseSchema = z
  .object({
    startsAt: z.string().datetime(),
    endsAt: z.string().datetime(),
    pricePiastres: z.number().int().nonnegative(),
  })
  .strict();
export const quoteResponseSchema = z
  .object({
    breakdown: z.array(hourPriceResponseSchema),
    totalPiastres: z.number().int().nonnegative(),
    depositPiastres: z.number().int().nonnegative(),
    dueAtVenuePiastres: z.number().int().nonnegative(),
  })
  .strict();
export const availabilityResponseSchema = z.array(
  hourPriceResponseSchema.extend({ status: z.enum(['available', 'booked', 'past']) }),
);
