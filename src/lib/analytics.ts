type GtagCommand = 'config' | 'event' | 'set' | 'consent' | 'js';
type GtagFn = (command: GtagCommand, ...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagFn;
  }
}

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() ?? '';
const ENABLED = MEASUREMENT_ID.length > 0 && typeof window !== 'undefined';

let loaded = false;

export function loadGA(): void {
  if (!ENABLED || loaded) return;
  loaded = true;

  window.dataLayer = window.dataLayer ?? [];
  const gtag: GtagFn = function (...args: unknown[]) {
    window.dataLayer!.push(args);
  } as GtagFn;
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', MEASUREMENT_ID, {
    send_page_view: false,
    anonymize_ip: true,
    allow_ad_personalization_signals: false,
  });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

export function trackPageView(path: string): void {
  if (!ENABLED || !window.gtag) return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

export function trackEvent(name: string, params: Record<string, unknown> = {}): void {
  if (!ENABLED || !window.gtag) return;
  window.gtag('event', name, params);
}
