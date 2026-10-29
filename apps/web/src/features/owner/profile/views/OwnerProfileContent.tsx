import { Sparkles } from 'lucide-react';
import type { OwnerProfileContentProps } from '../types';
import { OwnerProfileMatchDetails } from '../components/OwnerProfileMatchDetails';
import { OwnerProfilePaymentSummary } from '../components/OwnerProfilePaymentSummary';

export function OwnerProfileContent({
  handlePhotoUpload,
  handleRemovePhoto,
  handleSaveDetails,
  isSaving,
  isUploadingPhoto,
  name,
  phone,
  photoUrl,
  setName,
  setPhone,
  translate,
  user,
  venue,
}: OwnerProfileContentProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-50 dark:from-emerald-950/40 via-white dark:via-[#13221f]/90 to-teal-50 dark:to-teal-950/40 border border-slate-200 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden dark:border-white/10">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-lime-400/20 text-emerald-700 border border-lime-400/30 dark:text-lime-300">
            <Sparkles size={12} className="text-emerald-700 dark:text-lime-400" />
            {translate('OWNER PROFILE')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight dark:text-slate-100">
            {translate('Your Owner Profile & Avatar')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl dark:text-slate-300">
            {translate(
              'Customize your profile photo and contact details visible across venue operational receipts and dashboard.',
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar Management Card */}
        <OwnerProfileMatchDetails
          {...{
            handlePhotoUpload,
            handleRemovePhoto,
            isUploadingPhoto,
            name,
            photoUrl,
            translate,
            user,
          }}
        />

        {/* Right Columns: Personal Details & Venue Info */}
        <OwnerProfilePaymentSummary
          {...{
            handleSaveDetails,
            isSaving,
            name,
            phone,
            setName,
            setPhone,
            translate,
            user,
            venue,
          }}
        />
      </div>
    </div>
  );
}
