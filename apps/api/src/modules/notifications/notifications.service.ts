import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaClient) {}
  registerDevice(userId: string, expoToken: string, platform: string) {
    return this.prisma.deviceToken.upsert({
      where: { expoToken },
      create: { userId, expoToken, platform, lastSeenAt: new Date() },
      update: { userId, platform, lastSeenAt: new Date() },
      select: { id: true, platform: true, lastSeenAt: true },
    });
  }
  async removeDevice(userId: string, expoToken: string) {
    await this.prisma.deviceToken.deleteMany({ where: { userId, expoToken } });
    return { accepted: true };
  }
  enqueue(
    tx: Prisma.TransactionClient | PrismaClient,
    input: { type: string; payload: Prisma.InputJsonValue },
  ) {
    return tx.outboxEvent.create({ data: { type: input.type, payload: input.payload } });
  }
  inbox(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        type: true,
        title: true,
        body: true,
        link: true,
        readAt: true,
        createdAt: true,
      },
    });
  }
  async markRead(userId: string, id: string) {
    return this.prisma.notification.updateMany({
      where: { id, userId, readAt: null },
      data: { readAt: new Date() },
    });
  }
  async preferences(userId: string) {
    const [stored, received] = await Promise.all([this.prisma.notificationPreference.findMany({
      where: { userId },
      select: { category: true, emailEnabled: true, pushEnabled: true },
    }), this.prisma.notification.findMany({ where: { userId }, distinct: ['type'], select: { type: true } })]);
    const categories = new Set(['booking.confirmed', ...received.map((row) => row.type), ...stored.map((row) => row.category)]);
    return [...categories].map((category) => stored.find((row) => row.category === category) ?? { category, emailEnabled: true, pushEnabled: true });
  }
  setPreference(userId: string, category: string, emailEnabled: boolean, pushEnabled: boolean) {
    return this.prisma.notificationPreference.upsert({
      where: { userId_category: { userId, category } },
      create: { userId, category, emailEnabled, pushEnabled },
      update: { emailEnabled, pushEnabled },
    });
  }
  async processOnce() {
    const events = await this.prisma.outboxEvent.findMany({
      where: { status: { in: ['pending', 'failed'] } },
      orderBy: { createdAt: 'asc' },
      take: 50,
    });
    let processed = 0;
    for (const event of events) {
      const claimed = await this.prisma.outboxEvent.updateMany({
        where: { id: event.id, status: { in: ['pending', 'failed'] } },
        data: { status: 'processing', attempts: { increment: 1 } },
      });
      if (claimed.count !== 1) continue;
      try {
        const payload = event.payload as {
          userId?: string;
          type?: string;
          title?: string;
          body?: string;
          link?: string;
        };
        if (payload.userId) {
          const notification = await this.prisma.notification.upsert({
            where: { outboxEventId: event.id },
            create: {
              outboxEventId: event.id,
              userId: payload.userId,
              type: payload.type ?? event.type,
              title: payload.title ?? event.type,
              body: payload.body ?? '',
              link: payload.link ?? null,
            },
            update: {},
          });
          const preference = await this.prisma.notificationPreference.findUnique({
            where: { userId_category: { userId: payload.userId, category: event.type } },
          });
          await this.prisma.deliveryLog.createMany({
            data: [
              ...(preference?.emailEnabled === false
                ? []
                : [
                    {
                      notificationId: notification.id,
                      channel: 'email',
                      status: 'sent',
                      sentAt: new Date(),
                    },
                  ]),
              ...(preference?.pushEnabled === false
                ? []
                : [
                    {
                      notificationId: notification.id,
                      channel: 'push',
                      status: 'sent',
                      sentAt: new Date(),
                    },
                  ]),
            ],
            skipDuplicates: true,
          });
        }
        await this.prisma.outboxEvent.update({
          where: { id: event.id },
          data: { status: 'sent' },
        });
        processed += 1;
      } catch {
        await this.prisma.outboxEvent.update({
          where: { id: event.id },
          data: { status: 'failed' },
        });
      }
    }
    return processed;
  }
}
