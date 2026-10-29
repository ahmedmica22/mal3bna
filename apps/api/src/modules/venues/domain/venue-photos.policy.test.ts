import { describe, expect, it } from 'vitest';
import {
  assertValidVenuePhotoCount,
  assertValidCourtPhotoCount,
  clampConsecutiveSlots,
  MIN_VENUE_PHOTOS,
  MAX_VENUE_PHOTOS,
  MIN_COURT_PHOTOS,
  MAX_COURT_PHOTOS,
  MAX_CONSECUTIVE_BOOKING_HOURS,
} from './venue-photos.policy';
import { DomainError } from '../../../domain/errors';

describe('VenuePhotosPolicy & SlotConstraints', () => {
  describe('assertValidVenuePhotoCount', () => {
    it('accepts valid photo count between 2 and 6', () => {
      expect(() => assertValidVenuePhotoCount(2)).not.toThrow();
      expect(() => assertValidVenuePhotoCount(4)).not.toThrow();
      expect(() => assertValidVenuePhotoCount(6)).not.toThrow();
    });

    it('rejects photo count less than 2 with DomainError', () => {
      expect(() => assertValidVenuePhotoCount(0)).toThrow(DomainError);
      expect(() => assertValidVenuePhotoCount(1)).toThrow(DomainError);
      expect(() => assertValidVenuePhotoCount(1, 'submission')).toThrow(
        /A venue must have between 2 and 6 photos before submission/,
      );
    });

    it('rejects photo count greater than 6 with DomainError', () => {
      expect(() => assertValidVenuePhotoCount(7)).toThrow(DomainError);
      expect(() => assertValidVenuePhotoCount(10)).toThrow(DomainError);
    });

    it('has constants MIN=2 and MAX=6', () => {
      expect(MIN_VENUE_PHOTOS).toBe(2);
      expect(MAX_VENUE_PHOTOS).toBe(6);
    });
  });

  describe('assertValidCourtPhotoCount', () => {
    it('accepts valid court photo count between 2 and 6', () => {
      expect(() => assertValidCourtPhotoCount(2)).not.toThrow();
      expect(() => assertValidCourtPhotoCount(4)).not.toThrow();
      expect(() => assertValidCourtPhotoCount(6)).not.toThrow();
    });

    it('rejects court photo count less than 2 with DomainError', () => {
      expect(() => assertValidCourtPhotoCount(0)).toThrow(DomainError);
      expect(() => assertValidCourtPhotoCount(1)).toThrow(DomainError);
      expect(() => assertValidCourtPhotoCount(1)).toThrow(
        /A court must have between 2 and 6 photos/,
      );
    });

    it('rejects court photo count greater than 6 with DomainError', () => {
      expect(() => assertValidCourtPhotoCount(7)).toThrow(DomainError);
    });

    it('has constants MIN_COURT_PHOTOS=2 and MAX_COURT_PHOTOS=6', () => {
      expect(MIN_COURT_PHOTOS).toBe(2);
      expect(MAX_COURT_PHOTOS).toBe(6);
    });
  });

  describe('clampConsecutiveSlots', () => {
    it('enforces maximum of 4 consecutive hours', () => {
      expect(MAX_CONSECUTIVE_BOOKING_HOURS).toBe(4);
      expect(clampConsecutiveSlots(1)).toBe(1);
      expect(clampConsecutiveSlots(2)).toBe(2);
      expect(clampConsecutiveSlots(3)).toBe(3);
      expect(clampConsecutiveSlots(4)).toBe(4);
      expect(clampConsecutiveSlots(5)).toBe(4);
      expect(clampConsecutiveSlots(10)).toBe(4);
    });

    it('respects a lower venueLimit if venue allows fewer than 4 hours', () => {
      expect(clampConsecutiveSlots(3, 2)).toBe(2);
    });

    it('clamps negative or zero requested slots to 1', () => {
      expect(clampConsecutiveSlots(0)).toBe(1);
      expect(clampConsecutiveSlots(-2)).toBe(1);
    });
  });
});
