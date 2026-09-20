/**
 * Tiny i18n locale store.
 * Detection order: ?lang= override → localStorage → navigator.language(s) → 'zh'.
 * Subscribers re-render via a custom 'td:locale' event plus 'storage' for
 * cross-tab sync.
 */

import { getForcedLocaleTag } from '@/lib/embed';

export type Locale = 'zh' | 'en';

const STORAGE_KEY = 'td-locale';
const LOCALE_EVENT = 'td:locale';

/**
 * Maps a BCP-47 tag onto a locale we actually ship ('zh-Hant', 'zh-TW', 'zh'
 * → 'zh'; 'en-US', 'en' → 'en'). Anything else returns null so the caller can
 * fall back instead of showing an empty UI.
 */
function fromTag(raw: string): Locale | null {
  const tag = raw.toLowerCase();
  if (tag.startsWith('zh')) return 'zh';
  if (tag.startsWith('en')) return 'en';
  return null;
}

function detectFromBrowser(): Locale {
  if (typeof navigator === 'undefined') return 'zh';
  const candidates = [...(navigator.languages ?? []), navigator.language].filter(Boolean);
  for (const raw of candidates) {
    const locale = fromTag(raw);
    if (locale) return locale;
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

/** `?lang=` (used by the in-app WebView); null when absent or unsupported. */
function readForced(): Locale | null {
  const tag = getForcedLocaleTag();
  return tag ? fromTag(tag) : null;
}

export function getLocale(): Locale {
  // A forced tag outranks the stored choice for as long as it is in the URL,
  // and setLocale() never overwrites it — the toggle is hidden in embed mode.
  return readForced() ?? readStored() ?? detectFromBrowser();
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
