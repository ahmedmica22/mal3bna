import { StatePanel } from '../../components/feedback/StatePanel';
import { useAdminVenuesPage } from '../../features/admin/venues/hooks/useAdminVenuesPage';
import { AdminVenuesContent } from '../../features/admin/venues/views/AdminVenuesContent';

export function AdminVenuesPage() {
  const state = useAdminVenuesPage();
  switch (state.view) {
    case 'Loading': {
      const { translate } = state.props;
      return <StatePanel title={translate('Loading venue management queue…')} />;
    }
    case 'Error': {
      const { query, translate } = state.props;
      return (
        <StatePanel
          title={translate('Venue queue unavailable.')}
          action={
            <button
              className="button px-4 py-2 rounded-xl text-xs font-bold bg-lime-400 text-slate-950"
              onClick={() => void query.refetch()}
            >
              {translate('Try again')}
            </button>
          }
        />
      );
    }
    case 'Content':
      return <AdminVenuesContent {...state.props} />;
  }
}
