export const darkTheme = {
  mode: 'dark' as const,
  colors: {
    bg: '#0b1715',
    bgSecondary: '#0f1f1c',
    card: '#13221f',
    cardSecondary: '#192b27',
    cardBorder: 'rgba(255, 255, 255, 0.1)',
    cardBorderHover: 'rgba(186, 243, 94, 0.4)',
    divider: 'rgba(255, 255, 255, 0.08)',
    inputBg: 'rgba(255, 255, 255, 0.05)',
    inputBorder: 'rgba(255, 255, 255, 0.12)',

    // Stadium Accent Palette
    lime: '#baf35e',
    limeDark: '#0b1715',
    limeGlow: 'rgba(186, 243, 94, 0.15)',
    limeBorder: 'rgba(186, 243, 94, 0.3)',

    // Status Tones
    emerald: '#10b981',
    emeraldGlow: 'rgba(16, 185, 129, 0.15)',
    amber: '#f59e0b',
    amberGlow: 'rgba(245, 158, 11, 0.15)',
    rose: '#f43f5e',
    roseGlow: 'rgba(244, 63, 94, 0.15)',
    sky: '#38bdf8',
    skyGlow: 'rgba(56, 189, 248, 0.15)',

    // Typography
    textPrimary: '#f8fafc',
    textSecondary: '#cbd5e1',
    textMuted: '#94a3b8',
    textDark: '#64748b',
  },
  radii: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    sheet: 28,
    full: 9999,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
};

export const lightTheme = {
  mode: 'light' as const,
  colors: {
    bg: '#f4f7f5',
    bgSecondary: '#edf3ef',
    card: '#ffffff',
    cardSecondary: '#edf3ef',
    cardBorder: '#e2e8f0',
    cardBorderHover: '#16a34a',
    divider: '#e2e8f0',
    inputBg: '#f8fafc',
    inputBorder: '#cbd5e1',

    // Stadium Accent Palette in Light Mode (High Contrast Forest Grass / Emerald)
    lime: '#28785a',
    limeDark: '#ffffff',
    limeGlow: 'rgba(21, 128, 61, 0.12)',
    limeBorder: 'rgba(21, 128, 61, 0.3)',

    // Status Tones
    emerald: '#059669',
    emeraldGlow: 'rgba(5, 150, 105, 0.12)',
    amber: '#d97706',
    amberGlow: 'rgba(217, 119, 6, 0.12)',
    rose: '#e11d48',
    roseGlow: 'rgba(225, 29, 72, 0.12)',
    sky: '#0284c7',
    skyGlow: 'rgba(2, 132, 199, 0.12)',

    // Typography
    textPrimary: '#102a2b',
    textSecondary: '#334155',
    textMuted: '#64748b',
    textDark: '#94a3b8',
  },
  radii: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    sheet: 28,
    full: 9999,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
};

export type ThemeMode = 'dark' | 'light';

export type ThemeType = {
  mode: ThemeMode;
  colors: typeof darkTheme.colors;
  radii: typeof darkTheme.radii;
  spacing: typeof darkTheme.spacing;
};

export function getTheme(mode: ThemeMode): ThemeType {
  return mode === 'light' ? lightTheme : darkTheme;
}

// Default export for backward compatibility
export const Theme = darkTheme;
