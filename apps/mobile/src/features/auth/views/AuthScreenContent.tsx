import { View, KeyboardAvoidingView, Platform } from 'react-native';
import {
  Screen,
  Panel,
  Title,
  Copy,
  Field,
  Action,
  useMobileDesign,
} from '../../../components/common/MobileDesign';
import type { AuthScreenContentProps } from '../types';
export function AuthScreenContent(p: AuthScreenContentProps) {
  const { t } = useMobileDesign();
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Screen>
        <View
          style={{
            width: '100%',
            maxWidth: 480,
            alignSelf: 'center',
            gap: 24,
            paddingVertical: 20,
          }}
        >
          <Copy accent>mal3bna / {t(p.isSignUp ? 'join' : 'signIn')}</Copy>
          <Title>{t(p.isSignUp ? 'join' : 'welcome')}</Title>
          <Copy>{t('authNote')}</Copy>
          <Panel>
            {p.isSignUp && (
              <Field
                label={t('name')}
                value={p.nameInput}
                onChangeText={p.setNameInput}
                autoComplete="name"
              />
            )}
            <Field
              label={t('email')}
              value={p.emailInput}
              onChangeText={p.setEmailInput}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            {p.isSignUp && (
              <Field
                label={t('phone')}
                value={p.phoneInput}
                onChangeText={p.setPhoneInput}
                keyboardType="phone-pad"
              />
            )}
            <Field
              label={t('password')}
              value={p.passInput}
              onChangeText={p.setPassInput}
              secureTextEntry
              autoComplete={p.isSignUp ? 'new-password' : 'current-password'}
              onSubmitEditing={() => void p.handleSubmit()}
            />
            {p.errorMessage !== '' && <Copy>{p.errorMessage}</Copy>}
            <Action
              label={t(p.isLoggingIn ? 'loading' : p.isSignUp ? 'create' : 'signIn')}
              disabled={p.isLoggingIn}
              onPress={() => void p.handleSubmit()}
            />
            <Action
              label={t(p.isSignUp ? 'haveAccount' : 'needAccount')}
              secondary
              onPress={() => {
                p.setIsSignUp(!p.isSignUp);
                p.setErrorMessage('');
              }}
            />
          </Panel>
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}
