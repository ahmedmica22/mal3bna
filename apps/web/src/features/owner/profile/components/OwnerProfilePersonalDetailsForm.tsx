import { TextField } from '../../../../components/forms/TextField';
import { CheckCircle2, User, Phone, Mail, Save } from 'lucide-react';
import type { OwnerProfileContentProps } from '../types';

export function OwnerProfilePersonalDetailsForm({
  handleSaveDetails,
  isSaving,
  name,
  phone,
  setName,
  setPhone,
  translate,
  user,
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
>) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl backdrop-blur-md space-y-5 dark:bg-[#13221f]/80 dark:border-white/10">
      <h2 className="text-sm font-black text-emerald-700 uppercase tracking-wider flex items-center gap-2 dark:text-lime-400">
        <User size={16} />
        <span>{translate('Account Information')}</span>
      </h2>

      <form onSubmit={(e) => void handleSaveDetails(e)} className="space-y-4">
        {/* Full Name */}
        <TextField
          label={
            <>
              <User size={13} className="text-slate-400" />
              <span>{translate('Full Name')}</span>
            </>
          }
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder={translate('Your full name')}
          containerClassName="space-y-1.5"
        />

        {/* Email Address */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Mail size={13} className="text-slate-400" />
            <span>{translate('Email Address')}</span>
          </label>
          <div className="relative">
            <input
              type="email"
              value={user?.email ?? ''}
              disabled
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-100 text-slate-500 text-sm font-medium cursor-not-allowed dark:border-white/5 dark:bg-white/[0.02] dark:text-slate-400"
            />
            <span className="absolute end-3 top-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 size={13} />
              {translate('Verified')}
            </span>
          </div>
        </div>

        {/* Phone Number */}
        <TextField
          label={
            <>
              <Phone size={13} className="text-slate-400" />
              <span>{translate('Phone Number')}</span>
            </>
          }
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+201012345678"
          containerClassName="space-y-1.5"
        />

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-black bg-lime-400 hover:bg-lime-300 text-slate-950 shadow-md shadow-lime-400/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <Save size={14} />
            <span>
              {isSaving ? translate('Saving details…') : translate('Save Profile Changes')}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
