import { CreditCard, DollarSign, TrendingUp, HandCoins } from 'lucide-react';
import { MetricCard } from '../../../../components/ui/MetricCard';
import type { AdminDashboardContentProps } from '../types';

export function AdminDashboardFinancialKpiStatCards({
  commissionEgp,
  finance,
  onlineVolumeEgp,
  totalGmvEgp,
  translate,
  venueCashEgp,
}: Pick<
  AdminDashboardContentProps,
  'commissionEgp' | 'finance' | 'onlineVolumeEgp' | 'totalGmvEgp' | 'translate' | 'venueCashEgp'
>) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 relative z-10">
      <MetricCard
        title={translate('Platform GMV')}
        value={totalGmvEgp}
        subtitle={
          <span>
            {finance?.totalBookingsCount ?? 0} {translate('total bookings')}
          </span>
        }
        icon={<TrendingUp size={16} />}
        href="/admin/bookings"
        tone="emerald"
      />

      <MetricCard
        title={translate('Venue Cash Collected')}
        value={venueCashEgp}
        subtitle={
          <span className="text-emerald-700 font-bold dark:text-lime-400">
            {finance?.venueCashBookingsCount ?? 0} {translate('matches collected in person')}
          </span>
        }
        icon={<HandCoins size={16} />}
        href="/admin/bookings"
        tone="lime"
      />

      <MetricCard
        title={translate('Commission Earned')}
        value={commissionEgp}
        subtitle={<span>{translate('Platform fee revenue')}</span>}
        icon={<DollarSign size={16} />}
        href="/admin/payouts"
        tone="purple"
      />

      <MetricCard
        title={translate('Online Captured')}
        value={onlineVolumeEgp}
        subtitle={<span>{translate('Card & gateway payments')}</span>}
        icon={<CreditCard size={16} />}
        href="/admin/payouts"
        tone="sky"
      />
    </div>
  );
}
