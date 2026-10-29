import { styles } from '../styles';
import type { OwnerAddVenueScreenProps } from '../contracts';
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Area } from '../../../../types/domain';
import { venueService } from '../../../../services/venue.service';
import { ownerService } from '../../../../services/owner.service';
export function useOwnerAddVenueScreen({
  token,
  ownerName,
  onVenueCreated,
  onSignOut,
  onToast,
}: OwnerAddVenueScreenProps) {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loadingAreas, setLoadingAreas] = useState(true);

  // Venue Info Form
  const [venueName, setVenueName] = useState('');
  const [selectedAreaId, setSelectedAreaId] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [maxHours, setMaxHours] = useState('4');

  // Photos (Min 2, Max 6)
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  // Initial Court Form
  const [courtName, setCourtName] = useState('Pitch 1');
  const [sport, setSport] = useState<'football' | 'padel'>('football');
  const [size, setSize] = useState<number>(5);
  const [surface, setSurface] = useState('Artificial Turf');
  const [isIndoor, setIsIndoor] = useState(false);
  const [hourlyPriceEgp, setHourlyPriceEgp] = useState('500');

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadAreas();
  }, []);

  async function loadAreas() {
    setLoadingAreas(true);
    try {
      const list = await venueService.getAreas();
      setAreas(list);
      if (list.length > 0 && !selectedAreaId) {
        setSelectedAreaId(list[0].id);
      }
    } catch {
      onToast('error', 'Network Error', 'Could not load Cairo districts.');
    } finally {
      setLoadingAreas(false);
    }
  }

  async function pickPhotos() {
    if (photoUrls.length >= 6) {
      return onToast('warning', 'Limit Reached', 'Maximum 6 photos allowed for the venue.');
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 6 - photoUrls.length,
      quality: 0.7,
      base64: true,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newUrls = result.assets.map((asset) =>
        asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri,
      );
      setPhotoUrls((prev) => [...prev, ...newUrls].slice(0, 6));
      onToast('success', 'Photos Added', `Added ${newUrls.length} photo(s) from device.`);
    }
  }

  function handleRemovePhoto(index: number) {
    setPhotoUrls((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    if (!venueName.trim() || !selectedAreaId || !address.trim() || !phone.trim()) {
      return onToast(
        'warning',
        'Missing Details',
        'Please enter venue name, district, address, and phone.',
      );
    }
    if (photoUrls.length < 2 || photoUrls.length > 6) {
      return onToast(
        'warning',
        'Photos Required',
        'You must provide between 2 and 6 photos for the venue.',
      );
    }
    const rate = Number(hourlyPriceEgp);
    if (isNaN(rate) || rate < 50) {
      return onToast('warning', 'Invalid Price', 'Minimum pitch rate is 50 EGP per hour.');
    }

    setIsSubmitting(true);
    try {
      // 1. Register Venue
      const createdVenue = await ownerService.registerVenue(
        {
          name: venueName.trim(),
          areaId: selectedAreaId,
          address: address.trim(),
          phone: phone.trim(),
          description: description.trim() || `${venueName.trim()} sports venue in Cairo`,
          maxHoursPerBooking: Number(maxHours) || 4,
        },
        token,
      );

      // 2. Upload Min 2, Max 6 Photos
      await ownerService.uploadPhotos(
        createdVenue.id,
        photoUrls.map((url) => ({ url, mimeType: 'image/jpeg' })),
        token,
      );

      // 3. Add Initial Court with Rates & Court Photos (min 2, max 6)
      const initialCourtPhotos = photoUrls
        .slice(0, Math.min(photoUrls.length, 6))
        .map((url) => ({ url, mimeType: 'image/jpeg' }));

      await ownerService.addCourt(
        createdVenue.id,
        {
          name: courtName.trim() || 'Pitch 1',
          sport,
          size: sport === 'football' ? size : undefined,
          surface,
          isIndoor,
          hourlyPriceEgp: rate,
          photos: initialCourtPhotos,
        },
        token,
      );

      // 4. Set standard 24h opening hours
      for (let day = 0; day < 7; day++) {
        await ownerService.setOpeningHours(createdVenue.id, day, 0, 1440, token);
      }

      // 5. Submit for Super Admin review
      await ownerService.submitVenue(createdVenue.id, token);

      onToast(
        'success',
        'Venue Submitted!',
        'Your venue details, 24h schedule, and photos have been sent for Super Admin verification.',
      );
      onVenueCreated();
    } catch (err) {
      onToast(
        'error',
        'Submission Failed',
        err instanceof Error ? err.message : 'Could not submit venue',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    view: 'Content',
    props: {
      address,
      areas,
      courtName,
      description,
      handleRemovePhoto,
      handleSubmit,
      hourlyPriceEgp,
      isIndoor,
      isSubmitting,
      loadingAreas,
      maxHours,
      onSignOut,
      ownerName,
      phone,
      photoUrls,
      pickPhotos,
      selectedAreaId,
      setAddress,
      setCourtName,
      setDescription,
      setHourlyPriceEgp,
      setIsIndoor,
      setMaxHours,
      setPhone,
      setSelectedAreaId,
      setSize,
      setSport,
      setSurface,
      setVenueName,
      size,
      sport,
      styles,
      surface,
      venueName,
    },
  } as const;
}
