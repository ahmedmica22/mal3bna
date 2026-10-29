import { useLanguage } from '../../../../store/LanguageStore';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../../../services/api';
import { useToast } from '../../../../components/feedback/ToastContext';
import { useActionDialog } from '../../../../components/feedback/ActionDialogProvider';
import type { AdminVenue, Court } from '../../../../types/domain';

export function useAdminVenuesPage() {
  const { translate } = useLanguage();
  const { toast } = useToast();
  const ask = useActionDialog();
  const queryClient = useQueryClient();
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [courtActionLoadingId, setCourtActionLoadingId] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ['admin-venues'],
    queryFn: () => adminApi.venues(),
  });

  const pendingCourtsQuery = useQuery({
    queryKey: ['admin-pending-courts'],
    queryFn: () => adminApi.courts('pending'),
  });

  async function handleDecision(
    venue: AdminVenue,
    decision: 'approved' | 'rejected' | 'suspended',
  ) {
    let reason: string | undefined;
    if (decision === 'rejected') {
      reason =
        (await ask({
          title: translate('Reject venue'),
          message: translate('Enter rejection reason:'),
          inputLabel: translate('Reason'),
        })) ?? undefined;
      if (!reason) return;
    } else if (decision === 'suspended') {
      reason =
        (await ask({
          title: translate('Suspend venue'),
          message: translate('Enter suspension reason:'),
          inputLabel: translate('Reason'),
        })) ?? undefined;
      if (!reason) return;
    }

    setActionLoadingId(venue.id);
    try {
      await adminApi.decideVenue(venue.id, decision, reason);
      await queryClient.invalidateQueries({ queryKey: ['admin-venues'] });
      toast.success(
        translate('Venue {{value0}} has been {{value1}}.', {
          value0: venue.name,
          value1: decision,
        }),
        translate('Venue Status Updated'),
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Decision failed',
        translate('Action Failed'),
      );
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleApproveCourt(court: Court) {
    setCourtActionLoadingId(court.id);
    try {
      await adminApi.approveCourt(court.id);
      await queryClient.invalidateQueries({ queryKey: ['admin-pending-courts'] });
      await queryClient.invalidateQueries({ queryKey: ['admin-venues'] });
      toast.success(
        translate('Court "{{value0}}" is now approved and active for public bookings.', {
          value0: court.name,
        }),
        translate('Court Approved'),
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Could not approve court',
        translate('Approval Failed'),
      );
    } finally {
      setCourtActionLoadingId(null);
    }
  }

  async function handleRejectCourt(court: Court) {
    const reason = await ask({
      title: translate('Reject court'),
      message: translate('Enter reason for rejecting this court:'),
      inputLabel: translate('Reason'),
    });
    if (!reason) return;

    setCourtActionLoadingId(court.id);
    try {
      await adminApi.rejectCourt(court.id, reason);
      await queryClient.invalidateQueries({ queryKey: ['admin-pending-courts'] });
      await queryClient.invalidateQueries({ queryKey: ['admin-venues'] });
      toast.warning(
        translate('Court "{{value0}}" has been rejected.', { value0: court.name }),
        translate('Court Rejected'),
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Could not reject court',
        translate('Action Failed'),
      );
    } finally {
      setCourtActionLoadingId(null);
    }
  }

  async function handleCommissionSave(venueId: string, bp: number) {
    if (bp < 1000 || bp > 2000) {
      return toast.warning(
        translate('Commission must be between 10% and 20% (1000 to 2000 basis points).'),
        translate('Invalid Rate'),
      );
    }
    setActionLoadingId(venueId);
    try {
      await adminApi.changeCommission(venueId, bp);
      await queryClient.invalidateQueries({ queryKey: ['admin-venues'] });
      toast.success(
        translate('Commission rate set to {{value0}}%.', { value0: (bp / 100).toFixed(1) }),
        translate('Commission Saved'),
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to update commission',
        translate('Commission Error'),
      );
    } finally {
      setActionLoadingId(null);
    }
  }

  if (query.isLoading) return { view: 'Loading', props: { translate } } as const;
  if (query.isError) {
    return { view: 'Error', props: { query, translate } } as const;
  }

  const venues = query.data ?? [];
  const pendingCourts = pendingCourtsQuery.data ?? [];

  return {
    view: 'Content',
    props: {
      actionLoadingId,
      courtActionLoadingId,
      handleApproveCourt,
      handleCommissionSave,
      handleDecision,
      handleRejectCourt,
      pendingCourts,
      pendingCourtsQuery,
      translate,
      venues,
    },
  } as const;
}
