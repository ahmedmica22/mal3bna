import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { z } from 'zod';
import { CurrentUser, Roles } from '../auth/presentation/metadata';
import type { PublicUser } from '../auth/domain/auth.types';
import { AdminService } from './admin.service';

const courtReject = z
  .object({
    reason: z.string().trim().optional(),
  })
  .strict();
const decision = z
  .object({
    decision: z.enum(['approved', 'rejected', 'suspended', 'active']),
    reason: z.string().trim().optional(),
  })
  .strict();
const commission = z.object({ commissionBp: z.number().int() }).strict();
const payout = z
  .object({
    venueId: z.string().uuid(),
    periodStart: z.string().datetime(),
    periodEnd: z.string().datetime(),
  })
  .strict();
const userStatus = z
  .object({ status: z.enum(['active', 'blocked', 'suspended', 'pending']) })
  .strict();
const payoutAction = z
  .object({
    action: z.enum(['approve', 'mark_paid']),
    paymentReference: z.string().trim().optional(),
  })
  .strict();
const area = z
  .object({
    cityId: z.string().uuid(),
    nameEn: z.string().trim().min(1).max(100),
    nameAr: z.string().trim().min(1).max(100),
  })
  .strict();
const bulkCancel = z
  .object({ reservationIds: z.array(z.string().uuid()).min(1).max(100) })
  .strict();
const bookingListQuery = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(50),
    status: z.string().trim().optional(),
    search: z.string().trim().optional(),
  })
  .strict();
@Controller('admin')
@Roles('admin')
export class AdminController {
  constructor(private readonly admin: AdminService) {}
  @Get('bookings') bookings(@Query() query: unknown) {
    const input = bookingListQuery.parse(query);
    return this.admin.listBookings(input.page, input.pageSize, input.status, input.search);
  }
  @Get('finance/overview') financialOverview() {
    return this.admin.financialOverview();
  }
  @Get('users') users() {
    return this.admin.users();
  }
  @Get('venues') venues() {
    return this.admin.venues();
  }
  @Get('courts') courts(@Query('status') status?: string) {
    return this.admin.courts(status);
  }
  @Post('courts/:id/approve') approveCourt(
    @CurrentUser() user: PublicUser,
    @Param('id') id: string,
  ) {
    return this.admin.approveCourt(user.id, id);
  }
  @Post('courts/:id/reject') rejectCourt(
    @CurrentUser() user: PublicUser,
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    const input = courtReject.parse(body);
    return this.admin.rejectCourt(user.id, id, input.reason);
  }
  @Get('geography') geography() {
    return this.admin.geography();
  }
  @Post('geography/areas') createArea(@CurrentUser() user: PublicUser, @Body() body: unknown) {
    const input = area.parse(body);
    return this.admin.createArea(user.id, input.cityId, input.nameEn, input.nameAr);
  }
  @Post('users/:id/status') userStatus(
    @CurrentUser() user: PublicUser,
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    return this.admin.setUserStatus(user.id, id, userStatus.parse(body).status);
  }
  @Post('owners/:id/approve') approveOwner(
    @CurrentUser() user: PublicUser,
    @Param('id') id: string,
  ) {
    return this.admin.approveOwner(user.id, id);
  }
  @Post('venues/:id/decision') venue(
    @CurrentUser() user: PublicUser,
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    const input = decision.parse(body);
    return this.admin.decideVenue(user.id, id, input.decision, input.reason);
  }
  @Post('venues/:id/commission') commission(
    @CurrentUser() user: PublicUser,
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    return this.admin.changeCommission(user.id, id, commission.parse(body).commissionBp);
  }
  @Post('payouts') payout(@CurrentUser() user: PublicUser, @Body() body: unknown) {
    const input = payout.parse(body);
    return this.admin.generatePayout(
      user.id,
      input.venueId,
      new Date(input.periodStart),
      new Date(input.periodEnd),
    );
  }
  @Get('payouts') payouts() {
    return this.admin.payouts();
  }
  @Get('stuck-items') stuckItems() {
    return this.admin.stuckItems();
  }
  @Post('bookings/bulk-cancel') bulkCancel(@CurrentUser() user: PublicUser, @Body() body: unknown) {
    return this.admin.bulkCancel(user.id, bulkCancel.parse(body).reservationIds);
  }
  @Post('payouts/:id/action') payoutAction(
    @CurrentUser() user: PublicUser,
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    const input = payoutAction.parse(body);
    return this.admin.updatePayout(user.id, id, input.action, input.paymentReference);
  }
}
