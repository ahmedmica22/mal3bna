import { useLanguage } from '../../store/LanguageStore';
import { Link } from 'react-router-dom';
import { Users, ArrowRight } from 'lucide-react';
import type { PendingOwnersQueueProps } from '../../types/ui';
import { AdminActionButton } from './AdminActionButton';

export type { PendingOwnersQueueProps };

export function PendingOwnersQueue({
  owners,
  approvingOwnerId,
  onApprove,
}: PendingOwnersQueueProps) {
  const { translate, locale } = useLanguage();
  if (owners.length === 0) return null;

  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-6 shadow-xl backdrop-blur-md space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 dark:text-slate-100">
            <Users size={18} className="text-amber-800 dark:text-amber-400" />
            <span>{translate('Pending Venue Owner Requests')}</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400/20 text-amber-800 border border-amber-400/30 dark:text-amber-300">
              {owners.length} {translate('Pending')}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">
            {translate(
              'Approve owner accounts to grant them permission to enter and submit venue information.',
            )}
          </p>
        </div>
        <Link
          to="/admin/users"
          className="text-xs font-bold text-amber-800 hover:text-amber-200 flex items-center gap-1 transition-colors dark:text-amber-300"
        >
          <span>{translate('User Directory')}</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {owners.map((owner) => {
          const isApproving = approvingOwnerId === owner.id;
          return (
            <div
              key={owner.id}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between gap-3 hover:border-amber-400/40 transition-colors dark:bg-[#0b1715]/80 dark:border-white/10"
            >
              <div>
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 text-sm dark:text-slate-100">
                    {owner.name}
                  </strong>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-800 border border-amber-400/25 dark:text-amber-300">
                    {translate('Pending')}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 dark:text-slate-400">{owner.email}</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  {translate('Requested:')} {new Date(owner.createdAt).toLocaleDateString(locale)}
                </p>
              </div>

              <AdminActionButton
                variant="primary"
                size="sm"
                className="w-full !rounded-xl !py-2"
                isLoading={isApproving}
                disabled={Boolean(approvingOwnerId)}
                onClick={() => void onApprove(owner.id, owner.name)}
              >
                {isApproving ? translate('Approving…') : translate('Approve Owner Request')}
              </AdminActionButton>
            </div>
          );
        })}
      </div>
    </div>
  );
}
