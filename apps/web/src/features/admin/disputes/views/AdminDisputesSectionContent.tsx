import { AdminPageHeader } from '../../../../components/admin/AdminPageHeader';
import type { AdminDisputesSectionContentProps } from '../types';
import { AdminDisputesSectionDisputesSubsection } from '../components/AdminDisputesSectionDisputesSubsection';
import { AdminDisputesSectionAppealsSubsection } from '../components/AdminDisputesSectionAppealsSubsection';

export function AdminDisputesSectionContent({
  actionLoadingId,
  appeals,
  disputes,
  handleAppealDecision,
  handleDisputeDecision,
  translate,
}: AdminDisputesSectionContentProps) {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="ADMIN CONTROL • TRUST & DISPUTES"
        title={translate('Disputes & Appeals')}
      />

      {/* Disputes Subsection */}
      <AdminDisputesSectionDisputesSubsection
        {...{ actionLoadingId, disputes, handleDisputeDecision, translate }}
      />

      {/* Appeals Subsection */}
      <AdminDisputesSectionAppealsSubsection
        {...{ actionLoadingId, appeals, handleAppealDecision, translate }}
      />
    </div>
  );
}
