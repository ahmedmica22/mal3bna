import { Module } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import {
  AuthService,
  AUTH_REPOSITORY,
  EMAIL_SENDER,
  PASSWORD_HASHER,
  TOKEN_SERVICE,
} from './application/auth.service';
import { InMemoryAuthRepository } from './application/in-memory-auth.repository';
import { Argon2PasswordHasher } from './infrastructure/argon2-password.hasher';
import { InMemoryEmailSender } from './infrastructure/in-memory.email-sender';
import { MailpitEmailSender } from './infrastructure/mailpit.email-sender';
import { PrismaAuthRepository } from './infrastructure/prisma-auth.repository';
import { JwtTokenService } from './infrastructure/jwt-token.service';
import { PrismaClient } from '@prisma/client';
import { AuthController } from './presentation/auth.controller';
import { MeController } from './presentation/me.controller';
import { JwtAuthGuard, RolesGuard } from './presentation/guards';

@Module({
  controllers: [AuthController, MeController],
  providers: [
    AuthService,
    Reflector,
    PrismaClient,
    InMemoryAuthRepository,
    PrismaAuthRepository,
    Argon2PasswordHasher,
    InMemoryEmailSender,
    MailpitEmailSender,
    JwtTokenService,
    { provide: AUTH_REPOSITORY, useExisting: PrismaAuthRepository },
    { provide: PASSWORD_HASHER, useExisting: Argon2PasswordHasher },
    { provide: EMAIL_SENDER, useExisting: MailpitEmailSender },
    { provide: TOKEN_SERVICE, useExisting: JwtTokenService },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
  exports: [AuthService, InMemoryAuthRepository, InMemoryEmailSender],
})
export class AuthModule {}
