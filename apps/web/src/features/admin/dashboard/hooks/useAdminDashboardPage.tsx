import { useLanguage } from '../../../../store/LanguageStore';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../../../services/api';
import { useToast } from '../../../../components/feedback/ToastContext';
import { formatEgp } from '../../../../utils/formatters';

export function useAdminDashboardPage() {
  const { translate } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [approvingOwnerId, setApprovingOwnerId] = useState<string | null>(null);

  const venuesQuery = useQuery({
    queryKey: ['admin-venues'],
    queryFn: () => adminApi.venues(),
  });

  const usersQuery = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminApi.users(),
  });

  const disputesQuery = useQuery({
    queryKey: ['admin-disputes'],
    queryFn: () => adminApi.disputes(),
  });

  const appealsQuery = useQuery({
    queryKey: ['admin-appeals'],
    queryFn: () => adminApi.appeals(),
  });

  const payoutsQuery = useQuery({
    queryKey: ['admin-payouts'],
    queryFn: () => adminApi.payouts(),
  });

  const stuckQuery = useQuery({
    queryKey: ['admin-stuck'],
    queryFn: () => adminApi.stuckItems(),
  });

  const financeQuery = useQuery({
    queryKey: ['admin-finance-overview'],
    queryFn: () => adminApi.financeOverview(),
    refetchInterval: 5000,
  });

  const isLoading =
    venuesQuery.isLoading ||
    usersQuery.isLoading ||
    disputesQuery.isLoading ||
    payoutsQuery.isLoading;

  if (isLoading) {
    return { view: 'Loading', props: { translate } } as const;
  }

  async function handleApproveOwner(ownerId: string, ownerName: string) {
    setApprovingOwnerId(ownerId);
    try {
      await adminApi.approveOwner(ownerId);
      await queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success(
        translate('Owner "{{value0}}" approved successfully. They can now submit venue info.', {
          value0: ownerName,
        }),
        translate('Owner Approved'),
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Could not approve owner request',
        translate('Approval Error'),
      );
    } finally {
      setApprovingOwnerId(null);
    }
  }

  // Calculate aggregated metrics
  const venues = venuesQuery.data ?? [];
  const pendingVenues = venues.filter((v) => v.status === 'pending');
  const approvedVenues = venues.filter((v) => v.status === 'approved');

  const users = usersQuery.data ?? [];
  const players = users.filter((u) => u.role === 'player');
  const owners = users.filter((u) => u.role === 'owner');
  const pendingOwners = owners.filter((o) => o.status === 'pending');

  const disputes = disputesQuery.data ?? [];
  const openDisputes = disputes.filter((d) => d.status === 'open');

  const appeals = appealsQuery.data ?? [];
  const pendingAppeals = appeals.filter((a) => a.status === 'open');

  const payouts = payoutsQuery.data ?? [];
  const draftPayouts = payouts.filter((p) => p.status === 'draft');
  const totalVolumePiastres = payouts.reduce((acc, p) => acc + (p.amountPiastres ?? 0), 0);
  const totalVolumeEgp = formatEgp(totalVolumePiastres);

  const stuckCount = stuckQuery.data?.length ?? 0;

  const finance = financeQuery.data;
  const totalGmvEgp = formatEgp(finance?.totalGmvPiastres ?? 0);
  const venueCashEgp = formatEgp(finance?.venueCashCollectedPiastres ?? 0);
  const commissionEgp = formatEgp(finance?.commissionEarnedPiastres ?? 0);
  const onlineVolumeEgp = formatEgp(finance?.onlineVolumePiastres ?? 0);

  return {
    view: 'Content',
    props: {
      approvedVenues,
      approvingOwnerId,
      commissionEgp,
      disputes,
      draftPayouts,
      finance,
      handleApproveOwner,
      onlineVolumeEgp,
      openDisputes,
      owners,
      payouts,
      pendingAppeals,
      pendingOwners,
      pendingVenues,
      players,
      stuckCount,
      totalGmvEgp,
      totalVolumeEgp,
      translate,
      users,
      venueCashEgp,
      venues,
    },
  } as const;
}
