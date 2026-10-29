import { TextField } from '../../../../components/forms/TextField';
import { Dialog } from '../../../../components/ui/Dialog';
import { Select } from '../../../../components/ui/Select';
import { DateTimePicker } from '../../../../components/ui/DateTimePicker';
import { X } from 'lucide-react';
import type { OwnerBookingsContentProps } from '../types';

export function OwnerBookingsBlockCourtModal({
  blockCourtId,
  blockHours,
  blockReason,
  blockStartsAt,
  courts,
  setBlockCourtId,
  setBlockHours,
  setBlockReason,
  setBlockStartsAt,
  setShowBlockModal,
  showBlockModal,
  submitBlock,
  translate,
}: Pick<
  OwnerBookingsContentProps,
  | 'blockCourtId'
  | 'blockHours'
  | 'blockReason'
  | 'blockStartsAt'
  | 'courts'
  | 'setBlockCourtId'
  | 'setBlockHours'
  | 'setBlockReason'
  | 'setBlockStartsAt'
  | 'setShowBlockModal'
  | 'showBlockModal'
  | 'submitBlock'
  | 'translate'
>) {
  return (
    <>
      {showBlockModal && (
        <Dialog label={translate('Block Court Slot')} onClose={() => setShowBlockModal(false)}>
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 dark:bg-[#13221f] dark:border-white/15">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-white/10">
              <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
                {translate('Block Court (Maintenance)')}
              </h2>
              <button
                type="button"
                onClick={() => setShowBlockModal(false)}
                className="text-slate-500 hover:text-white p-1 rounded-lg hover:bg-slate-100 transition-colors dark:text-slate-400 dark:hover:bg-white/10"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed dark:text-slate-400">
              {translate(
                'Close court slots for turf maintenance, lighting repair, or weather. This prevents players from booking during this window.',
              )}
            </p>

            <form onSubmit={submitBlock} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 dark:text-slate-300">
                  {translate('Select Court')}
                </label>
                <Select
                  value={blockCourtId || (courts[0]?.id ?? '')}
                  onChange={setBlockCourtId}
                  options={courts.map((c) => ({
                    value: c.id,
                    label: `${c.name} (${c.sport})`,
                  }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1 dark:text-slate-300">
                    {translate('Start Time')}
                  </label>
                  <DateTimePicker value={blockStartsAt} onChange={setBlockStartsAt} />
                </div>
                <TextField
                  label={translate('Duration (Hours)')}
                  type="number"
                  min={1}
                  max={12}
                  value={blockHours}
                  onChange={(e) => setBlockHours(Number(e.target.value))}
                />
              </div>

              <TextField
                label={translate('Reason for Block')}
                type="text"
                required
                placeholder={translate('e.g. Floodlight repair, Rain closure')}
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
              />

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  className="button px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-100 text-slate-700 transition-all cursor-pointer dark:bg-white/10 dark:hover:bg-white/15 dark:text-slate-200"
                  onClick={() => setShowBlockModal(false)}
                >
                  {translate('Cancel')}
                </button>
                <button
                  type="submit"
                  className="button px-4 py-2 rounded-xl text-xs font-extrabold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
                >
                  {translate('Block Court Slot')}
                </button>
              </div>
            </form>
          </div>
        </Dialog>
      )}
    </>
  );
}
