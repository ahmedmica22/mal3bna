import { StatePanel } from '../../../../components/feedback/StatePanel';
import { AdminPageHeader } from '../../../../components/admin/AdminPageHeader';
import {
  AdminTableCard,
  AdminTable,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableBody,
} from '../../../../components/admin/AdminTable';
import { VenueTableRow } from '../components/VenueTableRow';
import type { AdminVenuesContentProps } from '../types';
import { AdminVenuesPendingCourtsQueue } from '../components/AdminVenuesPendingCourtsQueue';

export function AdminVenuesContent({
  actionLoadingId,
  courtActionLoadingId,
  handleApproveCourt,
  handleCommissionSave,
  handleDecision,
  handleRejectCourt,
  pendingCourts,
  pendingCourtsQuery,
  translate,
  venues,
}: AdminVenuesContentProps) {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="ADMIN CONTROL • VENUES & COURT APPROVALS"
        title={translate('Venue & Pitch Verification Queue')}
      />

      {/* PENDING COURTS QUEUE */}
      <AdminVenuesPendingCourtsQueue
        {...{
          courtActionLoadingId,
          handleApproveCourt,
          handleRejectCourt,
          pendingCourts,
          pendingCourtsQuery,
          translate,
        }}
      />

      {/* VENUE MANAGEMENT TABLE */}
      <section className="space-y-4">
        <h2 className="text-base font-black text-slate-900 dark:text-slate-100">
          {translate('Registered Venues (')}
          {venues.length})
        </h2>

        {venues.length === 0 ? (
          <StatePanel title={translate('No venues registered yet.')} />
        ) : (
          <AdminTableCard>
            <AdminTable minWidth="min-w-[800px]">
              <AdminTableHead>
                <tr>
                  <AdminTableHeaderCell>{translate('Venue & Location')}</AdminTableHeaderCell>
                  <AdminTableHeaderCell>{translate('Owner Account')}</AdminTableHeaderCell>
                  <AdminTableHeaderCell>{translate('Courts')}</AdminTableHeaderCell>
                  <AdminTableHeaderCell>{translate('Commission')}</AdminTableHeaderCell>
                  <AdminTableHeaderCell>{translate('Status')}</AdminTableHeaderCell>
                  <AdminTableHeaderCell align="right">
                    {translate('Admin Actions')}
                  </AdminTableHeaderCell>
                </tr>
              </AdminTableHead>
              <AdminTableBody>
                {venues.map((venue) => (
                  <VenueTableRow
                    key={venue.id}
                    venue={venue}
                    isLoading={actionLoadingId === venue.id}
                    onDecision={handleDecision}
                    onCommissionSave={handleCommissionSave}
                  />
                ))}
              </AdminTableBody>
            </AdminTable>
          </AdminTableCard>
        )}
      </section>
    </div>
  );
}
