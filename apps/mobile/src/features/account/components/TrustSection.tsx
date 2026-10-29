import {
  Panel,
  Title,
  Copy,
  Field,
  Action,
  useMobileDesign,
} from '../../../components/common/MobileDesign';
import type { AccountCenterState } from '../hooks/useAccountCenter';
export function TrustSection({ state }: { state: AccountCenterState }) {
  const { t } = useMobileDesign();
  return (
    <>
      <Title small>{t('strikes')}</Title>
      {!state.data?.strikes.length && <Copy>{t('noItems')}</Copy>}
      {state.data?.strikes.map((item) => (
        <Panel key={item.id}>
          <Copy>#{item.reservationId.slice(0, 8)}</Copy>
          <Copy>{item.removedReason ?? item.expiresAt}</Copy>
        </Panel>
      ))}
      <Title small>{t('disputes')}</Title>
      {!state.data?.disputes.length && <Copy>{t('noItems')}</Copy>}
      {state.data?.disputes.map((item) => (
        <Panel key={item.id}>
          <Copy accent>{item.status}</Copy>
          <Copy>{item.playerMessage}</Copy>
          {item.ownerResponse && <Copy>{item.ownerResponse}</Copy>}
        </Panel>
      ))}
      <Title small>{t('appeals')}</Title>
      {!state.data?.appeals.length && <Copy>{t('noItems')}</Copy>}
      {state.data?.appeals.map((item) => (
        <Panel key={item.id}>
          <Copy accent>{item.status}</Copy>
          <Copy>{item.message}</Copy>
          {item.nextAllowedAt && <Copy>{item.nextAllowedAt}</Copy>}
        </Panel>
      ))}
      <Field
        label={t('message')}
        value={state.message}
        onChangeText={state.setMessage}
        multiline
        maxLength={2000}
      />
      <Action
        label={t('submit')}
        disabled={state.saving || !state.message.trim()}
        onPress={() => void state.appeal()}
      />
    </>
  );
}
