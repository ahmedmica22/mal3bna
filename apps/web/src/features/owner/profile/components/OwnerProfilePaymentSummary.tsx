import { Building2, ShieldCheck } from 'lucide-react';
import type { OwnerProfileContentProps } from '../types';
import { OwnerProfilePersonalDetailsForm } from './OwnerProfilePersonalDetailsForm';

export function OwnerProfilePaymentSummary({
  handleSaveDetails,
  isSaving,
  name,
  phone,
  setName,
  setPhone,
  translate,
  user,
  venue,
}: Pick<
  OwnerProfileContentProps,
  | 'handleSaveDetails'
  | 'isSaving'
  | 'name'
  | 'phone'
  | 'setName'
  | 'setPhone'
  | 'translate'
  | 'user'
  | 'venue'
>) {
  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Personal Details Form */}
      <OwnerProfilePersonalDetailsForm
        {...{ handleSaveDetails, isSaving, name, phone, setName, setPhone, translate, user }}
      />

      {/* Managed Venue Summary */}
      {venue && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl backdrop-blur-md space-y-3 dark:bg-[#13221f]/80 dark:border-white/10">
          <h2 className="text-sm font-black text-emerald-700 uppercase tracking-wider flex items-center gap-2 dark:text-lime-400">
            <Building2 size={16} />
            <span>{translate('Your Sports Venue')}</span>
          </h2>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/5">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                {venue.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 dark:text-slate-400">{venue.address}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 dark:text-emerald-400">
              <ShieldCheck size={14} />
              {translate(venue.status ?? 'active')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
