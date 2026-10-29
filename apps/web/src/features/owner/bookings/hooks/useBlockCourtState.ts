import { useState } from 'react';
import type { Court } from '../../../../types/domain';
import { ownerApi } from '../../../../services/api';
import type { QueryClient } from '@tanstack/react-query';

export function useBlockCourtState({
  courts,
  queryClient,
  toast,
  translate,
}: {
  courts: Court[];
  queryClient: QueryClient;
  toast: {
    warning: (msg: string, title?: string) => void;
    success: (msg: string, title?: string) => void;
    error: (msg: string, title?: string) => void;
  };
  translate: (k: string) => string;
}) {
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockCourtId, setBlockCourtId] = useState('');
  const [blockStartsAt, setBlockStartsAt] = useState(() => {
    const d = new Date();
    d.setMinutes(0, 0, 0);
    d.setHours(d.getHours() + 1);
    return d.toISOString().slice(0, 16);
  });
  const [blockHours, setBlockHours] = useState(2);
  const [blockReason, setBlockReason] = useState('Turf brush maintenance');

  async function submitBlock(e: React.FormEvent) {
    e.preventDefault();
    if (!blockCourtId && courts.length > 0)
      return toast.warning(translate('Please select a court'), translate('Missing Court'));
    try {
      await ownerApi.blockCourt({
        courtId: blockCourtId || courts[0]!.id,
        startsAt: new Date(blockStartsAt).toISOString(),
        hours: Number(blockHours),
        reason: blockReason,
      });
      await queryClient.invalidateQueries({ queryKey: ['owner-bookings'] });
      setShowBlockModal(false);
      toast.success(translate('Court slot blocked successfully.'), translate('Court Slot Blocked'));
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Block court failed',
        translate('Block Failed'),
      );
    }
  }

  return {
    showBlockModal,
    setShowBlockModal,
    blockCourtId,
    setBlockCourtId,
    blockStartsAt,
    setBlockStartsAt,
    blockHours,
    setBlockHours,
    blockReason,
    setBlockReason,
    submitBlock,
  };
}
