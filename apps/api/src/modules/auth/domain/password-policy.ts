import { securityConstants } from '@court-booking/config';
import { DomainError } from '../../../domain/errors';

export function assertPasswordAllowed(password: string, isAdmin = false): void {
  const minimum = isAdmin
    ? securityConstants.ADMIN_MIN_PASSWORD_LENGTH
    : securityConstants.AUTH_MIN_PASSWORD_LENGTH;
  if (password.length < minimum) {
    throw new DomainError('PASSWORD_TOO_WEAK', `Password must be at least ${minimum} characters`);
  }
}
