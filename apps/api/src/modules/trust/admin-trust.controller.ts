import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { z } from 'zod';
import { CurrentUser, Roles } from '../auth/presentation/metadata';
import type { PublicUser } from '../auth/domain/auth.types';
import { TrustService } from './trust.service';
const disputeDecision = z
  .object({ decision: z.enum(['upheld', 'overturned']), note: z.string().trim().min(1).max(1000) })
  .strict();
const appealDecision = z
  .object({ decision: z.enum(['rejected', 'unblocked', 'strikes_removed']) })
  .strict();
@Controller('admin')
@Roles('admin')
export class AdminTrustController {
  constructor(private readonly trust: TrustService) {}
  @Get('disputes') listDisputes() {
    return this.trust.adminListDisputes();
  }
  @Get('appeals') listAppeals() {
    return this.trust.adminListAppeals();
  }
  @Post('disputes/:id/decision') dispute(
    @CurrentUser() user: PublicUser,
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    const input = disputeDecision.parse(body);
    return this.trust.decideDispute(user.id, id, input.decision, input.note);
  }
  @Post('appeals/:id/decision') appeal(
    @CurrentUser() user: PublicUser,
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    return this.trust.decideAppeal(user.id, id, appealDecision.parse(body).decision);
  }
}
