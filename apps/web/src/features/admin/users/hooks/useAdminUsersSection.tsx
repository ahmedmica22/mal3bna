import { useLanguage } from '../../../../store/LanguageStore';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../../../services/api';
import { useToast } from '../../../../components/feedback/ToastContext';

export function useAdminUsersSection() {
  const { translate } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const query = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminApi.users(),
  });

  async function handleUserStatus(userId: string, status: 'active' | 'blocked' | 'suspended') {
    setActionLoadingId(userId);
    try {
      await adminApi.setUserStatus(userId, status);
      await queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success(
        translate('User status updated to {{value0}}.', { value0: translate(status) }),
        translate('User Status'),
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Status update failed',
        translate('Status Error'),
      );
    } finally {
      setActionLoadingId(null);
    }
  }

  if (query.isLoading) return { view: 'Loading', props: { translate } } as const;
  const allUsers = query.data ?? [];

  const q = searchQuery.trim().toLowerCase();
  const filteredUsers = allUsers.filter((u) => {
    if (!q) return true;
    const matchesName = (u.name ?? '').toLowerCase().includes(q);
    const matchesId = (u.id ?? '').toLowerCase().includes(q);
    const matchesEmail = (u.email ?? '').toLowerCase().includes(q);
    return matchesName || matchesId || matchesEmail;
  });

  return {
    view: 'Content',
    props: {
      actionLoadingId,
      handleUserStatus,
      translate,
      users: filteredUsers,
      totalCount: allUsers.length,
      searchQuery,
      setSearchQuery,
    },
  } as const;
}
