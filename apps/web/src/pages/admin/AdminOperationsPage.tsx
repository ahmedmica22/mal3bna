import { AdminUsersSection } from './sections/AdminUsersSection';
import { AdminDisputesSection } from './sections/AdminDisputesSection';
import { AdminPayoutsSection } from './sections/AdminPayoutsSection';
import { AdminStuckSection } from './sections/AdminStuckSection';
import type { AdminOperationsPageProps } from '../../types/ui';

export type { AdminOperationsPageProps };

export function AdminOperationsPage({ kind }: AdminOperationsPageProps) {
  switch (kind) {
    case 'users':
      return <AdminUsersSection />;
    case 'disputes':
      return <AdminDisputesSection />;
    case 'payouts':
      return <AdminPayoutsSection />;
    case 'stuck':
      return <AdminStuckSection />;
    default:
      return null;
  }
}
