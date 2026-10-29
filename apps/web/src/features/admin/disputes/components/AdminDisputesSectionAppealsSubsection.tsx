import { ShieldAlert } from 'lucide-react';
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

export function AdminDisputesSectionAppealsSubsection({
  actionLoadingId,
  appeals,
  handleAppealDecision,
  translate,
}: Pick<
  AdminDisputesSectionContentProps,
  'actionLoadingId' | 'appeals' | 'handleAppealDecision' | 'translate'
>) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 dark:text-slate-100">
        <ShieldAlert className="text-rose-700 dark:text-rose-400" size={20} />
        <span>
          {translate('Blocked Player Appeals (')}
          {appeals.length})
        </span>
      </h2>

      {appeals.length === 0 ? (
        <StatePanel title={translate('No pending appeals.')} />
      ) : (
        <AdminTableCard>
          <AdminTable minWidth="min-w-[700px]">
            <AdminTableHead>
              <tr>
                <AdminTableHeaderCell>{translate('Player')}</AdminTableHeaderCell>
                <AdminTableHeaderCell>{translate('Appeal Message')}</AdminTableHeaderCell>
                <AdminTableHeaderCell>{translate('Status')}</AdminTableHeaderCell>
                <AdminTableHeaderCell align="right">{translate('Decision')}</AdminTableHeaderCell>
              </tr>
            </AdminTableHead>
            <AdminTableBody>
              {appeals.map((a) => {
                const isActionLoading = actionLoadingId === a.id;
                const playerName = a.player?.name ?? 'Player';
                const playerEmail = a.player?.email;

                return (
                  <AdminTableRow key={a.id}>
                    <AdminTableCell>
                      <strong className="text-slate-900 text-sm block dark:text-slate-100">
                        {playerName}
                      </strong>
                      {playerEmail && (
                        <span className="text-[11px] text-slate-500 block dark:text-slate-400">
                          {playerEmail}
                        </span>
                      )}
                    </AdminTableCell>

                    <AdminTableCell className="max-w-sm text-slate-700 dark:text-slate-200">
                      <p className="text-xs italic leading-relaxed">"{a.message}"</p>
                    </AdminTableCell>

                    <AdminTableCell>
                      <StatusBadge status={a.status} />
                    </AdminTableCell>

                    <AdminTableCell align="right">
                      {a.status === 'open' ? (
                        <div className="flex gap-1.5 justify-end">
                          <AdminActionButton
                            variant="primary"
                            disabled={isActionLoading}
                            isLoading={isActionLoading}
                            onClick={() => void handleAppealDecision(a.id, 'unblocked')}
                          >
                            {translate('Unblock')}
                          </AdminActionButton>
                          <AdminActionButton
                            variant="danger"
                            disabled={isActionLoading}
                            isLoading={isActionLoading}
                            onClick={() => void handleAppealDecision(a.id, 'rejected')}
                          >
                            {translate('Reject')}
                          </AdminActionButton>
                        </div>
                      ) : (
                        <span className="text-slate-500 font-semibold">{translate('Decided')}</span>
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
