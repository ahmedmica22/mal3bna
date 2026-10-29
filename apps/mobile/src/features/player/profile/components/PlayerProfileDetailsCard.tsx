import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import type { ThemeType } from '../../../../constants/theme';
import type { PlayerProfileStyles } from '../styles';

interface PlayerProfileDetailsCardProps {
  userName: string;
  userPhone?: string | null | undefined;
  userEmail?: string | undefined;
  isRtl: boolean;
  lang: string;
  theme: ThemeType;
  themeMode: 'dark' | 'light';
  styles: PlayerProfileStyles;
  onUpdateProfile?: ((data: { name?: string; phone?: string | null }) => Promise<unknown>) | undefined;
}

export function PlayerProfileDetailsCard({
  userName,
  userPhone,
  userEmail,
  isRtl,
  lang,
  theme,
  themeMode,
  styles,
  onUpdateProfile,
}: PlayerProfileDetailsCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(userName);
  const [editPhone, setEditPhone] = useState(userPhone ?? '');
  const [isSavingDetails, setIsSavingDetails] = useState(false);
  const [detailsSavedMsg, setDetailsSavedMsg] = useState('');

  useEffect(() => {
    setEditName(userName);
  }, [userName]);

  useEffect(() => {
    setEditPhone(userPhone ?? '');
  }, [userPhone]);

  async function handleSaveDetails() {
    if (!editName.trim()) return;
    setIsSavingDetails(true);
    setDetailsSavedMsg('');
    try {
      if (onUpdateProfile) {
        await onUpdateProfile({
          name: editName.trim(),
          phone: editPhone.trim() || null,
        });
        setDetailsSavedMsg(lang === 'ar' ? 'تم حفظ التعديلات بنجاح' : 'Details saved successfully');
        setTimeout(() => {
          setDetailsSavedMsg('');
          setIsEditing(false);
        }, 1500);
      }
    } finally {
      setIsSavingDetails(false);
    }
  }

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.cardBorder,
          marginBottom: 16,
        },
      ]}
    >
      <View
        style={{
          flexDirection: isRtl ? 'row-reverse' : 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <Text style={[styles.cardHeader, { color: theme.colors.lime, marginBottom: 0 }]}>
          {lang === 'ar' ? 'البيانات الشخصية' : 'Personal Details'}
        </Text>
        {!isEditing ? (
          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 5,
              borderRadius: 8,
              backgroundColor: theme.colors.limeGlow,
              borderWidth: 1,
              borderColor: theme.colors.limeBorder,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '700', color: theme.colors.lime }}>
              {lang === 'ar' ? 'تعديل' : 'Edit'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setIsEditing(false);
              setEditName(userName);
              setEditPhone(userPhone ?? '');
            }}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 5,
              borderRadius: 8,
              backgroundColor:
                themeMode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '600', color: theme.colors.textMuted }}>
              {lang === 'ar' ? 'إلغاء' : 'Cancel'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {detailsSavedMsg ? (
        <View
          style={{
            padding: 10,
            borderRadius: 8,
            backgroundColor: 'rgba(34, 197, 94, 0.15)',
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              color: '#22c55e',
              fontWeight: '700',
              textAlign: isRtl ? 'right' : 'left',
            }}
          >
            ✓ {detailsSavedMsg}
          </Text>
        </View>
      ) : null}

      {isEditing ? (
        <View style={{ gap: 12 }}>
          <View>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '700',
                color: theme.colors.textSecondary,
                marginBottom: 6,
                textAlign: isRtl ? 'right' : 'left',
              }}
            >
              {lang === 'ar' ? 'الاسم' : 'Name'}
            </Text>
            <TextInput
              value={editName}
              onChangeText={setEditName}
              placeholder={lang === 'ar' ? 'أدخل اسمك' : 'Enter your name'}
              placeholderTextColor={theme.colors.textMuted}
              style={{
                height: 44,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: theme.colors.cardBorder,
                backgroundColor: theme.colors.cardSecondary,
                color: theme.colors.textPrimary,
                paddingHorizontal: 12,
                fontSize: 14,
                textAlign: isRtl ? 'right' : 'left',
              }}
            />
          </View>

          <View>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '700',
                color: theme.colors.textSecondary,
                marginBottom: 6,
                textAlign: isRtl ? 'right' : 'left',
              }}
            >
              {lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
            </Text>
            <TextInput
              value={editPhone}
              onChangeText={setEditPhone}
              placeholder={lang === 'ar' ? 'مثال: 01012345678' : 'e.g. 01012345678'}
              placeholderTextColor={theme.colors.textMuted}
              keyboardType="phone-pad"
              style={{
                height: 44,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: theme.colors.cardBorder,
                backgroundColor: theme.colors.cardSecondary,
                color: theme.colors.textPrimary,
                paddingHorizontal: 12,
                fontSize: 14,
                textAlign: isRtl ? 'right' : 'left',
              }}
            />
          </View>

          <TouchableOpacity
            onPress={handleSaveDetails}
            disabled={isSavingDetails || !editName.trim()}
            style={{
              marginTop: 6,
              height: 44,
              borderRadius: 10,
              backgroundColor: theme.colors.lime,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isSavingDetails || !editName.trim() ? 0.6 : 1,
            }}
          >
            {isSavingDetails ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Text style={{ color: '#000', fontWeight: '800', fontSize: 14 }}>
                {lang === 'ar' ? 'حفظ التعديلات' : 'Save Changes'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ gap: 8 }}>
          <View
            style={{
              flexDirection: isRtl ? 'row-reverse' : 'row',
              justifyContent: 'space-between',
              paddingVertical: 6,
            }}
          >
            <Text style={{ fontSize: 13, color: theme.colors.textMuted }}>
              {lang === 'ar' ? 'الاسم' : 'Name'}
            </Text>
            <Text style={{ fontSize: 13, fontWeight: '700', color: theme.colors.textPrimary }}>
              {userName || '—'}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.colors.cardBorder }]} />

          <View
            style={{
              flexDirection: isRtl ? 'row-reverse' : 'row',
              justifyContent: 'space-between',
              paddingVertical: 6,
            }}
          >
            <Text style={{ fontSize: 13, color: theme.colors.textMuted }}>
              {lang === 'ar' ? 'رقم الهاتف' : 'Phone'}
            </Text>
            <Text style={{ fontSize: 13, fontWeight: '700', color: theme.colors.textPrimary }}>
              {userPhone || (lang === 'ar' ? 'لم يحدد' : 'Not set')}
            </Text>
          </View>

          {userEmail ? (
            <>
              <View style={[styles.divider, { backgroundColor: theme.colors.cardBorder }]} />
              <View
                style={{
                  flexDirection: isRtl ? 'row-reverse' : 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 6,
                }}
              >
                <Text style={{ fontSize: 13, color: theme.colors.textMuted }}>
                  {lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                </Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary }}>
                  {userEmail}
                </Text>
              </View>
            </>
          ) : null}
        </View>
      )}
    </View>
  );
}
