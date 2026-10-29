import {
  AppSheet,
  Copy,
  Action,
  useMobileDesign,
} from '../../../../components/common/MobileDesign';
import { useOwnerBookingAction } from '../hooks/useOwnerBookingAction';
export function OwnerBookingActionSheet({
  id,
  action,
  onClose,
  onChanged,
}: {
  id: string;
  action: 'ownerCancel' | 'noShow' | null;
  onClose: () => void;
  onChanged?: () => void;
}) {
  const state = useOwnerBookingAction(id, action, onChanged);
  const { t } = useMobileDesign();
  if (!action) return null;
  return (
    <AppSheet title={t(action)} onClose={onClose}>
      <Copy>{t(state.done ? 'sent' : 'confirmNote')}</Copy>
      {state.error && <Copy>{state.error}</Copy>}
      <Action
        label={t(state.done ? 'close' : state.saving ? 'loading' : 'confirmAction')}
        disabled={state.saving}
        onPress={() => (state.done ? onClose() : void state.submit())}
      />
    </AppSheet>
  );
}
