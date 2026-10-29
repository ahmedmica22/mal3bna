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
import { formatEgp, truncateId } from '../../../../utils/formatters';
import type { AdminPayoutsSectionContentProps } from '../types';

export function AdminPayoutsSectionPayoutsTable({
  actionLoadingId,
  handlePayoutAction,
  locale,
  payouts,
  translate,
}: Pick<
  AdminPayoutsSectionContentProps,
  'actionLoadingId' | 'handlePayoutAction' | 'locale' | 'payouts' | 'translate'
>) {
  return (
    <div className="space-y-4 relative z-10">
      <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
        {translate('Batched Payouts')}
      </h2>

      {payouts.length === 0 ? (
        <StatePanel title={translate('No payout batches created yet.')} />
      ) : (
        <AdminTableCard>
          <AdminTable minWidth="min-w-[700px]">
            <AdminTableHead>
              <tr>
                <AdminTableHeaderCell>{translate('Payout Reference')}</AdminTableHeaderCell>
                <AdminTableHeaderCell>{translate('Billing Window')}</AdminTableHeaderCell>
                <AdminTableHeaderCell>{translate('Amount')}</AdminTableHeaderCell>
                <AdminTableHeaderCell>{translate('Status')}</AdminTableHeaderCell>
                <AdminTableHeaderCell align="right">{translate('Actions')}</AdminTableHeaderCell>
              </tr>
            </AdminTableHead>
            <AdminTableBody>
              {payouts.map((p) => {
                const isActionLoading = actionLoadingId === p.id;
                const dateStart = new Date(p.periodStart).toLocaleDateString(locale, {
                  timeZone: 'Africa/Cairo',
                });
                const dateEnd = new Date(p.periodEnd).toLocaleDateString(locale, {
                  timeZone: 'Africa/Cairo',
                });

                return (
                  <AdminTableRow key={p.id}>
                    <AdminTableCell>
                      <span className="font-mono font-bold text-emerald-700 text-sm block dark:text-lime-400">
                        #{truncateId(p.id)}
                      </span>
                      {p.paymentReference && (
                        <span className="text-[11px] text-slate-500 block mt-0.5 dark:text-slate-400">
                          {translate('Ref:')} {p.paymentReference}
                        </span>
                      )}
                    </AdminTableCell>

                    <AdminTableCell className="text-slate-600 font-medium dark:text-slate-300">
                      {dateStart} - {dateEnd}
                    </AdminTableCell>

                    <AdminTableCell>
                      <strong className="text-emerald-700 font-black text-sm dark:text-lime-400">
                        {formatEgp(p.amountPiastres, { formatted: false })}
                      </strong>
                    </AdminTableCell>

                    <AdminTableCell>
                      <StatusBadge status={p.status} />
                    </AdminTableCell>

                    <AdminTableCell align="right">
                      <div className="flex gap-1.5 justify-end">
                        {p.status === 'draft' && (
                          <AdminActionButton
                            variant="primary"
                            disabled={isActionLoading}
                            isLoading={isActionLoading}
                            onClick={() => void handlePayoutAction(p.id, 'approve')}
                          >
                            {translate('✓ Approve')}
                          </AdminActionButton>
                        )}
                        {p.status === 'approved' && (
                          <AdminActionButton
                            variant="success"
                            disabled={isActionLoading}
                            isLoading={isActionLoading}
                            onClick={() => void handlePayoutAction(p.id, 'mark_paid')}
                          >
                            {translate('Mark Paid')}
                          </AdminActionButton>
                        )}
                        {p.status === 'paid' && (
                          <span className="text-slate-500 font-semibold">
                            {translate('Disbursed')}
                          </span>
                        )}
                      </div>
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
