import { OwnerBookingRow } from '../components/OwnerBookingRow';
import { StatePanel } from '../../../../components/feedback/StatePanel';
import { Plus, ShieldAlert, QrCode } from 'lucide-react';
import type { OwnerBookingsContentProps } from '../types';
import { OwnerBookingsManualBookingModal } from '../components/OwnerBookingsManualBookingModal';
import { OwnerBookingsBlockCourtModal } from '../components/OwnerBookingsBlockCourtModal';

export function OwnerBookingsContent({
  actionLoadingId,
  blockCourtId,
  blockHours,
  blockReason,
  blockStartsAt,
  bookings,
  courts,
  handleArrive,
  handleCancel,
  handleCollect,
  handleComplete,
  handleNoShow,
  handleQuickCheckIn,
  locale,
  manualCourtId,
  manualCustomerName,
  manualCustomerPhone,
  manualHours,
  manualPriceEgp,
  manualStartsAt,
  quickCode,
  setBlockCourtId,
  setBlockHours,
  setBlockReason,
  setBlockStartsAt,
  setManualCourtId,
  setManualCustomerName,
  setManualCustomerPhone,
  setManualHours,
  setManualPriceEgp,
  setManualStartsAt,
  setQuickCode,
  setShowBlockModal,
  setShowManualModal,
  showBlockModal,
  showManualModal,
  submitBlock,
  submitManual,
  translate,
}: OwnerBookingsContentProps) {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="eyebrow text-xs font-black text-emerald-700 uppercase tracking-wider mb-1 dark:text-lime-400">
            {translate('OWNER SPACE • MATCH DAY OPERATIONS')}
          </p>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight dark:text-slate-100">
            {translate('Match Day Bookings')}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="button px-4 py-2.5 rounded-full text-xs font-extrabold bg-lime-400 hover:bg-lime-300 text-slate-950 shadow-md shadow-lime-400/20 transition-all cursor-pointer inline-flex items-center gap-1.5"
            onClick={() => {
              if (courts.length > 0) setManualCourtId(courts[0]!.id);
              setShowManualModal(true);
            }}
          >
            <Plus size={15} />
            <span>{translate('+ Add Walk-In Booking')}</span>
          </button>
          <button
            type="button"
            className="button px-4 py-2.5 rounded-full text-xs font-extrabold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 transition-all cursor-pointer inline-flex items-center gap-1.5"
            onClick={() => {
              if (courts.length > 0) setBlockCourtId(courts[0]!.id);
              setShowBlockModal(true);
            }}
          >
            <ShieldAlert size={15} />
            <span>{translate('+ Block Court')}</span>
          </button>
        </div>
      </div>

      {/* Quick QR Check-In / Code Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white/95 dark:bg-[#13221f]/90 p-3 sm:p-4 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-2 text-emerald-700 dark:text-lime-400 shrink-0 px-1">
          <QrCode size={22} />
          <span className="text-xs font-black uppercase tracking-wider hidden md:inline">
            {translate('Quick Check-In')}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={quickCode}
            onChange={(e) => setQuickCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void handleQuickCheckIn();
            }}
            placeholder={translate('Scan QR code or paste booking code (#XXXXXXXX) / payload to mark player arrived...')}
            className="w-full bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-400"
          />
        </div>
        <button
          type="button"
          onClick={() => void handleQuickCheckIn()}
          disabled={!quickCode.trim() || Boolean(actionLoadingId)}
          className="px-5 py-2.5 rounded-2xl text-xs font-black bg-lime-400 hover:bg-lime-300 text-slate-950 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-lime-400/20 shrink-0"
        >
          {translate('✓ Mark Arrived')}
        </button>
      </div>

      {bookings.length === 0 ? (
        <StatePanel title={translate('No bookings registered yet.')}>
          {translate(
            'Upcoming bookings and walk-in reservations will appear here with live match-day check-in controls.',
          )}
        </StatePanel>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 shadow-2xl backdrop-blur-md overflow-x-auto dark:border-white/10 dark:bg-[#0b1715]/90">
          <table className="w-full border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 text-start text-xs font-black text-emerald-700 uppercase tracking-wider dark:border-white/10 dark:text-lime-400">
                <th className="p-4">{translate('Booking & Code')}</th>
                <th className="p-4">{translate('Pitch & Customer')}</th>
                <th className="p-4">{translate('Kickoff Time')}</th>
                <th className="p-4">{translate('Status')}</th>
                <th className="p-4">{translate('Due At Court')}</th>
                <th className="p-4 text-end">{translate('Match Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {bookings.map((booking) => (
                <OwnerBookingRow
                  key={booking.id}
                  booking={booking}
                  {...{
                    actionLoadingId,
                    handleArrive,
                    handleCancel,
                    handleCollect,
                    handleComplete,
                    handleNoShow,
                    locale,
                    translate,
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Manual Booking Modal */}
      {
        <OwnerBookingsManualBookingModal
          {...{
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
          }}
        />
      }

      {/* Block Court Modal */}
      {
        <OwnerBookingsBlockCourtModal
          {...{
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
          }}
        />
      }
    </div>
  );
}
