import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { BookingsModule } from '../bookings/bookings.module';
@Module({
  imports: [BookingsModule],
  providers: [PrismaClient, AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
