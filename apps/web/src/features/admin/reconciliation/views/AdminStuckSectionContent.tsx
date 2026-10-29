import { StatePanel } from '../../../../components/feedback/StatePanel';
import { AdminPageHeader } from '../../../../components/admin/AdminPageHeader';
import {
  AdminTableCard,
  AdminTable,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableBody,
  AdminTableRow,
  AdminTableCell,
} from '../../../../components/admin/AdminTable';
import { formatEgp, truncateId } from '../../../../utils/formatters';
import type { AdminStuckSectionContentProps } from '../types';

export function AdminStuckSectionContent({ stuck, translate }: AdminStuckSectionContentProps) {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="ADMIN CONTROL • RECONCILIATION & DEAD LETTERS"
        title={translate('System Stuck Items')}
      />

      {stuck.length === 0 ? (
        <StatePanel title={translate('All financial flows reconciled cleanly.')}>
          {translate('No failed refunds, orphaned holds, or dead-letter queue records detected.')}
        </StatePanel>
      ) : (
        <AdminTableCard>
          <AdminTable minWidth="min-w-[700px]">
            <AdminTableHead>
              <tr>
                <AdminTableHeaderCell>{translate('Item ID')}</AdminTableHeaderCell>
                <AdminTableHeaderCell>{translate('Reservation')}</AdminTableHeaderCell>
                <AdminTableHeaderCell>{translate('Amount')}</AdminTableHeaderCell>
                <AdminTableHeaderCell>{translate('Attempts')}</AdminTableHeaderCell>
                <AdminTableHeaderCell>{translate('Error Diagnostic')}</AdminTableHeaderCell>
              </tr>
            </AdminTableHead>
            <AdminTableBody>
              {stuck.map((item) => (
                <AdminTableRow key={item.id}>
                  <AdminTableCell className="font-mono font-bold text-slate-600 dark:text-slate-300">
                    #{truncateId(item.id)}
                  </AdminTableCell>

                  <AdminTableCell className="font-mono text-emerald-700 dark:text-lime-400">
                    #{truncateId(item.reservationId)}
                  </AdminTableCell>

                  <AdminTableCell className="font-bold text-slate-700 dark:text-slate-200">
                    {formatEgp(item.amountPiastres, { formatted: false })}
                  </AdminTableCell>

                  <AdminTableCell className="text-slate-600 dark:text-slate-300">
                    {item.attempts} {translate('attempts')}
                  </AdminTableCell>

                  <AdminTableCell className="text-rose-700 font-medium dark:text-rose-400">
                    {item.lastError ?? translate('Unknown failure')}
                  </AdminTableCell>
                </AdminTableRow>
              ))}
            </AdminTableBody>
          </AdminTable>
        </AdminTableCard>
      )}
    </div>
  );
}
