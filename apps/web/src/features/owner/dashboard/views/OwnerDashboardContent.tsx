import { OwnerPendingBanner } from '../../../../components/owner/OwnerPendingBanner';
import type { OwnerDashboardContentProps } from '../types';
import { OwnerDashboardApprovedOwnerWithoutVenuePrompt } from '../components/OwnerDashboardApprovedOwnerWithoutVenuePrompt';
import { OwnerDashboardHeader } from '../components/OwnerDashboardHeader';
import { OwnerDashboardTopOperationalKpiMetrics } from '../components/OwnerDashboardTopOperationalKpiMetrics';
import { MatchDayFeed } from '../components/MatchDayFeed';
import { VenueEarnings } from '../components/VenueEarnings';
import { VenueActivity } from '../components/VenueActivity';
import { CourtPerformance } from '../components/CourtPerformance';

export function OwnerDashboardContent(props: OwnerDashboardContentProps) {
  const { meQuery, venueQuery, translate, staleData, refresh } = props;
  return <div className="min-w-0 space-y-6 pb-6 sm:space-y-8">
    {meQuery.data?.status === 'pending' && <OwnerPendingBanner userName={meQuery.data?.name} onRefresh={() => { void meQuery.refetch(); void venueQuery.refetch(); }} compact />}
    <OwnerDashboardApprovedOwnerWithoutVenuePrompt {...props} />
    <OwnerDashboardHeader {...props} />
    {staleData && <div role="alert" className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">{translate('Live updates are unavailable. Showing the last loaded data.')}<button type="button" onClick={refresh} className="ms-3 min-h-10 font-bold underline">{translate('Retry')}</button></div>}
    <VenueEarnings {...props} />
    <OwnerDashboardTopOperationalKpiMetrics {...props} />
    <div className="grid min-w-0 items-start gap-5 xl:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]"><MatchDayFeed {...props} /><VenueActivity {...props} /></div>
    <CourtPerformance {...props} />
  </div>;
}
