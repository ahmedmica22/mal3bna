import { View, Text, TextInput, Platform } from 'react-native';
import type { ThemeType } from '../../../../constants/theme';

interface MobileCardFormFieldsProps {
  cardNumber: string;
  setCardNumber: (val: string) => void;
  cardValid: boolean;
  isFailureCard: boolean;
  expiry: string;
  setExpiry: (val: string) => void;
  expiryValid: boolean;
  cvv: string;
  setCvv: (val: string) => void;
  cvvValid: boolean;
  cardHolder: string;
  setCardHolder: (val: string) => void;
  holderValid: boolean;
  touched: {
    card: boolean;
    expiry: boolean;
    cvv: boolean;
    holder: boolean;
  };
  setTouched: React.Dispatch<
    React.SetStateAction<{
      card: boolean;
      expiry: boolean;
      cvv: boolean;
      holder: boolean;
    }>
  >;
  busy: boolean;
  result: 'idle' | 'success' | 'failure';
  theme: ThemeType;
  rtl: boolean;
  formatCardNumber: (raw: string) => string;
  formatExpiry: (raw: string) => string;
}

export function MobileCardFormFields({
  cardNumber,
  setCardNumber,
  cardValid,
  isFailureCard,
  expiry,
  setExpiry,
  expiryValid,
  cvv,
  setCvv,
  cvvValid,
  cardHolder,
  setCardHolder,
  holderValid,
  touched,
  setTouched,
  busy,
  result,
  theme,
  rtl,
  formatCardNumber,
  formatExpiry,
}: MobileCardFormFieldsProps) {
  const inputStyle = (valid: boolean, show: boolean) => ({
    borderWidth: 1.5,
    borderColor: show && !valid ? '#f87171' : theme.colors.inputBorder,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    backgroundColor: theme.colors.inputBg,
    color: theme.colors.textPrimary,
    fontSize: 15,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  });

  const labelStyle = {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: '700' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.8,
    marginBottom: 6,
    textAlign: rtl ? ('right' as const) : ('left' as const),
  };

  const errorStyle = {
    color: '#f87171',
    fontSize: 11,
    marginTop: 4,
  };

  return (
    <View>
      {/* Card Number */}
      <View style={{ marginBottom: 14 }}>
        <Text style={labelStyle}>Card Number</Text>
        <TextInput
          value={cardNumber}
          onChangeText={(v) => setCardNumber(formatCardNumber(v))}
          onBlur={() => setTouched((t) => ({ ...t, card: true }))}
          placeholder="4242 4242 4242 4242"
          placeholderTextColor={theme.colors.textMuted}
          keyboardType="numeric"
          maxLength={19}
          style={inputStyle(cardValid, touched.card)}
          editable={!busy && result === 'idle'}
          autoComplete="cc-number"
        />
        {touched.card && !cardValid && (
          <Text style={errorStyle}>Enter a valid 16-digit card number</Text>
        )}
        {isFailureCard && (
          <Text style={{ ...errorStyle, color: '#f59e0b' }}>
            ⚠ Test failure card — payment will be declined
          </Text>
        )}
      </View>

      {/* Expiry + CVV */}
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 14 }}>
        <View style={{ flex: 1 }}>
          <Text style={labelStyle}>Expiry</Text>
          <TextInput
            value={expiry}
            onChangeText={(v) => setExpiry(formatExpiry(v))}
            onBlur={() => setTouched((t) => ({ ...t, expiry: true }))}
            placeholder="MM/YY"
            placeholderTextColor={theme.colors.textMuted}
            keyboardType="numeric"
            maxLength={5}
            style={inputStyle(expiryValid, touched.expiry)}
            editable={!busy && result === 'idle'}
            autoComplete="cc-exp"
          />
          {touched.expiry && !expiryValid && (
            <Text style={errorStyle}>Invalid expiry</Text>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={labelStyle}>CVV</Text>
          <TextInput
            value={cvv}
            onChangeText={(v) => setCvv(v.replace(/\D/g, '').slice(0, 3))}
            onBlur={() => setTouched((t) => ({ ...t, cvv: true }))}
            placeholder="•••"
            placeholderTextColor={theme.colors.textMuted}
            keyboardType="numeric"
            maxLength={3}
            secureTextEntry
            style={inputStyle(cvvValid, touched.cvv)}
            editable={!busy && result === 'idle'}
            autoComplete="cc-csc"
          />
          {touched.cvv && !cvvValid && (
            <Text style={errorStyle}>3 digits</Text>
          )}
        </View>
      </View>

      {/* Cardholder Name */}
      <View style={{ marginBottom: 20 }}>
        <Text style={labelStyle}>Cardholder Name</Text>
        <TextInput
          value={cardHolder}
          onChangeText={(v) => setCardHolder(v.toUpperCase())}
          onBlur={() => setTouched((t) => ({ ...t, holder: true }))}
          placeholder="AHMED HASSAN"
          placeholderTextColor={theme.colors.textMuted}
          autoCapitalize="characters"
          style={{ ...inputStyle(holderValid, touched.holder), fontFamily: undefined }}
          editable={!busy && result === 'idle'}
          autoComplete="cc-name"
        />
        {touched.holder && !holderValid && (
          <Text style={errorStyle}>Enter the name on your card</Text>
        )}
      </View>
    </View>
  );
}
