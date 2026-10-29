import { styles } from '../styles';
import type { EditVenueModalProps } from '../contracts';
import { useState, useEffect } from 'react';
import { ownerService } from '../../../../services/owner.service';
export function useEditVenueModal({
  visible,
  venue,
  token,
  onClose,
  onVenueUpdated,
  onToast,
}: EditVenueModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [maxHours, setMaxHours] = useState('4');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (venue) {
      setName(venue.name ?? '');
      setPhone(venue.phone ?? '');
      setAddress(venue.address ?? '');
      setDescription(venue.description ?? '');
      setMaxHours(String(venue.maxHoursPerBooking ?? 4));
    }
  }, [venue, visible]);

  async function handleSave() {
    if (!venue) return;
    if (!name.trim() || !address.trim() || !phone.trim()) {
      return onToast('warning', 'Missing Details', 'Venue name, address, and phone are required.');
    }

    setIsSubmitting(true);
    try {
      await ownerService.updateVenue(
        venue.id,
        {
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          description: description.trim(),
          maxHoursPerBooking: Number(maxHours) || 4,
        },
        token,
      );

      onToast('success', 'Venue Updated', 'Venue overview information has been saved.');
      onVenueUpdated();
      onClose();
    } catch (err) {
      onToast(
        'error',
        'Update Error',
        err instanceof Error ? err.message : 'Could not update venue.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    view: 'Content',
    props: {
      address,
      description,
      handleSave,
      isSubmitting,
      maxHours,
      name,
      onClose,
      phone,
      setAddress,
      setDescription,
      setMaxHours,
      setName,
      setPhone,
      styles,
      visible,
    },
  } as const;
}
