import { useLanguage } from '../../../../store/LanguageStore';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { venueApi } from '../../../../services/api';
import type { AvailabilitySlot, Court, Venue } from '../../../../types/domain';
import { venueDate } from '../../../../utils/venue-time';

export function useVenuePage() {
  const { translate } = useLanguage();
  const navigate = useNavigate();
  const { id = '' } = useParams();
  const [courtId, setCourtId] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => venueDate(new Date()));
  const [activeCourtPhotoIdx, setActiveCourtPhotoIdx] = useState(0);

  const venue = useQuery({
    queryKey: ['venue', id],
    queryFn: () => venueApi.detail(id),
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (venue.data?.courts?.length && !courtId) {
      setCourtId(venue.data.courts[0]!.id);
    }
  }, [venue.data, courtId]);

  const availability = useQuery({
    queryKey: ['availability', courtId, selectedDate],
    queryFn: () => venueApi.availability(courtId, `?date=${selectedDate}`),
    enabled: Boolean(courtId),
    refetchInterval: 3000,
  });

  const [selected, setSelected] = useState<AvailabilitySlot[]>([]);

  if (venue.isLoading) return { view: 'Loading', props: { translate } } as const;
  if (venue.isError || !venue.data) return { view: 'Unavailable', props: { translate } } as const;

  const selectedCourt = venue.data.courts?.find((c) => c.id === courtId);

  const getCourtPhoto = (court: Court): string | null => {
    if (court.photos && court.photos.length > 0) {
      const first = court.photos[0];
      return first?.file?.storageKey ?? first?.storageKey ?? null;
    }
    return null;
  };

  const getCourtPhotos = (court: Court): string[] => {
    if (!court.photos) return [];
    return court.photos
      .map((p) => p.file?.storageKey ?? p.storageKey)
      .filter((url): url is string => Boolean(url));
  };

  const getVenuePhotos = (v: Venue): string[] => {
    if (!v.photos) return [];
    return v.photos
      .map((p) => p.file?.storageKey ?? p.storageKey)
      .filter((url): url is string => Boolean(url));
  };

  const venuePhotos = getVenuePhotos(venue.data);
  const allVenueCoverPhotos =
    venuePhotos.length > 0
      ? venuePhotos
      : (venue.data.courts ?? []).flatMap((court) => getCourtPhotos(court));

  const selectedCourtPhotos = selectedCourt ? getCourtPhotos(selectedCourt) : [];

  return {
    view: 'Content',
    props: {
      activeCourtPhotoIdx,
      allVenueCoverPhotos,
      availability,
      courtId,
      getCourtPhoto,
      getCourtPhotos,
      navigate,
      selected,
      selectedCourt,
      selectedCourtPhotos,
      selectedDate,
      setActiveCourtPhotoIdx,
      setCourtId,
      setSelected,
      setSelectedDate,
      translate,
      venue,
    },
  } as const;
}
