import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '../../../../store/LanguageStore';
import { useToast } from '../../../../components/feedback/ToastContext';
import { ownerApi } from '../../../../services/api';

export function useVenueOnboarding() {
  const { translate } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newVenueName, setNewVenueName] = useState('');
  const [newAreaId, setNewAreaId] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newMaxHours, setNewMaxHours] = useState<number>(4);
  const [venuePhotos, setVenuePhotos] = useState<string[]>([]);
  const [initialCourtName, setInitialCourtName] = useState('Pitch 1');
  const [initialSport, setInitialSport] = useState<'football' | 'padel'>('football');
  const [initialSize, setInitialSize] = useState<number>(5);
  const [initialSurface, setInitialSurface] = useState('Artificial Turf');
  const [initialIsIndoor, setInitialIsIndoor] = useState(false);
  const [initialHourlyRate, setInitialHourlyRate] = useState<number>(500);
  const [isSubmittingVenue, setIsSubmittingVenue] = useState(false);
  async function handleRegisterVenue(e: React.FormEvent) {
    e.preventDefault();
    if (!newVenueName.trim() || !newAreaId || !newAddress.trim() || !newPhone.trim()) {
      return toast.warning(
        translate('Please fill in all required venue details.'),
        translate('Missing Information'),
      );
    }
    if (venuePhotos.length < 2 || venuePhotos.length > 6) {
      return toast.warning(
        translate('You must upload between 2 and 6 photos for the venue.'),
        translate('Photos Required'),
      );
    }
    setIsSubmittingVenue(true);
    try {
      // 1. Register Venue
      const createdVenue = (await ownerApi.register({
        name: newVenueName.trim(),
        areaId: newAreaId,
        address: newAddress.trim(),
        phone: newPhone.trim(),
        description: newDescription.trim() || `${newVenueName.trim()} sports venue in Cairo`,
        latitude: 30.0444,
        longitude: 31.2357,
        maxHoursPerBooking: Number(newMaxHours) || 4,
      })) as { id: string };

      // 2. Upload Min 2, Max 6 Photos
      await ownerApi.uploadPhotos(
        createdVenue.id,
        venuePhotos.map((url) => ({ url, mimeType: 'image/jpeg' })),
      );

      // 3. Add initial Court with default price rules and photos (min 2, max 6)
      const initialCourtPhotos = venuePhotos
        .slice(0, Math.min(venuePhotos.length, 6))
        .map((url) => ({ url, mimeType: 'image/jpeg' }));

      const createdCourt = (await ownerApi.addCourt(createdVenue.id, {
        name: initialCourtName.trim() || 'Pitch 1',
        sport: initialSport,
        size: initialSport === 'football' ? Number(initialSize) : undefined,
        surface: initialSurface,
        isIndoor: initialIsIndoor,
        hourlyPriceEgp: initialHourlyRate,
        photos: initialCourtPhotos,
      })) as { id: string };

      // 4. Set Opening Hours (all 7 days, 24h standard)
      for (let day = 0; day < 7; day++) {
        await ownerApi.setOpeningHours(createdVenue.id, day, 0, 1440);
      }

      // 5. Set Hourly Price Rules
      const rules = Array.from({ length: 7 }, (_, day) => ({
        dayOfWeek: day,
        startMinute: 0,
        endMinute: 1440,
        pricePiastres: initialHourlyRate * 100,
      }));
      await ownerApi.setPriceRules(createdVenue.id, createdCourt.id, rules);

      // 6. Submit for Admin Approval
      await ownerApi.submit(createdVenue.id);

      await queryClient.invalidateQueries({ queryKey: ['owner-venue'] });
      toast.success(
        translate(
          'Venue info, photos (min 2, max 3), and court setup sent successfully! Super Admin will review your venue listing.',
        ),
        translate('Venue Submitted'),
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Could not submit venue details',
        translate('Submission Error'),
      );
    } finally {
      setIsSubmittingVenue(false);
    }
  }
  function removeOnboardingPhoto(idx: number) {
    setVenuePhotos((prev) => prev.filter((_, i) => i !== idx));
  }
  return {
    newVenueName,
    setNewVenueName,
    newAreaId,
    setNewAreaId,
    newAddress,
    setNewAddress,
    newPhone,
    setNewPhone,
    newDescription,
    setNewDescription,
    newMaxHours,
    setNewMaxHours,
    venuePhotos,
    setVenuePhotos,
    initialCourtName,
    setInitialCourtName,
    initialSport,
    setInitialSport,
    initialSize,
    setInitialSize,
    initialSurface,
    setInitialSurface,
    initialIsIndoor,
    setInitialIsIndoor,
    initialHourlyRate,
    setInitialHourlyRate,
    isSubmittingVenue,
    setIsSubmittingVenue,
    handleRegisterVenue,
    removeOnboardingPhoto,
  };
}
