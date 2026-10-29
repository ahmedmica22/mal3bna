import {
  Panel,
  Title,
  Copy,
  Field,
  Action,
  useMobileDesign,
} from '../../../components/common/MobileDesign';
import type { AccountCenterState } from '../hooks/useAccountCenter';
export function AccountSection({ state }: { state: AccountCenterState }) {
  const { t } = useMobileDesign();
  return (
    <>
      <Panel>
        <Title small>{t('account')}</Title>
        <Field
          label={t('name')}
          value={state.name}
          onChangeText={state.setName}
          autoComplete="name"
        />
        <Field
          label={t('phone')}
          value={state.phone}
          onChangeText={state.setPhone}
          keyboardType="phone-pad"
        />
        <Action
          label={t('submit')}
          disabled={state.saving || !state.name.trim()}
          onPress={() => void state.saveAccount()}
        />
      </Panel>
      <Panel>
        <Title small>{t('passwordChange')}</Title>
        <Field
          label={t('currentPassword')}
          value={state.currentPassword}
          onChangeText={state.setCurrentPassword}
          secureTextEntry
        />
        <Field
          label={t('newPassword')}
          value={state.password}
          onChangeText={state.setPassword}
          secureTextEntry
        />
        <Action
          label={t('passwordChange')}
          disabled={state.saving || !state.currentPassword || state.password.length < 8}
          onPress={() => void state.changePassword()}
        />
      </Panel>
      <Panel>
        <Title small>{t('danger')}</Title>
        <Copy>{t('deleteNote')}</Copy>
        <Field
          label="DELETE"
          autoCapitalize="characters"
          value={state.deleteText}
          onChangeText={state.setDeleteText}
        />
        <Action
          secondary
          label={t('deleteConfirm')}
          disabled={state.saving || state.deleteText !== 'DELETE'}
          onPress={() => void state.deleteAccount()}
        />
      </Panel>
    </>
  );
}
