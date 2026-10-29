import { CreditCard } from 'lucide-react';
import { Select } from '../../../../components/ui/Select';
import { DatePicker } from '../../../../components/ui/DatePicker';
import type { AdminPayoutsSectionContentProps } from '../types';

export function AdminPayoutsSectionGeneratePayoutBatch({
  generateEnd,
  generateStart,
  generateVenueId,
  handleGeneratePayout,
  isGenerating,
  setGenerateEnd,
  setGenerateStart,
  setGenerateVenueId,
  translate,
  venues,
}: Pick<
  AdminPayoutsSectionContentProps,
  | 'generateEnd'
  | 'generateStart'
  | 'generateVenueId'
  | 'handleGeneratePayout'
  | 'isGenerating'
  | 'setGenerateEnd'
  | 'setGenerateStart'
  | 'setGenerateVenueId'
  | 'translate'
  | 'venues'
>) {
  return (
    <div className="relative z-30 bg-white border border-slate-200 rounded-3xl p-6 shadow-xl backdrop-blur-md space-y-4 dark:bg-[#13221f]/80 dark:border-white/10">
      <div className="flex items-center gap-2">
        <CreditCard className="text-emerald-700 dark:text-lime-400" size={20} />
        <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">
          {translate('Generate Venue Payout Batch')}
        </h2>
      </div>

      <form
        onSubmit={handleGeneratePayout}
        className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end"
      >
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1 dark:text-slate-300">
            {translate('Select Venue')}
          </label>
          <Select
            value={generateVenueId || (venues[0]?.id ?? '')}
            onChange={setGenerateVenueId}
            options={venues.map((v) => ({
              value: v.id,
              label: v.name,
            }))}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1 dark:text-slate-300">
            {translate('Period Start')}
          </label>
          <DatePicker value={generateStart} onChange={setGenerateStart} align="left" />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1 dark:text-slate-300">
            {translate('Period End')}
          </label>
          <DatePicker value={generateEnd} onChange={setGenerateEnd} align="right" />
        </div>

        <div>
          <button
            type="submit"
            disabled={isGenerating}
            className="button w-full py-2.5 rounded-xl text-xs font-extrabold bg-lime-400 hover:bg-lime-300 text-slate-950 shadow-md shadow-lime-400/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? translate('Calculating…') : translate('Generate Batch')}
          </button>
        </div>
      </form>
    </div>
  );
}
