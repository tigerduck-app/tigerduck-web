/**
 * Tiny pushState router for a handful of pages.
 * No dependencies. Listens to popstate plus a custom 'td:navigate' event
 * so in-app Link clicks don't trigger a full page load.
 */

const NAV_EVENT = 'td:navigate';

export function getPath(): string {
  if (typeof window === 'undefined') return '/';
  const raw = window.location.pathname || '/';
  // Drop trailing slashes so '/tigersync/' and '/tigersync' are one route.
  // Native WebViews sometimes append one to the URL they load.
  if (raw.length <= 1) return raw;
  return raw.replace(/\/+$/, '') || '/';
}

/**
 * Segment match for nested routes, e.g.
 *   matchSegment('/help/receive-mail/android', '/help/receive-mail') -> 'android'
 *   matchSegment('/help/receive-mail', '/help/receive-mail')         -> ''
 *   matchSegment('/help/receive-mail/a/b', '/help/receive-mail')     -> null
 *   matchSegment('/tigersync', '/help/receive-mail')                 -> null
 *   matchSegment('/help/receive-mail/%', '/help/receive-mail')       -> null
 * Returns null when the prefix doesn't match or more than one segment follows,
 * so callers can fall through to their usual not-found handling.
 */
export function matchSegment(path: string, prefix: string): string | null {
  if (path === prefix) return '';
  if (!path.startsWith(`${prefix}/`)) return null;
  const rest = path.slice(prefix.length + 1);
  if (rest === '' || rest.includes('/')) return null;
  try {
    return decodeURIComponent(rest);
  } catch {
    // A malformed percent-escape ('/help/receive-mail/%') is not a route we
    // serve, and this runs during render — fall through to the caller's
    // not-found handling instead of throwing and blanking the whole SPA.
    return null;
  }
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
