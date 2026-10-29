import { describe, expect, it } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { AdminService } from './admin.service';
import { PrismaBookingService } from '../bookings/infrastructure/prisma-booking.service';
import { PrismaOwnerVenueService } from '../venues/infrastructure/prisma-owner-venue.service';
import { FakePaymentGateway } from '../bookings/application/fake-payment.gateway';
import { createTestVenueFixture, cleanupTestVenueFixture } from '../../test/integration-fixtures';

const integration = process.env.RUN_INTEGRATION === '1' ? describe : describe.skip;

integration('admin workflow integration', () => {
  it('persists geography/status changes and bulk-cancels a manual reservation', async () => {
    const prisma = new PrismaClient();
    const bookingService = new PrismaBookingService(prisma, new FakePaymentGateway());
    const adminService = new AdminService(prisma, bookingService);
    let fixture: Awaited<ReturnType<typeof createTestVenueFixture>> | undefined;
    let reservationId: string | undefined;

    try {
      fixture = await createTestVenueFixture(prisma);
      const court = fixture.court1;

      const admin = await prisma.user.create({
        data: {
          email: `workflow-admin-${Date.now()}@example.test`,
          passwordHash: 'test',
          role: 'admin',
          status: 'active',
          name: 'Workflow Admin',
          language: 'en',
          emailVerifiedAt: new Date(),
        },
      });
      const player = await prisma.user.create({
        data: {
          email: `workflow-player-${Date.now()}@example.test`,
          passwordHash: 'test',
          role: 'player',
          status: 'active',
          name: 'Workflow Player',
          language: 'en',
          emailVerifiedAt: new Date(),
        },
      });

      const startsAt = new Date(Date.now() + 27 * 24 * 60 * 60_000);
      startsAt.setUTCMinutes(0, 0, 0);
      const reservation = await prisma.reservation.create({
        data: {
          courtId: court.id,
          venueId: court.venueId,
          kind: 'manual',
          status: 'confirmed',
          startsAt,
          endsAt: new Date(startsAt.getTime() + 60 * 60_000),
          playerId: player.id,
          customerName: 'Admin workflow',
          totalPiastres: 1000,
          depositPiastres: 0,
          dueAtVenuePiastres: 1000,
          commissionBp: 0,
          priceBreakdown: [],
          bookingCode: `A-${Date.now().toString(36)}`,
        },
      });
      reservationId = reservation.id;

      await adminService.setUserStatus(admin.id, player.id, 'suspended');
      expect((await prisma.user.findUniqueOrThrow({ where: { id: player.id } })).status).toBe(
        'suspended',
      );
      expect((await adminService.geography()).length).toBeGreaterThan(0);
      const result = await adminService.bulkCancel(admin.id, [reservation.id]);
      expect(result[0]).toMatchObject({ status: 'cancelled' });
      expect(
        (await prisma.reservation.findUniqueOrThrow({ where: { id: reservation.id } })).status,
      ).toBe('cancelled');
    } finally {
      if (reservationId) {
        await prisma.reservation.deleteMany({ where: { id: reservationId } });
      }
      if (fixture) {
        await cleanupTestVenueFixture(prisma, fixture);
      }
      await prisma.$disconnect();
    }
  }, 30000);

  it('enforces that owner request must be approved by super admin before owner can register venue info', async () => {
    const prisma = new PrismaClient();
    const adminService = new AdminService(
      prisma,
      new PrismaBookingService(prisma, new FakePaymentGateway()),
    );
    const ownerVenueService = new PrismaOwnerVenueService(prisma);
    const suffix = Date.now().toString(36);

    const admin = await prisma.user.create({
      data: {
        email: `admin-approval-${suffix}@example.test`,
        passwordHash: 'test',
        role: 'admin',
        status: 'active',
        name: 'Approval Admin',
      },
    });

    const pendingOwner = await prisma.user.create({
      data: {
        email: `pending-owner-${suffix}@example.test`,
        passwordHash: 'test',
        role: 'owner',
        status: 'pending',
        name: 'Pending Owner',
      },
    });

    const area = await prisma.area.findFirstOrThrow();
    const venueInput = {
      areaId: area.id,
      name: `Test Venue ${suffix}`,
      description: 'Test description',
      phone: '+201012345678',
      latitude: 30.0444,
      longitude: 31.2357,
      address: 'Test Address',
    };

    let venueId: string | undefined;
    try {
      // 1. Should reject venue creation while owner status is 'pending'
      await expect(ownerVenueService.register(pendingOwner.id, venueInput)).rejects.toThrow(
        /pending approval by the super admin/i,
      );

      // 2. Super admin approves the owner request
      const approvedOwner = await adminService.approveOwner(admin.id, pendingOwner.id);
      expect(approvedOwner.status).toBe('active');

      // 3. Now owner can successfully send and register venue info
      const createdVenue = await ownerVenueService.register(pendingOwner.id, venueInput);
      expect(createdVenue.status).toBe('pending');
      expect(createdVenue.name).toBe(venueInput.name);
      venueId = createdVenue.id;

      // 4. Super admin approves the submitted venue
      const approvedVenue = await adminService.decideVenue(admin.id, createdVenue.id, 'approved');
      expect(approvedVenue.status).toBe('approved');
    } finally {
      if (venueId) {
        await prisma.venue.deleteMany({ where: { id: venueId } });
      }
      await prisma.$disconnect();
    }
  }, 30000);
});
