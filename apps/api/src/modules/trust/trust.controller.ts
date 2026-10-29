import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { z } from 'zod';
import { CurrentUser, Roles } from '../auth/presentation/metadata';
import type { PublicUser } from '../auth/domain/auth.types';
import { TrustService } from './trust.service';

const disputeSchema = z
  .object({ reservationId: z.string().uuid(), playerMessage: z.string().trim().min(1).max(2000) })
  .strict();
const appealSchema = z.object({ message: z.string().trim().min(1).max(2000) }).strict();
export const profileSchema = z
  .object({
    preferredFoot: z.string().trim().max(50).optional(),
    playingStyle: z.string().trim().max(100).optional(),
    position1: z.string().trim().max(50).optional(),
    position2: z.string().trim().max(50).optional(),
    areaId: z.string().uuid().optional(),
    padelSide: z.string().trim().max(50).optional(),
    padelHand: z.string().trim().max(50).optional(),
    padelLevel: z.string().trim().max(50).optional(),
    photoFileId: z.string().uuid().optional(),
    photoUrl: z.string().trim().optional(),
  })
  .strict();

@Controller('player')
@Roles('player')
export class TrustController {
  constructor(private readonly trust: TrustService) {}
  @Get('profile') profile(@CurrentUser() user: PublicUser) {
    return this.trust.profile(user.id);
  }
  @Patch('profile') updateProfile(@CurrentUser() user: PublicUser, @Body() body: unknown) {
    return this.trust.updateProfile(user.id, profileSchema.parse(body));
  }
  @Get('strikes') strikes(@CurrentUser() user: PublicUser) {
    return this.trust.listStrikes(user.id);
  }
  @Get('disputes') disputes(@CurrentUser() user: PublicUser) {
    return this.trust.listDisputes(user.id);
  }
  @Post('disputes') dispute(@CurrentUser() user: PublicUser, @Body() body: unknown) {
    const input = disputeSchema.parse(body);
    return this.trust.createDispute(user.id, input.reservationId, input.playerMessage);
  }
  @Get('appeals') appeals(@CurrentUser() user: PublicUser) {
    return this.trust.listAppeals(user.id);
  }
  @Post('appeals') appeal(@CurrentUser() user: PublicUser, @Body() body: unknown) {
    return this.trust.createAppeal(user.id, appealSchema.parse(body).message);
  }
}
