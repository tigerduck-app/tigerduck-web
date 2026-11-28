export type Platform = 'ios' | 'android' | 'mac' | 'desktop';

export function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent || '';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  // iPadOS Safari presents itself as a Mac; only the iPad has a touch screen.
  if (/Macintosh/i.test(ua)) return navigator.maxTouchPoints > 1 ? 'ios' : 'mac';
  return 'desktop';
}
