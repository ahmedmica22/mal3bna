import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { i18n, initializeI18n, type Language } from '@court-booking/i18n';
import { authApi } from '../services/api';
import { useAuth } from './AuthStore';

type Values = Record<string, string | number | boolean | undefined>;
type Translator = (key: string, values?: Values) => string;

function savedLanguage(): Language {
  try {
    return localStorage.getItem('mal3bna_lang') === 'ar' ? 'ar' : 'en';
  } catch {
    return 'en';
  }
}

function translator(language: Language): Translator {
  return (key, values) =>
    i18n.isInitialized
      ? String(
          i18n.t(key, {
            ...values,
            lng: language,
            ns: 'web',
            keySeparator: false,
            nsSeparator: false,
            defaultValue: key,
          }),
        )
      : key.replace(/\{\{(\w+)\}\}/g, (match, name: string) =>
          values?.[name] === undefined ? match : String(values[name]),
        );
}

const LanguageContext = createContext({
  language: 'en' as Language,
  locale: 'en-EG',
  translate: translator('en'),
  setLanguage: async (_language: Language): Promise<void> => {
    void _language;
  },
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [language, setLanguageState] = useState<Language>(() => {
    const initial = savedLanguage();
    void initializeI18n(initial);
    return initial;
  });

  const applyLanguage = useCallback((next: Language) => {
    void i18n.changeLanguage(next);
    setLanguageState(next);
    try {
      localStorage.setItem('mal3bna_lang', next);
    } catch {
      /* Storage may be unavailable. */
    }
    document.documentElement.lang = next;
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
  }, []);

  useEffect(() => {
    applyLanguage(user?.language ?? savedLanguage());
  }, [user?.id, user?.language, applyLanguage]);

  const setLanguage = useCallback(
    async (next: Language) => {
      applyLanguage(next);
      if (user) await authApi.updateLanguage(next);
    },
    [applyLanguage, user],
  );

  const value = useMemo(
    () => ({
      language,
      locale: language === 'ar' ? 'ar-EG-u-nu-latn' : 'en-EG',
      translate: translator(language),
      setLanguage,
    }),
    [language, setLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);
