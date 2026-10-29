import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { CurrentUser, Roles } from '../../auth/presentation/metadata';
import type { PublicUser } from '../../auth/domain/auth.types';
import { PrismaBookingService } from '../infrastructure/prisma-booking.service';
import { z } from 'zod';
import { LocalPaymentService } from '../infrastructure/local-payment.service';
import { fakePaymentInputSchema } from './fake-payment.schemas';
export const createSchema = z
  .object({
    courtId: z.string().min(1),
    venueId: z.string().min(1),
    startsAt: z.string().datetime(),
    hours: z.number().int().positive(),
    totalPiastres: z.number().int().nonnegative(),
    depositPiastres: z.number().int().nonnegative(),
    paymentOption: z.enum(['deposit', 'full']),
  })
  .strict();
@Controller('player/bookings')
@Roles('player')
export class BookingController {
  constructor(
    private readonly bookings: PrismaBookingService,
    private readonly localPayments: LocalPaymentService,
  ) {}
  @Post(':id/fake-payment')
  async fakePayment(
    @CurrentUser() user: PublicUser,
    @Param('id') id: string,
    @Headers('idempotency-key') key: string,
    @Body() body: unknown,
  ) {
    const { outcome } = fakePaymentInputSchema.parse(body);
    const result = await this.localPayments.simulate(user.id, id, outcome, key);
    return { ...result, booking: await this.bookings.get(user.id, id) };
  }
  @Get() list(@CurrentUser() user: PublicUser) {
    return this.bookings.list(user.id);
  }
  @Post()
  create(
    @CurrentUser() user: PublicUser,
    @Headers('idempotency-key') key: string,
    @Body() body: unknown,
  ) {
    const input = createSchema.parse(body);
    return this.bookings.create(
      { ...input, playerId: user.id, startsAt: new Date(input.startsAt) },
      key,
    );
  }
  @Get(':id') get(@CurrentUser() user: PublicUser, @Param('id') id: string) {
    return this.bookings.get(user.id, id);
  }
  @Get(':id/cancel-preview') cancelPreview(
    @CurrentUser() user: PublicUser,
    @Param('id') id: string,
  ) {
    return this.bookings.cancelPreview(user.id, id);
  }
  @Post(':id/cancel') cancel(
    @CurrentUser() user: PublicUser,
    @Param('id') id: string,
    @Headers('idempotency-key') key: string,
  ) {
    return this.bookings.cancel(user.id, id, key);
  }
}
