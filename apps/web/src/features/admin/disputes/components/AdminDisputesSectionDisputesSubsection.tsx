import { AlertTriangle } from 'lucide-react';
import { StatePanel } from '../../../../components/feedback/StatePanel';
import { StatusBadge } from '../../../../components/ui/StatusBadge';
import {
  AdminTableCard,
  AdminTable,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableBody,
  AdminTableRow,
  AdminTableCell,
} from '../../../../components/admin/AdminTable';
import { AdminActionButton } from '../../../../components/admin/AdminActionButton';
import type { AdminDisputesSectionContentProps } from '../types';

export function AdminDisputesSectionDisputesSubsection({
  actionLoadingId,
  disputes,
  handleDisputeDecision,
  translate,
}: Pick<
  AdminDisputesSectionContentProps,
  'actionLoadingId' | 'disputes' | 'handleDisputeDecision' | 'translate'
>) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 dark:text-slate-100">
        <AlertTriangle className="text-amber-800 dark:text-amber-400" size={20} />
        <span>
          {translate('Player No-Show Disputes (')}
          {disputes.length})
        </span>
      </h2>

      {disputes.length === 0 ? (
        <StatePanel title={translate('No open disputes.')} />
      ) : (
        <AdminTableCard>
          <AdminTable minWidth="min-w-[750px]">
            <AdminTableHead>
              <tr>
                <AdminTableHeaderCell>{translate('Booking')}</AdminTableHeaderCell>
                <AdminTableHeaderCell>{translate('Player Explanation')}</AdminTableHeaderCell>
                <AdminTableHeaderCell>{translate('Pitch')}</AdminTableHeaderCell>
                <AdminTableHeaderCell>{translate('Status')}</AdminTableHeaderCell>
                <AdminTableHeaderCell align="right">{translate('Decision')}</AdminTableHeaderCell>
              </tr>
            </AdminTableHead>
            <AdminTableBody>
              {disputes.map((d) => {
                const isActionLoading = actionLoadingId === d.id;
                const bookingCode = d.reservation?.bookingCode ?? d.reservationId.slice(0, 8);
                const playerName = d.reservation?.player?.name ?? 'Player';
                const venueName = d.reservation?.venue?.name ?? 'Venue';
                const courtName = d.reservation?.court?.name;

                return (
                  <AdminTableRow key={d.id}>
                    <AdminTableCell>
                      <strong className="text-emerald-700 font-mono text-sm block dark:text-lime-400">
                        {bookingCode}
                      </strong>
                      <span className="text-[11px] text-slate-500 block mt-0.5 dark:text-slate-400">
                        {playerName}
                      </span>
                    </AdminTableCell>

                    <AdminTableCell className="max-w-xs text-slate-700 dark:text-slate-200">
                      <p className="text-xs italic leading-relaxed">"{d.playerMessage}"</p>
                    </AdminTableCell>

                    <AdminTableCell className="text-slate-600 dark:text-slate-300">
                      <strong>{venueName}</strong>
                      {courtName && (
                        <span className="text-[11px] text-slate-500 block dark:text-slate-400">
                          {courtName}
                        </span>
                      )}
                    </AdminTableCell>

                    <AdminTableCell>
                      <StatusBadge status={d.status} />
                    </AdminTableCell>

                    <AdminTableCell align="right">
                      {d.status === 'open' ? (
                        <div className="flex gap-1.5 justify-end flex-wrap">
                          <AdminActionButton
                            variant="primary"
                            disabled={isActionLoading}
                            isLoading={isActionLoading}
                            onClick={() => void handleDisputeDecision(d.id, 'overturned')}
                          >
                            {translate('✓ Overturn (Clear Strike)')}
                          </AdminActionButton>
                          <AdminActionButton
                            variant="danger"
                            disabled={isActionLoading}
                            isLoading={isActionLoading}
                            onClick={() => void handleDisputeDecision(d.id, 'upheld')}
                          >
                            {translate('✕ Uphold (Issue Strike)')}
                          </AdminActionButton>
                        </div>
                      ) : (
                        <span className="text-slate-500 font-semibold">
                          {translate('Resolved')}
                        </span>
                      )}
                    </AdminTableCell>
                  </AdminTableRow>
                );
              })}
            </AdminTableBody>
          </AdminTable>
        </AdminTableCard>
      )}
    </div>
  );
}
