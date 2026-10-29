import { VenueCard } from '../../../discovery/VenueCard';
import { SearchBar } from '../../../discovery/SearchBar';
import { StatePanel } from '../../../../components/feedback/StatePanel';
import { ShimmerVenueCard } from '../../../../components/feedback/Shimmer';
import type { HomeContentProps } from '../types';
import { HomeActiveFilterChips } from './HomeActiveFilterChips';

export function HomeDiscoverySection({
  areaId,
  areas,
  clearFilters,
  filteredVenues,
  handleSearch,
  hasActiveFilters,
  isSearching,
  pitchSize,
  query,
  searchTerm,
  setAreaId,
  setPitchSize,
  setSearchTerm,
  setSport,
  sport,
  translate,
}: Pick<
  HomeContentProps,
  | 'areaId'
  | 'areas'
  | 'clearFilters'
  | 'filteredVenues'
  | 'handleSearch'
  | 'hasActiveFilters'
  | 'isSearching'
  | 'pitchSize'
  | 'query'
  | 'searchTerm'
  | 'setAreaId'
  | 'setPitchSize'
  | 'setSearchTerm'
  | 'setSport'
  | 'sport'
  | 'translate'
>) {
  return (
    <section className="discover mt-12" id="venues">
      <div className="section-title mb-6 flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="eyebrow text-xs font-black text-emerald-700 dark:text-lime-400 tracking-wider uppercase mb-1">
            {translate('THE PLAYGROUND')}
          </p>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 m-0">
            {translate('Courts in Cairo')}
          </h2>
        </div>
        <span className="text-xs font-semibold text-slate-600 bg-slate-100 border-slate-200 dark:text-slate-400 dark:bg-white/5 dark:border-white/10 px-3 py-1 rounded-full border">
          {translate(
            filteredVenues.length === 1
              ? '{{count}} available venue'
              : '{{count}} available venues',
            { count: filteredVenues.length },
          )}
        </span>
      </div>

      <SearchBar
        query={searchTerm}
        onQuery={setSearchTerm}
        area={areaId}
        onArea={setAreaId}
        areas={areas}
        sport={sport}
        onSport={setSport}
        size={pitchSize}
        onSize={setPitchSize}
        onSearch={handleSearch}
        isSearching={isSearching}
      />

      {/* Active Filter Chips */}
      {
        <HomeActiveFilterChips
          {...{
            areaId,
            areas,
            clearFilters,
            hasActiveFilters,
            pitchSize,
            searchTerm,
            setAreaId,
            setPitchSize,
            setSearchTerm,
            setSport,
            sport,
            translate,
          }}
        />
      }

      {query.isLoading && (
        <div className="venue-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <ShimmerVenueCard key={i} />
          ))}
        </div>
      )}

      {query.isError && (
        <StatePanel
          title={translate('We lost the ball.')}
          action={
            <button
              type="button"
              className="button px-4 py-2 rounded-full text-xs font-bold bg-lime-400 text-slate-950"
              onClick={() => void query.refetch()}
            >
              {translate('Try again')}
            </button>
          }
        >
          {translate('We could not load venues. Check your connection and try again.')}
        </StatePanel>
      )}

      {query.isSuccess && filteredVenues.length === 0 && (
        <StatePanel
          title={translate('No courts found matching criteria.')}
          action={
            <button
              type="button"
              onClick={clearFilters}
              className="button px-5 py-2.5 rounded-full text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white dark:bg-lime-400 dark:text-slate-950 mt-3 inline-block cursor-pointer shadow-md"
            >
              {translate('Clear all filters')}
            </button>
          }
        >
          {translate('Try adjusting your search query, pitch size, or sport filters.')}
        </StatePanel>
      )}

      {query.isSuccess && filteredVenues.length > 0 && (
        <div className="venue-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
          {filteredVenues.map((venue, index) => (
            <VenueCard key={venue.id} venue={venue} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}
