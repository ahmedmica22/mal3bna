import { AdminPageHeader } from '../../../../components/admin/AdminPageHeader';
import type { AdminPayoutsSectionContentProps } from '../types';
import { AdminPayoutsSectionGeneratePayoutBatch } from '../components/AdminPayoutsSectionGeneratePayoutBatch';
import { AdminPayoutsSectionPayoutsTable } from '../components/AdminPayoutsSectionPayoutsTable';

export function AdminPayoutsSectionContent({
  actionLoadingId,
  generateEnd,
  generateStart,
  generateVenueId,
  handleGeneratePayout,
  handlePayoutAction,
  isGenerating,
  locale,
  payouts,
  setGenerateEnd,
  setGenerateStart,
  setGenerateVenueId,
  translate,
  venues,
}: AdminPayoutsSectionContentProps) {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="ADMIN CONTROL • FINANCIAL SETTLEMENT"
        title={translate('Payouts & Ledger')}
      />

      {/* Generate Payout Batch */}
      <AdminPayoutsSectionGeneratePayoutBatch
        {...{
          generateEnd,
          generateStart,
          generateVenueId,
          handleGeneratePayout,
          isGenerating,
          setGenerateEnd,
          setGenerateStart,
          setGenerateVenueId,
          translate,
          venues,
        }}
      />

      {/* Payouts Table */}
      <AdminPayoutsSectionPayoutsTable
        {...{ actionLoadingId, handlePayoutAction, locale, payouts, translate }}
      />
    </div>
  );
}
