import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { request } from './api';
let currentToken: string | null = null;
export async function registerPush(prompt = true) {
  if (Platform.OS !== 'android' && Platform.OS !== 'ios')
    throw new Error(
      'Push registration requires a native development build. The inbox works on web.',
    );
  if (Constants.executionEnvironment === 'storeClient')
    throw new Error('Use a native development build for remote push notifications.');
  const projectId = process.env.EXPO_PUBLIC_EAS_PROJECT_ID ?? Constants.easConfig?.projectId;
  if (!projectId)
    throw new Error(
      'An EAS project ID is required for real push registration. Your inbox remains available.',
    );
  const Device = await import('expo-device');
  if (!Device.isDevice) throw new Error('Push registration requires a physical device.');
  const Notifications = await import('expo-notifications');
  if (Platform.OS === 'android')
    await Notifications.setNotificationChannelAsync('bookings', {
      name: 'Bookings',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  let permission = await Notifications.getPermissionsAsync();
  if (!permission.granted && prompt) permission = await Notifications.requestPermissionsAsync();
  if (!permission.granted) {
    if (prompt) throw new Error('Notification permission was not granted.');
    return;
  }
  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  await request('/notifications/devices', {
    method: 'POST',
    body: JSON.stringify({ expoToken: token, platform: Platform.OS }),
  });
  currentToken = token;
}
export async function unregisterPush() {
  if (!currentToken) return;
  const token = currentToken;
  await request('/notifications/devices', {
    method: 'DELETE',
    body: JSON.stringify({ expoToken: token }),
  });
  currentToken = null;
}
