import { StatePanel } from '../../components/feedback/StatePanel';
import { useOwnerMoneyPage } from '../../features/owner/money/hooks/useOwnerMoneyPage';
import { OwnerMoneyContent } from '../../features/owner/money/views/OwnerMoneyContent';

export function OwnerMoneyPage() {
  const state = useOwnerMoneyPage();
  switch (state.view) {
    case 'Loading': {
      const { translate } = state.props;
      return <StatePanel title={translate('Loading financial ledger…')} />;
    }
    case 'Error': {
      const { translate } = state.props;
      return <StatePanel title={translate('Financial overview unavailable.')} />;
    }
    case 'Content':
      return <OwnerMoneyContent {...state.props} />;
  }
}
