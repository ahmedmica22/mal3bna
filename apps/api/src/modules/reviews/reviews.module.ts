import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ReviewsService } from './reviews.service';
import {
  AdminReviewsController,
  OwnerReviewsController,
  PlayerReviewsController,
  PublicReviewsController,
} from './reviews.controller';

@Module({
  providers: [PrismaClient, ReviewsService],
  controllers: [
    PublicReviewsController,
    PlayerReviewsController,
    OwnerReviewsController,
    AdminReviewsController,
  ],
})
export class ReviewsModule {}
