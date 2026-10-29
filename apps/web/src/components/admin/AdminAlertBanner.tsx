import { useLanguage } from '../../store/LanguageStore';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { AdminAlertBannerProps } from '../../types/ui';

export type { AdminAlertBannerProps };

export function AdminAlertBanner({
  pendingOwnersCount,
  pendingVenuesCount,
  openDisputesCount,
  pendingAppealsCount,
}: AdminAlertBannerProps) {
  const { translate } = useLanguage();
  const totalAlerts =
    pendingOwnersCount + pendingVenuesCount + openDisputesCount + pendingAppealsCount;

  if (totalAlerts === 0) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-4 flex items-center gap-3 text-emerald-700 text-xs font-bold dark:text-emerald-300">
        <CheckCircle2 size={18} className="text-emerald-700 shrink-0 dark:text-emerald-400" />
        <span>
          {translate(
            'All operational queues are clear. Zero pending approvals or unresolved disputes.',
          )}
        </span>
      </div>
    );
  }

  const alertParts = [
    pendingOwnersCount > 0 && `${pendingOwnersCount} owner request(s)`,
    pendingVenuesCount > 0 && `${pendingVenuesCount} venue approval(s)`,
    openDisputesCount > 0 && `${openDisputesCount} open dispute(s)`,
    pendingAppealsCount > 0 && `${pendingAppealsCount} strike appeal(s)`,
  ].filter(Boolean);

  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center shrink-0 dark:text-amber-400">
          <AlertTriangle size={20} />
        </div>
        <div>
          <h3 className="text-sm font-extrabold text-amber-800 dark:text-amber-300">
            {translate('Action Required (')}
            {totalAlerts} {translate('item')}
            {totalAlerts > 1 ? translate('s') : ''})
          </h3>
          <p className="text-xs text-slate-600 mt-0.5 dark:text-slate-300">
            {alertParts.join(' • ')}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center flex-wrap">
        {pendingOwnersCount > 0 && (
          <Link
            to="/admin/users"
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors"
          >
            {translate('Owner Requests (')}
            {pendingOwnersCount})
          </Link>
        )}
        {pendingVenuesCount > 0 && (
          <Link
            to="/admin/venues"
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors"
          >
            {translate('Venues (')}
            {pendingVenuesCount})
          </Link>
        )}
        {openDisputesCount > 0 && (
          <Link
            to="/admin/disputes"
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors"
          >
            {translate('Disputes (')}
            {openDisputesCount})
          </Link>
        )}
      </div>
    </div>
  );
}
