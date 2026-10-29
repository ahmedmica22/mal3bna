import { MapPin, Phone, Percent, Clock, Edit3 } from 'lucide-react';
import type { OwnerVenueContentProps } from '../types';

export function VenueOverviewSection({
  setEditAddress,
  setEditDescription,
  setEditMaxHours,
  setEditName,
  setEditPhone,
  setShowEditVenueModal,
  translate,
  venue,
}: Pick<
  OwnerVenueContentProps,
  | 'setEditAddress'
  | 'setEditDescription'
  | 'setEditMaxHours'
  | 'setEditName'
  | 'setEditPhone'
  | 'setShowEditVenueModal'
  | 'translate'
  | 'venue'
>) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl backdrop-blur-md space-y-4 dark:bg-[#13221f]/80 dark:border-white/10">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">
          {translate('Venue Overview')}
        </h2>
        <button
          type="button"
          onClick={() => {
            setEditName(venue.name ?? '');
            setEditPhone(venue.phone ?? '');
            setEditAddress(venue.address ?? '');
            setEditDescription(venue.description ?? '');
            setEditMaxHours(venue.maxHoursPerBooking ?? 4);
            setShowEditVenueModal(true);
          }}
          className="px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-sm dark:bg-white/10 dark:hover:bg-white/20 dark:text-slate-200 dark:border-white/15"
        >
          <Edit3 size={13} className="text-emerald-700 dark:text-lime-400" />
          <span>{translate('Edit Venue Details')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/10">
          <span className="text-slate-500 block mb-1 flex items-center gap-1.5 dark:text-slate-400">
            <MapPin size={13} className="text-emerald-700 dark:text-lime-400" />
            {translate('Address')}
          </span>
          <strong className="text-slate-700 text-sm dark:text-slate-200">
            {venue.address ?? translate('Cairo, Egypt')}
          </strong>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/10">
          <span className="text-slate-500 block mb-1 flex items-center gap-1.5 dark:text-slate-400">
            <Phone size={13} className="text-emerald-700 dark:text-lime-400" />
            {translate('Contact Phone')}
          </span>
          <strong className="text-slate-700 text-sm dark:text-slate-200">
            {venue.phone ?? '+201000000000'}
          </strong>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/10">
          <span className="text-slate-500 block mb-1 flex items-center gap-1.5 dark:text-slate-400">
            <Percent size={13} className="text-emerald-700 dark:text-lime-400" />
            {translate('Commission Rate')}
          </span>
          <strong className="text-slate-700 text-sm dark:text-slate-200">
            {((venue.commissionBp ?? 1000) / 100).toFixed(1)}
            {translate('% Platform Fee')}
          </strong>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/10">
          <span className="text-slate-500 block mb-1 flex items-center gap-1.5 dark:text-slate-400">
            <Clock size={13} className="text-emerald-700 dark:text-lime-400" />
            {translate('Max Consecutive')}
          </span>
          <strong className="text-slate-700 text-sm dark:text-slate-200">
            {venue.maxHoursPerBooking ?? 4} {translate('Hours per Match')}
          </strong>
        </div>
      </div>

      {venue.description && (
        <p className="text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200 dark:text-slate-300 dark:bg-white/5 dark:border-white/10">
          {venue.description}
        </p>
      )}
    </div>
  );
}
