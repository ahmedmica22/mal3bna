import 'reflect-metadata';
import { describe, expect, it } from 'vitest';
import { Reflector } from '@nestjs/core';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { MeController } from './me.controller';
import { PublicVenueController } from '../../venues/presentation/public-venue.controller';
import { BookingController } from '../../bookings/presentation/booking.controller';
import { TrustController } from '../../trust/trust.controller';
import {
  AdminBookingController,
  OwnerBookingController,
} from '../../bookings/presentation/operator-booking.controller';
import { AdminTrustController } from '../../trust/admin-trust.controller';
import { OwnerVenueController } from '../../venues/presentation/owner-venue.controller';
import { OwnerOperationsController } from '../../venues/presentation/owner-operations.controller';
import { AdminController } from '../../admin/admin.controller';
import { NotificationsController } from '../../notifications/notifications.controller';
import {
  AdminReviewsController,
  OwnerReviewsController,
  PlayerReviewsController,
  PublicReviewsController,
} from '../../reviews/reviews.controller';
import { IS_PUBLIC_KEY, ROLES_KEY } from './metadata';
import { JwtAuthGuard, RolesGuard } from './guards';
import type { PublicUser } from '../domain/auth.types';

const routeControllers = [
  AuthController,
  MeController,
  PublicVenueController,
  BookingController,
  TrustController,
  OwnerBookingController,
  AdminBookingController,
  AdminTrustController,
  OwnerVenueController,
  OwnerOperationsController,
  AdminController,
  NotificationsController,
  PublicReviewsController,
  PlayerReviewsController,
  OwnerReviewsController,
  AdminReviewsController,
];

describe('authorization harness', () => {
  it('requires every auth route to declare public or roles metadata', () => {
    for (const controller of routeControllers) {
      const prototype = controller.prototype;
      for (const methodName of Object.getOwnPropertyNames(prototype)) {
        if (methodName === 'constructor') continue;
        const method = prototype[methodName as keyof typeof prototype];
        const isPublic =
          Reflect.getMetadata(IS_PUBLIC_KEY, method) === true ||
          Reflect.getMetadata(IS_PUBLIC_KEY, controller) === true;
        const roles =
          Reflect.getMetadata(ROLES_KEY, method) ?? Reflect.getMetadata(ROLES_KEY, controller);
        expect(
          isPublic || (Array.isArray(roles) && roles.length > 0),
          `${controller.name}.${methodName} is undeclared`,
        ).toBe(true);
      }
    }
  });

  it('denies missing credentials and wrong roles', async () => {
    const reflector = new Reflector();
    const tokenService = {
      verifyAccessToken: async () => ({ sub: 'id', role: 'player' as const, sid: 'session' }),
    };
    const authService = { authenticate: () => ({ id: 'id', role: 'player' }) as PublicUser };
    const authGuard = new JwtAuthGuard(reflector, authService as never, tokenService as never);
    const missingContext = context({}, function ProtectedRoute() {}, { header: () => undefined });
    await expect(authGuard.canActivate(missingContext)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );

    const rolesGuard = new RolesGuard(reflector);
    const handler = function ProtectedRoute() {};
    Reflect.defineMetadata(ROLES_KEY, ['owner'], handler);
    const wrongRoleContext = context(handler, function ProtectedController() {}, {
      user: { id: 'id', role: 'player' },
    });
    expect(() => rolesGuard.canActivate(wrongRoleContext)).toThrow(ForbiddenException);
  });

  it('matches the protected route role matrix and public allow-list', () => {
    const expected = new Map<object, string[]>([
      [AuthController, []],
      [MeController, ['player', 'owner', 'admin']],
      [PublicVenueController, []],
      [PublicReviewsController, []],
      [BookingController, ['player']],
      [TrustController, ['player']],
      [OwnerBookingController, ['owner']],
      [AdminBookingController, ['admin']],
      [AdminTrustController, ['admin']],
      [OwnerVenueController, ['owner']],
      [OwnerOperationsController, ['owner']],
      [AdminController, ['admin']],
      [NotificationsController, ['player', 'owner', 'admin']],
      [PlayerReviewsController, ['player']],
      [OwnerReviewsController, ['owner']],
      [AdminReviewsController, ['admin']],
    ]);
    expect(expected.size).toBe(routeControllers.length);
    for (const controller of routeControllers) {
      const roles = Reflect.getMetadata(ROLES_KEY, controller) ?? [];
      const isPublic = Reflect.getMetadata(IS_PUBLIC_KEY, controller) === true;
      expect(isPublic ? [] : roles, controller.name).toEqual(expected.get(controller));
    }
  });
});

function context(handler: object, controller: object, request: Record<string, unknown>) {
  return {
    getHandler: () => handler,
    getClass: () => controller,
    switchToHttp: () => ({ getRequest: () => request }),
  } as never;
}
