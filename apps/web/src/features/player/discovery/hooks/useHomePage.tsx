import { useLanguage } from '../../../../store/LanguageStore';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { venueApi } from '../../../../services/api';

export function useHomePage() {
  const { translate } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [sport, setSport] = useState('');
  const [pitchSize, setPitchSize] = useState('');
  const [areaId, setAreaId] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const areasQuery = useQuery({
    queryKey: ['areas'],
    queryFn: () => venueApi.areas(),
  });
  const areas = areasQuery.data ?? [];

  const query = useQuery({
    queryKey: ['venues', sport, pitchSize, areaId, searchTerm],
    queryFn: () => {
      const params = new URLSearchParams();
      if (sport) params.set('sport', sport);
      if (pitchSize) params.set('size', pitchSize);
      if (areaId) params.set('areaId', areaId);
      if (searchTerm.trim()) params.set('search', searchTerm.trim());
      const q = params.toString();
      return venueApi.list(q ? `?${q}` : '');
    },
  });

  const allVenues = query.data ?? [];
  const filteredVenues = allVenues.filter((v) => {
    if (areaId && v.areaId !== areaId && v.area?.id !== areaId) return false;
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      v.name.toLowerCase().includes(term) ||
      (v.address && v.address.toLowerCase().includes(term)) ||
      (v.description && v.description.toLowerCase().includes(term)) ||
      (v.area &&
        (v.area.nameEn.toLowerCase().includes(term) ||
          v.area.nameAr.toLowerCase().includes(term)))
    );
  });

  async function handleSearch() {
    setIsSearching(true);
    const el = document.getElementById('venues');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    try {
      await query.refetch();
    } finally {
      setTimeout(() => setIsSearching(false), 300);
    }
  }

  const hasActiveFilters = Boolean(searchTerm || sport || pitchSize || areaId);
  const clearFilters = () => {
    setSearchTerm('');
    setSport('');
    setPitchSize('');
    setAreaId('');
  };

  return {
    view: 'Content',
    props: {
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
    },
  } as const;
}
