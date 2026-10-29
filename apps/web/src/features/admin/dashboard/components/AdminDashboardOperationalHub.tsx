import { Layers } from 'lucide-react';
import { AdminModuleCard } from '../../../../components/admin/AdminModuleCard';
import type { AdminDashboardContentProps } from '../types';

export function AdminDashboardOperationalHub({
  disputes,
  payouts,
  translate,
  users,
  venues,
}: Pick<AdminDashboardContentProps, 'disputes' | 'payouts' | 'translate' | 'users' | 'venues'>) {
  return (
    <div>
      <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2 dark:text-slate-100">
        <Layers size={18} className="text-rose-700 dark:text-rose-400" />
        <span>{translate('Management Modules')}</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminModuleCard
          to="/admin/venues"
          eyebrow="Venues & Operations"
          title={translate('Venue Approval Queue & Commission Rates')}
          description="Approve or reject owner venue registrations, inspect football/padel court formats, and configure custom marketplace commission rates (default 12.0% / 1200 bps)."
          footerLeft={`${venues.length} total venues recorded`}
          footerRight="Open Venues →"
          tone="rose"
        />

        <AdminModuleCard
          to="/admin/users"
          eyebrow="Governance & Security"
          title={translate('User Directory & Account Status Controls')}
          description="Inspect player and owner profiles, enforce the 4-strike lockout policy, and suspend or reinstate accounts flagged for terms of service violations."
          footerLeft={`${users.length} registered accounts`}
          footerRight="Inspect Users →"
          tone="sky"
        />

        <AdminModuleCard
          to="/admin/disputes"
          eyebrow="Arbitration"
          title={translate('Disputes & Strike Appeals Arbitration')}
          description="Review no-show reports, examine gate closure claims and weather disputes, uphold or overturn strikes, and adjust ledger reversals accordingly."
          footerLeft={`${disputes.length} disputes filed to date`}
          footerRight="Arbitrate Cases →"
          tone="amber"
        />

        <AdminModuleCard
          to="/admin/payouts"
          eyebrow="Financial Settlement"
          title={translate('Venue Payout Batching & Bank Disbursals')}
          description="Generate billing window payout batches directly from the immutable double-entry ledger, confirm platform commission deductions, and record bank transaction references."
          footerLeft={`${payouts.length} payout batches processed`}
          footerRight="Manage Payouts →"
          tone="emerald"
        />
      </div>
    </div>
  );
}
