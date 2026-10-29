import { AdminDashboardBanner } from '../../../../components/admin/AdminDashboardBanner';
import { AdminAlertBanner } from '../../../../components/admin/AdminAlertBanner';
import { PendingOwnersQueue } from '../../../../components/admin/PendingOwnersQueue';
import {
  RecentVenuesCard,
  RecentDisputesCard,
} from '../../../../components/admin/RecentActivityWidgets';
import type { AdminDashboardContentProps } from '../types';
import { AdminDashboardPlatformFinancialCashMetricsVelocityBoard } from '../components/AdminDashboardPlatformFinancialCashMetricsVelocityBoard';
import { AdminDashboardTopCorePlatformStatistics } from '../components/AdminDashboardTopCorePlatformStatistics';
import { AdminDashboardOperationalHub } from '../components/AdminDashboardOperationalHub';

export function AdminDashboardContent({
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
}: AdminDashboardContentProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <AdminDashboardBanner />

      {/* Priority Action Alert Banner */}
      <AdminAlertBanner
        pendingOwnersCount={pendingOwners.length}
        pendingVenuesCount={pendingVenues.length}
        openDisputesCount={openDisputes.length}
        pendingAppealsCount={pendingAppeals.length}
      />

      {/* Pending Owner Requests Review Section */}
      <PendingOwnersQueue
        owners={pendingOwners}
        approvingOwnerId={approvingOwnerId}
        onApprove={handleApproveOwner}
      />

      {/* Platform Financial & Cash Metrics Velocity Board */}
      <AdminDashboardPlatformFinancialCashMetricsVelocityBoard
        {...{ commissionEgp, finance, onlineVolumeEgp, totalGmvEgp, translate, venueCashEgp }}
      />

      {/* Top 5 Core Platform Statistics */}
      <AdminDashboardTopCorePlatformStatistics
        {...{
          approvedVenues,
          draftPayouts,
          openDisputes,
          owners,
          pendingAppeals,
          pendingVenues,
          players,
          stuckCount,
          totalVolumeEgp,
          translate,
          users,
          venues,
        }}
      />

      {/* Operational Hub: 4 Interactive Feature Cards */}
      <AdminDashboardOperationalHub {...{ disputes, payouts, translate, users, venues }} />

      {/* Quick Recent Activity Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentVenuesCard venues={venues} />
        <RecentDisputesCard disputes={disputes} />
      </div>
    </div>
  );
}
