export type AppTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'icfes-theme';

export function readStoredTheme(): AppTheme {
  if (typeof window === 'undefined') return 'dark';
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export function persistTheme(theme: AppTheme) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // ignore quota / private mode
  }
}

export function applyThemeToDocument(theme: AppTheme) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.style.colorScheme = theme;
}
