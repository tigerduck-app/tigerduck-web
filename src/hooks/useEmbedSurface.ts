import { useEffect } from 'react';
import { getEmbedSurface } from '@/lib/embed';

/**
 * Paints the page with the host app's own surface colours (`?bg=` / `?fg=`),
 * so an embedded page and the app screen around it are literally the same
 * colour and the WebView edge is invisible.
 *
 * The values are written as CSS custom properties on <html>, which is where
 * the theme defines them — so `html`/`body` (and every `var(--td-*)` surface
 * in the page) follow along, including the over-scroll area. The remaining
 * surface tokens are mixed from the two supplied colours so the app only has
 * to pass Material's `surface` / `onSurface` pair.
 *
 * With neither param present nothing is touched and the theme applies as usual.
 */
const DERIVED: ReadonlyArray<readonly [string, string]> = [
  ['--td-bg-soft', 'color-mix(in oklab, var(--td-text) 6%, var(--td-bg))'],
  ['--td-bg-card', 'color-mix(in oklab, var(--td-text) 4%, var(--td-bg))'],
  ['--td-bg-tint', 'color-mix(in oklab, var(--td-text) 3%, var(--td-bg))'],
  ['--td-border-soft', 'color-mix(in oklab, var(--td-text) 18%, var(--td-bg))'],
  ['--td-border-hairline', 'color-mix(in oklab, var(--td-text) 16%, transparent)'],
  ['--td-text-secondary', 'color-mix(in oklab, var(--td-text) 72%, var(--td-bg))'],
  ['--td-text-tertiary', 'color-mix(in oklab, var(--td-text) 52%, var(--td-bg))'],
];

export function useEmbedSurface(): void {
  const { bg, fg } = getEmbedSurface();

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (!bg && !fg) return;

    const root = document.documentElement;
    const applied: string[] = [];
    const set = (name: string, value: string) => {
      root.style.setProperty(name, value);
      applied.push(name);
    };

    if (bg) set('--td-bg', bg);
    if (fg) set('--td-text', fg);
    DERIVED.forEach(([name, value]) => set(name, value));

    return () => applied.forEach((name) => root.style.removeProperty(name));
  }, [bg, fg]);
}
