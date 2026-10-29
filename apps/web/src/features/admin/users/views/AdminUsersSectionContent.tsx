import { Search, X, Users } from 'lucide-react';
import { StatePanel } from '../../../../components/feedback/StatePanel';
import { StatusBadge } from '../../../../components/ui/StatusBadge';
import { Badge } from '../../../../components/ui/Badge';
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
import { AdminActionButton } from '../../../../components/admin/AdminActionButton';
import type { AdminUsersSectionContentProps } from '../types';

export function AdminUsersSectionContent({
  actionLoadingId,
  handleUserStatus,
  translate,
  users,
  totalCount,
  searchQuery,
  setSearchQuery,
}: AdminUsersSectionContentProps) {
  return (
    <div className="space-y-6">
      <AdminPageHeader eyebrow="ADMIN CONTROL • ACCOUNTS" title={translate('User Directory')} />

      {/* Search Bar */}
      <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-sm dark:bg-[#13221f] dark:border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-full sm:max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder={translate('Search users by name or ID…')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500 dark:bg-black/40 dark:border-white/10 dark:text-white dark:placeholder-slate-500 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
              aria-label={translate('Clear')}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 self-end sm:self-center">
          <Users size={14} className="text-emerald-700 dark:text-lime-400" />
          <span>
            {searchQuery
              ? translate('Showing {{value0}} of {{value1}} users', {
                  value0: String(users.length),
                  value1: String(totalCount),
                })
              : translate('{{value0}} total users', { value0: String(totalCount) })}
          </span>
        </div>
      </div>

      {users.length === 0 ? (
        searchQuery ? (
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm text-center dark:bg-[#13221f] dark:border-white/10 space-y-3">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300 m-0">
              {translate('No users matching "{{value0}}"', { value0: searchQuery })}
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 dark:text-slate-200 dark:bg-white/10 dark:hover:bg-white/15 transition-colors cursor-pointer"
            >
              <X size={12} />
              <span>{translate('Clear Search')}</span>
            </button>
          </div>
        ) : (
          <StatePanel title={translate('No users found.')} />
        )
      ) : (
        <AdminTableCard>
          <AdminTable minWidth="min-w-[700px]">
            <AdminTableHead>
              <tr>
                <AdminTableHeaderCell>{translate('User / ID')}</AdminTableHeaderCell>
                <AdminTableHeaderCell>{translate('Email')}</AdminTableHeaderCell>
                <AdminTableHeaderCell>{translate('Role')}</AdminTableHeaderCell>
                <AdminTableHeaderCell>{translate('Status')}</AdminTableHeaderCell>
                <AdminTableHeaderCell align="right">{translate('Actions')}</AdminTableHeaderCell>
              </tr>
            </AdminTableHead>
            <AdminTableBody>
              {users.map((u) => {
                const isLoading = actionLoadingId === u.id;
                return (
                  <AdminTableRow key={u.id}>
                    <AdminTableCell>
                      <strong className="text-slate-900 text-sm block dark:text-slate-100">
                        {u.name}
                      </strong>
                      <span
                        className="text-[11px] font-mono text-slate-400 dark:text-slate-500 block truncate max-w-[220px]"
                        title={u.id}
                      >
                        {u.id}
                      </span>
                    </AdminTableCell>

                    <AdminTableCell className="text-slate-600 font-medium dark:text-slate-300">
                      {u.email}
                    </AdminTableCell>

                    <AdminTableCell>
                      <Badge
                        tone={
                          u.role === 'admin' ? 'danger' : u.role === 'owner' ? 'warning' : 'neutral'
                        }
                        className="capitalize"
                      >
                        {translate(u.role)}
                      </Badge>
                    </AdminTableCell>

                    <AdminTableCell>
                      <StatusBadge status={u.status} />
                    </AdminTableCell>

                    <AdminTableCell align="right">
                      {u.role !== 'admin' && (
                        <div className="flex gap-1.5 justify-end">
                          {u.status === 'pending' && u.role === 'owner' && (
                            <AdminActionButton
                              variant="primary"
                              disabled={isLoading}
                              onClick={() => void handleUserStatus(u.id, 'active')}
                            >
                              {translate('Approve Owner')}
                            </AdminActionButton>
                          )}
                          {u.status === 'active' && (
                            <AdminActionButton
                              variant="danger"
                              disabled={isLoading}
                              onClick={() => void handleUserStatus(u.id, 'suspended')}
                            >
                              {translate('Suspend')}
                            </AdminActionButton>
                          )}
                          {u.status !== 'active' && u.status !== 'pending' && (
                            <AdminActionButton
                              variant="primary"
                              disabled={isLoading}
                              onClick={() => void handleUserStatus(u.id, 'active')}
                            >
                              {translate('Activate')}
                            </AdminActionButton>
                          )}
                        </div>
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
