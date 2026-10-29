import { Controller, Headers, Param, Post } from '@nestjs/common';
import { CurrentUser, Roles } from '../../auth/presentation/metadata';
import type { PublicUser } from '../../auth/domain/auth.types';
import { PrismaBookingService } from '../infrastructure/prisma-booking.service';

@Controller('owner/bookings')
@Roles('owner')
export class OwnerBookingController {
  constructor(private readonly bookings: PrismaBookingService) {}
  @Post(':id/cancel') cancel(
    @CurrentUser() user: PublicUser,
    @Param('id') id: string,
    @Headers('idempotency-key') key?: string,
  ) {
    return this.bookings.operatorCancel(
      user.id,
      'owner',
      id,
      key || `owner-cancel-${id}-${Date.now()}`,
    );
  }
  @Post(':id/no-show')
  noShow(@CurrentUser() user: PublicUser, @Param('id') id: string) {
    return this.bookings.reportNoShow(user.id, id);
  }
}

@Controller('admin/bookings')
@Roles('admin')
export class AdminBookingController {
  constructor(private readonly bookings: PrismaBookingService) {}
  @Post(':id/cancel') cancel(
    @CurrentUser() user: PublicUser,
    @Param('id') id: string,
    @Headers('idempotency-key') key?: string,
  ) {
    return this.bookings.operatorCancel(
      user.id,
      'admin',
      id,
      key || `admin-cancel-${id}-${Date.now()}`,
    );
  }
}
