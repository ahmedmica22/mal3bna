import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { PrismaOwnerOperationsService } from './prisma-owner-operations.service';
import { AdminService } from '../../admin/admin.service';
import { PrismaBookingService } from '../../bookings/infrastructure/prisma-booking.service';
import { FakePaymentGateway } from '../../bookings/application/fake-payment.gateway';
import {
  createTestVenueFixture,
  cleanupTestVenueFixture,
} from '../../../test/integration-fixtures';

const integration = process.env.RUN_INTEGRATION === '1' ? describe : describe.skip;

integration('Cash Collection Visibility for Super Admin and Owner', () => {
  const prisma = new PrismaClient();
  const bookings = new PrismaBookingService(prisma, new FakePaymentGateway());
  const ownerOps = new PrismaOwnerOperationsService(prisma, bookings);
  const adminService = new AdminService(prisma, bookings);

  let fixture: Awaited<ReturnType<typeof createTestVenueFixture>>;

  beforeAll(async () => {
    fixture = await createTestVenueFixture(prisma);
  });

  afterAll(async () => {
    if (fixture) {
      await cleanupTestVenueFixture(prisma, fixture);
    }
    await prisma.$disconnect();
  });

  it('updates owner balance and super admin financial overview when cash is collected', async () => {
    const ownerId = fixture.owner.id;
    const venueId = fixture.venue.id;
    const courtId = fixture.court1.id;

    // 1. Baselines
    const baselineAdminFinance = await adminService.financialOverview();
    const baselineOwnerBalance = await ownerOps.balance(ownerId);

    // 2. Create booking with 30% deposit
    const totalPiastres = 40000; // 400 EGP
    const depositPiastres = 12000; // 120 EGP
    const dueAtVenuePiastres = 28000; // 280 EGP

    const startsAt = new Date(Date.now() + 86400000 * 3);
    const endsAt = new Date(startsAt.getTime() + 3600000);

    const booking = await prisma.reservation.create({
      data: {
        courtId,
        venueId,
        kind: 'booking',
        status: 'confirmed',
        startsAt,
        endsAt,
        customerName: 'Integration Player',
        totalPiastres,
        depositPiastres,
        paidPiastres: depositPiastres,
        dueAtVenuePiastres,
        commissionBp: 1000,
        priceBreakdown: [{ hour: 1, pricePiastres: totalPiastres }],
        bookingCode: `TST-${Date.now().toString(36).toUpperCase()}`,
        paymentOption: 'deposit',
      },
    });

    // 3. Before collection: booking has dueAtVenuePiastres
    expect(booking.dueAtVenuePiastres).toBe(dueAtVenuePiastres);
    expect(booking.venueCollectedAt).toBeNull();

    // 4. Owner collects cash
    const collected = await ownerOps.collect(ownerId, booking.id);
    expect(collected.dueAtVenuePiastres).toBe(0);
    expect(collected.paidPiastres).toBe(totalPiastres);
    expect(collected.venueCollectedAt).toBeInstanceOf(Date);
    expect(collected.collectedBy).toBe(ownerId);

    // 5. Verify Owner balance has increased by 280 EGP
    const postOwnerBalance = await ownerOps.balance(ownerId);
    expect(
      postOwnerBalance.cashCollectedPiastres - baselineOwnerBalance.cashCollectedPiastres,
    ).toBe(dueAtVenuePiastres);
    expect(
      postOwnerBalance.todayCashCollectedPiastres - baselineOwnerBalance.todayCashCollectedPiastres,
    ).toBe(dueAtVenuePiastres);

    // 6. Verify Super Admin Financial Overview has increased by 280 EGP
    const postAdminFinance = await adminService.financialOverview();
    expect(
      postAdminFinance.venueCashCollectedPiastres - baselineAdminFinance.venueCashCollectedPiastres,
    ).toBe(dueAtVenuePiastres);
    expect(
      postAdminFinance.venueCashBookingsCount - baselineAdminFinance.venueCashBookingsCount,
    ).toBe(1);

    // 7. Verify Admin Bookings list includes venueCollectedAt
    const adminBookings = await adminService.listBookings(1, 10);
    const found = adminBookings.items.find((b) => b.id === booking.id);
    expect(found).toBeDefined();
    expect(found?.venueCollectedAt).toBeInstanceOf(Date);
    expect(found?.dueAtVenuePiastres).toBe(0);
    expect(found?.paidPiastres).toBe(totalPiastres);
  });
});
