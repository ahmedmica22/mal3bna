import { Building2, Users, Scale, CreditCard } from 'lucide-react';
import { MetricCard } from '../../../../components/ui/MetricCard';
import type { AdminDashboardContentProps } from '../types';

export function AdminDashboardTopCorePlatformStatistics({
  approvedVenues,
  draftPayouts,
  openDisputes,
  owners,
  pendingAppeals,
  pendingVenues,
  players,
  totalVolumeEgp,
  translate,
  users,
  venues,
}: Pick<
  AdminDashboardContentProps,
  | 'approvedVenues'
  | 'draftPayouts'
  | 'openDisputes'
  | 'owners'
  | 'pendingAppeals'
  | 'pendingVenues'
  | 'players'
  | 'totalVolumeEgp'
  | 'translate'
  | 'users'
  | 'venues'
>) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Building2 size={15} className="text-lime-400" />
          <span>{translate('Platform Core Statistics')}</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title={translate('Total Venues')}
          value={venues.length}
          subtitle={
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-700 font-bold dark:text-lime-400">
                {approvedVenues.length} {translate('active')}
              </span>
              <span>•</span>
              <span
                className={
                  pendingVenues.length > 0 ? 'text-amber-800 font-bold dark:text-amber-400' : ''
                }
              >
                {pendingVenues.length} {translate('pending')}
              </span>
            </span>
          }
          icon={<Building2 size={16} />}
          href="/admin/venues"
          tone="lime"
        />

        <MetricCard
          title={translate('Users')}
          value={users.length}
          subtitle={
            <span className="flex items-center gap-1.5">
              <span className="text-sky-700 font-bold dark:text-sky-300">
                {players.length} {translate('players')}
              </span>
              <span>•</span>
              <span>
                {owners.length} {translate('owners')}
              </span>
            </span>
          }
          icon={<Users size={16} />}
          href="/admin/users"
          tone="sky"
        />

        <MetricCard
          title={translate('Open Disputes')}
          value={openDisputes.length}
          subtitle={
            pendingAppeals.length > 0 ? (
              <span className="text-rose-700 font-bold dark:text-rose-400">
                {pendingAppeals.length} {translate('appeals open')}
              </span>
            ) : (
              <span>{translate('0 strikes under appeal')}</span>
            )
          }
          icon={<Scale size={16} />}
          href="/admin/disputes"
          tone="rose"
        />

        <MetricCard
          title={translate('Settled Volume')}
          value={totalVolumeEgp}
          subtitle={
            <span
              className={
                draftPayouts.length > 0 ? 'text-amber-800 font-bold dark:text-amber-400' : ''
              }
            >
              {draftPayouts.length} {translate('draft batches')}
            </span>
          }
          icon={<CreditCard size={16} />}
          href="/admin/payouts"
          tone="emerald"
        />
      </div>
    </div>
  );
}
