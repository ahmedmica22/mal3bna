import { Module, Controller, Get, Req } from '@nestjs/common';
import type { Request } from 'express';
import { healthResponseSchema } from '@court-booking/shared';
import { Public } from './modules/auth/presentation/metadata';
import { AuthModule } from './modules/auth/auth.module';
import { VenuesModule } from './modules/venues/venues.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { TrustModule } from './modules/trust/trust.module';
import { AdminModule } from './modules/admin/admin.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ReviewsModule } from './modules/reviews/reviews.module';

type RequestWithId = Request & { id: string };

@Controller('health')
class HealthController {
  @Get()
  @Public()
  health(@Req() request: RequestWithId) {
    return healthResponseSchema.parse({ status: 'ok', requestId: request.id });
  }
}

@Module({
  imports: [
    AuthModule,
    VenuesModule,
    BookingsModule,
    TrustModule,
    AdminModule,
    NotificationsModule,
    ReviewsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
