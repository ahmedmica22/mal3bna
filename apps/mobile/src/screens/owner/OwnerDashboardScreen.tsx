import type { OwnerDashboardScreenProps } from '../../features/owner/dashboard/contracts';
import { createOwnerDashboardScreenModel } from '../../features/owner/dashboard/model/createOwnerDashboardScreenModel';
import { OwnerDashboardScreenContent } from '../../features/owner/dashboard/views/OwnerDashboardScreenContent';
export function OwnerDashboardScreen(props: OwnerDashboardScreenProps) {
  const state = createOwnerDashboardScreenModel(props);
  switch (state.view) {
    case 'Content':
      return <OwnerDashboardScreenContent {...state.props} />;
  }
}
