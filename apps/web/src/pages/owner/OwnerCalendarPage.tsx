import { StatePanel } from '../../components/feedback/StatePanel';
import { useOwnerCalendarPage } from '../../features/owner/calendar/hooks/useOwnerCalendarPage';
import { OwnerCalendarContent } from '../../features/owner/calendar/views/OwnerCalendarContent';

export function OwnerCalendarPage() {
  const state = useOwnerCalendarPage();
  switch (state.view) {
    case 'Loading': {
      const { translate } = state.props;
      return <StatePanel title={translate('Loading schedule…')} />;
    }
    case 'Error': {
      const { bookingsQuery, translate } = state.props;
      return (
        <StatePanel
          title={translate('Schedule unavailable.')}
          action={
            <button
              className="button px-4 py-2 rounded-xl text-xs font-bold bg-lime-400 text-slate-950"
              onClick={() => void bookingsQuery.refetch()}
            >
              {translate('Try again')}
            </button>
          }
        />
      );
    }
    case 'Content':
      return <OwnerCalendarContent {...state.props} />;
  }
}
