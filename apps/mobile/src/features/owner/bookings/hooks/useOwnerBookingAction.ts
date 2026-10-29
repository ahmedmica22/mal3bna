import { useEffect, useState } from 'react';
import { ownerService } from '../../../../services/owner.service';
import { errorMessage } from '../../../../utils/errors';
export function useOwnerBookingAction(
  id: string,
  action: 'ownerCancel' | 'noShow' | null,
  onChanged?: () => void,
) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    setError('');
    setDone(false);
  }, [id, action]);
  async function submit() {
    if (!action || saving) return;
    setSaving(true);
    setError('');
    try {
      if (action === 'ownerCancel') await ownerService.cancel(id);
      else await ownerService.noShow(id);
      setDone(true);
      onChanged?.();
    } catch (error) {
      setError(errorMessage(error, 'Could not update reservation.'));
    } finally {
      setSaving(false);
    }
  }
  return { saving, error, done, submit };
}
