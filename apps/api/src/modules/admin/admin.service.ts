import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { DomainError } from '../../domain/errors';
import { PrismaBookingService } from '../bookings/infrastructure/prisma-booking.service';
@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly bookings: PrismaBookingService,
  ) {}
  async listBookings(page: number, pageSize: number, status?: string, search?: string) {
    const where: Record<string, unknown> = {};
    if (status && status !== 'all') {
      where.status = status;
    }
    if (search && search.trim()) {
      const term = search.trim();
      where.OR = [
        { bookingCode: { contains: term, mode: 'insensitive' } },
        { customerName: { contains: term, mode: 'insensitive' } },
        { venue: { name: { contains: term, mode: 'insensitive' } } },
        { court: { name: { contains: term, mode: 'insensitive' } } },
        { player: { name: { contains: term, mode: 'insensitive' } } },
      ];
    }

    const [rows, total, confirmedCount, heldCount, totalGrossPiastres] = await Promise.all([
      this.prisma.reservation.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }, { startsAt: 'desc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          bookingCode: true,
          kind: true,
          status: true,
          startsAt: true,
          endsAt: true,
          totalPiastres: true,
          depositPiastres: true,
          paidPiastres: true,
          dueAtVenuePiastres: true,
          venueCollectedAt: true,
          createdAt: true,
          playerId: true,
          customerName: true,
          court: { select: { id: true, name: true, sport: true, size: true } },
          venue: { select: { id: true, name: true } },
          player: { select: { id: true, name: true } },
          payments: { select: { method: true } },
        },
      }),
      this.prisma.reservation.count({ where }),
      this.prisma.reservation.count({ where: { status: 'confirmed' } }),
      this.prisma.reservation.count({ where: { status: 'held' } }),
      this.prisma.reservation.aggregate({ _sum: { totalPiastres: true } }),
    ]);
    const items = rows.map(({ payments, ...booking }) => ({
      ...booking,
      isTestPayment: payments.some((payment) => payment.method === 'fake'),
    }));
    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      stats: {
        confirmed: confirmedCount,
        held: heldCount,
        totalPiastres: totalGrossPiastres._sum.totalPiastres ?? 0,
      },
    };
  }

  async decideVenue(
    adminId: string,
    venueId: string,
    decision: 'approved' | 'rejected' | 'suspended' | 'active',
    reason?: string,
  ) {
    const venue = await this.prisma.venue.findUnique({ where: { id: venueId } });
    if (!venue) throw new DomainError('NOT_FOUND', 'Venue not found');
    const status = decision === 'active' ? 'approved' : decision;
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.venue.update({
        where: { id: venueId },
        data: { status, rejectionReason: decision === 'rejected' ? (reason ?? null) : null },
      });
      await tx.auditLog.create({
        data: {
          actorId: adminId,
          actorRole: 'admin',
          action: `venue.${decision}`,
          targetType: 'venue',
          targetId: venueId,
          reason: reason ?? null,
        },
      });
      return updated;
    });
  }
  async changeCommission(adminId: string, venueId: string, newBp: number) {
    if (newBp < 1000 || newBp > 2000)
      throw new DomainError('VALIDATION_FAILED', 'Commission must be between 10% and 20%');
    const venue = await this.prisma.venue.findUnique({ where: { id: venueId } });
    if (!venue) throw new DomainError('NOT_FOUND', 'Venue not found');
    return this.prisma.$transaction(async (tx) => {
      await tx.venue.update({ where: { id: venueId }, data: { commissionBp: newBp } });
      await tx.commissionChange.create({
        data: { venueId, oldBp: venue.commissionBp, newBp, changedBy: adminId },
      });
      await tx.auditLog.create({
        data: {
          actorId: adminId,
          actorRole: 'admin',
          action: 'venue.commission_changed',
          targetType: 'venue',
          targetId: venueId,
          oldValue: { commissionBp: venue.commissionBp },
          newValue: { commissionBp: newBp },
        },
      });
      return { venueId, oldBp: venue.commissionBp, newBp };
    });
  }
  users() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, role: true, status: true, name: true, createdAt: true },
    });
  }
  venues() {
    return this.prisma.venue.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        owner: { select: { id: true, email: true, name: true } },
        area: {
          select: { id: true, nameEn: true, nameAr: true, city: { select: { nameEn: true } } },
        },
        courts: {
          select: {
            id: true,
            name: true,
            sport: true,
            size: true,
            approvalStatus: true,
            isActive: true,
            photos: {
              include: { file: true },
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
    });
  }

  courts(status?: string) {
    return this.prisma.court.findMany({
      ...(status ? { where: { approvalStatus: status } } : {}),
      orderBy: { createdAt: 'desc' },
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            owner: { select: { id: true, name: true, email: true } },
          },
        },
        photos: {
          include: { file: true },
          orderBy: { sortOrder: 'asc' },
        },
        priceRules: {
          orderBy: { validFrom: 'desc' },
        },
      },
    });
  }

  async approveCourt(adminId: string, courtId: string) {
    const court = await this.prisma.court.findUnique({
      where: { id: courtId },
      include: { photos: true },
    });
    if (!court) throw new DomainError('NOT_FOUND', 'Court not found');
    if (court.photos.length < 2 || court.photos.length > 6) {
      throw new DomainError(
        'VALIDATION_FAILED',
        'Court must have between 2 and 6 photos before approval',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.court.update({
        where: { id: courtId },
        data: { approvalStatus: 'approved', isActive: true, rejectionReason: null },
      });
      await tx.auditLog.create({
        data: {
          actorId: adminId,
          actorRole: 'admin',
          action: 'court.approved',
          targetType: 'court',
          targetId: courtId,
        },
      });
      return updated;
    });
  }

  async rejectCourt(adminId: string, courtId: string, reason?: string) {
    const court = await this.prisma.court.findUnique({ where: { id: courtId } });
    if (!court) throw new DomainError('NOT_FOUND', 'Court not found');

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.court.update({
        where: { id: courtId },
        data: { approvalStatus: 'rejected', isActive: false, rejectionReason: reason ?? null },
      });
      await tx.auditLog.create({
        data: {
          actorId: adminId,
          actorRole: 'admin',
          action: 'court.rejected',
          targetType: 'court',
          targetId: courtId,
          reason: reason ?? null,
        },
      });
      return updated;
    });
  }
  geography() {
    return this.prisma.city.findMany({
      orderBy: { nameEn: 'asc' },
      select: { id: true, nameEn: true, nameAr: true, areas: { orderBy: { nameEn: 'asc' } } },
    });
  }

  async createArea(adminId: string, cityId: string, nameEn: string, nameAr: string) {
    const city = await this.prisma.city.findUnique({ where: { id: cityId } });
    if (!city) throw new DomainError('NOT_FOUND', 'City not found');
    return this.prisma.$transaction(async (tx) => {
      const area = await tx.area.create({ data: { cityId, nameEn, nameAr } });
      await tx.auditLog.create({
        data: {
          actorId: adminId,
          actorRole: 'admin',
          action: 'geography.area_created',
          targetType: 'area',
          targetId: area.id,
          newValue: { cityId, nameEn, nameAr },
        },
      });
      return area;
    });
  }
  async approveOwner(adminId: string, ownerId: string) {
    const owner = await this.prisma.user.findUnique({ where: { id: ownerId } });
    if (!owner) throw new DomainError('NOT_FOUND', 'Owner not found');
    if (owner.role !== 'owner') {
      throw new DomainError('VALIDATION_FAILED', 'User is not an owner');
    }
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.user.update({ where: { id: ownerId }, data: { status: 'active' } });
      await tx.auditLog.create({
        data: {
          actorId: adminId,
          actorRole: 'admin',
          action: 'owner.approved',
          targetType: 'user',
          targetId: ownerId,
          oldValue: { status: owner.status },
          newValue: { status: 'active' },
        },
      });
      return updated;
    });
  }

  async setUserStatus(
    adminId: string,
    userId: string,
    status: 'active' | 'blocked' | 'suspended' | 'pending',
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new DomainError('NOT_FOUND', 'User not found');
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.user.update({ where: { id: userId }, data: { status } });
      await tx.auditLog.create({
        data: {
          actorId: adminId,
          actorRole: 'admin',
          action: `user.${status}`,
          targetType: 'user',
          targetId: userId,
          oldValue: { status: user.status },
          newValue: { status },
        },
      });
      return updated;
    });
  }
  async generatePayout(adminId: string, venueId: string, periodStart: Date, periodEnd: Date) {
    const entries = await this.prisma.ledgerEntry.findMany({
      where: {
        venueId,
        account: 'VENUE_BALANCE',
        createdAt: { gte: periodStart, lt: periodEnd },
        payoutId: null,
      },
    });
    const amount = entries.reduce((sum, entry) => sum + entry.amountPiastres, 0);
    if (amount <= 0) throw new DomainError('CONFLICT', 'No released balance');
    return this.prisma.$transaction(async (tx) => {
      const payout = await tx.payout.create({
        data: { venueId, periodStart, periodEnd, amountPiastres: amount, status: 'draft' },
      });
      for (const entry of entries)
        await tx.ledgerEntry.update({ where: { id: entry.id }, data: { payoutId: payout.id } });
      await tx.auditLog.create({
        data: {
          actorId: adminId,
          actorRole: 'admin',
          action: 'payout.generated',
          targetType: 'payout',
          targetId: payout.id,
          newValue: { amountPiastres: amount },
        },
      });
      return payout;
    });
  }

  payouts() {
    return this.prisma.payout.findMany({ orderBy: { createdAt: 'desc' } });
  }

  stuckItems() {
    return this.prisma.refund.findMany({
      where: { status: 'failed' },
      orderBy: { updatedAt: 'asc' },
      select: {
        id: true,
        reservationId: true,
        amountPiastres: true,
        attempts: true,
        lastError: true,
        updatedAt: true,
      },
    });
  }

  async bulkCancel(adminId: string, reservationIds: string[]) {
    const results = [];
    for (const reservationId of reservationIds) {
      try {
        results.push(
          await this.bookings.operatorCancel(
            adminId,
            'admin',
            reservationId,
            `admin-close:${reservationId}`,
          ),
        );
      } catch (error) {
        results.push({
          reservationId,
          status: 'failed',
          reason: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
    return results;
  }

  async updatePayout(
    adminId: string,
    payoutId: string,
    action: 'approve' | 'mark_paid',
    paymentReference?: string,
  ) {
    const payout = await this.prisma.payout.findUnique({ where: { id: payoutId } });
    if (!payout) throw new DomainError('NOT_FOUND', 'Payout not found');
    if (action === 'approve' && payout.status !== 'draft')
      throw new DomainError('CONFLICT', 'Payout is not a draft');
    if (action === 'mark_paid' && payout.status !== 'approved')
      throw new DomainError('CONFLICT', 'Payout must be approved first');
    const status = action === 'approve' ? 'approved' : 'paid';
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.payout.update({
        where: { id: payoutId },
        data: {
          status,
          approvedBy: action === 'approve' ? adminId : payout.approvedBy,
          paidAt: action === 'mark_paid' ? new Date() : payout.paidAt,
          paymentReference:
            action === 'mark_paid' ? (paymentReference ?? null) : payout.paymentReference,
        },
      });
      await tx.auditLog.create({
        data: {
          actorId: adminId,
          actorRole: 'admin',
          action: `payout.${action === 'mark_paid' ? 'paid' : 'approved'}`,
          targetType: 'payout',
          targetId: payoutId,
        },
      });
      return updated;
    });
  }

  async financialOverview() {
    const [reservationAgg, cashCollectedAgg, commissionAgg, onlinePaymentsAgg, payoutsAgg] =
      await Promise.all([
        this.prisma.reservation.aggregate({
          where: {
            status: { in: ['confirmed', 'arrived', 'completed'] },
          },
          _sum: {
            totalPiastres: true,
            paidPiastres: true,
            depositPiastres: true,
            dueAtVenuePiastres: true,
          },
          _count: { _all: true },
        }),
        this.prisma.reservation.aggregate({
          where: {
            venueCollectedAt: { not: null },
          },
          _sum: {
            totalPiastres: true,
            paidPiastres: true,
            depositPiastres: true,
          },
          _count: { _all: true },
        }),
        this.prisma.ledgerEntry.aggregate({
          where: { account: 'COMMISSION' },
          _sum: { amountPiastres: true },
        }),
        this.prisma.payment.aggregate({
          where: { status: 'paid' },
          _sum: { amountPiastres: true },
        }),
        this.prisma.payout.aggregate({
          _sum: { amountPiastres: true },
        }),
      ]);

    const totalGmvPiastres = reservationAgg._sum?.totalPiastres ?? 0;
    const totalBookingsCount = reservationAgg._count._all;

    // Venue cash collected is paidPiastres - depositPiastres for bookings where venueCollectedAt is stamped
    const venueCashCollectedPiastres = Math.max(
      0,
      (cashCollectedAgg._sum?.paidPiastres ?? 0) - (cashCollectedAgg._sum?.depositPiastres ?? 0),
    );
    const venueCashBookingsCount = cashCollectedAgg._count._all;

    const commissionEarnedPiastres = commissionAgg._sum?.amountPiastres ?? 0;
    const onlineVolumePiastres = onlinePaymentsAgg._sum?.amountPiastres ?? 0;
    const settledPayoutsPiastres = payoutsAgg._sum?.amountPiastres ?? 0;
    const pendingCashAtVenuesPiastres = reservationAgg._sum?.dueAtVenuePiastres ?? 0;

    return {
      totalGmvPiastres,
      totalBookingsCount,
      venueCashCollectedPiastres,
      venueCashBookingsCount,
      commissionEarnedPiastres,
      onlineVolumePiastres,
      settledPayoutsPiastres,
      pendingCashAtVenuesPiastres,
    };
  }
}
