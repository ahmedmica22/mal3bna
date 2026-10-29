import { useLanguage } from '../../../../store/LanguageStore';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useState, useMemo, useEffect, type SetStateAction } from 'react';
import { adminApi } from '../../../../services/api';

const statusTone: Record<string, { badge: string; dot: string }> = {
  confirmed: {
    badge: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    dot: 'bg-emerald-400',
  },
  held: {
    badge: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    dot: 'bg-amber-400',
  },
  arrived: {
    badge: 'bg-sky-500/15 text-sky-400 border border-sky-500/30',
    dot: 'bg-sky-400',
  },
  completed: {
    badge: 'bg-slate-500/15 text-slate-300 border border-slate-500/30',
    dot: 'bg-slate-400',
  },
  cancelled: {
    badge: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
    dot: 'bg-rose-400',
  },
  expired: {
    badge: 'bg-slate-500/15 text-slate-400 border border-slate-500/30',
    dot: 'bg-slate-500',
  },
  no_show: {
    badge: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
    dot: 'bg-rose-400',
  },
  no_show_pending: {
    badge: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
    dot: 'bg-orange-400',
  },
};
const PAGE_SIZE = 7;
export function useAdminBookingsPage() {
  const { translate, locale } = useLanguage();
  const cairoDateTime = new Intl.DateTimeFormat(locale, {
    timeZone: 'Africa/Cairo',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [{ page, search: debouncedSearch, status: statusFilter }, setFilters] = useState({
    page: 1,
    search: '',
    status: 'all',
  });
  const normalizedSearch = searchTerm.trim();

  // Debounce search input so user typing is butter-smooth
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((current) =>
        current.search === normalizedSearch
          ? current
          : { ...current, search: normalizedSearch, page: 1 },
      );
    }, 350);
    return () => clearTimeout(timer);
  }, [normalizedSearch]);

  const handleStatusFilter = (id: string) => {
    setFilters({ status: id, search: normalizedSearch, page: 1 });
  };

  const setPage = (update: SetStateAction<number>) => {
    setFilters((current) => ({
      ...current,
      page: Math.max(1, typeof update === 'function' ? update(current.page) : update),
    }));
  };

  const bookings = useQuery({
    queryKey: ['admin-bookings', page, PAGE_SIZE, statusFilter, debouncedSearch],
    queryFn: () => adminApi.bookings(page, PAGE_SIZE, statusFilter, debouncedSearch),
    placeholderData: keepPreviousData,
    refetchInterval: 10000,
    refetchOnWindowFocus: false,
  });

  const result = bookings.data;
  const isUpdating = bookings.isFetching || normalizedSearch !== debouncedSearch;
  const hasFilters = Boolean(normalizedSearch) || statusFilter !== 'all';

  // The API searches the complete inventory before pagination. Filtering this
  // page again would hide valid matches and disagree with the server's totals.
  const filteredItems = result?.items ?? [];

  useEffect(() => {
    if (result && !bookings.isPlaceholderData && page > Math.max(1, result.totalPages)) {
      setFilters((current) => ({ ...current, page: Math.max(1, result.totalPages) }));
    }
  }, [result, bookings.isPlaceholderData, page]);

  // Aggregate statistics across ALL data
  const stats = useMemo(() => {
    if (result?.stats) {
      return {
        confirmed: result.stats.confirmed,
        held: result.stats.held,
        totalEgp: (result.stats.totalPiastres / 100).toFixed(2),
      };
    }
    if (!result?.items) return { confirmed: 0, held: 0, totalEgp: '0.00' };
    const confirmed = result.items.filter((b) => b.status === 'confirmed').length;
    const held = result.items.filter((b) => b.status === 'held').length;
    const totalPiastres = result.items.reduce((acc, b) => acc + (b.totalPiastres ?? 0), 0);
    return {
      confirmed,
      held,
      totalEgp: (totalPiastres / 100).toFixed(2),
    };
  }, [result?.stats, result?.items]);

  if (bookings.isLoading && !result) return { view: 'Loading', props: { translate } } as const;
  if (bookings.isError || !result) {
    return { view: 'Error', props: { bookings, translate } } as const;
  }

  return {
    view: 'Content',
    props: {
      bookings,
      cairoDateTime,
      filteredItems,
      handleStatusFilter,
      hasFilters,
      isUpdating,
      page,
      result,
      searchTerm,
      setPage,
      setSearchTerm,
      stats,
      statusFilter,
      statusTone,
      translate,
    },
  } as const;
}
