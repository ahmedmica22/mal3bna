import { MapPin, Globe, Calendar } from 'lucide-react';
import type { CheckoutContentProps } from '../types';
import { CheckoutPaymentOptions } from './CheckoutPaymentOptions';

export function CheckoutMatchDetails({
  courtName,
  depositPiastres,
  hours,
  isWithin24Hours,
  locale,
  paymentOption,
  setPaymentOption,
  startsAt,
  totalPiastres,
  translate,
  venueName,
}: Pick<
  CheckoutContentProps,
  | 'courtName'
  | 'depositPiastres'
  | 'hours'
  | 'isWithin24Hours'
  | 'locale'
  | 'paymentOption'
  | 'setPaymentOption'
  | 'startsAt'
  | 'totalPiastres'
  | 'translate'
  | 'venueName'
>) {
  return (
    <div className="lg:col-span-7 space-y-6">
      {/* Match Details Card */}
      <div className="rounded-2xl border border-white/10 bg-[#13221f] p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-white m-0">{translate('Match Details')}</h2>
          <span className="px-3 py-1 rounded-full text-xs font-bold text-lime-400 bg-lime-400/10 border border-lime-400/20">
            {hours} {hours > 1 ? translate('Hours') : translate('Hour')}
          </span>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-center gap-3">
            <MapPin size={16} className="text-slate-400 shrink-0" />
            <div>
              <span className="block text-slate-400 text-[11px]">{translate('Venue')}</span>
              <strong className="text-sm font-bold text-white">{venueName}</strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Globe size={16} className="text-slate-400 shrink-0" />
            <div>
              <span className="block text-slate-400 text-[11px]">{translate('Court')}</span>
              <strong className="text-sm font-bold text-white">{courtName}</strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar size={16} className="text-slate-400 shrink-0" />
            <div>
              <span className="block text-slate-400 text-[11px]">{translate('Kickoff')}</span>
              <strong className="text-sm font-bold text-white">
                {startsAt
                  ? new Date(startsAt).toLocaleString(locale, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                      timeZone: 'Africa/Cairo',
                    })
                  : translate('Selected time')}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* SELECT PAYMENT METHOD */}
      <CheckoutPaymentOptions
        {...{
          depositPiastres,
          isWithin24Hours,
          paymentOption,
          setPaymentOption,
          totalPiastres,
          translate,
        }}
      />
    </div>
  );
}
