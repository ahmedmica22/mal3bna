import { CheckCircle } from 'lucide-react';
import type { SettingsContentProps } from '../types';

export function NotificationPreferencesPanel({
  activeTab,
  defaultCategories,
  prefSaving,
  prefSuccess,
  prefsState,
  togglePreference,
  translate,
}: Pick<
  SettingsContentProps,
  | 'activeTab'
  | 'defaultCategories'
  | 'prefSaving'
  | 'prefSuccess'
  | 'prefsState'
  | 'togglePreference'
  | 'translate'
>) {
  return (
    <>
      {activeTab === 'preferences' && (
        <div className="space-y-4">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white mb-1">
              {translate('Notification Preferences')}
            </h2>
            <p className="text-xs text-slate-400 m-0">
              {translate('Choose how you would like to be notified for each match-day category.')}
            </p>
          </div>

          {prefSuccess && (
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-3.5 text-xs text-emerald-300 flex items-center gap-2.5">
              <CheckCircle size={16} className="text-emerald-400 shrink-0" />
              <span>{translate('Preferences saved successfully.')}</span>
            </div>
          )}

          <div className="space-y-3.5">
            {defaultCategories.map((cat) => {
              const current = prefsState[cat.category] ?? { email: true, push: true };
              return (
                <div
                  key={cat.category}
                  className="rounded-2xl border border-white/10 bg-[#13221f] p-5 shadow-xl"
                >
                  <strong className="block text-sm font-bold text-white mb-1">{cat.label}</strong>
                  <p className="text-xs text-slate-400 mb-4 m-0 leading-relaxed">{cat.desc}</p>
                  <div className="flex gap-3 flex-wrap">
                    <label
                      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        current.email
                          ? 'border-lime-400/50 bg-lime-400/10 text-white'
                          : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={current.email}
                        disabled={prefSaving}
                        onChange={() => void togglePreference(cat.category, 'email')}
                        className="accent-lime-400"
                      />
                      <span>{translate('Email Notifications')}</span>
                    </label>
                    <label
                      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        current.push
                          ? 'border-lime-400/50 bg-lime-400/10 text-white'
                          : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={current.push}
                        disabled={prefSaving}
                        onChange={() => void togglePreference(cat.category, 'push')}
                        className="accent-lime-400"
                      />
                      <span>{translate('In-App / Push Alerts')}</span>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
