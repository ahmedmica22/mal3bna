import { useLanguage } from '../../../../store/LanguageStore';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../../../services/api';
import { useToast } from '../../../../components/feedback/ToastContext';
import { useActionDialog } from '../../../../components/feedback/ActionDialogProvider';

export function useAdminDisputesSection() {
  const { translate } = useLanguage();
  const { toast } = useToast();
  const ask = useActionDialog();
  const queryClient = useQueryClient();
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const disputesQuery = useQuery({
    queryKey: ['admin-disputes'],
    queryFn: () => adminApi.disputes(),
  });

  const appealsQuery = useQuery({
    queryKey: ['admin-appeals'],
    queryFn: () => adminApi.appeals(),
  });

  const isLoading = disputesQuery.isLoading || appealsQuery.isLoading;

  async function handleDisputeDecision(disputeId: string, decision: 'upheld' | 'overturned') {
    const note = await ask({
      title: translate('Resolve dispute'),
      message: translate('Enter resolution note for {{decision}}.', {
        decision: translate(decision),
      }),
      inputLabel: translate('Resolution note'),
    });
    if (note === null) return;

    setActionLoadingId(disputeId);
    try {
      await adminApi.decideDispute(disputeId, decision, note);
      await queryClient.invalidateQueries({ queryKey: ['admin-disputes'] });
      toast.success(
        translate('Dispute decided: {{value0}}. Strike and ledger updated.', {
          value0: translate(decision),
        }),
        translate('Dispute Resolved'),
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Dispute decision failed',
        translate('Dispute Error'),
      );
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleAppealDecision(appealId: string, decision: 'unblocked' | 'rejected') {
    setActionLoadingId(appealId);
    try {
      await adminApi.decideAppeal(appealId, decision);
      await queryClient.invalidateQueries({ queryKey: ['admin-appeals'] });
      toast.success(
        translate('Appeal decided: {{value0}}.', { value0: translate(decision) }),
        translate('Appeal Processed'),
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Appeal decision failed',
        translate('Appeal Error'),
      );
    } finally {
      setActionLoadingId(null);
    }
  }

  if (isLoading) {
    return { view: 'Loading', props: { translate } } as const;
  }

  const disputes = disputesQuery.data ?? [];
  const appeals = appealsQuery.data ?? [];

  return {
    view: 'Content',
    props: {
      actionLoadingId,
      appeals,
      disputes,
      handleAppealDecision,
      handleDisputeDecision,
      translate,
    },
  } as const;
}
