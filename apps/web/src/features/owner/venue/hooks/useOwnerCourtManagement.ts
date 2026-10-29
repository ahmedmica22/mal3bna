import { useState } from 'react';
import { ownerApi } from '../../../../services/api';
import type { QueryClient } from '@tanstack/react-query';

export function useOwnerCourtManagement({
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
  const [showAddCourt, setShowAddCourt] = useState(false);
  const [courtName, setCourtName] = useState('');
  const [sport, setSport] = useState<'football' | 'padel'>('football');
  const [size, setSize] = useState<number>(5);
  const [surface, setSurface] = useState('Artificial Turf');
  const [isIndoor, setIsIndoor] = useState(false);
  const [courtHourlyPrice, setCourtHourlyPrice] = useState<number>(500);
  const [newCourtPhotos, setNewCourtPhotos] = useState<string[]>([]);
  const [isSubmittingCourt, setIsSubmittingCourt] = useState(false);

  async function handleAddCourt(e: React.FormEvent) {
    e.preventDefault();
    if (!venueId || !courtName.trim()) return;
    if (newCourtPhotos.length < 2 || newCourtPhotos.length > 6) {
      return toast.warning(
        translate('A court requires between 2 and 6 photos.'),
        translate('Court Photos Required'),
      );
    }
    setIsSubmittingCourt(true);
    try {
      await ownerApi.addCourt(venueId, {
        name: courtName,
        sport,
        size: sport === 'football' ? Number(size) : undefined,
        surface,
        isIndoor,
        hourlyPriceEgp: Number(courtHourlyPrice),
        photos: newCourtPhotos.map((url) => ({ url, mimeType: 'image/jpeg' })),
      });
      await queryClient.invalidateQueries({ queryKey: ['owner-venue'] });
      setShowAddCourt(false);
      setCourtName('');
      setNewCourtPhotos([]);
      toast.success(
        translate(
          'Pitch added and submitted for Super Admin review. It will become bookable once approved.',
        ),
        translate('Court Submitted for Approval'),
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Could not add court',
        translate('Court Creation Failed'),
      );
    } finally {
      setIsSubmittingCourt(false);
    }
  }

  return {
    showAddCourt,
    setShowAddCourt,
    courtName,
    setCourtName,
    sport,
    setSport,
    size,
    setSize,
    surface,
    setSurface,
    isIndoor,
    setIsIndoor,
    courtHourlyPrice,
    setCourtHourlyPrice,
    newCourtPhotos,
    setNewCourtPhotos,
    isSubmittingCourt,
    handleAddCourt,
  };
}
