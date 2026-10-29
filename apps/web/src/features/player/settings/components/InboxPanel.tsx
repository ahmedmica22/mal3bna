import { StatePanel } from '../../../../components/feedback/StatePanel';
import { Bell } from 'lucide-react';
import type { SettingsContentProps } from '../types';

export function InboxPanel({
  activeTab,
  handleMarkRead,
  inboxQuery,
  locale,
  notifications,
  translate,
}: Pick<
  SettingsContentProps,
  'activeTab' | 'handleMarkRead' | 'inboxQuery' | 'locale' | 'notifications' | 'translate'
>) {
  return (
    <>
      {activeTab === 'inbox' && (
        <div className="space-y-4">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white mb-1">
              {translate('System Notifications')}
            </h2>
            <p className="text-xs text-slate-400 m-0">
              {translate('Real-time updates regarding bookings and payments')}
            </p>
          </div>

          {inboxQuery.isLoading && <StatePanel title={translate('Loading notifications…')} />}

          {inboxQuery.isSuccess && notifications.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-[#13221f] p-8 text-center shadow-xl">
              <Bell size={32} className="text-slate-500 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-white mb-1">{translate('Inbox is quiet.')}</h3>
              <p className="text-xs text-slate-400 m-0 max-w-sm mx-auto">
                {translate(
                  'You will receive match confirmations, kickoff alerts, and payment receipts here.',
                )}
              </p>
            </div>
          )}

          {notifications.length > 0 && (
            <div className="space-y-3">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-2xl border p-4 sm:p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl ${
                    item.readAt
                      ? 'border-white/10 bg-[#13221f]'
                      : 'border-lime-400/40 bg-lime-400/5 ring-1 ring-lime-400/20'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <strong
                        className={`text-sm font-bold ${item.readAt ? 'text-white' : 'text-lime-400'}`}
                      >
                        {item.title}
                      </strong>
                      {!item.readAt && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-lime-400 text-slate-950">
                          {translate('NEW')}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mb-2 m-0">{item.body}</p>
                    <small className="text-[11px] text-slate-400 font-semibold block">
                      {new Date(item.createdAt).toLocaleString(locale, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                        timeZone: 'Africa/Cairo',
                      })}
                    </small>
                  </div>
                  {!item.readAt && (
                    <button
                      type="button"
                      onClick={() => void handleMarkRead(item.id)}
                      className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all shrink-0 cursor-pointer self-start sm:self-center"
                    >
                      {translate('Mark read')}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
