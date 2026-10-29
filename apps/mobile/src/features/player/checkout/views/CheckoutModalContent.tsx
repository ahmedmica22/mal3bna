import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { BookingQr } from '../../../../components/common/BookingQr';
import {
  AppSheet,
  Panel,
  Copy,
  Action,
  useMobileDesign,
} from '../../../../components/common/MobileDesign';
import { CheckoutPolicyCard } from '../components/CheckoutPolicyCard';
import { CheckoutSummaryCard } from '../components/CheckoutSummaryCard';
import { FakeCardInputStep } from '../components/FakeCardInputStep';
import type { CheckoutModalContentProps } from '../types';

export function CheckoutModalContent(p: CheckoutModalContentProps) {
  const { t, lang, theme, rtl } = useMobileDesign();
  const [accepted, setAccepted] = useState(false);
  const [showCardInput, setShowCardInput] = useState(false);

  useEffect(() => {
    setAccepted(false);
    setShowCardInput(false);
  }, [p.court?.id, p.startsAt, p.hours, p.totalPiastres]);

  const formatMoney = (value: number) =>
    `${new Intl.NumberFormat(lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-EG', { maximumFractionDigits: 2 }).format(value / 100)} EGP`;

  const dueNow = p.paymentOption === 'full' ? p.totalPiastres : p.depositPiastres;
  const disabled = !accepted || p.isSubmitting || Boolean(p.pendingBooking && p.holdSeconds <= 0);
  const codes =
    p.confirmedCode
      ?.split(',')
      .map((code) => code.trim())
      .filter(Boolean) ?? [];

  // Confirmation screen
  if (p.confirmedCode) {
    return (
      <AppSheet title={t('confirmation')} onClose={p.onClose}>
        <Copy>{t('confirmationNote')}</Copy>
        <Panel>
          {codes[0] ? <BookingQr code={codes[0]} /> : null}
          {codes.slice(1).map((code) => (
            <Copy key={code}>#{code}</Copy>
          ))}
          <Copy>
            {p.venue?.name} / {p.court?.name}
          </Copy>
          <Copy>
            {p.hours} {t('hours')} · {formatMoney(p.totalPiastres)}
          </Copy>
        </Panel>
        <Action label={t('myBookings')} onPress={p.onSuccessDone} />
      </AppSheet>
    );
  }

  // Card input screen (shown after policy accepted and Pay tapped)
  if (showCardInput) {
    return (
      <AppSheet
        fullScreen
        title="Card Payment"
        onClose={() => setShowCardInput(false)}
      >
        <FakeCardInputStep
          amountPiastres={dueNow}
          paymentOption={p.paymentOption}
          onPay={async (outcome) => {
            // Map 'success'/'failure' to the submit handler
            if (outcome === 'success') {
              await p.onSubmit();
            } else {
              // Trigger with failure by calling submit — backend fake gateway will handle
              await p.onSubmit();
            }
          }}
          onBack={() => setShowCardInput(false)}
        />
      </AppSheet>
    );
  }

  // Main checkout screen
  return (
    <AppSheet
      fullScreen
      title={t('checkoutTitle')}
      onClose={p.onClose}
      footer={
        <>
          <Pressable
            accessibilityRole="checkbox"
            accessibilityLabel={t('policyAccept')}
            accessibilityState={{ checked: accepted, disabled: p.isSubmitting }}
            disabled={p.isSubmitting}
            onPress={() => setAccepted((current) => !current)}
            style={{
              flexDirection: rtl ? 'row-reverse' : 'row',
              alignItems: 'center',
              gap: 16,
              backgroundColor: theme.colors.card,
              padding: 18,
              borderRadius: 24,
              minHeight: 64,
            }}
          >
            <Text
              style={{
                flex: 1,
                color: theme.colors.textPrimary,
                fontSize: 15,
                lineHeight: 22,
                fontWeight: '700',
                textAlign: rtl ? 'right' : 'left',
              }}
            >
              {t('policyAccept')}
            </Text>
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 10,
                borderWidth: accepted ? 0 : 2,
                borderColor: theme.colors.textMuted,
                backgroundColor: accepted ? theme.colors.lime : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {accepted ? (
                <Text style={{ color: theme.colors.limeDark, fontSize: 20, fontWeight: '800' }}>
                  ✓
                </Text>
              ) : null}
            </View>
          </Pressable>

          {/* Pay button → opens card input form */}
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled, busy: p.isSubmitting }}
            disabled={disabled}
            onPress={() => {
              if (p.pendingBooking) {
                // Retry flow: go straight to submit
                p.onSubmit();
              } else {
                setShowCardInput(true);
              }
            }}
            style={({ pressed }) => ({
              minHeight: 60,
              borderRadius: 32,
              backgroundColor: theme.colors.lime,
              paddingHorizontal: 22,
              paddingVertical: 17,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: disabled ? 0.45 : pressed ? 0.8 : 1,
            })}
          >
            {p.isSubmitting ? (
              <ActivityIndicator color={theme.colors.limeDark} />
            ) : (
              <Text
                style={{
                  color: theme.colors.limeDark,
                  fontWeight: '900',
                  fontSize: 17,
                  textAlign: 'center',
                }}
              >
                {p.pendingBooking
                  ? t('retryPayment')
                  : t('payAndBook').replace('{amount}', formatMoney(dueNow))}
              </Text>
            )}
          </Pressable>
        </>
      }
    >
      <CheckoutSummaryCard booking={p} formatMoney={formatMoney} />
      <View
        accessibilityRole="radiogroup"
        style={{ flexDirection: rtl ? 'row-reverse' : 'row', gap: 10 }}
      >
        {(['deposit', 'full'] as const).map((option) => (
          <Pressable
            key={option}
            accessibilityRole="radio"
            accessibilityState={{
              checked: p.paymentOption === option,
              disabled: Boolean(p.pendingBooking || p.isSubmitting),
            }}
            disabled={Boolean(p.pendingBooking || p.isSubmitting)}
            onPress={() => p.onSelectPaymentOption(option)}
            style={{
              flex: 1,
              padding: 15,
              borderRadius: 18,
              borderWidth: 1.5,
              borderColor: p.paymentOption === option ? theme.colors.lime : theme.colors.cardBorder,
              backgroundColor:
                p.paymentOption === option ? theme.colors.limeGlow : theme.colors.card,
            }}
          >
            <Text
              style={{
                color: p.paymentOption === option ? theme.colors.lime : theme.colors.textSecondary,
                fontWeight: '800',
                fontSize: 14,
                textAlign: 'center',
              }}
            >
              {t(option)}
            </Text>
          </Pressable>
        ))}
      </View>
      <CheckoutPolicyCard />
      {p.pendingBooking && (
        <View style={{ borderRadius: 16, padding: 14, backgroundColor: theme.colors.amberGlow }}>
          <Copy accent>
            {p.holdSeconds > 0
              ? `${t('hold')}: ${String(Math.floor(p.holdSeconds / 60)).padStart(2, '0')}:${String(p.holdSeconds % 60).padStart(2, '0')}`
              : t('expired')}
          </Copy>
        </View>
      )}
      <Copy>{t('paymentNote')}</Copy>
      {p.paymentError ? (
        <View accessibilityRole="alert">
          <Copy>{p.paymentError}</Copy>
        </View>
      ) : null}
    </AppSheet>
  );
}
