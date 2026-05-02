import { useTheme, type Theme } from '@/hooks/useTheme';
import { useLocale } from '@/hooks/useLocale';
import { tFor } from '@/lib/messages';

const NEXT: Record<Theme, Theme> = {
  auto: 'light',
  light: 'dark',
  dark: 'auto',
};

function SunIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function AutoIcon() {
  // Half-filled circle: outline + left half filled
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 3 A9 9 0 0 0 12 21 Z" fill="currentColor" />
    </svg>
  );
}

function iconFor(theme: Theme) {
  if (theme === 'light') return <SunIcon />;
  if (theme === 'dark') return <MoonIcon />;
  return <AutoIcon />;
}

export function ThemeToggle() {
  const { theme, cycle } = useTheme();
  const { locale } = useLocale();
  const messages = tFor(locale).themeToggle;
  const next = NEXT[theme];

  return (
    <button
      type="button"
      onClick={cycle}
      className="td-theme-toggle"
      aria-label={messages.switchTo(messages.labels[theme], messages.labels[next])}
      title={messages.current(messages.labels[theme])}
    >
      {iconFor(theme)}
    </button>
  );
}
