import { useEffect, useRef, useState, type SetStateAction } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import type { PublicUserResponse } from '@court-booking/api-client';
import type { Language } from '../constants/translations';
import type { ThemeMode } from '../constants/theme';
import { request } from '../services/api';
import { errorMessage } from '../utils/errors';
const key = 'mal3bna.appearance.v1';
export function useAppearance(account: PublicUserResponse | null) {
  const [lang, setLanguageState] = useState<Language>('en');
  const [themeMode, setThemeState] = useState<ThemeMode>('dark');
  const [loaded, setLoaded] = useState(false);
  const [appearanceError, setAppearanceError] = useState('');
  const accountRef = useRef(account); accountRef.current = account;
  const languageRef = useRef(lang); languageRef.current = lang;
  const themeRef = useRef(themeMode); themeRef.current = themeMode;
  const edited = useRef(false);
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const raw = Platform.OS === 'web' ? globalThis.localStorage?.getItem(key) : await SecureStore.getItemAsync(key);
        const saved = raw ? JSON.parse(raw) as { language?: unknown; theme?: unknown } : null;
        if (active && !edited.current) {
          if (saved?.theme === 'dark' || saved?.theme === 'light') setThemeState(saved.theme);
          if (!accountRef.current && (saved?.language === 'en' || saved?.language === 'ar')) setLanguageState(saved.language);
        }
      } catch { /* Appearance defaults remain usable if local storage is unavailable. */ }
      finally { if (active) setLoaded(true); }
    }
    void load(); return () => { active = false; };
  }, []);
  useEffect(() => { if (account?.language) setLanguageState(account.language); }, [account?.id, account?.language]);
  useEffect(() => {
    if (!loaded) return;
    const raw = JSON.stringify({ language: lang, theme: themeMode });
    if (Platform.OS === 'web') { try { globalThis.localStorage?.setItem(key, raw); } catch { /* Preferences are optional. */ } }
    else void SecureStore.setItemAsync(key, raw).catch(() => undefined);
  }, [loaded, lang, themeMode]);
  function setLang(next: SetStateAction<Language>) {
    const language = typeof next === 'function' ? next(languageRef.current) : next;
    edited.current = true; languageRef.current = language; setLanguageState(language); setAppearanceError('');
    if (accountRef.current) void request('/me', { method: 'PATCH', body: JSON.stringify({ language }) }).catch(error => setAppearanceError(errorMessage(error, 'Language was saved on this device, but could not be saved to your account.')));
  }
  function setThemeMode(next: SetStateAction<ThemeMode>) {
    const value = typeof next === 'function' ? next(themeRef.current) : next;
    edited.current = true; themeRef.current = value; setThemeState(value);
  }
  return { lang, setLang, themeMode, setThemeMode, appearanceError };
}
