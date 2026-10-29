import { useLanguage } from '../../../../store/LanguageStore';
import { MapPin, Mail, Phone, Layers } from 'lucide-react';
import type { AdminVenue } from '../../../../types/domain';
import { StatusBadge } from '../../../../components/ui/StatusBadge';
import { AdminTableRow, AdminTableCell } from '../../../../components/admin/AdminTable';
import { AdminActionButton } from '../../../../components/admin/AdminActionButton';
import { CommissionEditor } from '../../../../components/admin/CommissionEditor';
import type { VenueTableRowProps } from '../../../../types/ui';

export type { VenueTableRowProps };

export function VenueTableRow({
  venue,
  isLoading,
  onDecision,
  onCommissionSave,
}: VenueTableRowProps) {
  const { translate } = useLanguage();
  const courtsCount = (venue.courts ?? []).length;
  const ownerEmail = venue.ownerEmail ?? venue.owner?.email ?? 'Owner account';

  return (
    <AdminTableRow>
      {/* Venue & Location */}
      <AdminTableCell>
        <strong className="text-slate-900 text-sm block dark:text-slate-100">{venue.name}</strong>
        <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 dark:text-slate-400">
          <MapPin size={11} className="text-slate-500" />
          {venue.address ?? translate('Cairo')} {venue.areaName ? `· ${venue.areaName}` : ''}
        </span>
      </AdminTableCell>

      {/* Owner Account */}
      <AdminTableCell>
        <span className="text-slate-700 block font-medium flex items-center gap-1 dark:text-slate-200">
          <Mail size={11} className="text-slate-500" />
          {ownerEmail}
        </span>
        {venue.phone && (
          <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 dark:text-slate-400">
            <Phone size={10} className="text-slate-500" />
            {venue.phone}
          </span>
        )}
      </AdminTableCell>

      {/* Courts */}
      <AdminTableCell>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 font-bold border border-slate-200 dark:bg-white/5 dark:text-slate-300 dark:border-white/5">
          <Layers size={12} className="text-emerald-700 dark:text-lime-400" />
          {courtsCount} {translate('courts')}
        </span>
      </AdminTableCell>

      {/* Commission */}
      <AdminTableCell>
        <CommissionEditor
          commissionBp={venue.commissionBp}
          isSaving={isLoading}
          onSave={(bp) => onCommissionSave(venue.id, bp)}
        />
      </AdminTableCell>

      {/* Status */}
      <AdminTableCell>
        <StatusBadge status={venue.status} />
      </AdminTableCell>

      {/* Admin Actions */}
      <AdminTableCell align="right">
        <div className="flex gap-1.5 justify-end flex-wrap items-center">
          {['pending', 'draft', 'rejected'].includes(venue.status) && (
            <AdminActionButton
              variant="primary"
              disabled={isLoading}
              onClick={() => void onDecision(venue, 'approved')}
            >
              {translate('✓ Approve')}
            </AdminActionButton>
          )}

          {venue.status === 'pending' && (
            <AdminActionButton
              variant="danger"
              disabled={isLoading}
              onClick={() => void onDecision(venue, 'rejected')}
            >
              {translate('✕ Reject')}
            </AdminActionButton>
          )}

          {venue.status === 'approved' && (
            <AdminActionButton
              variant="danger"
              disabled={isLoading}
              onClick={() => void onDecision(venue, 'suspended')}
            >
              {translate('Suspend')}
            </AdminActionButton>
          )}

          {venue.status === 'suspended' && (
            <AdminActionButton
              variant="primary"
              disabled={isLoading}
              onClick={() => void onDecision(venue, 'approved')}
            >
              {translate('Reactivate')}
            </AdminActionButton>
          )}
        </div>
      </AdminTableCell>
    </AdminTableRow>
  );
}
