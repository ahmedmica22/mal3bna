import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { z } from 'zod';
import { CurrentUser, Public, Roles } from '../auth/presentation/metadata';
import type { PublicUser } from '../auth/domain/auth.types';
import { ReviewsService } from './reviews.service';

const createSchema = z
  .object({
    reservationId: z.string().uuid(),
    rating: z.number().int().min(1).max(5),
    comment: z.string().trim().max(2000).optional(),
  })
  .strict();
const replySchema = z.object({ reply: z.string().trim().min(1).max(2000) }).strict();
const removeSchema = z.object({ reason: z.string().trim().min(1).max(500) }).strict();

@Controller('public/venues')
export class PublicReviewsController {
  constructor(private readonly reviews: ReviewsService) {}
  @Get(':venueId/reviews')
  @Public()
  list(@Param('venueId') venueId: string) {
    return this.reviews.listVenue(venueId);
  }
}

@Controller('player/reviews')
@Roles('player')
export class PlayerReviewsController {
  constructor(private readonly reviews: ReviewsService) {}
  @Post()
  create(@CurrentUser() user: PublicUser, @Body() body: unknown) {
    const input = createSchema.parse(body);
    return this.reviews.create(user.id, input.reservationId, input.rating, input.comment);
  }
}

@Controller('owner/reviews')
@Roles('owner')
export class OwnerReviewsController {
  constructor(private readonly reviews: ReviewsService) {}
  @Post(':id/reply')
  reply(@CurrentUser() user: PublicUser, @Param('id') id: string, @Body() body: unknown) {
    return this.reviews.reply(user.id, id, replySchema.parse(body).reply);
  }
}

@Controller('admin/reviews')
@Roles('admin')
export class AdminReviewsController {
  constructor(private readonly reviews: ReviewsService) {}
  @Post(':id/remove')
  remove(@CurrentUser() user: PublicUser, @Param('id') id: string, @Body() body: unknown) {
    return this.reviews.remove(user.id, id, removeSchema.parse(body).reason);
  }
}
