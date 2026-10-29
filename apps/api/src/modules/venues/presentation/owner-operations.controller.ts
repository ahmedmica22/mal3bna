import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { z } from 'zod';
import { CurrentUser, Roles } from '../../auth/presentation/metadata';
import type { PublicUser } from '../../auth/domain/auth.types';
import { PrismaOwnerOperationsService } from '../infrastructure/prisma-owner-operations.service';
export const manualSchema = z
  .object({
    courtId: z.string().uuid(),
    startsAt: z.string().datetime(),
    hours: z.number().int().positive(),
    customerName: z.string().trim().min(1),
    customerPhone: z.string().trim().optional(),
    totalPiastres: z.number().int().nonnegative(),
  })
  .strict();
export const blockSchema = z
  .object({
    courtId: z.string().uuid(),
    startsAt: z.string().datetime(),
    hours: z.number().int().positive(),
    reason: z.string().trim().min(1),
  })
  .strict();
const closureSchema = z.object({ confirm: z.boolean().default(false) }).strict();
export const ownerProfileSchema = z
  .object({
    photoUrl: z.string().trim().optional(),
    photoFileId: z.string().uuid().optional(),
    name: z.string().trim().min(1).max(100).optional(),
    phone: z.string().trim().max(30).optional(),
  })
  .strict();
@Controller('owner')
@Roles('owner')
export class OwnerOperationsController {
  constructor(private readonly operations: PrismaOwnerOperationsService) {}
  @Get('profile') profile(@CurrentUser() user: PublicUser) {
    return this.operations.getProfile(user.id);
  }
  @Patch('profile') updateProfile(@CurrentUser() user: PublicUser, @Body() body: unknown) {
    return this.operations.updateProfile(user.id, ownerProfileSchema.parse(body));
  }
  @Get('bookings') bookings(
    @CurrentUser() user: PublicUser,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.operations.bookings(
      user.id,
      from ? new Date(from) : undefined,
      to ? new Date(to) : undefined,
    );
  }
  @Get('balance') balance(@CurrentUser() user: PublicUser) {
    return this.operations.balance(user.id);
  }
  @Get('payouts') payouts(@CurrentUser() user: PublicUser) {
    return this.operations.payouts(user.id);
  }
  @Get('reports/occupancy') report(
    @CurrentUser() user: PublicUser,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.operations.report(
      user.id,
      from ? new Date(from) : undefined,
      to ? new Date(to) : undefined,
    );
  }
  @Post('courts/:courtId/closure') closure(
    @CurrentUser() user: PublicUser,
    @Param('courtId') courtId: string,
    @Body() body: unknown,
  ) {
    return this.operations.closeCourt(user.id, courtId, closureSchema.parse(body).confirm);
  }
  @Post('bookings/:id/arrive') arrive(@CurrentUser() user: PublicUser, @Param('id') id: string) {
    return this.operations.arrive(user.id, id);
  }
  @Post('bookings/:id/complete') complete(
    @CurrentUser() user: PublicUser,
    @Param('id') id: string,
  ) {
    return this.operations.complete(user.id, id);
  }
  @Post('bookings/:id/collect') collect(@CurrentUser() user: PublicUser, @Param('id') id: string) {
    return this.operations.collect(user.id, id);
  }
  @Post('manual-bookings') manual(@CurrentUser() user: PublicUser, @Body() body: unknown) {
    const input = manualSchema.parse(body);
    return this.operations.manual(user.id, {
      ...input,
      startsAt: new Date(input.startsAt),
      customerPhone: input.customerPhone,
    });
  }
  @Post('blocks') block(@CurrentUser() user: PublicUser, @Body() body: unknown) {
    const input = blockSchema.parse(body);
    return this.operations.block(user.id, { ...input, startsAt: new Date(input.startsAt) });
  }
}
