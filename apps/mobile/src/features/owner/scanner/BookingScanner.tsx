import { useState } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { View } from 'react-native';
import { AppSheet, Copy, Action, useMobileDesign } from '../../../components/common/MobileDesign';
import { parseCheckInQr } from '../../../utils/checkin-qr';

export function BookingScanner({
  onRead,
  onClose,
}: {
  onRead: (raw: string) => void;
  onClose: () => void;
}) {
  const { t, lang } = useMobileDesign();
  const [permission, requestPermission] = useCameraPermissions();
  const [error, setError] = useState(false);
  return (
    <AppSheet title={lang === 'ar' ? 'مسح رمز الحجز لتسجيل الحضور' : 'Scan QR for Check-In'} onClose={onClose}>
      {!permission?.granted ? (
        <Action
          label={lang === 'ar' ? 'السماح بالكاميرا' : 'Allow camera access'}
          onPress={() => void requestPermission()}
        />
      ) : (
        <View style={{ height: 280, borderRadius: 20, overflow: 'hidden' }}>
          <CameraView
            style={{ flex: 1 }}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={({ data }) => {
              const parsed = parseCheckInQr(data);
              if (parsed.code || parsed.id) {
                onRead(data);
              } else {
                setError(true);
              }
            }}
          />
        </View>
      )}
      {error && <Copy>{t('error')}</Copy>}
      <Copy accent>
        {lang === 'ar'
          ? 'المسح يسجل حضور اللاعب تلقائياً فور التعرف على الرمز.'
          : 'Scanning automatically checks in the player for kickoff upon detection.'}
      </Copy>
    </AppSheet>
  );
}
