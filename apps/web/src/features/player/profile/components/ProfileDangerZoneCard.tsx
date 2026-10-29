import { AlertTriangle, Trash2, ShieldAlert } from 'lucide-react';
import { Dialog } from '../../../../components/ui/Dialog';

interface ProfileDangerZoneCardProps {
  translate: (key: string, params?: Record<string, string | number>) => string;
  showDeleteModal: boolean;
  setShowDeleteModal: (show: boolean) => void;
  isDeletingAccount: boolean;
  handleDeleteAccount: () => Promise<void>;
  hasActiveBookings?: boolean | undefined;
  activeBookingsCount?: number | undefined;
}

export function ProfileDangerZoneCard({
  translate,
  showDeleteModal,
  setShowDeleteModal,
  isDeletingAccount,
  handleDeleteAccount,
  hasActiveBookings,
  activeBookingsCount,
}: ProfileDangerZoneCardProps) {
  return (
    <>
      {/* Danger Zone: Delete Account */}
      <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 shadow-md backdrop-blur-md dark:bg-rose-950/20 dark:border-rose-900/30 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-red-700 dark:text-rose-400 flex items-center gap-2 m-0 mb-1">
              <AlertTriangle size={18} className="text-red-600 dark:text-rose-400 shrink-0" />
              <span>{translate('Danger Zone')}</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl m-0 leading-relaxed">
              {translate(
                'Once you delete your account, your personal information is permanently redacted and your access is revoked. This action cannot be undone.',
              )}
            </p>
          </div>
          <button
            type="button"
            disabled={hasActiveBookings || isDeletingAccount}
            onClick={() => setShowDeleteModal(true)}
            title={
              hasActiveBookings
                ? translate('Cannot delete account while you have appointments booked.')
                : undefined
            }
            className="button inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:scale-95 shadow-sm shadow-red-600/30 cursor-pointer transition-all shrink-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-red-600 disabled:active:scale-100"
          >
            <Trash2 size={14} />
            <span>{translate('Delete Account')}</span>
          </button>
        </div>

        {/* Warning if player has active match appointments booked */}
        {hasActiveBookings && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs">
            <ShieldAlert size={16} className="shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="font-bold m-0">
                {translate('Account deletion blocked: active appointments booked')}
              </p>
              <p className="text-[11px] opacity-90 m-0 mt-0.5">
                {translate(
                  'A player cannot delete their account as long as they have appointments booked ({{value0}} active). Please attend or cancel your upcoming reservations before deleting.',
                  { value0: activeBookingsCount ?? 1 },
                )}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showDeleteModal && (
        <Dialog label={translate('Delete Account')} onClose={() => !isDeletingAccount && setShowDeleteModal(false)}>
          <div className="bg-white dark:bg-[#13221f] border border-slate-200 dark:border-white/10 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-rose-950/50 flex items-center justify-center text-red-600 dark:text-rose-400 shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-slate-100 m-0">
                  {translate('Permanently Delete Account')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 m-0">
                  {translate('This action is irreversible.')}
                </p>
              </div>
            </div>

            {hasActiveBookings ? (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs">
                <p className="font-bold m-0 mb-1">
                  {translate('Action Blocked')}
                </p>
                <p className="m-0 text-[11px]">
                  {translate('You cannot delete your account as long as you have appointments booked. Please attend or cancel your reservations first.')}
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed m-0">
                {translate(
                  'Are you sure you want to delete your account? This action cannot be undone. Any completed reservations will be anonymized, and active sessions will be terminated.',
                )}
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-white/10">
              <button
                type="button"
                disabled={isDeletingAccount}
                onClick={() => setShowDeleteModal(false)}
                className="button px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-50"
              >
                {translate('Cancel')}
              </button>
              <button
                type="button"
                disabled={isDeletingAccount || hasActiveBookings}
                onClick={() => void handleDeleteAccount()}
                className="button inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 cursor-pointer transition-all shadow-md shadow-red-600/30"
              >
                {isDeletingAccount ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{translate('Deleting...')}</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    <span>{translate('Delete My Account')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
}
