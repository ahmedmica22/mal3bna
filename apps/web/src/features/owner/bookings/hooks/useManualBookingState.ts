import { useState } from 'react';
import type { Court } from '../../../../types/domain';
import { ownerApi } from '../../../../services/api';
import type { QueryClient } from '@tanstack/react-query';

export function useManualBookingState({
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
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualCourtId, setManualCourtId] = useState('');
  const [manualCustomerName, setManualCustomerName] = useState('');
  const [manualCustomerPhone, setManualCustomerPhone] = useState('');
  const [manualStartsAt, setManualStartsAt] = useState(() => {
    const d = new Date();
    d.setMinutes(0, 0, 0);
    d.setHours(d.getHours() + 1);
    return d.toISOString().slice(0, 16);
  });
  const [manualHours, setManualHours] = useState(1);
  const [manualPriceEgp, setManualPriceEgp] = useState(500);

  async function submitManual(e: React.FormEvent) {
    e.preventDefault();
    if (!manualCourtId && courts.length > 0)
      return toast.warning(translate('Please select a court'), translate('Missing Court'));
    try {
      await ownerApi.manualBooking({
        courtId: manualCourtId || courts[0]!.id,
        startsAt: new Date(manualStartsAt).toISOString(),
        hours: Number(manualHours),
        customerName: manualCustomerName,
        customerPhone: manualCustomerPhone || undefined,
        totalPiastres: manualPriceEgp * 100,
      });
      await queryClient.invalidateQueries({ queryKey: ['owner-bookings'] });
      setShowManualModal(false);
      setManualCustomerName('');
      setManualCustomerPhone('');
      toast.success(
        translate('Walk-in booking saved to schedule.'),
        translate('Manual Booking Created'),
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Manual booking failed',
        translate('Booking Failed'),
      );
    }
  }

  return {
    showManualModal,
    setShowManualModal,
    manualCourtId,
    setManualCourtId,
    manualCustomerName,
    setManualCustomerName,
    manualCustomerPhone,
    setManualCustomerPhone,
    manualStartsAt,
    setManualStartsAt,
    manualHours,
    setManualHours,
    manualPriceEgp,
    setManualPriceEgp,
    submitManual,
  };
}
