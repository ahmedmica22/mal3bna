import { CalendarCheck2, CheckCircle2, Clock3, LayoutGrid } from 'lucide-react';
import { MetricCard } from '../../../../components/ui/MetricCard';
import type { OwnerDashboardContentProps } from '../types';

export function OwnerDashboardTopOperationalKpiMetrics({ stats, translate, formatNumber }: Pick<OwnerDashboardContentProps, 'stats' | 'translate' | 'formatNumber'>) {
  return <section aria-label={translate('Venue statistics')} className="grid grid-cols-2 gap-3 xl:grid-cols-4 sm:gap-4">
    <MetricCard title={translate('Total bookings')} value={formatNumber(stats.totalBookings)} subtitle={translate('All-time player and walk-in bookings')} icon={<CalendarCheck2 size={18} />} href="/owner/bookings" tone="lime" />
    <MetricCard title={translate('Completed matches')} value={formatNumber(stats.completedBookings)} subtitle={translate('{{count}} cancelled bookings', { count: formatNumber(stats.cancelledBookings) })} icon={<CheckCircle2 size={18} />} href="/owner/bookings" tone="emerald" />
    <MetricCard title={translate('Reserved hours')} value={formatNumber(stats.reservedHours)} subtitle={translate('Confirmed, checked-in and completed')} icon={<Clock3 size={18} />} href="/owner/calendar" tone="sky" />
    <MetricCard title={translate('Active courts')} value={`${formatNumber(stats.activeCourts)} / ${formatNumber(stats.totalCourts)}`} subtitle={translate('Approved and enabled for bookings')} icon={<LayoutGrid size={18} />} href="/owner/venue" tone="purple" />
  </section>;
}
