import { useCallback, useEffect, useState } from 'react';

export type Theme = 'auto' | 'light' | 'dark';

const STORAGE_KEY = 'td-theme';
const THEMES: Theme[] = ['auto', 'light', 'dark'];

function readStored(): Theme {
  if (typeof window === 'undefined') return 'auto';
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v === 'auto' || v === 'light' || v === 'dark') return v;
  } catch {
    // localStorage may be unavailable (SSR, private browsing)
  }
  return 'auto';
}

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
}

export function useTheme(): { theme: Theme; setTheme: (t: Theme) => void; cycle: () => void } {
  const [theme, setThemeState] = useState<Theme>(() => readStored());

  useEffect(() => {
    applyTheme(theme);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);

  const cycle = useCallback(() => {
    setThemeState((current) => {
      const idx = THEMES.indexOf(current);
      return THEMES[(idx + 1) % THEMES.length];
    });
  }, []);

  return { theme, setTheme, cycle };
}
