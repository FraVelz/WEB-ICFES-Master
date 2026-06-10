'use client';

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { usePathname } from 'next/navigation';

import { applyThemeToDocument, persistTheme, readStoredTheme, type AppTheme } from '@/features/theme/themeStorage';

type ThemeContextValue = {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** SSR + primer render cliente: mismo valor que el HTML del servidor (evita mismatch de hidratación). */
const SSR_THEME_DEFAULT: AppTheme = 'dark';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<AppTheme>(SSR_THEME_DEFAULT);
  const pathname = usePathname();
  const syncedFromStorage = useRef(false);

  // useLayoutEffect + pathname: evita flash oscuro al navegar (Next puede resetear <html>)
  useLayoutEffect(() => {
    if (!syncedFromStorage.current) {
      syncedFromStorage.current = true;
      const stored = readStoredTheme();
      setThemeState(stored);
      applyThemeToDocument(stored);
      return;
    }
    applyThemeToDocument(theme);
  }, [theme, pathname]);

  const setTheme = useCallback((next: AppTheme) => {
    setThemeState(next);
    persistTheme(next);
    applyThemeToDocument(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
    }),
    [theme, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
