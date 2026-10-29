import { Mail, Phone, Smartphone } from 'lucide-react';
import type { SettingsContentProps } from '../types';

export function SupportPanel({
  activeTab,
  translate,
}: Pick<SettingsContentProps, 'activeTab' | 'translate'>) {
  return (
    <>
      {activeTab === 'support' && (
        <div className="space-y-4">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white mb-1">
              {translate('Customer Support & On-Call Admin')}
            </h2>
            <p className="text-xs text-slate-400 m-0 leading-relaxed">
              {translate(
                'Have questions about a match, no-show dispute, or payment issue? Our team is available 24/7.',
              )}
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-white/10 bg-[#13221f] p-5 shadow-xl flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <Smartphone size={20} />
              </div>
              <div>
                <strong className="block text-sm font-bold text-white mb-0.5">
                  {translate('WhatsApp Support Hotline')}
                </strong>
                <span className="text-xs font-black text-lime-400 block mb-0.5">
                  +20 100 123 4567
                </span>
                <small className="text-[11px] text-slate-400 block">
                  {translate('Instant replies for match-day emergencies')}
                </small>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#13221f] p-5 shadow-xl flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/30">
                <Mail size={20} />
              </div>
              <div>
                <strong className="block text-sm font-bold text-white mb-0.5">
                  {translate('Email Support Desk')}
                </strong>
                <span className="text-xs font-black text-sky-400 block mb-0.5">
                  {translate('support@mal3bna.com')}
                </span>
                <small className="text-[11px] text-slate-400 block">
                  {translate('Dispute escalation and refund inquiries')}
                </small>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#13221f] p-5 shadow-xl flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                <Phone size={20} />
              </div>
              <div>
                <strong className="block text-sm font-bold text-white mb-0.5">
                  {translate('Cairo Operations Center')}
                </strong>
                <span className="text-xs font-black text-amber-400 block mb-0.5">
                  {translate('Maadi Technology Park, Building 4, Cairo')}
                </span>
                <small className="text-[11px] text-slate-400 block">
                  {translate('Operating hours: 09:00 - 23:00 daily')}
                </small>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
