import { Search, Filter, X, Loader2 } from 'lucide-react';
import type { AdminBookingsContentProps } from '../types';

export function AdminBookingsInteractiveFilterSearchBarFullyResponsive({
  isUpdating,
  handleStatusFilter,
  searchTerm,
  setSearchTerm,
  statusFilter,
  translate,
}: Pick<
  AdminBookingsContentProps,
  'isUpdating' | 'handleStatusFilter' | 'searchTerm' | 'setSearchTerm' | 'statusFilter' | 'translate'
>) {
  return (
    <div className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-[#13221f] border border-white/10 shadow-xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
      {/* Search Input with Clear Button */}
      <div className="relative flex-1 max-w-full lg:max-w-md">
        <Search
          size={15}
          className="absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
        <input
          type="search"
          aria-label={translate('Search by code, venue, or player…')}
          placeholder={translate('Search by code, venue, or player…')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full ps-9 pe-14 py-2.5 rounded-xl sm:rounded-2xl bg-black/40 border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-lime-400 transition-colors"
        />
        <div className="absolute end-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {isUpdating && <Loader2 size={13} className="animate-spin text-lime-400" />}
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              aria-label={translate('Clear')}
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Status Filter Tabs - Scrollable on mobile, flex row on desktop */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 w-full lg:w-auto">
        <Filter size={13} className="text-slate-400 shrink-0 me-1 hidden sm:block" />
        {[
          { id: 'all', label: translate('All') },
          { id: 'confirmed', label: translate('Confirmed Only') },
          { id: 'held', label: translate('Held') },
          { id: 'arrived', label: translate('Arrived') },
          { id: 'completed', label: translate('Completed') },
          { id: 'cancelled', label: translate('Cancelled') },
          { id: 'expired', label: translate('Expired') },
          { id: 'no_show_pending', label: translate('No-show pending') },
          { id: 'no_show', label: translate('No-show') },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleStatusFilter(tab.id)}
            aria-pressed={statusFilter === tab.id}
            className={`px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              statusFilter === tab.id
                ? 'bg-lime-400 text-slate-950 font-black shadow-md shadow-lime-400/20'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
