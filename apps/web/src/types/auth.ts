import type { PublicUserResponse } from '@court-booking/api-client';

export type User = PublicUserResponse;

export type Role = User['role'];
