import type { SettingsContentProps } from '../types';

export function LanguagePreferencesPanel({
  activeTab,
  handleLanguageChange,
  lang,
  translate,
}: Pick<SettingsContentProps, 'activeTab' | 'handleLanguageChange' | 'lang' | 'translate'>) {
  return (
    <>
      {activeTab === 'regional' && (
        <div className="space-y-4">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white mb-1">
              {translate('Regional & Localization')}
            </h2>
            <p className="text-xs text-slate-400 m-0 leading-relaxed">
              {translate(
                'mal3bna is localized for Egyptian venues with full Arabic and Right-to-Left (RTL) layout support.',
              )}
            </p>
          </div>

          {/* Language Selector */}
          <div className="rounded-2xl border border-white/10 bg-[#13221f] p-6 shadow-xl mb-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              {translate('Interface Language:')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`py-3.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  lang === 'en'
                    ? 'border-lime-400 bg-lime-400 text-slate-950 font-black shadow-lg shadow-lime-400/20'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                {translate('English ')}
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('ar')}
                className={`py-3.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  lang === 'ar'
                    ? 'border-lime-400 bg-lime-400 text-slate-950 font-black shadow-lg shadow-lime-400/20'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                {translate('العربية ')}
              </button>
            </div>
          </div>

          {/* Platform Standards Card */}
          <div className="rounded-2xl border border-white/10 bg-[#13221f] p-6 shadow-xl">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">
              {translate('Platform Standards')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400 block text-[11px] mb-1">
                  {translate('Currency:')}
                </span>
                <strong className="text-white font-bold">
                  {translate('Egyptian Pounds (EGP / ج.م)')}
                </strong>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400 block text-[11px] mb-1">
                  {translate('Timezone:')}
                </span>
                <strong className="text-white font-bold">
                  {translate('Africa/Cairo (EET/EEST)')}
                </strong>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400 block text-[11px] mb-1">
                  {translate('Slot Duration:')}
                </span>
                <strong className="text-white font-bold">
                  {translate('Fixed 60 Minutes (on the hour)')}
                </strong>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400 block text-[11px] mb-1">
                  {translate('Payment Terms:')}
                </span>
                <strong className="text-white font-bold">
                  {translate('30% Online + 70% Venue Cash')}
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
