import { Inject, Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { DomainError } from '../../domain/errors';
import type { PaymentGateway } from '../bookings/application/payment-gateway';
import { LedgerService } from '../bookings/infrastructure/ledger.service';

@Injectable()
export class TrustService {
  constructor(
    private readonly prisma: PrismaClient,
    @Inject('PAYMENT_GATEWAY') private readonly gateway: PaymentGateway,
  ) {}

  listStrikes(playerId: string) {
    return this.prisma.strike.findMany({
      where: { playerId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        reservationId: true,
        venueId: true,
        expiresAt: true,
        removedAt: true,
        removedReason: true,
        createdAt: true,
        venue: { select: { id: true, name: true } },
        reservation: { select: { id: true, bookingCode: true, startsAt: true } },
      },
    });
  }

  async profile(playerId: string) {
    const profile = await this.prisma.playerProfile.findUnique({
      where: { userId: playerId },
      include: {
        photoFile: {
          select: {
            id: true,
            storageKey: true,
          },
        },
      },
    });
    if (!profile) return null;
    return {
      userId: profile.userId,
      photoFileId: profile.photoFileId,
      photoUrl: profile.photoFile?.storageKey ?? null,
      preferredFoot: profile.preferredFoot,
      playingStyle: profile.playingStyle,
      position1: profile.position1,
      position2: profile.position2,
      areaId: profile.areaId,
      padelSide: profile.padelSide,
      padelHand: profile.padelHand,
      padelLevel: profile.padelLevel,
    };
  }

  async updateProfile(
    playerId: string,
    input: {
      preferredFoot?: string | undefined;
      playingStyle?: string | undefined;
      position1?: string | undefined;
      position2?: string | undefined;
      areaId?: string | undefined;
      padelSide?: string | undefined;
      padelHand?: string | undefined;
      padelLevel?: string | undefined;
      photoFileId?: string | undefined;
      photoUrl?: string | undefined;
    },
  ) {
    let resolvedPhotoFileId = input.photoFileId;
    if (input.photoUrl) {
      const file = await this.prisma.file.create({
        data: {
          uploadedBy: playerId,
          purpose: 'player_photo',
          visibility: 'public',
          storageKey: input.photoUrl,
          mimeType: input.photoUrl.startsWith('data:image/png')
            ? 'image/png'
            : input.photoUrl.startsWith('data:image/webp')
              ? 'image/webp'
              : 'image/jpeg',
          size: Math.max(1024, Math.round(input.photoUrl.length * 0.75)),
        },
      });
      resolvedPhotoFileId = file.id;
    }

    const updateData: Prisma.PlayerProfileUncheckedUpdateInput = {};
    if (input.preferredFoot !== undefined) updateData.preferredFoot = input.preferredFoot;
    if (input.playingStyle !== undefined) updateData.playingStyle = input.playingStyle;
    if (input.position1 !== undefined) updateData.position1 = input.position1;
    if (input.position2 !== undefined) updateData.position2 = input.position2;
    if (input.areaId !== undefined) updateData.areaId = input.areaId;
    if (input.padelSide !== undefined) updateData.padelSide = input.padelSide;
    if (input.padelHand !== undefined) updateData.padelHand = input.padelHand;
    if (input.padelLevel !== undefined) updateData.padelLevel = input.padelLevel;
    if (resolvedPhotoFileId !== undefined) updateData.photoFileId = resolvedPhotoFileId;

    const saved = await this.prisma.playerProfile.upsert({
      where: { userId: playerId },
      create: {
        userId: playerId,
        preferredFoot: input.preferredFoot ?? null,
        playingStyle: input.playingStyle ?? null,
        position1: input.position1 ?? null,
        position2: input.position2 ?? null,
        areaId: input.areaId ?? null,
        padelSide: input.padelSide ?? null,
        padelHand: input.padelHand ?? null,
        padelLevel: input.padelLevel ?? null,
        photoFileId: resolvedPhotoFileId ?? null,
      },
      update: updateData,
      include: {
        photoFile: {
          select: {
            id: true,
            storageKey: true,
          },
        },
      },
    });

    return {
      userId: saved.userId,
      photoFileId: saved.photoFileId,
      photoUrl: saved.photoFile?.storageKey ?? null,
      preferredFoot: saved.preferredFoot,
      playingStyle: saved.playingStyle,
      position1: saved.position1,
      position2: saved.position2,
      areaId: saved.areaId,
      padelSide: saved.padelSide,
      padelHand: saved.padelHand,
      padelLevel: saved.padelLevel,
    };
  }

  async createDispute(playerId: string, reservationId: string, playerMessage: string) {
    const reservation = await this.prisma.reservation.findFirst({
      where: { id: reservationId, playerId, status: 'no_show_pending' },
      include: { strike: true, dispute: true },
    });
    if (!reservation) throw new DomainError('NOT_FOUND', 'No-show booking not found');
    const reportAt = reservation.noShowMarkedAt?.getTime();
    if (!reportAt || Date.now() > reportAt + 48 * 60 * 60_000)
      throw new DomainError('CONFLICT', 'The dispute window has closed');
    if (reservation.dispute) {
      if (reservation.dispute.status !== 'open')
        throw new DomainError('CONFLICT', 'A dispute has already been decided');
      return this.prisma.dispute.update({
        where: { id: reservation.dispute.id },
        data: { playerMessage },
      });
    }
    return this.prisma.$transaction(async (tx) => {
      const dispute = await tx.dispute.create({
        data: {
          reservationId,
          strikeId: reservation.strike?.id ?? null,
          playerMessage,
          status: 'open',
        },
      });
      await tx.auditLog.create({
        data: {
          actorId: playerId,
          actorRole: 'player',
          action: 'dispute.created',
          targetType: 'reservation',
          targetId: reservationId,
          newValue: { disputeId: dispute.id },
        },
      });
      return dispute;
    });
  }

  listDisputes(playerId: string) {
    return this.prisma.dispute.findMany({
      where: { reservation: { playerId } },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        reservationId: true,
        playerMessage: true,
        ownerResponse: true,
        status: true,
        decidedAt: true,
        createdAt: true,
      },
    });
  }

  async createAppeal(playerId: string, message: string) {
    const active = await this.prisma.strike.count({
      where: { playerId, expiresAt: { gt: new Date() }, removedAt: null },
    });
    if (active < 4)
      throw new DomainError('CONFLICT', 'An appeal is available only for a blocked player');
    const pending = await this.prisma.appeal.findFirst({ where: { playerId, status: 'open' } });
    if (pending) throw new DomainError('CONFLICT', 'An appeal is already open');
    return this.prisma.appeal.create({ data: { playerId, message, status: 'open' } });
  }

  listAppeals(playerId: string) {
    return this.prisma.appeal.findMany({
      where: { playerId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        message: true,
        status: true,
        decidedAt: true,
        nextAllowedAt: true,
        createdAt: true,
      },
    });
  }

  async decideDispute(
    adminId: string,
    disputeId: string,
    decision: 'upheld' | 'overturned',
    note: string,
  ) {
    const dispute = await this.prisma.dispute.findUnique({
      where: { id: disputeId },
      include: { reservation: true },
    });
    if (!dispute || dispute.status !== 'open')
      throw new DomainError('NOT_FOUND', 'Open dispute not found');
    const payment = (
      await this.prisma.payment.findMany({
        where: { reservationId: dispute.reservationId, status: 'paid' },
      })
    )[0];
    const refundAmount = payment
      ? Math.max(0, payment.amountPiastres - dispute.reservation.depositPiastres)
      : 0;
    let gatewayRefund: { refunded: boolean; gatewayRefundId: string } | undefined;
    if (decision === 'upheld' && payment && refundAmount > 0)
      gatewayRefund = await this.gateway.refundPayment({
        sessionId: payment.gatewaySessionId,
        amountPiastres: refundAmount,
        idempotencyKey: `dispute:${disputeId}`,
      });
    if (gatewayRefund && !gatewayRefund.refunded)
      throw new DomainError('REFUND_FAILED', 'Refund is pending retry');
    return this.prisma.$transaction(async (tx) => {
      let strikeId = dispute.strikeId;
      if (decision === 'upheld' && !strikeId && dispute.reservation.playerId) {
        const strike = await tx.strike.create({
          data: {
            playerId: dispute.reservation.playerId,
            reservationId: dispute.reservationId,
            venueId: dispute.reservation.venueId,
            expiresAt: new Date(Date.now() + 183 * 24 * 60 * 60_000),
          },
        });
        strikeId = strike.id;
      }
      if (decision === 'upheld' && payment && gatewayRefund && refundAmount > 0) {
        const refund = await tx.refund.create({
          data: {
            paymentId: payment.id,
            reservationId: dispute.reservationId,
            amountPiastres: refundAmount,
            reason: 'no_show',
            status: 'succeeded',
            gatewayRefundId: gatewayRefund.gatewayRefundId,
            idempotencyKey: `dispute:${disputeId}`,
          },
        });
        await LedgerService.recordRefund(tx, {
          reservationId: dispute.reservationId,
          venueId: dispute.reservation.venueId,
          paymentId: payment.id,
          refundId: refund.id,
          amountPiastres: refundAmount,
        });
        if (new Date() >= dispute.reservation.endsAt)
          await LedgerService.recordRelease(tx, {
            reservationId: dispute.reservationId,
            venueId: dispute.reservation.venueId,
            amountPiastres: dispute.reservation.depositPiastres,
            commissionBp: dispute.reservation.commissionBp,
            idempotencyKey: `no-show-release:${dispute.reservationId}`,
          });
      }
      await tx.dispute.update({
        where: { id: disputeId },
        data: {
          status: decision,
          strikeId,
          decidedBy: adminId,
          decidedAt: new Date(),
          decisionNote: note,
        },
      });
      await tx.reservation.update({
        where: { id: dispute.reservationId },
        data: { status: decision === 'upheld' ? 'no_show' : 'confirmed' },
      });
      await tx.auditLog.create({
        data: {
          actorId: adminId,
          actorRole: 'admin',
          action: 'dispute.decided',
          targetType: 'dispute',
          targetId: disputeId,
          reason: note,
          newValue: { decision, strikeId },
        },
      });
      return { disputeId, decision, strikeId };
    });
  }

  async decideAppeal(
    adminId: string,
    appealId: string,
    decision: 'rejected' | 'unblocked' | 'strikes_removed',
  ) {
    const appeal = await this.prisma.appeal.findUnique({ where: { id: appealId } });
    if (!appeal || appeal.status !== 'open')
      throw new DomainError('NOT_FOUND', 'Open appeal not found');
    return this.prisma.$transaction(async (tx) => {
      if (decision !== 'rejected')
        await tx.strike.updateMany({
          where: { playerId: appeal.playerId, expiresAt: { gt: new Date() }, removedAt: null },
          data: { removedAt: new Date(), removedBy: adminId, removedReason: 'appeal_approved' },
        });
      await tx.appeal.update({
        where: { id: appealId },
        data: { status: decision, decidedBy: adminId, decidedAt: new Date() },
      });
      await tx.auditLog.create({
        data: {
          actorId: adminId,
          actorRole: 'admin',
          action: 'appeal.decided',
          targetType: 'appeal',
          targetId: appealId,
          newValue: { decision },
        },
      });
      return { appealId, decision };
    });
  }

  adminListDisputes() {
    return this.prisma.dispute.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        reservation: {
          select: {
            id: true,
            bookingCode: true,
            startsAt: true,
            endsAt: true,
            status: true,
            court: { select: { name: true, sport: true } },
            venue: { select: { name: true } },
            player: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });
  }

  adminListAppeals() {
    return this.prisma.appeal.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        player: { select: { id: true, name: true, email: true } },
      },
    });
  }
}
