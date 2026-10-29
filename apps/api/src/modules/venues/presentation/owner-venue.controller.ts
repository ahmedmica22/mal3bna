import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { z } from 'zod';
import { CurrentUser, Roles } from '../../auth/presentation/metadata';
import type { PublicUser } from '../../auth/domain/auth.types';
import { PrismaOwnerVenueService } from '../infrastructure/prisma-owner-venue.service';

export const venueSchema = z
  .object({
    areaId: z.string().uuid(),
    name: z.string().trim().min(1).max(200),
    description: z.string().trim().min(1).max(5000),
    phone: z.string().trim().min(5).max(40),
    latitude: z.number(),
    longitude: z.number(),
    address: z.string().trim().min(1).max(500),
    maxHoursPerBooking: z.number().int().min(1).max(12).optional(),
  })
  .strict();

export const updateVenueSchema = z
  .object({
    areaId: z.string().uuid().optional(),
    name: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().min(1).max(5000).optional(),
    phone: z.string().trim().min(5).max(40).optional(),
    address: z.string().trim().min(1).max(500).optional(),
    maxHoursPerBooking: z.number().int().min(1).max(12).optional(),
  })
  .strict();

export const courtSchema = z
  .object({
    name: z.string().trim().min(1).max(100),
    sport: z.enum(['football', 'padel']),
    size: z.number().int().optional(),
    surface: z.string().trim().max(100).optional(),
    isIndoor: z.boolean().optional(),
    hourlyPriceEgp: z.number().positive().optional(),
    photos: z
      .array(
        z
          .object({
            url: z.string().trim().min(1, 'Photo URL is required'),
            mimeType: z.string().trim().optional(),
          })
          .strict(),
      )
      .min(2, 'Minimum 2 photos required for each court')
      .max(6, 'Maximum 6 photos allowed for each court'),
  })
  .strict();

export const photosSchema = z
  .object({
    photos: z
      .array(
        z
          .object({
            url: z.string().trim().min(1, 'Photo URL is required'),
            mimeType: z.string().trim().optional(),
          })
          .strict(),
      )
      .min(2, 'Minimum 2 photos required')
      .max(6, 'Maximum 6 photos allowed'),
  })
  .strict();

export const hoursSchema = z
  .object({
    dayOfWeek: z.number().int(),
    openMinute: z.number().int(),
    closeMinute: z.number().int(),
  })
  .strict();

export const pricesSchema = z
  .object({
    rules: z
      .array(
        z
          .object({
            dayOfWeek: z.number().int(),
            startMinute: z.number().int(),
            endMinute: z.number().int(),
            pricePiastres: z.number().int().positive(),
          })
          .strict(),
      )
      .min(1),
  })
  .strict();

@Controller('owner/venues')
@Roles('owner')
export class OwnerVenueController {
  constructor(private readonly venues: PrismaOwnerVenueService) {}

  @Get('mine')
  mine(@CurrentUser() user: PublicUser) {
    return this.venues.mine(user.id);
  }

  @Post()
  register(@CurrentUser() user: PublicUser, @Body() body: unknown) {
    return this.venues.register(user.id, venueSchema.parse(body));
  }

  @Patch(':id')
  update(@CurrentUser() user: PublicUser, @Param('id') id: string, @Body() body: unknown) {
    return this.venues.update(user.id, id, updateVenueSchema.parse(body));
  }

  @Post(':id/photos')
  photos(@CurrentUser() user: PublicUser, @Param('id') id: string, @Body() body: unknown) {
    return this.venues.uploadPhotos(user.id, id, photosSchema.parse(body).photos);
  }

  @Post(':id/submit')
  submit(@CurrentUser() user: PublicUser, @Param('id') id: string) {
    return this.venues.submit(user.id, id);
  }

  @Post(':id/courts')
  court(@CurrentUser() user: PublicUser, @Param('id') id: string, @Body() body: unknown) {
    return this.venues.createCourt(user.id, id, courtSchema.parse(body));
  }

  @Post(':id/opening-hours')
  hours(@CurrentUser() user: PublicUser, @Param('id') id: string, @Body() body: unknown) {
    const input = hoursSchema.parse(body);
    return this.venues.setOpeningHours(
      user.id,
      id,
      input.dayOfWeek,
      input.openMinute,
      input.closeMinute,
    );
  }

  @Post(':id/courts/:courtId/photos')
  courtPhotos(
    @CurrentUser() user: PublicUser,
    @Param('id') id: string,
    @Param('courtId') courtId: string,
    @Body() body: unknown,
  ) {
    return this.venues.uploadCourtPhotos(user.id, id, courtId, photosSchema.parse(body).photos);
  }

  @Post(':id/courts/:courtId/price-rules')
  prices(
    @CurrentUser() user: PublicUser,
    @Param('id') id: string,
    @Param('courtId') courtId: string,
    @Body() body: unknown,
  ) {
    return this.venues.setPriceRules(user.id, id, courtId, pricesSchema.parse(body).rules);
  }
}
