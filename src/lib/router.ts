/**
 * Tiny pushState router for a 3-page SPA.
 * No dependencies. Listens to popstate plus a custom 'td:navigate' event
 * so in-app Link clicks don't trigger a full page load.
 */

const NAV_EVENT = 'td:navigate';

export function getPath(): string {
  if (typeof window === 'undefined') return '/';
  return window.location.pathname || '/';
}

export function navigate(to: string, opts: { replace?: boolean } = {}): void {
  if (typeof window === 'undefined') return;
  const current = window.location.pathname + window.location.search + window.location.hash;
  if (current === to) return;
  if (opts.replace) {
    window.history.replaceState({}, '', to);
  } else {
    window.history.pushState({}, '', to);
  }
  window.dispatchEvent(new Event(NAV_EVENT));
}

export function subscribe(cb: () => void): () => void {
  window.addEventListener('popstate', cb);
  window.addEventListener(NAV_EVENT, cb);
  return () => {
    window.removeEventListener('popstate', cb);
    window.removeEventListener(NAV_EVENT, cb);
  };
}
