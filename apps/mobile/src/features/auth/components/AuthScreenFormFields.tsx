import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Theme } from '../../../constants/theme';
import { PrimaryButton } from '../../../components/common/PrimaryButton';
import type { AuthScreenContentProps } from '../types';
export function AuthScreenFormFields({
  emailInput,
  errorMessage,
  handleSubmit,
  isLoggingIn,
  isSignUp,
  nameInput,
  passInput,
  phoneInput,
  role,
  setEmailInput,
  setErrorMessage,
  setIsSignUp,
  setNameInput,
  setPassInput,
  setPhoneInput,
  setRole,
  styles,
}: Pick<
  AuthScreenContentProps,
  | 'emailInput'
  | 'errorMessage'
  | 'handleSubmit'
  | 'isLoggingIn'
  | 'isSignUp'
  | 'nameInput'
  | 'passInput'
  | 'phoneInput'
  | 'role'
  | 'setEmailInput'
  | 'setErrorMessage'
  | 'setIsSignUp'
  | 'setNameInput'
  | 'setPassInput'
  | 'setPhoneInput'
  | 'setRole'
  | 'styles'
>) {
  return (
    <View style={styles.form}>
      {isSignUp && (
        <TextInput
          placeholder="Full Name"
          placeholderTextColor={Theme.colors.textDark}
          value={nameInput}
          onChangeText={setNameInput}
          style={styles.input}
        />
      )}

      <TextInput
        placeholder={isSignUp ? 'Email Address' : 'Email or Cairo Mobile (e.g. 01012345678)'}
        placeholderTextColor={Theme.colors.textDark}
        value={emailInput}
        onChangeText={setEmailInput}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      {isSignUp && (
        <TextInput
          placeholder="Egyptian Mobile (e.g. 01015272532) - Optional"
          placeholderTextColor={Theme.colors.textDark}
          value={phoneInput}
          onChangeText={setPhoneInput}
          keyboardType="phone-pad"
          style={styles.input}
        />
      )}

      <TextInput
        placeholder="Password (min 8 characters)"
        placeholderTextColor={Theme.colors.textDark}
        value={passInput}
        onChangeText={setPassInput}
        secureTextEntry
        style={styles.input}
      />

      {/* Error Banner */}
      {Boolean(errorMessage) && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠ {errorMessage}</Text>
        </View>
      )}

      <PrimaryButton
        title={isSignUp ? 'Create Real Account' : 'Sign In'}
        loading={isLoggingIn}
        onPress={handleSubmit}
        style={{ marginTop: 4 }}
      />

      {/* Toggle Mode */}
      <TouchableOpacity
        style={styles.modeToggle}
        onPress={() => {
          setIsSignUp(!isSignUp);
          setErrorMessage('');
        }}
      >
        <Text style={styles.modeToggleText}>
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
