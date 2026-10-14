type GtagFn = (command: string, ...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagFn;
  }
}

/** A shared class table link (`/T/...`) carries a student ID and courses, so it is never tracked. */
function isShareCodePage(): boolean {
  return /^\/t\//i.test(window.location.pathname);
}

export function trackPageView(path: string): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function' || isShareCodePage()) return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

export function trackEvent(name: string, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function' || isShareCodePage()) return;
  window.gtag('event', name, params);
}
