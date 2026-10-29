import { useLanguage } from '../../../../store/LanguageStore';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../../../services/api';

export function useAdminStuckSection() {
  const { translate } = useLanguage();
  const query = useQuery({
    queryKey: ['admin-stuck'],
    queryFn: () => adminApi.stuckItems(),
  });

  if (query.isLoading) return { view: 'Loading', props: { translate } } as const;

  const stuck = query.data ?? [];

  return { view: 'Content', props: { stuck, translate } } as const;
}
