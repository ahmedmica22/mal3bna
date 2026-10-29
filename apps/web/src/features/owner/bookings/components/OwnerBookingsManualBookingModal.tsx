import { TextField } from '../../../../components/forms/TextField';
import { Dialog } from '../../../../components/ui/Dialog';
import { Select } from '../../../../components/ui/Select';
import { DateTimePicker } from '../../../../components/ui/DateTimePicker';
import { X } from 'lucide-react';
import type { OwnerBookingsContentProps } from '../types';

export function OwnerBookingsManualBookingModal({
  courts,
  manualCourtId,
  manualCustomerName,
  manualCustomerPhone,
  manualHours,
  manualPriceEgp,
  manualStartsAt,
  setManualCourtId,
  setManualCustomerName,
  setManualCustomerPhone,
  setManualHours,
  setManualPriceEgp,
  setManualStartsAt,
  setShowManualModal,
  showManualModal,
  submitManual,
  translate,
}: Pick<
  OwnerBookingsContentProps,
  | 'courts'
  | 'manualCourtId'
  | 'manualCustomerName'
  | 'manualCustomerPhone'
  | 'manualHours'
  | 'manualPriceEgp'
  | 'manualStartsAt'
  | 'setManualCourtId'
  | 'setManualCustomerName'
  | 'setManualCustomerPhone'
  | 'setManualHours'
  | 'setManualPriceEgp'
  | 'setManualStartsAt'
  | 'setShowManualModal'
  | 'showManualModal'
  | 'submitManual'
  | 'translate'
>) {
  return (
    <>
      {showManualModal && (
        <Dialog
          label={translate('Add Walk-In / Phone Booking')}
          onClose={() => setShowManualModal(false)}
        >
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 dark:bg-[#13221f] dark:border-white/15">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-white/10">
              <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
                {translate('Add Walk-In / Phone Booking')}
              </h2>
              <button
                type="button"
                onClick={() => setShowManualModal(false)}
                className="text-slate-500 hover:text-white p-1 rounded-lg hover:bg-slate-100 transition-colors dark:text-slate-400 dark:hover:bg-white/10"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed dark:text-slate-400">
              {translate(
                'Manual reservations directly reserve pitch slots on your calendar without online deposit requirements.',
              )}
            </p>

            <form onSubmit={submitManual} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 dark:text-slate-300">
                  {translate('Select Court')}
                </label>
                <Select
                  value={manualCourtId || (courts[0]?.id ?? '')}
                  onChange={setManualCourtId}
                  options={courts.map((c) => ({
                    value: c.id,
                    label: `${c.name} (${c.sport})`,
                  }))}
                />
              </div>

              <TextField
                label={translate('Customer Name')}
                type="text"
                required
                placeholder={translate('e.g. Captain Mahmoud')}
                value={manualCustomerName}
                onChange={(e) => setManualCustomerName(e.target.value)}
              />

              <TextField
                label={translate('Customer Phone (Optional)')}
                type="tel"
                placeholder="+20 10..."
                value={manualCustomerPhone}
                onChange={(e) => setManualCustomerPhone(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1 dark:text-slate-300">
                    {translate('Kickoff Time')}
                  </label>
                  <DateTimePicker value={manualStartsAt} onChange={setManualStartsAt} />
                </div>
                <TextField
                  label={translate('Duration (Hours)')}
                  type="number"
                  min={1}
                  max={4}
                  value={manualHours}
                  onChange={(e) => setManualHours(Number(e.target.value))}
                />
              </div>

              <TextField
                label={translate('Total Price (EGP)')}
                type="number"
                min={0}
                step={50}
                value={manualPriceEgp}
                onChange={(e) => setManualPriceEgp(Number(e.target.value))}
              />

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  className="button px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-100 text-slate-700 transition-all cursor-pointer dark:bg-white/10 dark:hover:bg-white/15 dark:text-slate-200"
                  onClick={() => setShowManualModal(false)}
                >
                  {translate('Cancel')}
                </button>
                <button
                  type="submit"
                  className="button px-4 py-2 rounded-xl text-xs font-extrabold bg-lime-400 hover:bg-lime-300 text-slate-950 shadow-lg shadow-lime-400/25 transition-all cursor-pointer"
                >
                  {translate('Confirm Walk-In Booking')}
                </button>
              </div>
            </form>
          </div>
        </Dialog>
      )}
    </>
  );
}
