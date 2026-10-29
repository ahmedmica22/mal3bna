import { View, Switch } from 'react-native';
import {
  Panel,
  Title,
  Copy,
  Action,
  useMobileDesign,
} from '../../../components/common/MobileDesign';
import type { AccountCenterState } from '../hooks/useAccountCenter';
export function InboxSection({
  state,
  onOpenBookings,
}: {
  state: AccountCenterState;
  onOpenBookings: () => void;
}) {
  const { t } = useMobileDesign();
  return (
    <>
      <Title small>{t('inbox')}</Title>
      {!state.data?.inbox.length && <Copy>{t('noItems')}</Copy>}
      {state.data?.inbox.map((item) => (
        <Panel key={item.id}>
          <Copy accent>{item.readAt ? '' : t('unread')}</Copy>
          <Title small>{item.title}</Title>
          <Copy>{item.body}</Copy>
          {!item.readAt && (
            <Action
              secondary
              label={t('markRead')}
              disabled={state.saving}
              onPress={() => void state.markRead(item.id)}
            />
          )}
          {item.link && <Action label={t('myBookings')} onPress={onOpenBookings} />}
        </Panel>
      ))}
      <Title small>{t('preferences')}</Title>
      <Action
        label={t('pushAlerts')}
        disabled={state.saving}
        onPress={() => void state.enablePush()}
      />
      {state.data?.preferences.length === 0 && <Copy>{t('noItems')}</Copy>}
      {state.data?.preferences.map((item) => (
        <Panel key={item.category}>
          <Copy>{item.category}</Copy>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Copy>{t('emailAlerts')}</Copy>
            <Switch
              accessibilityLabel={`${item.category}: ${t('emailAlerts')}`}
              value={item.emailEnabled}
              disabled={state.saving}
              onValueChange={(value) =>
                void state.preference(item.category, value, item.pushEnabled)
              }
            />
          </View>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Copy>{t('pushAlerts')}</Copy>
            <Switch
              accessibilityLabel={`${item.category}: ${t('pushAlerts')}`}
              value={item.pushEnabled}
              disabled={state.saving}
              onValueChange={(value) =>
                void state.preference(item.category, item.emailEnabled, value)
              }
            />
          </View>
        </Panel>
      ))}
    </>
  );
}
