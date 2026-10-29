import { describe, expect, it } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { NotificationsService } from './notifications.service';

const integration = process.env.RUN_INTEGRATION === '1' ? describe : describe.skip;

integration('notifications outbox integration', () => {
  it('delivers an outbox event once and makes duplicate processing a no-op', async () => {
    const prisma = new PrismaClient();
    const notifications = new NotificationsService(prisma);
    const user = await prisma.user.create({
      data: {
        email: `notification-${Date.now()}@example.test`,
        passwordHash: 'test',
        role: 'player',
        status: 'active',
        name: 'Notification Test',
        language: 'en',
        emailVerifiedAt: new Date(),
      },
    });
    try {
      const event = await notifications.enqueue(prisma, {
        type: 'booking.confirmed',
        payload: {
          userId: user.id,
          type: 'booking.confirmed',
          title: 'Booking confirmed',
          body: 'Your booking is confirmed.',
          link: '/bookings/test',
        },
      });
      await notifications.setPreference(user.id, 'booking.confirmed', true, false);
      expect(await notifications.processOnce()).toBe(1);
      expect(await notifications.processOnce()).toBe(0);
      expect(await prisma.notification.count({ where: { userId: user.id } })).toBe(1);
      expect((await prisma.outboxEvent.findUniqueOrThrow({ where: { id: event.id } })).status).toBe(
        'sent',
      );
      expect((await notifications.inbox(user.id))[0]?.title).toBe('Booking confirmed');
      expect(
        await prisma.deliveryLog.count({
          where: { channel: 'email', notification: { userId: user.id } },
        }),
      ).toBeGreaterThan(0);
      expect(
        await prisma.deliveryLog.count({
          where: { channel: 'push', notification: { userId: user.id } },
        }),
      ).toBe(0);
    } finally {
      const createdNotifications = await prisma.notification.findMany({
        where: { userId: user.id },
        select: { id: true },
      });
      await prisma.deliveryLog.deleteMany({
        where: {
          notificationId: { in: createdNotifications.map((notification) => notification.id) },
        },
      });
      await prisma.notification.deleteMany({ where: { userId: user.id } });
      await prisma.notificationPreference.deleteMany({ where: { userId: user.id } });
      await prisma.user.delete({ where: { id: user.id } });
      await prisma.$disconnect();
    }
  }, 30000);
});
