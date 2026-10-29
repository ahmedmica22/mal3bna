import { TextField } from '../../../../components/forms/TextField';
import { Select } from '../../../../components/ui/Select';
import { CheckCircle2, Award, Save } from 'lucide-react';
import type { ProfileContentProps } from '../types';

export function ProfilePlayerSportsPreferencesForm({
  footOptions,
  handleSave,
  isSaving,
  padelLevel,
  padelOptions,
  playingStyle,
  position1,
  preferredFoot,
  saveSuccess,
  setPadelLevel,
  setPlayingStyle,
  setPosition1,
  setPreferredFoot,
  styleOptions,
  translate,
}: Pick<
  ProfileContentProps,
  | 'footOptions'
  | 'handleSave'
  | 'isSaving'
  | 'padelLevel'
  | 'padelOptions'
  | 'playingStyle'
  | 'position1'
  | 'preferredFoot'
  | 'saveSuccess'
  | 'setPadelLevel'
  | 'setPlayingStyle'
  | 'setPosition1'
  | 'setPreferredFoot'
  | 'styleOptions'
  | 'translate'
>) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl backdrop-blur-md dark:bg-[#13221f]/80 dark:border-white/10">
      <div className="flex items-center gap-2.5 mb-6">
        <Award className="text-emerald-700 dark:text-lime-400" size={20} />
        <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
          {translate('Sports Profile & Play Style')}
        </h2>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 dark:text-slate-300">
              {translate('Preferred Foot')}
            </label>
            <Select value={preferredFoot} onChange={setPreferredFoot} options={footOptions} />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 dark:text-slate-300">
              {translate('Playing Style')}
            </label>
            <Select value={playingStyle} onChange={setPlayingStyle} options={styleOptions} />
          </div>

          <TextField
            label={translate('Primary Football Position')}
            type="text"
            value={position1}
            onChange={(e) => setPosition1(e.target.value)}
            placeholder={translate('e.g. Center Midfield, ST')}
          />

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 dark:text-slate-300">
              {translate('Padel Skill Level')}
            </label>
            <Select value={padelLevel} onChange={setPadelLevel} options={padelOptions} />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2 border-t border-slate-200 dark:border-white/10">
          <button
            type="submit"
            disabled={isSaving}
            className="button px-5 py-2.5 rounded-full text-xs font-extrabold bg-lime-400 hover:bg-lime-300 text-slate-950 shadow-lg shadow-lime-400/25 transition-all cursor-pointer inline-flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={14} />
            <span>{isSaving ? translate('Saving…') : translate('Save Profile Preferences')}</span>
          </button>
          {saveSuccess && (
            <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 dark:text-emerald-400">
              <CheckCircle2 size={14} />
              {translate('Changes saved!')}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
