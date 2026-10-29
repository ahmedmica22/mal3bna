import { Module } from '@nestjs/common';
import { VenueService } from './application/venue.service';
import { VENUE_READER } from './application/venue-reader';
import { PublicVenueController } from './presentation/public-venue.controller';
import { PrismaClient } from '@prisma/client';
import { PrismaVenueReadService } from './infrastructure/prisma-venue-read.service';
import { PrismaOwnerVenueService } from './infrastructure/prisma-owner-venue.service';
import { OwnerVenueController } from './presentation/owner-venue.controller';
import { PrismaOwnerOperationsService } from './infrastructure/prisma-owner-operations.service';
import { OwnerOperationsController } from './presentation/owner-operations.controller';
import { BookingsModule } from '../bookings/bookings.module';
@Module({
  imports: [BookingsModule],
  providers: [
    PrismaClient,
    VenueService,
    PrismaVenueReadService,
    { provide: VENUE_READER, useExisting: PrismaVenueReadService },
    PrismaOwnerVenueService,
    PrismaOwnerOperationsService,
  ],
  controllers: [PublicVenueController, OwnerVenueController, OwnerOperationsController],
  exports: [VenueService, PrismaVenueReadService],
})
export class VenuesModule {}
