import { styles } from '../styles';
import type { AddCourtModalProps } from '../contracts';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { ownerService } from '../../../../services/owner.service';
export function useAddCourtModal({
  visible,
  venueId,
  token,
  onClose,
  onCourtAdded,
  onToast,
}: AddCourtModalProps) {
  const [courtName, setCourtName] = useState('');
  const [sport, setSport] = useState<'football' | 'padel'>('football');
  const [size, setSize] = useState<number>(5);
  const [surface, setSurface] = useState('Artificial Turf');
  const [isIndoor, setIsIndoor] = useState(false);
  const [hourlyPriceEgp, setHourlyPriceEgp] = useState('500');
  const [courtPhotos, setCourtPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function pickPhotos() {
    if (courtPhotos.length >= 6) {
      return onToast('warning', 'Maximum 6 Photos', 'A court can have at most 6 photos.');
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 6 - courtPhotos.length,
      quality: 0.7,
      base64: true,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newUrls = result.assets.map((asset) =>
        asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri,
      );
      setCourtPhotos((prev) => [...prev, ...newUrls].slice(0, 6));
      onToast('success', 'Photos Added', `Added ${newUrls.length} photo(s) from your device.`);
    }
  }

  async function handleSave() {
    if (!courtName.trim()) {
      return onToast('warning', 'Missing Name', 'Please enter a pitch/court name.');
    }
    if (courtPhotos.length < 2 || courtPhotos.length > 6) {
      return onToast('warning', 'Photos Required', 'Every court requires between 2 and 6 photos.');
    }
    const rate = Number(hourlyPriceEgp);
    if (isNaN(rate) || rate < 50) {
      return onToast('warning', 'Invalid Price', 'Minimum pitch rate is 50 EGP per hour.');
    }

    setIsSubmitting(true);
    try {
      await ownerService.addCourt(
        venueId,
        {
          name: courtName.trim(),
          sport,
          size: sport === 'football' ? size : undefined,
          surface,
          isIndoor,
          hourlyPriceEgp: rate,
          photos: courtPhotos.map((url) => ({ url, mimeType: 'image/jpeg' })),
        },
        token,
      );

      onToast(
        'success',
        'Court Submitted',
        `${courtName.trim()} submitted for Super Admin review. It will become bookable once approved.`,
      );
      setCourtName('');
      onCourtAdded();
      onClose();
    } catch (err) {
      onToast('error', 'Error', err instanceof Error ? err.message : 'Could not add pitch.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    view: 'Content',
    props: {
      courtName,
      courtPhotos,
      handleSave,
      hourlyPriceEgp,
      isIndoor,
      isSubmitting,
      onClose,
      pickPhotos,
      setCourtName,
      setCourtPhotos,
      setHourlyPriceEgp,
      setIsIndoor,
      setSize,
      setSport,
      setSurface,
      size,
      sport,
      styles,
      surface,
      visible,
    },
  } as const;
}
