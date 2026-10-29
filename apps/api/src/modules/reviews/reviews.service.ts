import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { DomainError } from '../../domain/errors';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaClient) {}

  listVenue(venueId: string) {
    return this.prisma.review.findMany({
      where: { venueId, status: 'visible' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        rating: true,
        comment: true,
        ownerReply: true,
        ownerRepliedAt: true,
        createdAt: true,
      },
    });
  }

  async create(playerId: string, reservationId: string, rating: number, comment?: string) {
    const reservation = await this.prisma.reservation.findFirst({
      where: { id: reservationId, playerId, status: 'completed' },
      include: { review: true },
    });
    if (!reservation) throw new DomainError('NOT_FOUND', 'Completed booking not found');
    if (reservation.review) throw new DomainError('CONFLICT', 'A review already exists');
    return this.prisma.review.create({
      data: {
        reservationId,
        playerId,
        venueId: reservation.venueId,
        rating,
        comment: comment ?? null,
      },
    });
  }

  async reply(ownerId: string, reviewId: string, reply: string) {
    const review = await this.prisma.review.findFirst({
      where: { id: reviewId, venue: { ownerId } },
    });
    if (!review) throw new DomainError('NOT_FOUND', 'Review not found');
    return this.prisma.review.update({
      where: { id: reviewId },
      data: { ownerReply: reply, ownerRepliedAt: new Date() },
    });
  }

  async remove(adminId: string, reviewId: string, reason: string) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new DomainError('NOT_FOUND', 'Review not found');
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.review.update({
        where: { id: reviewId },
        data: { status: 'removed', removedBy: adminId },
      });
      await tx.auditLog.create({
        data: {
          actorId: adminId,
          actorRole: 'admin',
          action: 'review.removed',
          targetType: 'review',
          targetId: reviewId,
          reason,
        },
      });
      return updated;
    });
  }
}
