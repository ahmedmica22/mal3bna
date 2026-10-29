import { styles } from '../styles';
import type { ManagePhotosModalProps } from '../contracts';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { ownerService } from '../../../../services/owner.service';
export function useManagePhotosModal({
  visible,
  venueId,
  initialPhotos = [],
  token,
  onClose,
  onPhotosUpdated,
  onToast,
}: ManagePhotosModalProps) {
  const [photoUrls, setPhotoUrls] = useState<string[]>(initialPhotos.slice(0, 6));
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  async function handleSave() {
    if (photoUrls.length < 2 || photoUrls.length > 6) {
      return onToast('warning', 'Validation Failed', 'You must provide between 2 and 6 photos.');
    }

    setIsSubmitting(true);
    try {
      await ownerService.uploadPhotos(
        venueId,
        photoUrls.map((url) => ({ url, mimeType: 'image/jpeg' })),
        token,
      );
      onToast('success', 'Photos Updated', 'Venue gallery updated successfully.');
      onPhotosUpdated();
      onClose();
    } catch (err) {
      onToast('error', 'Error', err instanceof Error ? err.message : 'Could not upload photos.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    view: 'Content',
    props: {
      handleRemovePhoto,
      handleSave,
      isSubmitting,
      onClose,
      photoUrls,
      pickPhotos,
      styles,
      visible,
    },
  } as const;
}
