import { createContext, useContext, type ReactNode } from 'react';
import {
  useWindowDimensions,
  StyleSheet,
  ScrollView,
  RefreshControl,
  View,
  Text,
  Pressable,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  type TextInputProps,
  type StyleProp,
  type TextStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme, type ThemeType } from '../../constants/theme';
import type { Language } from '../../constants/translations';
import { interfaceCopy, type CopyKey } from '../../constants/interface-copy';
export {
  MobileDesignContext,
  MobileDesignProvider,
  useMobileDesign,
  type MobileDesignContextValue,
} from './MobileDesignContext';
import { useMobileDesign } from './MobileDesignContext';
export function Screen({
  children,
  onRefresh,
  refreshing = false,
}: {
  children: ReactNode;
  onRefresh?: () => void;
  refreshing?: boolean;
}) {
  const { width, rtl, theme } = useMobileDesign();
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.lime}
            colors={[theme.colors.lime]}
          />
        ) : undefined
      }
      contentContainerStyle={{
        padding: width >= 650 ? 28 : 16,
        paddingBottom: 110,
        gap: 20,
        width: '100%',
        maxWidth: 1180,
        alignSelf: 'center',
        direction: rtl ? 'rtl' : 'ltr',
      }}
    >
      {children}
    </ScrollView>
  );
}
export function Panel({ children }: { children: ReactNode }) {
  const { theme } = useMobileDesign();
  return (
    <View
      style={{
        backgroundColor: theme.colors.card,
        borderColor: theme.colors.cardBorder,
        borderWidth: 1,
        borderRadius: 24,
        padding: 20,
        gap: 14,
      }}
    >
      {children}
    </View>
  );
}
export function Title({ children, small = false }: { children: ReactNode; small?: boolean }) {
  const { theme, rtl, compact } = useMobileDesign();
  return (
    <Text
      accessibilityRole="header"
      style={{
        color: theme.colors.textPrimary,
        fontSize: small ? 19 : compact ? 28 : 36,
        fontWeight: '900',
        letterSpacing: -0.8,
        textAlign: rtl ? 'right' : 'left',
        flexShrink: 1,
      }}
    >
      {children}
    </Text>
  );
}
export function Copy({
  children,
  accent = false,
  style,
}: {
  children: ReactNode;
  accent?: boolean;
  style?: StyleProp<TextStyle>;
}) {
  const { theme, rtl } = useMobileDesign();
  return (
    <Text
      style={[
        {
          color: accent ? theme.colors.lime : theme.colors.textMuted,
          fontSize: 13,
          lineHeight: 21,
          textAlign: rtl ? 'right' : 'left',
          flexShrink: 1,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
export function Action({
  label,
  onPress,
  secondary = false,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
}) {
  const { theme } = useMobileDesign();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 48,
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 13,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: secondary ? theme.colors.inputBg : theme.colors.lime,
        borderColor: secondary ? theme.colors.cardBorder : theme.colors.lime,
        borderWidth: 1,
        opacity: disabled ? 0.45 : pressed ? 0.75 : 1,
      })}
    >
      <Text
        style={{
          fontWeight: '800',
          color: secondary ? theme.colors.textPrimary : theme.colors.limeDark,
          textAlign: 'center',
          fontSize: 13,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
export function Field({ label, ...props }: TextInputProps & { label: string }) {
  const { theme, rtl } = useMobileDesign();
  return (
    <View style={{ gap: 7 }}>
      <Copy>{label}</Copy>
      <TextInput
        {...props}
        accessibilityLabel={label}
        placeholderTextColor={theme.colors.textMuted}
        style={[
          {
            minHeight: 50,
            borderWidth: 1,
            borderColor: theme.colors.inputBorder,
            borderRadius: 14,
            paddingHorizontal: 14,
            paddingVertical: 12,
            backgroundColor: theme.colors.inputBg,
            color: theme.colors.textPrimary,
            textAlign: rtl ? 'right' : 'left',
          },
          props.style,
        ]}
      />
    </View>
  );
}
export function AppSheet({
  children,
  onClose,
  title,
  footer,
  fullScreen = false,
}: {
  children: ReactNode;
  onClose: () => void;
  title: string;
  footer?: ReactNode;
  fullScreen?: boolean;
}) {
  const { theme, width, height, t, rtl } = useMobileDesign();
  const insets = useSafeAreaInsets();
  return (
    <Modal visible transparent={!fullScreen} animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{
          flex: 1,
          justifyContent: width >= 650 ? 'center' : 'flex-end',
          backgroundColor: 'rgba(0,0,0,.68)',
          padding: !fullScreen && width >= 650 ? 24 : 0,
        }}
      >
        <View
          accessibilityViewIsModal
          style={{
            backgroundColor: theme.colors.bg,
            borderColor: theme.colors.cardBorder,
            borderWidth: 1,
            borderRadius: fullScreen ? 0 : width >= 650 ? 28 : 24,
            maxWidth: fullScreen ? undefined : 760,
            width: '100%',
            alignSelf: 'center',
            maxHeight: fullScreen ? undefined : height - Math.max(insets.top, 20),
            flex: fullScreen ? 1 : undefined,
            paddingTop: fullScreen ? insets.top : 0,
            paddingBottom: Math.max(insets.bottom, 16),
            overflow: 'hidden',
            direction: rtl ? 'rtl' : 'ltr',
          }}
        >
          <View
            style={{
              padding: 18,
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderColor: theme.colors.divider,
              flexDirection: rtl ? 'row-reverse' : 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            {fullScreen && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('back')}
                onPress={onClose}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 16,
                  backgroundColor: theme.colors.cardSecondary,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: theme.colors.textPrimary, fontSize: 28 }}>
                  {rtl ? '›' : '‹'}
                </Text>
              </Pressable>
            )}
            <View style={{ flex: 1 }}>
              <Title small>{title}</Title>
            </View>
            {!fullScreen && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('close')}
                onPress={onClose}
                style={{
                  minWidth: 44,
                  minHeight: 44,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: theme.colors.textPrimary, fontSize: 24 }}>×</Text>
              </Pressable>
            )}
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              padding: width >= 650 ? 24 : 18,
              gap: 18,
              width: '100%',
              maxWidth: fullScreen ? 760 : undefined,
              alignSelf: 'center',
            }}
            style={fullScreen ? { flex: 1 } : { flexGrow: 0 }}
          >
            {children}
          </ScrollView>
          {footer && (
            <View
              style={{
                borderTopWidth: StyleSheet.hairlineWidth,
                borderColor: theme.colors.divider,
                padding: 18,
                gap: 14,
                width: '100%',
                maxWidth: 760,
                alignSelf: 'center',
              }}
            >
              {footer}
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export * from './Shimmer';
