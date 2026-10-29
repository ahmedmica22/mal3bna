import { TextField } from '../../../../components/forms/TextField';
import { Select } from '../../../../components/ui/Select';
import { X } from 'lucide-react';
import type { OwnerVenueContentProps } from '../types';
import { OwnerVenuePitchPhotos } from './OwnerVenuePitchPhotos';

export function AddCourtForm({
  courtHourlyPrice,
  courtName,
  handleAddCourt,
  handleFilesUpload,
  isIndoor,
  isSubmittingCourt,
  newCourtPhotos,
  setCourtHourlyPrice,
  setCourtName,
  setIsIndoor,
  setNewCourtPhotos,
  setShowAddCourt,
  setSize,
  setSport,
  setSurface,
  showAddCourt,
  size,
  sport,
  surface,
  translate,
}: Pick<
  OwnerVenueContentProps,
  | 'courtHourlyPrice'
  | 'courtName'
  | 'handleAddCourt'
  | 'handleFilesUpload'
  | 'isIndoor'
  | 'isSubmittingCourt'
  | 'newCourtPhotos'
  | 'setCourtHourlyPrice'
  | 'setCourtName'
  | 'setIsIndoor'
  | 'setNewCourtPhotos'
  | 'setShowAddCourt'
  | 'setSize'
  | 'setSport'
  | 'setSurface'
  | 'showAddCourt'
  | 'size'
  | 'sport'
  | 'surface'
  | 'translate'
>) {
  return (
    <>
      {showAddCourt && (
        <form
          onSubmit={(e) => void handleAddCourt(e)}
          className="p-5 rounded-2xl bg-slate-50 border border-lime-400/30 space-y-4 animate-in fade-in duration-200 dark:bg-black/40"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-emerald-700 dark:text-lime-400">
              {translate('Add New Court / Pitch')}
            </h3>
            <button
              type="button"
              className="text-slate-500 hover:text-slate-900 cursor-pointer dark:text-slate-400 dark:hover:text-slate-100"
              onClick={() => setShowAddCourt(false)}
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <TextField
              label={translate('Pitch Name')}
              type="text"
              required
              placeholder={translate('e.g. Pitch A (Turf)')}
              value={courtName}
              onChange={(e) => setCourtName(e.target.value)}
            />

            <div>
              <label className="block text-slate-600 font-bold mb-1 dark:text-slate-300">
                {translate('Sport')}
              </label>
              <Select
                value={sport}
                onChange={(val) => setSport(val as 'football' | 'padel')}
                options={[
                  { value: 'football', label: translate('Football') },
                  { value: 'padel', label: translate('Padel') },
                ]}
              />
            </div>

            {sport === 'football' ? (
              <div>
                <label className="block text-slate-600 font-bold mb-1 dark:text-slate-300">
                  {translate('Size')}
                </label>
                <Select
                  value={String(size)}
                  onChange={(val) => setSize(Number(val))}
                  options={[
                    { value: '5', label: translate('5-a-side') },
                    { value: '7', label: translate('7-a-side') },
                    { value: '11', label: translate('11-a-side') },
                  ]}
                />
              </div>
            ) : (
              <div>
                <label className="block text-slate-600 font-bold mb-1 dark:text-slate-300">
                  {translate('Type')}
                </label>
                <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-xs dark:bg-white/5 dark:border-white/10 dark:text-slate-400">
                  {translate('Standard Double (Glass)')}
                </div>
              </div>
            )}

            <TextField
              label={translate('Surface')}
              type="text"
              value={surface}
              onChange={(e) => setSurface(e.target.value)}
            />

            <div>
              <label className="block text-slate-600 font-bold mb-1 dark:text-slate-300">
                {translate('Environment')}
              </label>
              <Select
                value={isIndoor ? 'indoor' : 'outdoor'}
                onChange={(val) => setIsIndoor(val === 'indoor')}
                options={[
                  { value: 'outdoor', label: translate('☀️ Outdoor') },
                  { value: 'indoor', label: translate('🏠 Indoor / Covered') },
                ]}
              />
            </div>

            <TextField
              label={translate('Hourly Rate (EGP) *')}
              type="number"
              required
              min={50}
              step={50}
              value={courtHourlyPrice}
              onChange={(e) => setCourtHourlyPrice(Number(e.target.value))}
            />
          </div>

          {/* Pitch Photos (Min 2, Max 6) */}
          <OwnerVenuePitchPhotos
            {...{ handleFilesUpload, newCourtPhotos, setNewCourtPhotos, translate }}
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer dark:text-slate-400 dark:hover:text-slate-100"
              onClick={() => setShowAddCourt(false)}
            >
              {translate('Cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmittingCourt}
              className="px-4 py-1.5 rounded-xl text-xs font-bold bg-lime-400 hover:bg-lime-300 text-slate-950 shadow-sm cursor-pointer"
            >
              {isSubmittingCourt ? translate('Saving…') : translate('Save Pitch')}
            </button>
          </div>
        </form>
      )}
    </>
  );
}
