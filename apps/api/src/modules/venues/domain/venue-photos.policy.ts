import { DomainError } from '../../../domain/errors';

export const MIN_VENUE_PHOTOS = 2;
export const MAX_VENUE_PHOTOS = 6;
export const MIN_COURT_PHOTOS = 2;
export const MAX_COURT_PHOTOS = 6;
export const MAX_CONSECUTIVE_BOOKING_HOURS = 4;

export function assertValidVenuePhotoCount(
  count: number,
  context: 'upload' | 'submission' = 'upload',
): void {
  if (count < MIN_VENUE_PHOTOS || count > MAX_VENUE_PHOTOS) {
    throw new DomainError(
      'VALIDATION_FAILED',
      context === 'submission'
        ? `A venue must have between ${MIN_VENUE_PHOTOS} and ${MAX_VENUE_PHOTOS} photos before submission.`
        : `A venue must have between ${MIN_VENUE_PHOTOS} and ${MAX_VENUE_PHOTOS} photos.`,
    );
  }
}

export function assertValidCourtPhotoCount(count: number): void {
  if (count < MIN_COURT_PHOTOS || count > MAX_COURT_PHOTOS) {
    throw new DomainError(
      'VALIDATION_FAILED',
      `A court must have between ${MIN_COURT_PHOTOS} and ${MAX_COURT_PHOTOS} photos.`,
    );
  }
}

export function clampConsecutiveSlots(
  requestedSlots: number,
  venueLimit = MAX_CONSECUTIVE_BOOKING_HOURS,
): number {
  const effectiveMax = Math.min(venueLimit, MAX_CONSECUTIVE_BOOKING_HOURS);
  return Math.min(Math.max(1, requestedSlots), effectiveMax);
}
