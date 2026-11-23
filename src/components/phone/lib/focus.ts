import type { KeyboardEvent } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Keeps Tab and Shift+Tab inside a modal surface, a sheet, a menu or a confirmation: only the
 * phone behind it is inert, so the browser would move focus on to the site around the phone.
 * Returns true when it took the key.
 */
export function trapTab(event: KeyboardEvent, container: HTMLElement): boolean {
  if (event.key !== 'Tab') return false;
  event.preventDefault();
  const stops = [...container.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    (el) => !el.closest('[inert]') && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden'
  );
  if (stops.length === 0) return true;
  const at = stops.indexOf(document.activeElement as HTMLElement);
  const step = event.shiftKey ? -1 : 1;
  const next = at === -1 ? (event.shiftKey ? stops.length - 1 : 0) : (at + step + stops.length) % stops.length;
  stops[next].focus();
  return true;
}
