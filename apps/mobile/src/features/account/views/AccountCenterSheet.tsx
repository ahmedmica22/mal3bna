import { View } from 'react-native';
import { AppSheet, Copy, Action, Shimmer, useMobileDesign } from '../../../components/common/MobileDesign';
import { useAccountCenter, type AccountCenterProps } from '../hooks/useAccountCenter';
import { InboxSection } from '../components/InboxSection';
import { TrustSection } from '../components/TrustSection';
import { AccountSection } from '../components/AccountSection';
export function AccountCenterSheet(props: AccountCenterProps) {
  const state = useAccountCenter(props);
  const { t } = useMobileDesign();
  if (!props.visible) return null;
  return (
    <AppSheet title={t('account')} onClose={props.onClose}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {(
          ['inbox', ...(props.role === 'player' ? (['trust'] as const) : []), 'account'] as const
        ).map((tab) => (
          <Action
            key={tab}
            label={t(tab)}
            secondary={state.tab !== tab}
            onPress={() => state.setTab(tab)}
          />
        ))}
      </View>
      {state.loading && (
        <View style={{ gap: 12, marginVertical: 8 }}>
          <Shimmer height={64} borderRadius={16} />
          <Shimmer height={64} borderRadius={16} />
        </View>
      )}
      {state.error !== '' && (
        <>
          <Copy>{state.error}</Copy>
          <Action label={t('retry')} onPress={() => void state.reload()} />
        </>
      )}
      {state.tab === 'inbox' && (
        <InboxSection state={state} onOpenBookings={props.onOpenBookings} />
      )}
      {state.tab === 'trust' && props.role === 'player' && <TrustSection state={state} />}
      {state.tab === 'account' && <AccountSection state={state} />}
    </AppSheet>
  );
}
