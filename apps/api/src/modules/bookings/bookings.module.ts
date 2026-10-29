import { Module } from '@nestjs/common';
import { BookingService } from './application/booking.service';
import { FakePaymentGateway } from './application/fake-payment.gateway';
import { BookingController } from './presentation/booking.controller';
import { PrismaClient } from '@prisma/client';
import { PrismaBookingService } from './infrastructure/prisma-booking.service';
import { WebhookService } from './infrastructure/webhook.service';
import { WebhookController } from './presentation/webhook.controller';
import {
  AdminBookingController,
  OwnerBookingController,
} from './presentation/operator-booking.controller';
import { BookingJobsService } from './infrastructure/booking-jobs.service';
import { LocalPaymentService } from './infrastructure/local-payment.service';
@Module({
  providers: [
    PrismaClient,
    BookingService,
    PrismaBookingService,
    WebhookService,
    LocalPaymentService,
    BookingJobsService,
    FakePaymentGateway,
    { provide: 'PAYMENT_GATEWAY', useExisting: FakePaymentGateway },
  ],
  controllers: [
    BookingController,
    WebhookController,
    OwnerBookingController,
    AdminBookingController,
  ],
  exports: [PrismaBookingService],
})
export class BookingsModule {}
