import 'reflect-metadata';
import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';
import { assertPasswordAllowed } from '../modules/auth/domain/password-policy';

interface Arguments {
  email: string;
  name: string;
  password: string;
}

async function main(): Promise<void> {
  const args = parseArguments(process.argv.slice(2));
  assertPasswordAllowed(args.password, true);
  const prisma = new PrismaClient();
  try {
    const existing = await prisma.user.findUnique({ where: { email: args.email.toLowerCase() } });
    if (existing) throw new Error('An account with this email already exists');
    await prisma.user.create({
      data: {
        email: args.email.toLowerCase(),
        passwordHash: await argon2.hash(args.password, { type: argon2.argon2id }),
        role: 'admin',
        status: 'active',
        name: args.name,
        language: 'en',
        emailVerifiedAt: new Date(),
        phoneVerified: false,
      },
    });
    console.log(`Created admin ${args.email.toLowerCase()}`);
  } finally {
    await prisma.$disconnect();
  }
}

function parseArguments(argv: string[]): Arguments {
  const values = new Map<string, string>();
  for (let index = 0; index < argv.length; index += 2) {
    const name = argv[index];
    const value = argv[index + 1];
    if (!name?.startsWith('--') || !value)
      throw new Error('Usage: admin:create --email EMAIL --name NAME --password PASSWORD');
    values.set(name.slice(2), value);
  }
  const email = values.get('email');
  const name = values.get('name');
  const password = values.get('password') ?? process.env.ADMIN_PASSWORD;
  if (!email || !name || !password)
    throw new Error('Usage: admin:create --email EMAIL --name NAME --password PASSWORD');
  if (!email.includes('@')) throw new Error('Admin email is invalid');
  return { email, name, password };
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Admin creation failed');
  process.exitCode = 1;
});
