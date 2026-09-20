/**
 * URL-parameter overrides used when the native apps open a page inside a
 * WebView. All three are read straight from `window.location.search`, so they
 * survive a reload inside the WebView and never touch what the visitor has
 * saved on the website itself:
 *
 *   ?embed=1                 render the page content only (no nav, no footer)
 *   ?theme=light|dark|auto   force the theme instead of the stored/system one
 *   ?lang=<bcp47>            force the UI language instead of the detected one
 *
 * Example:
 *   /help/receive-mail/android?embed=1&theme=dark&lang=zh-Hant
 *
 * Anything unrecognised is ignored, so the page keeps its normal behaviour.
 */

export type ForcedTheme = 'auto' | 'light' | 'dark';

function readParam(name: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const value = new URLSearchParams(window.location.search).get(name);
    return value === null ? null : value.trim();
  } catch {
    // Malformed query strings should never take the page down.
    return null;
  }
}

/** True for `?embed=1` (also accepts `true`/`yes` for tolerance). */
export function isEmbedded(): boolean {
  const value = readParam('embed');
  if (!value) return false;
  const v = value.toLowerCase();
  return v === '1' || v === 'true' || v === 'yes';
}

/** `?theme=` when it names a theme we support, otherwise null. */
export function getForcedTheme(): ForcedTheme | null {
  const value = readParam('theme')?.toLowerCase();
  if (value === 'auto' || value === 'light' || value === 'dark') return value;
  return null;
}

/**
 * The raw `?lang=` BCP-47 tag, e.g. `zh-Hant` or `en-US`. Mapping it onto a
 * locale we actually ship happens in `@/lib/locale`, which owns that list.
 */
export function getForcedLocaleTag(): string | null {
  const value = readParam('lang');
  return value ? value : null;
}

/**
 * `?bg=` / `?fg=` — the host app's own surface colours, URL-encoded hex
 * (e.g. `bg=%23121212&fg=%23E6E6E6`). The Android app passes its Material
 * `colorScheme.surface` / `onSurface` so the embedded page matches the screen
 * around it and the WebView edge is invisible.
 *
 * Only `#RGB` / `#RRGGBB` survives validation — anything else is dropped
 * rather than handed to CSS, since these values end up in a style property.
 */
const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

function readColorParam(name: string): string | null {
  // URLSearchParams already percent-decodes, so '%23121212' arrives as '#121212'.
  const value = readParam(name);
  if (!value) return null;
  const hex = value.startsWith('#') ? value : `#${value}`;
  return HEX_COLOR.test(hex) ? hex.toLowerCase() : null;
}

export interface EmbedSurface {
  bg: string | null;
  fg: string | null;
}

export function getEmbedSurface(): EmbedSurface {
  return { bg: readColorParam('bg'), fg: readColorParam('fg') };
}
