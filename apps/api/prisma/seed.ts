import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function cleanAndSeedGeographyOnly() {
  console.log('Cleaning all non-geography tables...');

  // 1. Delete dependent operational tables
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE 
      "Review",
      "Appeal",
      "Dispute",
      "Strike",
      "Payout",
      "LedgerEntry",
      "Refund",
      "Payment",
      "Reservation",
      "PriceRule",
      "OpeningHour",
      "Court",
      "VenuePhoto",
      "VenueDocument",
      "CommissionChange",
      "Venue",
      "PlayerProfile",
      "OwnerProfile",
      "Session",
      "RefreshTokenHistory",
      "EmailVerificationToken",
      "PasswordResetToken",
      "DeviceToken",
      "Notification",
      "NotificationPreference",
      "DeliveryLog",
      "AuditLog",
      "IdempotencyRecord",
      "OutboxEvent",
      "WebhookEvent",
      "BlockedIdentifier",
      "File"
    CASCADE;
  `);

  // Delete non-admin users
  await prisma.$executeRawUnsafe(`
    DELETE FROM "User" WHERE role != 'admin';
  `);

  console.log('All operational data deleted.');

  // 2. Ensure Geography (Cities & Areas)
  const cairo = await prisma.city.upsert({
    where: { id: '40000000-0000-4000-8000-000000000001' },
    update: {},
    create: {
      id: '40000000-0000-4000-8000-000000000001',
      nameEn: 'Cairo',
      nameAr: 'القاهرة',
    },
  });

  const areas = [
    { id: '50000000-0000-4000-8000-000000000001', nameEn: 'New Cairo', nameAr: 'القاهرة الجديدة' },
    { id: '50000000-0000-4000-8000-000000000002', nameEn: 'Nasr City', nameAr: 'مدينة نصر' },
    { id: '50000000-0000-4000-8000-000000000003', nameEn: 'Maadi', nameAr: 'المعادي' },
    { id: '50000000-0000-4000-8000-000000000004', nameEn: 'Zamalek', nameAr: 'الزمالك' },
    { id: '50000000-0000-4000-8000-000000000005', nameEn: 'Heliopolis', nameAr: 'مصر الجديدة' },
    { id: '50000000-0000-4000-8000-000000000006', nameEn: 'Dokki', nameAr: 'الدقي' },
    { id: '50000000-0000-4000-8000-000000000007', nameEn: 'Sheikh Zayed', nameAr: 'الشيخ زايد' },
    {
      id: '50000000-0000-4000-8000-000000000008',
      nameEn: '6th of October',
      nameAr: 'السادس من أكتوبر',
    },
  ];

  for (const a of areas) {
    await prisma.area.upsert({
      where: { id: a.id },
      update: {},
      create: {
        id: a.id,
        cityId: cairo.id,
        nameEn: a.nameEn,
        nameAr: a.nameAr,
      },
    });
  }

  // 3. Ensure Super Admin Account
  const adminPasswordHash = await argon2.hash('AdminPassword123!', { type: argon2.argon2id });
  await prisma.user.upsert({
    where: { id: '00000000-0000-4000-8000-000000000099' },
    update: { passwordHash: adminPasswordHash, status: 'active' },
    create: {
      id: '00000000-0000-4000-8000-000000000099',
      email: 'admin@mal3bna.test',
      passwordHash: adminPasswordHash,
      role: 'admin',
      status: 'active',
      name: 'Super Admin',
      language: 'en',
      emailVerifiedAt: new Date(),
    },
  });

  console.log('Geography and Super Admin confirmed.');
  console.log('Current counts in database:');
  const [venueCount, userCount, courtCount, reservationCount] = await Promise.all([
    prisma.venue.count(),
    prisma.user.count(),
    prisma.court.count(),
    prisma.reservation.count(),
  ]);
  console.log(`- Venues: ${venueCount}`);
  console.log(`- Courts: ${courtCount}`);
  console.log(`- Reservations: ${reservationCount}`);
  console.log(`- Users: ${userCount} (Super Admin only)`);
}

cleanAndSeedGeographyOnly()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
