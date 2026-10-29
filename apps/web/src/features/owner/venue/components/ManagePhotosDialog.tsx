import { Dialog } from '../../../../components/ui/Dialog';
import { X, Upload } from 'lucide-react';
import type { OwnerVenueContentProps } from '../types';

export function ManagePhotosDialog({
  editPhotosList,
  handleFilesUpload,
  handleSavePhotos,
  isSubmittingPhotos,
  removeEditPhoto,
  setShowManagePhotosModal,
  showManagePhotosModal,
  translate,
}: Pick<
  OwnerVenueContentProps,
  | 'editPhotosList'
  | 'handleFilesUpload'
  | 'handleSavePhotos'
  | 'isSubmittingPhotos'
  | 'removeEditPhoto'
  | 'setShowManagePhotosModal'
  | 'showManagePhotosModal'
  | 'translate'
>) {
  return (
    <>
      {showManagePhotosModal && (
        <Dialog
          label={translate('Manage Photos (Min 2, Max 6)')}
          onClose={() => setShowManagePhotosModal(false)}
        >
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative dark:bg-[#13221f] dark:border-white/15">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4 dark:border-white/10">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                  {translate('Venue Photos (Min 2, Max 6)')}
                </h3>
                <p className="text-xs text-emerald-700 mt-0.5 dark:text-lime-400">
                  {translate('Currently')} {editPhotosList.length}{' '}
                  {translate('of 6 photos selected')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowManagePhotosModal(false)}
                className="text-slate-500 hover:text-slate-900 cursor-pointer dark:text-slate-400 dark:hover:text-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={(e) => void handleSavePhotos(e)} className="space-y-4 text-xs">
              {/* Direct Device File Upload */}
              {editPhotosList.length < 6 && (
                <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-lime-400/40 hover:border-lime-400 rounded-2xl bg-lime-400/5 hover:bg-lime-400/10 cursor-pointer transition-all">
                  <Upload size={22} className="text-emerald-700 mb-1 dark:text-lime-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {translate('Upload photos directly from your computer / phone')}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {translate('JPG, PNG, WEBP (Min 2, Max 6 photos)')}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => void handleFilesUpload(e.target.files, 'manage')}
                  />
                </label>
              )}

              {/* Photo Previews */}
              {editPhotosList.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {editPhotosList.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-white/15"
                    >
                      <img
                        src={url}
                        alt={translate('Photo {{value0}}', { value0: idx + 1 })}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/80 text-white">
                        {translate('Photo')} {idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeEditPhoto(idx)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-bold hover:bg-rose-600 transition-colors cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic dark:text-slate-400">
                  {translate('No venue photos uploaded yet. Please select at least 2 photos.')}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setShowManagePhotosModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer dark:text-slate-400 dark:hover:text-slate-100"
                >
                  {translate('Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPhotos}
                  className="px-5 py-2 rounded-xl text-xs font-black bg-lime-400 hover:bg-lime-300 text-slate-950 shadow-md shadow-lime-400/20 cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingPhotos
                    ? translate('Saving Photos…')
                    : translate('Save {{value0}} Photos', { value0: editPhotosList.length })}
                </button>
              </div>
            </form>
          </div>
        </Dialog>
      )}
    </>
  );
}
