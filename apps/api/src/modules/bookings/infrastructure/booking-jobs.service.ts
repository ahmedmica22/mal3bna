import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaBookingService } from './prisma-booking.service';

@Injectable()
export class BookingJobsService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly bookings: PrismaBookingService,
  ) {}
  async runOnce(now = new Date()) {
    const expiredHolds = await this.bookings.expireHolds(now);
    const finalizedNoShows = await this.bookings.finalizeNoShows(now);
    const failedRefunds = await this.prisma.refund.findMany({
      where: { status: 'failed' },
      select: { idempotencyKey: true },
    });
    let retriedRefunds = 0;
    for (const refund of failedRefunds) {
      try {
        await this.bookings.retryRefund(refund.idempotencyKey);
        retriedRefunds += 1;
      } catch {
        /* retained for the next retry */
      }
    }
    return { expiredHolds, finalizedNoShows, retriedRefunds };
  }
}
