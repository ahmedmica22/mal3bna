import { useLanguage } from '../../../../store/LanguageStore';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../../../services/api';
import { useToast } from '../../../../components/feedback/ToastContext';
import { useActionDialog } from '../../../../components/feedback/ActionDialogProvider';

export function useAdminPayoutsSection() {
  const { translate, locale } = useLanguage();
  const { toast } = useToast();
  const ask = useActionDialog();
  const queryClient = useQueryClient();
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Form state
  const [generateVenueId, setGenerateVenueId] = useState('');
  const [generateStart, setGenerateStart] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 14);
    return d.toISOString().slice(0, 10);
  });
  const [generateEnd, setGenerateEnd] = useState(() => new Date().toISOString().slice(0, 10));
  const [isGenerating, setIsGenerating] = useState(false);

  const payoutsQuery = useQuery({
    queryKey: ['admin-payouts'],
    queryFn: () => adminApi.payouts(),
  });

  const venuesQuery = useQuery({
    queryKey: ['admin-venues-for-payouts'],
    queryFn: () => adminApi.venues(),
  });

  const isLoading = payoutsQuery.isLoading || venuesQuery.isLoading;

  async function handleGeneratePayout(e: React.FormEvent) {
    e.preventDefault();
    const venues = venuesQuery.data ?? [];
    if (!generateVenueId && venues.length > 0) {
      return toast.warning(
        translate('Please select a venue for the payout cycle.'),
        translate('Select Venue'),
      );
    }
    setIsGenerating(true);
    try {
      const vId = generateVenueId || venues[0]!.id;
      await adminApi.generatePayout(
        vId,
        `${generateStart}T00:00:00.000Z`,
        `${generateEnd}T23:59:59.999Z`,
      );
      await queryClient.invalidateQueries({ queryKey: ['admin-payouts'] });
      toast.success(
        translate('Payout batch generated from released ledger balance.'),
        translate('Payout Batch Created'),
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Payout generation failed',
        translate('Payout Error'),
      );
    } finally {
      setIsGenerating(false);
    }
  }

  async function handlePayoutAction(payoutId: string, action: 'approve' | 'mark_paid') {
    let reference: string | undefined;
    if (action === 'mark_paid') {
      reference =
        (await ask({
          title: translate('Mark payout as paid'),
          message: translate('Enter payment transaction reference (e.g. Bank Ref, InstaPay TXN):'),
          inputLabel: translate('Payment reference'),
        })) ?? undefined;
      if (!reference) return;
    }

    setActionLoadingId(payoutId);
    try {
      await adminApi.payoutAction(payoutId, action, reference);
      await queryClient.invalidateQueries({ queryKey: ['admin-payouts'] });
      toast.success(
        translate('Payout marked as {{value0}}.', {
          value0: action === 'mark_paid' ? 'paid' : 'approved',
        }),
        translate('Payout Updated'),
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Payout action failed',
        translate('Action Failed'),
      );
    } finally {
      setActionLoadingId(null);
    }
  }

  if (isLoading) return { view: 'Loading', props: { translate } } as const;

  const payouts = payoutsQuery.data ?? [];
  const venues = venuesQuery.data ?? [];

  return {
    view: 'Content',
    props: {
      actionLoadingId,
      generateEnd,
      generateStart,
      generateVenueId,
      handleGeneratePayout,
      handlePayoutAction,
      isGenerating,
      locale,
      payouts,
      setGenerateEnd,
      setGenerateStart,
      setGenerateVenueId,
      translate,
      venues,
    },
  } as const;
}
