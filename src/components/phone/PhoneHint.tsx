import { useEffect, useRef, type RefObject } from 'react';

interface Point {
  x: number;
  y: number;
}

const WIDE_MS = 3000;
const TAP_MS = 1600;
const START_DELAY_MS = 400;
const REPEAT_GAP_MS = 1200;
/** The share of the phone, or of a viewport shorter than it, that must be on screen to play. */
const SHOWN_RATIO = 0.6;
const TARGET_POLL_MS = 150;
const TARGET_POLL_LIMIT = 40;
const EASE = 'cubic-bezier(0.45, 0.05, 0.3, 1)';

function centre(element: Element, host: DOMRect): Point {
  const box = element.getBoundingClientRect();
  return { x: box.left + box.width / 2 - host.left, y: box.top + box.height / 2 - host.top };
}

function at(point: Point, scale: number): string {
  return `translate(${point.x}px, ${point.y}px) scale(${scale})`;
}

/** A tap on `target`, then, when there is a row, a swipe across it, as Simulator draws a touch. */
function play(layer: HTMLElement, host: HTMLElement, target: Element, row: Element | null): Animation[] {
  const dot = layer.querySelector<HTMLElement>('.td-phone-hint-dot')!;
  const ripple = layer.querySelector<HTMLElement>('.td-phone-hint-ripple')!;
  const trail = layer.querySelector<HTMLElement>('.td-phone-hint-trail')!;
  const box = host.getBoundingClientRect();
  const start = { x: box.width / 2, y: box.height * 0.62 };
  const tap = centre(target, box);
  ripple.style.left = `${tap.x}px`;
  ripple.style.top = `${tap.y}px`;

  if (!row) {
    return [
      dot.animate(
        [
          { offset: 0, transform: at(start, 1.25), opacity: 0, easing: EASE },
          { offset: 0.15, transform: at(start, 1), opacity: 1, easing: EASE },
          { offset: 0.5, transform: at(tap, 1) },
          { offset: 0.58, transform: at(tap, 0.78) },
          { offset: 0.68, transform: at(tap, 1), opacity: 1 },
          { offset: 1, transform: at(tap, 1), opacity: 0 },
        ],
        { duration: TAP_MS, fill: 'forwards' }
      ),
      ripple.animate(
        [
          { offset: 0, opacity: 0, transform: 'scale(1)' },
          { offset: 0.57, opacity: 0, transform: 'scale(1)' },
          { offset: 0.58, opacity: 0.7, transform: 'scale(1)' },
          { offset: 0.85, opacity: 0, transform: 'scale(2.6)' },
          { offset: 1, opacity: 0, transform: 'scale(2.6)' },
        ],
        { duration: TAP_MS, fill: 'forwards', easing: 'ease-out' }
      ),
    ];
  }

  const rowBox = row.getBoundingClientRect();
  const from = { x: rowBox.right - rowBox.width * 0.15 - box.left, y: rowBox.top + rowBox.height / 2 - box.top };
  const to = { x: from.x - rowBox.width * 0.5, y: from.y };
  trail.style.left = `${to.x}px`;
  trail.style.top = `${to.y}px`;
  trail.style.width = `${from.x - to.x}px`;
  return [
    dot.animate(
      [
        { offset: 0, transform: at(start, 1.25), opacity: 0, easing: EASE },
        { offset: 0.08, transform: at(start, 1), opacity: 1, easing: EASE },
        { offset: 0.27, transform: at(tap, 1) },
        { offset: 0.31, transform: at(tap, 0.78) },
        { offset: 0.36, transform: at(tap, 1), easing: EASE },
        { offset: 0.55, transform: at(from, 1) },
        { offset: 0.6, transform: at(from, 0.82), easing: EASE },
        { offset: 0.84, transform: at(to, 0.82), opacity: 1 },
        { offset: 0.9, transform: at(to, 1), opacity: 1 },
        { offset: 1, transform: at(to, 1), opacity: 0 },
      ],
      { duration: WIDE_MS, fill: 'forwards' }
    ),
    ripple.animate(
      [
        { offset: 0, opacity: 0, transform: 'scale(1)' },
        { offset: 0.3, opacity: 0, transform: 'scale(1)' },
        { offset: 0.31, opacity: 0.7, transform: 'scale(1)' },
        { offset: 0.48, opacity: 0, transform: 'scale(2.6)' },
        { offset: 1, opacity: 0, transform: 'scale(2.6)' },
      ],
      { duration: WIDE_MS, fill: 'forwards', easing: 'ease-out' }
    ),
    trail.animate(
      [
        { offset: 0, transform: 'scaleX(0)', opacity: 1 },
        { offset: 0.6, transform: 'scaleX(0)', opacity: 1, easing: EASE },
        { offset: 0.84, transform: 'scaleX(1)', opacity: 1 },
        { offset: 0.96, transform: 'scaleX(1)', opacity: 0 },
        { offset: 1, transform: 'scaleX(1)', opacity: 0 },
      ],
      { duration: WIDE_MS, fill: 'forwards' }
    ),
  ];
}

/**
 * Shows a touch tapping the Class Table tab and swiping an assignment row, again and again while
 * the phone is mostly on screen; on a narrow screen it taps the button that opens the phone. It
 * stops as soon as `active` turns false, which the visitor's first touch or focus does.
 */
export function PhoneHint({ hostRef, preview, active }: { hostRef: RefObject<HTMLDivElement>; preview: boolean; active: boolean }) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const layer = layerRef.current;
    if (!active || !host || !layer) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let animations: Animation[] = [];
    let timer = 0;
    let tries = 0;
    let shown = false;
    let pending = false;
    const schedule = (delay: number) => {
      if (pending) return;
      pending = true;
      timer = window.setTimeout(attempt, delay);
    };
    const find = () => {
      if (preview) return { target: host.querySelector('.td-phone-open-badge'), row: null };
      const target = host.querySelectorAll('.td-ph-tabbar [role="tab"]')[1] ?? null;
      const row = host.querySelector('.td-ph-tab:not([hidden]) .td-ph-swipe-face');
      return { target, row };
    };
    const attempt = () => {
      const { target, row } = find();
      if (!target) {
        if (++tries < TARGET_POLL_LIMIT) timer = window.setTimeout(attempt, TARGET_POLL_MS);
        else pending = false;
        return;
      }
      animations = play(layer, host, target, row);
      // A cancelled animation rejects `finished`, which ends the loop.
      Promise.all(animations.map((animation) => animation.finished)).then(
        () => {
          pending = false;
          if (shown) schedule(REPEAT_GAP_MS);
        },
        () => {}
      );
    };
    // An observer also reports every change of isIntersecting, below its thresholds too.
    const mostlyShown = (entry: IntersectionObserverEntry) =>
      entry.intersectionRatio >= SHOWN_RATIO || entry.intersectionRect.height >= window.innerHeight * SHOWN_RATIO;
    const observer = new IntersectionObserver(
      (entries) => {
        shown = mostlyShown(entries[entries.length - 1]);
        if (shown) schedule(START_DELAY_MS);
      },
      { threshold: [0, 0.2, 0.4, SHOWN_RATIO, 0.8, 1] }
    );
    observer.observe(host);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      animations.forEach((animation) => animation.cancel());
    };
  }, [hostRef, preview, active]);

  return (
    <div ref={layerRef} className="td-phone-hint" aria-hidden="true">
      <span className="td-phone-hint-trail" />
      <span className="td-phone-hint-ripple" />
      <span className="td-phone-hint-dot" />
    </div>
  );
}
