import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { TrustService } from './trust.service';
import { TrustController } from './trust.controller';
import { AdminTrustController } from './admin-trust.controller';
import { FakePaymentGateway } from '../bookings/application/fake-payment.gateway';

@Module({
  providers: [
    PrismaClient,
    FakePaymentGateway,
    { provide: 'PAYMENT_GATEWAY', useExisting: FakePaymentGateway },
    TrustService,
  ],
  controllers: [TrustController, AdminTrustController],
})
export class TrustModule {}
