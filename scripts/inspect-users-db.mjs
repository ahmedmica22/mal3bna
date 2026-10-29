import { PrismaClient } from '../apps/api/node_modules/@prisma/client/index.js';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      playerProfile: {
        select: {
          photoFileId: true,
          photoFile: true,
          preferredFoot: true,
          playingStyle: true,
          padelLevel: true,
        },
      },
      reservations: {
        select: {
          id: true,
          bookingCode: true,
          status: true,
          startsAt: true,
          court: { select: { name: true, venue: { select: { name: true } } } },
        },
      },
    },
  });

  for (const u of users) {
    console.log(`\nUser: ${u.email} (${u.role}) | Name: ${u.name} | Bookings: ${u.reservations.length}`);
    console.log('Player Profile:', JSON.stringify(u.playerProfile));
    for (const r of u.reservations) {
      console.log(`  - [${r.status}] ${r.bookingCode} | ${r.startsAt.toISOString()} | Venue: ${r.court.venue.name}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
