import { Link } from 'react-router-dom';
import { StatePanel } from '../../../../components/feedback/StatePanel';
import type { CheckoutExpiredProps } from '../types';
export function CheckoutExpired(props: CheckoutExpiredProps) {
  const { translate, venueId } = props;
  return (
    <main className="page checkout max-w-xl mx-auto px-4 py-16 text-center">
      <StatePanel
        title={translate('Slot hold expired.')}
        action={
          <Link
            className="button px-6 py-2.5 rounded-full text-xs font-bold bg-lime-400 text-slate-950 inline-block mt-3"
            to={venueId ? `/venues/${venueId}` : '/'}
          >
            {translate('Return to court availability')}
          </Link>
        }
      >
        {translate(
          'Your 10-minute hold window for this slot expired to free availability for other players. Please choose your slot again.',
        )}
      </StatePanel>
    </main>
  );
}
