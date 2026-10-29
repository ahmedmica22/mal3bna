import { View, Text, Platform } from 'react-native';
import type { ThemeType } from '../../../../constants/theme';

interface MobileCardPreviewProps {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  brand: 'visa' | 'mastercard' | 'other';
  theme: ThemeType;
}

export function MobileCardPreview({
  cardNumber,
  cardHolder,
  expiry,
  brand,
  theme,
}: MobileCardPreviewProps) {
  return (
    <View
      style={{
        backgroundColor: '#0f1f18',
        borderRadius: 24,
        padding: 22,
        marginBottom: 16,
        overflow: 'hidden',
      }}
    >
      {/* Badge */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 18,
        }}
      >
        <View>
          <Text
            style={{
              color: theme.colors.lime,
              fontSize: 10,
              fontWeight: '900',
              letterSpacing: 1.5,
              textTransform: 'uppercase',
            }}
          >
            SANDBOX PAYMENT
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 2 }}>
            Simulated · No real charge
          </Text>
        </View>
        <Text style={{ fontSize: 20 }}>🔒</Text>
      </View>

      {/* Card number preview */}
      <Text
        style={{
          color: 'rgba(255,255,255,0.9)',
          fontSize: 18,
          letterSpacing: 4,
          fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
          marginBottom: 16,
        }}
      >
        {cardNumber || '•••• •••• •••• ••••'}
      </Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
          <Text
            style={{
              color: 'rgba(255,255,255,0.35)',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
            }}
          >
            Cardholder
          </Text>
          <Text
            style={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: 13,
              fontWeight: '700',
              marginTop: 2,
            }}
          >
            {cardHolder || '—'}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text
            style={{
              color: 'rgba(255,255,255,0.35)',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
            }}
          >
            Expires
          </Text>
          <Text
            style={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: 13,
              fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
              marginTop: 2,
            }}
          >
            {expiry || 'MM/YY'}
          </Text>
        </View>
      </View>

      {/* Brand */}
      {brand !== 'other' && (
        <View style={{ position: 'absolute', bottom: 22, right: 22 }}>
          <Text
            style={{
              color: brand === 'visa' ? '#60a5fa' : '#f59e0b',
              fontSize: 13,
              fontWeight: '900',
              fontStyle: 'italic',
              letterSpacing: 2,
            }}
          >
            {brand === 'visa' ? 'VISA' : 'MC'}
          </Text>
        </View>
      )}
    </View>
  );
}
