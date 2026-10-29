import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
@Module({
  providers: [PrismaClient, NotificationsService],
  controllers: [NotificationsController],
  exports: [NotificationsService],
})
export class NotificationsModule {}
