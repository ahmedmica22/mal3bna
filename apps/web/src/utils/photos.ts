import type { Court, Venue } from '../types/domain';

type PhotoSource = NonNullable<Venue['photos']>[number];

export function photoUrls(photos: readonly PhotoSource[] | undefined): string[] {
  return (photos ?? [])
    .map((photo) => photo.file?.storageKey ?? photo.storageKey)
    .filter((url): url is string => Boolean(url));
}

export const courtPhotos = (court: Court): string[] => photoUrls(court.photos);
export function venueCoverPhotos(venue: Pick<Venue, 'photos' | 'courts'>): string[] {
  const ownPhotos = photoUrls(venue.photos);
  return ownPhotos.length ? ownPhotos : (venue.courts ?? []).flatMap(courtPhotos);
}
