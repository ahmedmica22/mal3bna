import { TextField } from '../../../../components/forms/TextField';
import { Select } from '../../../../components/ui/Select';
import { Send, Layers, Building2, CheckCircle2 } from 'lucide-react';
import type { OwnerVenueOnboardingProps } from '../types';
import { OwnerVenueVenuePhotos } from '../components/OwnerVenueVenuePhotos';

export function OwnerVenueOnboarding({
  areas,
  handleFilesUpload,
  handleRegisterVenue,
  initialCourtName,
  initialHourlyRate,
  initialIsIndoor,
  initialSize,
  initialSport,
  initialSurface,
  isSubmittingVenue,
  newAddress,
  newAreaId,
  newDescription,
  newMaxHours,
  newPhone,
  newVenueName,
  removeOnboardingPhoto,
  setInitialCourtName,
  setInitialHourlyRate,
  setInitialIsIndoor,
  setInitialSize,
  setInitialSport,
  setInitialSurface,
  setNewAddress,
  setNewAreaId,
  setNewDescription,
  setNewMaxHours,
  setNewPhone,
  setNewVenueName,
  translate,
  user,
  venuePhotos,
}: OwnerVenueOnboardingProps) {
  return (
    <div className="max-w-3xl mx-auto my-6 space-y-6 animate-in fade-in duration-300">
      <div className="bg-gradient-to-r from-emerald-50 dark:from-emerald-950/40 via-white dark:via-[#13221f]/90 to-teal-50 dark:to-teal-950/40 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-emerald-400/20 text-emerald-700 border border-emerald-400/30 dark:text-emerald-300">
            <CheckCircle2 size={13} className="text-emerald-700 dark:text-emerald-400" />
            {translate('Owner Account Approved')}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 dark:text-slate-100">
          <span>{translate('Send Venue Information')}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed dark:text-slate-300">
          {translate('Welcome,')} <strong>{user?.name ?? translate('Venue Partner')}</strong>
          {translate(
            '! Your owner account request has been approved by the Super Admin. Please fill in your venue details, upload 2 to 3 photos, and configure your first pitch.',
          )}
        </p>
      </div>

      <form
        onSubmit={(e) => void handleRegisterVenue(e)}
        className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-xl space-y-6 dark:bg-[#13221f]/80 dark:border-white/10"
      >
        {/* 1. Venue Identity & Location */}
        <div className="border-b border-slate-200 pb-4 dark:border-white/10">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 dark:text-slate-100">
            <Building2 size={18} className="text-emerald-700 dark:text-lime-400" />
            <span>{translate('1. Venue Identity & Location')}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 dark:text-slate-400">
            {translate('Authoritative address and contact information.')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            label={translate('Venue Name *')}
            type="text"
            required
            placeholder={translate('e.g. Al Ahly Arena or Gezira Sports Complex')}
            value={newVenueName}
            onChange={(e) => setNewVenueName(e.target.value)}
          />

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 dark:text-slate-300">
              {translate('District / Area *')}
            </label>
            <Select
              value={newAreaId}
              onChange={(val) => setNewAreaId(val)}
              options={[
                { value: '', label: translate('Select Cairo Area…') },
                ...areas.map((a) => ({
                  value: a.id,
                  label: `${a.nameEn} (${a.nameAr})`,
                })),
              ]}
            />
          </div>

          <TextField
            label={translate('Contact Phone / WhatsApp *')}
            type="tel"
            required
            placeholder={translate('e.g. +20 100 123 4567')}
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
          />

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 dark:text-slate-300">
              {translate('Max Consecutive Hours per Match (Platform Max: 4)')}
            </label>
            <Select
              value={String(newMaxHours)}
              onChange={(val) => setNewMaxHours(Number(val))}
              options={[
                { value: '2', label: translate('2 Hours') },
                { value: '3', label: translate('3 Hours') },
                { value: '4', label: translate('4 Hours (Platform Standard)') },
              ]}
            />
          </div>

          <TextField
            label={translate('Full Street Address *')}
            type="text"
            required
            placeholder={translate('e.g. Plot 4, Fifth Settlement, Next to AUC, New Cairo')}
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            containerClassName="sm:col-span-2"
          />

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-600 mb-1.5 dark:text-slate-300">
              {translate('Description & Amenities')}
            </label>
            <textarea
              rows={3}
              placeholder={translate(
                'Describe your court surfaces, lighting, parking, changing rooms...',
              )}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-lime-400 focus:outline-none transition-colors resize-none dark:bg-white/5 dark:border-white/10 dark:text-slate-100"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
          </div>
        </div>

        {/* 2. Venue Photos (Min 2, Max 3) */}
        <OwnerVenueVenuePhotos
          {...{ handleFilesUpload, removeOnboardingPhoto, translate, venuePhotos }}
        />

        {/* 3. Initial Pitch & Standard Rate */}
        <div className="border-b border-slate-200 pb-4 dark:border-white/10">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 dark:text-slate-100">
            <Layers size={18} className="text-emerald-700 dark:text-lime-400" />
            <span>{translate('3. Initial Pitch & Standard Rate')}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 dark:text-slate-400">
            {translate(
              'Configure your first bookable pitch. Standard 24h round-the-clock availability is set.',
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <TextField
            label={translate('Pitch Name')}
            type="text"
            required
            value={initialCourtName}
            onChange={(e) => setInitialCourtName(e.target.value)}
          />

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 dark:text-slate-300">
              {translate('Sport')}
            </label>
            <Select
              value={initialSport}
              onChange={(val) => setInitialSport(val as 'football' | 'padel')}
              options={[
                { value: 'football', label: translate('Football') },
                { value: 'padel', label: translate('Padel') },
              ]}
            />
          </div>

          {initialSport === 'football' ? (
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 dark:text-slate-300">
                {translate('Football Pitch Size')}
              </label>
              <Select
                value={String(initialSize)}
                onChange={(val) => setInitialSize(Number(val))}
                options={[
                  { value: '5', label: translate('5-a-side') },
                  { value: '7', label: translate('7-a-side') },
                  { value: '11', label: translate('11-a-side') },
                ]}
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 dark:text-slate-300">
                {translate('Court Type')}
              </label>
              <div className="px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 text-xs font-medium dark:bg-white/5 dark:border-white/10 dark:text-slate-400">
                {translate('Standard Double Padel (Glass)')}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 dark:text-slate-300">
              {translate('Surface Type')}
            </label>
            <Select
              value={initialSurface}
              onChange={(val) => setInitialSurface(val)}
              options={[
                { value: 'Artificial Turf', label: translate('Artificial Turf') },
                { value: 'Natural Grass', label: translate('Natural Grass') },
                { value: 'Acrylic / Hardcourt', label: translate('Acrylic / Hardcourt') },
                { value: 'Double Glass Padel', label: translate('Double Glass Padel') },
              ]}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 dark:text-slate-300">
              {translate('Court Environment')}
            </label>
            <Select
              value={initialIsIndoor ? 'indoor' : 'outdoor'}
              onChange={(val) => setInitialIsIndoor(val === 'indoor')}
              options={[
                { value: 'outdoor', label: translate('☀️ Outdoor Pitch') },
                { value: 'indoor', label: translate('🏠 Covered / Indoor') },
              ]}
            />
          </div>

          <TextField
            label={translate('Hourly Price (EGP) *')}
            type="number"
            required
            min={50}
            step={50}
            value={initialHourlyRate}
            onChange={(e) => setInitialHourlyRate(Number(e.target.value))}
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmittingVenue}
            className="w-full py-4 rounded-2xl text-sm font-black bg-lime-400 hover:bg-lime-300 text-slate-950 shadow-xl shadow-lime-400/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Send size={16} />
            <span>
              {isSubmittingVenue
                ? translate('Submitting Venue Info…')
                : translate('Send Venue Info & Photos for Super Admin Approval')}
            </span>
          </button>
          <p className="text-center text-[11px] text-slate-500 mt-2 dark:text-slate-400">
            {translate(
              'Round-the-clock 24-hour slots provisioned. Super Admin will verify your photos and listing.',
            )}
          </p>
        </div>
      </form>
    </div>
  );
}
