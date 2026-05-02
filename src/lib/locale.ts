/**
 * Tiny i18n locale store.
 * Detection order: localStorage → navigator.language(s) → 'zh' fallback.
 * Subscribers re-render via a custom 'td:locale' event plus 'storage' for
 * cross-tab sync.
 */

export type Locale = 'zh' | 'en';

const STORAGE_KEY = 'td-locale';
const LOCALE_EVENT = 'td:locale';

function detectFromBrowser(): Locale {
  if (typeof navigator === 'undefined') return 'zh';
  const candidates = [...(navigator.languages ?? []), navigator.language].filter(Boolean);
  for (const raw of candidates) {
    const tag = raw.toLowerCase();
    if (tag.startsWith('zh')) return 'zh';
    if (tag.startsWith('en')) return 'en';
  }
  return 'zh';
}

function readStored(): Locale | null {
  if (typeof window === 'undefined') return null;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v === 'zh' || v === 'en') return v;
  } catch {
    // localStorage may be unavailable (SSR, private browsing)
  }
  return null;
}

export function getLocale(): Locale {
  return readStored() ?? detectFromBrowser();
}

export function setLocale(locale: Locale): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event(LOCALE_EVENT));
}

export function subscribe(cb: () => void): () => void {
  window.addEventListener(LOCALE_EVENT, cb);
  window.addEventListener('storage', cb);
  return () => {
    window.removeEventListener(LOCALE_EVENT, cb);
    window.removeEventListener('storage', cb);
  };
}
