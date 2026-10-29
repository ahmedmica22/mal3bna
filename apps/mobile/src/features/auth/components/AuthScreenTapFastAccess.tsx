import { Text, View, TouchableOpacity } from 'react-native';
import { Theme } from '../../../constants/theme';
import type { AuthScreenContentProps } from '../types';
export function AuthScreenTapFastAccess({
  isSignUp,
  setEmailInput,
  setErrorMessage,
  setPassInput,
  styles,
}: Pick<
  AuthScreenContentProps,
  'isSignUp' | 'setEmailInput' | 'setErrorMessage' | 'setPassInput' | 'styles'
>) {
  return (
    <>
      {!isSignUp && (
        <View style={styles.demoBox}>
          <View style={styles.demoHeader}>
            <Text style={{ color: Theme.colors.lime, fontSize: 14 }}>⚡</Text>
            <Text style={styles.demoTitle}>FAST LOGIN / OPTION B</Text>
          </View>
          <View style={styles.demoBtnRow}>
            <TouchableOpacity
              style={[styles.demoBtn, styles.demoBtnPlayer]}
              onPress={() => {
                setEmailInput('micaahmed666@gmail.com');
                setPassInput('Password123!');
                setErrorMessage('');
              }}
            >
              <Text style={styles.demoBtnPlayerText}>⭐ Player (micaahmed666)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.demoBtn, styles.demoBtnPlayer]}
              onPress={() => {
                setEmailInput('ahmedplayer@gmail.com');
                setPassInput('Password123!');
                setErrorMessage('');
              }}
            >
              <Text style={styles.demoBtnPlayerText}>⚽ Player (ahmedplayer)</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
}
