import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Theme, ThemeContextType } from '../types/ui';

export type { Theme, ThemeContextType };

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  dark: true,
  toggleTheme: () => undefined,
  setTheme: () => undefined,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem('mal3bna_theme');
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    } catch {
      // ignore
    }
    return 'dark'; // Always default to dark stadium theme
  });

  const setTheme = (next: Theme) => {
    setThemeState(next);
    try {
      localStorage.setItem('mal3bna_theme', next);
    } catch {
      // ignore
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  const dark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, dark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
