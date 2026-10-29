import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import {
  ApiError,
  GeneratedApiClient,
  SessionClient,
  type AuthResponse,
  type LoginInput,
  type PublicUserResponse,
} from '@court-booking/api-client';

function apiBase(): string {
  const explicit = process.env.EXPO_PUBLIC_API_URL;
  if (explicit) return explicit.replace(/\/$/, '');
  if (Platform.OS === 'web') return 'http://localhost:3000/api/v1';

  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants as unknown as { manifest?: { debuggerHost?: string } }).manifest?.debuggerHost ||
    (Constants as unknown as { manifest2?: { extra?: { expoClient?: { hostUri?: string } } } })
      .manifest2?.extra?.expoClient?.hostUri;

  if (hostUri) {
    const isTunnel = /exp\.direct|expo\.dev|expo\.app|ngrok|tunnel/.test(hostUri);
    const protocol = isTunnel ? 'https' : 'http';
    return `${protocol}://${hostUri}/api/v1`;
  }

  return Platform.OS === 'android'
    ? 'http://10.0.2.2:3000/api/v1'
    : 'http://192.168.1.105:3000/api/v1';
}
export const API_BASE = apiBase();
const refreshKey = 'mal3bna.refresh.v1';
let refreshToken: string | null = null;
let epoch = 0;
let persistence: Promise<void> = Promise.resolve();
const aliases = new Set<string>();
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());
function persist(value: string | null, generation: number): Promise<void> {
  const next = persistence
    .catch(() => undefined)
    .then(async () => {
      if (generation !== epoch) return;
      if (Platform.OS !== 'web') {
        if (value)
          await SecureStore.setItemAsync(refreshKey, value, {
            keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
          });
        else await SecureStore.deleteItemAsync(refreshKey);
      }
    });
  persistence = next;
  return next;
}
const timedFetch: typeof fetch = async (input, init) => {
  const controller = new AbortController();
  const abort = () => controller.abort();
  init?.signal?.addEventListener('abort', abort, { once: true });
  if (init?.signal?.aborted) controller.abort();
  const timeout = setTimeout(abort, 15000);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } catch (error) {
    if (controller.signal.aborted && !init?.signal?.aborted) {
      throw new ApiError(0, 'REQUEST_TIMEOUT', 'The server took too long to respond.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
    init?.signal?.removeEventListener('abort', abort);
  }
};
const publicApi = new GeneratedApiClient({
  baseUrl: API_BASE,
  fetch: timedFetch,
  credentials: 'omit',
  headers: {
    'X-Client': 'mobile',
    'bypass-tunnel-reminder': 'true',
    'ngrok-skip-browser-warning': 'true',
  },
});
const session = new SessionClient({
  baseUrl: API_BASE,
  fetch: timedFetch,
  credentials: 'omit',
  headers: {
    'X-Client': 'mobile',
    'bypass-tunnel-reminder': 'true',
    'ngrok-skip-browser-warning': 'true',
  },
  refresh: async (client) => {
    const generation = epoch;
    if (!refreshToken) throw new ApiError(401, 'SESSION_EXPIRED', 'Please sign in again.');
    const tokens = await client.request<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
    if (generation !== epoch) throw new ApiError(0, 'SESSION_CHANGED', 'Session changed');
    if (!tokens.refreshToken) throw new Error('The mobile API did not return a refresh token.');
    refreshToken = tokens.refreshToken;
    await persist(refreshToken, generation);
    if (generation !== epoch) throw new ApiError(0, 'SESSION_CHANGED', 'Session changed');
    aliases.add(tokens.accessToken);
    return tokens.accessToken;
  },
  onSessionExpired: () => {
    void clearSession();
  },
});
export function subscribeSession(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
export const accessToken = () => session.getAccessToken();
export async function clearSession() {
  const generation = ++epoch;
  refreshToken = null;
  aliases.clear();
  session.setAccessToken(null);
  notify();
  await persist(null, generation);
}
async function accept(tokens: AuthResponse, generation: number) {
  if (generation !== epoch) throw new ApiError(0, 'SESSION_CHANGED', 'Session changed');
  if (tokens.role !== 'player') {
    await publicApi.request('/auth/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokens.accessToken}` },
    });
    throw new Error(
      tokens.role === 'owner'
        ? 'The mobile app is for players only. Venue owners please manage your venue on the web dashboard.'
        : 'Admin accounts use the web dashboard.',
    );
  }
  if (!tokens.refreshToken) throw new Error('The mobile API did not return a refresh token.');
  refreshToken = tokens.refreshToken;
  await persist(refreshToken, generation);
  if (generation !== epoch) throw new ApiError(0, 'SESSION_CHANGED', 'Session changed');
  aliases.clear();
  aliases.add(tokens.accessToken);
  session.setAccessToken(tokens.accessToken);
  const me = await request<PublicUserResponse>('/me');
  notify();
  return me;
}
export async function authenticate(input: LoginInput) {
  const generation = ++epoch;
  const tokens = await publicApi.request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return accept(tokens, generation);
}
export async function restoreSession(): Promise<PublicUserResponse | null> {
  const generation = epoch;
  if (session.getAccessToken()) return request<PublicUserResponse>('/me');
  if (Platform.OS === 'web') return null;
  const saved = await SecureStore.getItemAsync(refreshKey);
  if (!saved || generation !== epoch) return null;
  try {
    const tokens = await publicApi.request<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: saved }),
    });
    return await accept(tokens, generation);
  } catch (error) {
    if (generation === epoch && error instanceof ApiError && [400, 401, 403].includes(error.status))
      await clearSession();
    throw error;
  }
}
export async function endSession() {
  try {
    if (session.getAccessToken()) await request('/auth/logout', { method: 'POST' });
  } finally {
    await clearSession();
  }
}
/** Compatibility token argument is scoped to the current family; refresh and transport remain centralized. */
export async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  legacyToken?: string | null,
): Promise<T> {
  // Public discovery must survive sign-in/refresh/logout while it is in flight.
  // SessionClient intentionally rejects account-scoped responses after a session
  // change; applying that rule to public reads breaks Explore during restoration.
  if (endpoint.startsWith('/public/') && (options.method ?? 'GET').toUpperCase() === 'GET') {
    return publicApi.request<T>(endpoint, options);
  }
  if (legacyToken && !aliases.has(legacyToken))
    throw new ApiError(0, 'SESSION_CHANGED', 'Session changed. Please reopen this screen.');
  const previous = session.getAccessToken();
  try {
    return await session.request<T>(endpoint, options);
  } finally {
    if (previous !== session.getAccessToken()) notify();
  }
}
export { ApiError };
