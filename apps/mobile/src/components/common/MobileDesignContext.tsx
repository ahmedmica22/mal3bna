import { createContext, useContext, ReactNode } from 'react';
import { useWindowDimensions } from 'react-native';
import { Theme, type ThemeType } from '../../constants/theme';
import type { Language } from '../../constants/translations';
import { interfaceCopy, type CopyKey } from '../../constants/interface-copy';

export interface MobileDesignContextValue {
  theme: ThemeType;
  lang: Language;
}

export const MobileDesignContext = createContext<MobileDesignContextValue>({
  theme: Theme,
  lang: 'en',
});

export function MobileDesignProvider({
  theme,
  lang,
  children,
}: {
  theme: ThemeType;
  lang: Language;
  children: ReactNode;
}) {
  return (
    <MobileDesignContext.Provider value={{ theme, lang }}>
      {children}
    </MobileDesignContext.Provider>
  );
}

export function useMobileDesign() {
  const { theme, lang } = useContext(MobileDesignContext);
  const { width, height, fontScale } = useWindowDimensions();
  return {
    theme,
    lang,
    rtl: lang === 'ar',
    width,
    height,
    compact: width < 380 || fontScale > 1.3,
    columns: width >= 1000 ? 3 : width >= 650 ? 2 : 1,
    t: (key: CopyKey) => interfaceCopy[lang][key],
    money: (piastres?: number) => `${Math.round((piastres ?? 0) / 100)} EGP`,
  };
}
