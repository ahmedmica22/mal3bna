import { useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useMobileDesign } from '../../../../components/common/MobileDesign';
import { MobileCardPreview } from './MobileCardPreview';
import { MobileCardFormFields } from './MobileCardFormFields';

const FAILURE_CARD = '4000000000000002';

function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 16);
  const groups: string[] = [];
  for (let i = 0; i < digits.length; i += 4) groups.push(digits.slice(i, i + 4));
  return groups.join(' ');
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

function detectBrand(num: string): 'visa' | 'mastercard' | 'other' {
  const d = num.replace(/\s/g, '');
  if (/^4/.test(d)) return 'visa';
  if (/^5[1-5]/.test(d)) return 'mastercard';
  return 'other';
}

interface FakeCardInputStepProps {
  amountPiastres: number;
  paymentOption: 'deposit' | 'full';
  onPay: (outcome: 'success' | 'failure') => Promise<void>;
  onBack: () => void;
}

export function FakeCardInputStep({
  amountPiastres,
  paymentOption,
  onPay,
  onBack,
}: FakeCardInputStepProps) {
  const { theme, rtl } = useMobileDesign();

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<'idle' | 'success' | 'failure'>('idle');
  const [touched, setTouched] = useState({
    card: false,
    expiry: false,
    cvv: false,
    holder: false,
  });

  const rawCard = cardNumber.replace(/\s/g, '');
  const brand = detectBrand(cardNumber);
  const isFailureCard = rawCard === FAILURE_CARD;

  const cardValid = rawCard.length === 16;
  const expiryValid =
    /^\d{2}\/\d{2}$/.test(expiry) &&
    (() => {
      const parts = expiry.split('/').map(Number);
      const mm = parts[0] ?? 0;
      const yy = parts[1] ?? 0;
      const now = new Date();
      const exp = new Date(2000 + yy, mm - 1, 1);
      return mm >= 1 && mm <= 12 && exp > now;
    })();
  const cvvValid = /^\d{3,4}$/.test(cvv);
  const holderValid = cardHolder.trim().length >= 3;
  const formValid = cardValid && expiryValid && cvvValid && holderValid;

  const formatMoney = (piastres: number) => `${(piastres / 100).toFixed(2)} EGP`;

  const handlePay = useCallback(async () => {
    setTouched({ card: true, expiry: true, cvv: true, holder: true });
    if (!formValid || busy) return;
    setBusy(true);
    try {
      const outcome = isFailureCard ? 'failure' : 'success';
      await onPay(outcome);
      setResult(outcome);
    } catch {
      setResult('failure');
    } finally {
      setBusy(false);
    }
  }, [formValid, busy, isFailureCard, onPay]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }}>
        {/* Visual Card Preview */}
        <MobileCardPreview
          cardNumber={cardNumber}
          cardHolder={cardHolder}
          expiry={expiry}
          brand={brand}
          theme={theme}
        />

        {/* Amount bar */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: `${theme.colors.lime}18`,
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: `${theme.colors.lime}35`,
          }}
        >
          <Text
            style={{
              color: theme.colors.lime,
              fontSize: 12,
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            {paymentOption === 'full' ? 'Pay in Full' : 'Pay Deposit (30%)'}
          </Text>
          <Text
            style={{
              color: theme.colors.lime,
              fontSize: 20,
              fontWeight: '900',
              fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
            }}
          >
            {formatMoney(amountPiastres)}
          </Text>
        </View>

        {/* Form Inputs */}
        <MobileCardFormFields
          cardNumber={cardNumber}
          setCardNumber={setCardNumber}
          cardValid={cardValid}
          isFailureCard={isFailureCard}
          expiry={expiry}
          setExpiry={setExpiry}
          expiryValid={expiryValid}
          cvv={cvv}
          setCvv={setCvv}
          cvvValid={cvvValid}
          cardHolder={cardHolder}
          setCardHolder={setCardHolder}
          holderValid={holderValid}
          touched={touched}
          setTouched={setTouched}
          busy={busy}
          result={result}
          theme={theme}
          rtl={rtl}
          formatCardNumber={formatCardNumber}
          formatExpiry={formatExpiry}
        />

        {/* Pay button */}
        {result === 'idle' && (
          <Pressable
            onPress={() => void handlePay()}
            disabled={busy}
            accessibilityRole="button"
            style={({ pressed }) => ({
              backgroundColor: theme.colors.lime,
              borderRadius: 22,
              paddingVertical: 17,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: busy ? 0.6 : pressed ? 0.8 : 1,
              marginBottom: 12,
              shadowColor: theme.colors.lime,
              shadowOpacity: 0.35,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 4 },
            })}
          >
            {busy ? (
              <ActivityIndicator color={theme.colors.limeDark} />
            ) : (
              <Text
                style={{
                  color: theme.colors.limeDark,
                  fontWeight: '900',
                  fontSize: 17,
                  letterSpacing: 0.3,
                }}
              >
                🔒 Pay {formatMoney(amountPiastres)} securely
              </Text>
            )}
          </Pressable>
        )}

        {/* Result States */}
        {result === 'success' && (
          <View
            style={{
              backgroundColor: `${theme.colors.lime}20`,
              borderColor: `${theme.colors.lime}50`,
              borderWidth: 1,
              borderRadius: 18,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 22 }}>✅</Text>
            <View>
              <Text style={{ color: theme.colors.lime, fontWeight: '800', fontSize: 15 }}>
                Payment confirmed
              </Text>
              <Text style={{ color: theme.colors.textMuted, fontSize: 12, marginTop: 2 }}>
                Your booking is locked in.
              </Text>
            </View>
          </View>
        )}
        {result === 'failure' && (
          <View
            style={{
              backgroundColor: 'rgba(239,68,68,0.12)',
              borderColor: 'rgba(239,68,68,0.35)',
              borderWidth: 1,
              borderRadius: 18,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 22 }}>❌</Text>
            <View>
              <Text style={{ color: '#f87171', fontWeight: '800', fontSize: 15 }}>
                Payment declined
              </Text>
              <Text style={{ color: theme.colors.textMuted, fontSize: 12, marginTop: 2 }}>
                Check your card details and try again.
              </Text>
            </View>
          </View>
        )}

        {/* Back link */}
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          style={({ pressed }) => ({
            alignItems: 'center',
            paddingVertical: 12,
            opacity: pressed ? 0.6 : 1,
          })}
        >
          <Text style={{ color: theme.colors.textMuted, fontSize: 13 }}>← Back to checkout</Text>
        </Pressable>

        {/* Security note */}
        <Text
          style={{
            color: theme.colors.textMuted,
            fontSize: 11,
            textAlign: 'center',
            opacity: 0.6,
            marginBottom: 8,
          }}
        >
          🔒 256-bit encrypted sandbox — test environment only
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
