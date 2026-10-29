const { PrismaClient } = require('./apps/api/node_modules/@prisma/client');
const argon2 = require('./apps/api/node_modules/argon2');

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      fullName: true,
      emailVerifiedAt: true,
      passwordHash: true,
    },
  });

  console.log('Total users:', users.length);
  for (const u of users) {
    const isTestPass = await argon2.verify(u.passwordHash, 'Password123!').catch(() => false);
    const isPlayerPass = await argon2
      .verify(u.passwordHash, 'PlayerPassword123!')
      .catch(() => false);
    const isOwnerPass = await argon2.verify(u.passwordHash, 'OwnerPassword123!').catch(() => false);
    console.log(
      `- ${u.email} | Role: ${u.role} | Verified: ${!!u.emailVerifiedAt} | Passwords: Password123!=${isTestPass}, PlayerPassword123!=${isPlayerPass}, OwnerPassword123!=${isOwnerPass}`,
    );
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
