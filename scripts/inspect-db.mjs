import { PrismaClient } from '../apps/api/node_modules/@prisma/client/default.js';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://court_booking:court_booking@127.0.0.1:15432/court_booking?schema=public',
    },
  },
});

async function main() {
  const users = await prisma.user.findMany({
    select: { role: true, email: true, name: true, phone: true },
    orderBy: { createdAt: 'asc' },
  });
  const venues = await prisma.venue.findMany({
    select: {
      name: true,
      owner: { select: { email: true } },
      courts: { select: { name: true } },
    },
  });
  const reservations = await prisma.reservation.findMany({
    select: {
      bookingCode: true,
      status: true,
      venue: { select: { name: true } },
      court: { select: { name: true } },
      player: { select: { email: true } },
    },
  });

  console.log('=== REMAINING DATABASE OVERVIEW ===');
  console.log(`\nUSERS (${users.length}):`);
  for (const u of users) {
    console.log(`- [${u.role}] ${u.email} (${u.name}, ${u.phone})`);
  }

  console.log(`\nVENUES (${venues.length}):`);
  for (const v of venues) {
    console.log(`- "${v.name}" (Owner: ${v.owner.email}) | Courts: ${v.courts.map(c => c.name).join(', ')}`);
  }

  console.log(`\nRESERVATIONS (${reservations.length}):`);
  for (const r of reservations) {
    console.log(`- ${r.bookingCode} [${r.status}] Venue: "${r.venue.name}", Court: "${r.court.name}", Player: ${r.player?.email}`);
  }
}

main().finally(() => prisma.$disconnect());
