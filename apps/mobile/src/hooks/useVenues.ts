import { useState, useEffect, useCallback, useRef } from 'react';
import { Venue, SportType, Area } from '../types/domain';
import { venueService } from '../services/venue.service';
import { ApiError } from '../services/api';
import type { CopyKey } from '../constants/interface-copy';

export function useVenues() {
  const [sportFilter, setSportFilter] = useState<'all' | SportType>('all');
  const [areaFilter, setAreaFilter] = useState<'all' | string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [venues, setVenues] = useState<Venue[]>(() => venueService.cachedVenues() ?? []);
  const [areas, setAreas] = useState<Area[]>([]);
  const [error, setError] = useState<false | CopyKey>(false);
  const [loading, setLoading] = useState(() => !venueService.cachedVenues());
  const generation = useRef(0);

  useEffect(() => {
    let active = true;
    void venueService
      .getAreas()
      .then((list) => {
        if (active) setAreas(list);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const loadVenues = useCallback(
    async (force = false) => {
      const current = ++generation.current;
      const cached = venueService.cachedVenues(sportFilter, areaFilter);
      setVenues(cached ?? []);
      setLoading(!cached);
      setError(false);
      try {
        const data = await venueService.getVenues(sportFilter, areaFilter, '', force);
        if (current === generation.current) setVenues(data);
      } catch (cause) {
        if (__DEV__) {
          // Never log headers, credentials, response bodies or account details.
          console.warn('[Explore] Public venue request failed', {
            name: cause instanceof Error ? cause.name : 'UnknownError',
            message: cause instanceof Error ? cause.message.slice(0, 240) : 'Unknown error',
            code: cause instanceof ApiError ? cause.code : undefined,
            status: cause instanceof ApiError ? cause.status : undefined,
          });
        }
        if (current === generation.current) {
          setError(
            cause instanceof ApiError
              ? cause.code === 'REQUEST_TIMEOUT'
                ? 'discoveryTimeout'
                : cause.code === 'INVALID_RESPONSE'
                  ? 'discoveryInvalidResponse'
                  : cause.status >= 500
                    ? 'discoveryUnavailable'
                    : 'checkConnection'
              : 'checkConnection',
          );
        }
      } finally {
        if (current === generation.current) setLoading(false);
      }
    },
    [sportFilter, areaFilter],
  );

  useEffect(() => {
    void loadVenues();
    return () => {
      generation.current += 1;
    };
  }, [loadVenues]);

  return {
    sportFilter,
    setSportFilter,
    areaFilter,
    setAreaFilter,
    searchQuery,
    setSearchQuery,
    areas,
    venues,
    error,
    loading,
    refreshVenues: () => loadVenues(true),
  };
}
