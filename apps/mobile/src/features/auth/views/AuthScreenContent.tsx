import { View, KeyboardAvoidingView, Platform, Text } from 'react-native';
import {
  Screen,
  Panel,
  Title,
  Copy,
  Field,
  Action,
  useMobileDesign,
} from '../../../components/common/MobileDesign';
import { BrandIcon } from '../../../components/common/BrandIcon';
import type { AuthScreenContentProps } from '../types';
export function AuthScreenContent(p: AuthScreenContentProps) {
  const { t, lang } = useMobileDesign();
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
            gap: 20,
            paddingVertical: 16,
          }}
        >
          {/* Brand Header */}
          <View style={{ alignItems: 'center', gap: 8, marginVertical: 8 }}>
            <BrandIcon size={72} />
            <Text
              style={{
                fontSize: 22,
                fontWeight: '900',
                color: '#bef264',
                letterSpacing: 1,
              }}
            >
              ملعبنا • MAL3BNA
            </Text>
          </View>

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
            {p.onBrowseGuest && (
              <Action
                label={lang === 'ar' ? 'تصفح الملاعب كزائر ⚡' : 'Explore Venues as Guest ⚡'}
                secondary
                onPress={p.onBrowseGuest}
              />
            )}
          </Panel>
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}
