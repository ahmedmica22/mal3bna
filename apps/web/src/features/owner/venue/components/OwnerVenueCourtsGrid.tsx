import { PhotoStrip } from '../../../../components/common/PhotoStrip';
import { photoUrls } from '../../../../utils/photos';
import { X, DollarSign } from 'lucide-react';
import type { OwnerVenueContentProps } from '../types';

export function OwnerVenueCourtsGrid({
  handleSetPricing,
  isSubmittingPricing,
  priceEgp,
  pricingCourtId,
  setPriceEgp,
  setPricingCourtId,
  translate,
  venue,
}: Pick<
  OwnerVenueContentProps,
  | 'handleSetPricing'
  | 'isSubmittingPricing'
  | 'priceEgp'
  | 'pricingCourtId'
  | 'setPriceEgp'
  | 'setPricingCourtId'
  | 'translate'
  | 'venue'
>) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {(venue.courts ?? []).map((court) => (
        <div
          key={court.id}
          className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-lime-400/30 transition-all space-y-3 dark:bg-white/5 dark:border-white/10"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
                {court.name}
              </h3>
              <span className="text-[11px] text-slate-500 capitalize dark:text-slate-400">
                {court.sport ?? translate('football')}
                {court.size ? translate(' • {{value0}}-a-side', { value0: court.size }) : ''} •{' '}
                {court.surface ?? translate('Turf')} •{' '}
                {court.isIndoor ? translate('Indoor') : translate('Outdoor')}
              </span>
            </div>
            {court.approvalStatus === 'approved' && court.isActive ? (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-lime-400/15 text-emerald-700 border border-lime-400/20 uppercase dark:text-lime-300">
                {translate('✓ Active')}
              </span>
            ) : court.approvalStatus === 'rejected' ? (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/15 text-rose-700 border border-rose-500/20 uppercase dark:text-rose-300">
                {translate('✕ Rejected')}
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-400/15 text-amber-800 border border-amber-400/20 uppercase dark:text-amber-300">
                {translate('⏳ Pending Approval')}
              </span>
            )}
          </div>

          {/* Court Photos Thumbnail Strip */}
          <PhotoStrip photos={photoUrls(court.photos)} alt={court.name} />

          {court.approvalStatus === 'pending' && (
            <p className="text-[11px] text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 leading-relaxed">
              {translate(
                '⏳ Pending Super Admin verification. This court cannot accept bookings until approved.',
              )}
            </p>
          )}

          {/* Set Pricing Inline Modal */}
          {pricingCourtId === court.id ? (
            <div className="p-3 rounded-xl bg-slate-50 border border-lime-400/30 space-y-2 text-xs dark:bg-black/40">
              <div className="flex justify-between items-center">
                <span className="font-bold text-emerald-700 dark:text-lime-400">
                  {translate('Set Hourly Rate (EGP)')}
                </span>
                <button
                  type="button"
                  className="text-slate-500 hover:text-slate-900 cursor-pointer dark:text-slate-400 dark:hover:text-slate-100"
                  onClick={() => setPricingCourtId('')}
                >
                  <X size={14} />
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={50}
                  step={50}
                  value={priceEgp}
                  onChange={(e) => setPriceEgp(Number(e.target.value))}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-lime-400 focus:outline-none dark:bg-white/5 dark:border-white/10 dark:text-slate-100"
                />
                <button
                  type="button"
                  disabled={isSubmittingPricing}
                  className="px-3 py-1.5 rounded-lg bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs cursor-pointer"
                  onClick={() => void handleSetPricing(court.id)}
                >
                  {isSubmittingPricing ? '…' : translate('Save')}
                </button>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {translate('Rule: Price changes activate after 24h per platform rules.')}
              </p>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-200 flex justify-between items-center dark:border-white/5">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold dark:text-slate-400">
                  {translate('Standard Rate')}
                </span>
                <span className="text-sm font-black text-slate-900 dark:text-slate-100">
                  {court.priceRules?.[0]?.pricePiastres
                    ? translate('{{value0}} EGP/hr', {
                        value0: (court.priceRules[0].pricePiastres / 100).toFixed(0),
                      })
                    : translate('Configured')}
                </span>
              </div>
              <button
                type="button"
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors inline-flex items-center gap-1 cursor-pointer dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-200 dark:border-white/10"
                onClick={() => {
                  setPricingCourtId(court.id);
                  setPriceEgp(
                    court.priceRules?.[0]?.pricePiastres
                      ? court.priceRules[0].pricePiastres / 100
                      : 600,
                  );
                }}
              >
                <DollarSign size={12} />
                <span>{translate('Set Rate')}</span>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
