import { useState } from 'react';
import { ownerApi } from '../../../../services/api';
import type { QueryClient } from '@tanstack/react-query';

export function useOwnerVenueEdit({
  venueId,
  queryClient,
  toast,
  translate,
}: {
  venueId?: string | undefined;
  queryClient: QueryClient;
  toast: {
    warning: (msg: string, title?: string) => void;
    success: (msg: string, title?: string) => void;
    error: (msg: string, title?: string) => void;
  };
  translate: (k: string, vars?: Record<string, string | number | boolean | undefined>) => string;
}) {
  const [showEditVenueModal, setShowEditVenueModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editMaxHours, setEditMaxHours] = useState(4);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  async function handleSaveEditVenue(e: React.FormEvent) {
    e.preventDefault();
    if (!venueId) return;
    if (!editName.trim() || !editAddress.trim() || !editPhone.trim()) {
      return toast.warning(
        translate('Name, address, and phone are required.'),
        translate('Missing Fields'),
      );
    }
    setIsSubmittingEdit(true);
    try {
      await ownerApi.updateVenue(venueId, {
        name: editName.trim(),
        address: editAddress.trim(),
        phone: editPhone.trim(),
        description: editDescription.trim(),
        maxHoursPerBooking: Number(editMaxHours) || 4,
      });
      await queryClient.invalidateQueries({ queryKey: ['owner-venue'] });
      setShowEditVenueModal(false);
      toast.success(translate('Venue details updated successfully.'), translate('Changes Saved'));
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to update venue',
        translate('Update Error'),
      );
    } finally {
      setIsSubmittingEdit(false);
    }
  }

  return {
    showEditVenueModal,
    setShowEditVenueModal,
    editName,
    setEditName,
    editPhone,
    setEditPhone,
    editAddress,
    setEditAddress,
    editDescription,
    setEditDescription,
    editMaxHours,
    setEditMaxHours,
    isSubmittingEdit,
    handleSaveEditVenue,
  };
}
