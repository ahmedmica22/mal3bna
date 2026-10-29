import { TextField } from '../../../../components/forms/TextField';
import { Dialog } from '../../../../components/ui/Dialog';
import { Select } from '../../../../components/ui/Select';
import { X } from 'lucide-react';
import type { OwnerVenueContentProps } from '../types';

export function EditVenueDialog({
  editAddress,
  editDescription,
  editMaxHours,
  editName,
  editPhone,
  handleSaveEditVenue,
  isSubmittingEdit,
  setEditAddress,
  setEditDescription,
  setEditMaxHours,
  setEditName,
  setEditPhone,
  setShowEditVenueModal,
  showEditVenueModal,
  translate,
}: Pick<
  OwnerVenueContentProps,
  | 'editAddress'
  | 'editDescription'
  | 'editMaxHours'
  | 'editName'
  | 'editPhone'
  | 'handleSaveEditVenue'
  | 'isSubmittingEdit'
  | 'setEditAddress'
  | 'setEditDescription'
  | 'setEditMaxHours'
  | 'setEditName'
  | 'setEditPhone'
  | 'setShowEditVenueModal'
  | 'showEditVenueModal'
  | 'translate'
>) {
  return (
    <>
      {showEditVenueModal && (
        <Dialog
          label={translate('Edit Venue Details')}
          onClose={() => setShowEditVenueModal(false)}
        >
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative dark:bg-[#13221f] dark:border-white/15">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4 dark:border-white/10">
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                {translate('Edit Venue Details')}
              </h3>
              <button
                type="button"
                onClick={() => setShowEditVenueModal(false)}
                className="text-slate-500 hover:text-slate-900 cursor-pointer dark:text-slate-400 dark:hover:text-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={(e) => void handleSaveEditVenue(e)} className="space-y-4 text-xs">
              <TextField
                label={translate('Venue Name *')}
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />

              <TextField
                label={translate('Contact Phone *')}
                type="tel"
                required
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
              />

              <TextField
                label={translate('Full Street Address *')}
                type="text"
                required
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
              />

              <div>
                <label className="block text-slate-600 font-bold mb-1 dark:text-slate-300">
                  {translate('Description & Amenities')}
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-lime-400 focus:outline-none resize-none dark:bg-white/5 dark:border-white/10 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1 dark:text-slate-300">
                  {translate('Max Hours per Booking (Max 4)')}
                </label>
                <Select
                  value={String(editMaxHours)}
                  onChange={(val) => setEditMaxHours(Number(val))}
                  options={[
                    { value: '2', label: translate('2 Hours') },
                    { value: '3', label: translate('3 Hours') },
                    { value: '4', label: translate('4 Hours (Platform Standard)') },
                  ]}
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setShowEditVenueModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer dark:text-slate-400 dark:hover:text-slate-100"
                >
                  {translate('Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEdit}
                  className="px-5 py-2 rounded-xl text-xs font-black bg-lime-400 hover:bg-lime-300 text-slate-950 shadow-md shadow-lime-400/20 cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingEdit ? translate('Saving…') : translate('Save Venue Details')}
                </button>
              </div>
            </form>
          </div>
        </Dialog>
      )}
    </>
  );
}
