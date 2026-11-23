import { createContext, createElement, useCallback, useContext, useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';

export type Axis = 'x' | 'y';

export interface PanInfo {
  dx: number;
  dy: number;
  /** Pixels per second over the last few samples. */
  vx: number;
  vy: number;
  startX: number;
  startY: number;
  pointerType: string;
  /** What the pointer went down on. */
  target: EventTarget | null;
}

export interface PanHandlers {
  axis: Axis;
  /** Asked once the pointer has moved along `axis`; false hands the drag to the next candidate. */
  canStart?: (info: PanInfo) => boolean;
  onStart?: (info: PanInfo) => void;
  onMove: (info: PanInfo) => void;
  onEnd: (info: PanInfo, cancelled: boolean) => void;
  /** Pointer types this pan answers; every type by default. */
  pointerTypes?: readonly string[];
}

interface Sample {
  x: number;
  y: number;
  t: number;
}

interface Tracked {
  candidates: PanHandlers[];
  samples: Sample[];
  pointerType: string;
  target: EventTarget | null;
  owner: PanHandlers | null;
  unclaimed: boolean;
}

const SLOP_PX = 6;
const VELOCITY_WINDOW_MS = 90;
/** One phone's pointers: the pans each went down in, and until when a click is dropped. */
interface Gestures {
  tracked: Map<number, Tracked>;
  swallowClickUntil: number;
}

function info(entry: Tracked): PanInfo {
  const first = entry.samples[0];
  const last = entry.samples[entry.samples.length - 1];
  const recent = entry.samples.filter((s) => last.t - s.t <= VELOCITY_WINDOW_MS);
  const from = recent[0] ?? last;
  const dt = Math.max(1, last.t - from.t);
  return {
    dx: last.x - first.x,
    dy: last.y - first.y,
    vx: ((last.x - from.x) / dt) * 1000,
    vy: ((last.y - from.y) / dt) * 1000,
    startX: first.x,
    startY: first.y,
    pointerType: entry.pointerType,
    target: entry.target,
  };
}

function onMove({ tracked }: Gestures, event: PointerEvent) {
  const entry = tracked.get(event.pointerId);
  if (!entry || entry.unclaimed) return;
  entry.samples.push({ x: event.clientX, y: event.clientY, t: event.timeStamp });
  if (entry.samples.length > 24) entry.samples.splice(1, entry.samples.length - 24);
  const now = info(entry);
  if (!entry.owner) {
    if (Math.hypot(now.dx, now.dy) < SLOP_PX) return;
    const axis: Axis = Math.abs(now.dx) > Math.abs(now.dy) ? 'x' : 'y';
    entry.owner =
      entry.candidates.find((c) => c.axis === axis && (c.canStart?.(now) ?? true)) ?? null;
    if (!entry.owner) {
      entry.unclaimed = true;
      return;
    }
    entry.owner.onStart?.(now);
  }
  if (event.cancelable) event.preventDefault();
  entry.owner.onMove(now);
}

function onEnd(gestures: Gestures, event: PointerEvent) {
  const entry = gestures.tracked.get(event.pointerId);
  if (!entry) return;
  gestures.tracked.delete(event.pointerId);
  if (!entry.owner) return;
  // The click that follows a drag must not also tap whatever is under the pointer.
  gestures.swallowClickUntil = event.timeStamp + 400;
  entry.owner.onEnd(info(entry), event.type === 'pointercancel');
}

function onClick(gestures: Gestures, event: MouseEvent) {
  if (event.timeStamp > gestures.swallowClickUntil) return;
  gestures.swallowClickUntil = 0;
  event.preventDefault();
  event.stopPropagation();
}

const GestureContext = createContext<Gestures | null>(null);

/** Tracks the pointers of the phone inside it, which follow a drag past its edges. */
export function GestureScope({ children }: { children: ReactNode }) {
  const [gestures] = useState<Gestures>(() => ({ tracked: new Map(), swallowClickUntil: 0 }));
  useEffect(() => {
    const move = (event: PointerEvent) => onMove(gestures, event);
    const end = (event: PointerEvent) => onEnd(gestures, event);
    const click = (event: MouseEvent) => onClick(gestures, event);
    window.addEventListener('pointermove', move, { passive: false });
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
    window.addEventListener('click', click, true);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
      window.removeEventListener('click', click, true);
    };
  }, [gestures]);
  return createElement(GestureContext.Provider, { value: gestures }, children);
}

function useGestures(): Gestures {
  const gestures = useContext(GestureContext);
  if (!gestures) throw new Error('usePan needs a GestureScope above it');
  return gestures;
}

/** Drops the click that ends the tap `event` starts, as a tap that only closes something. */
export function useSwallowNextClick(): (event: Event) => void {
  const gestures = useGestures();
  return useCallback((event) => {
    gestures.swallowClickUntil = event.timeStamp + 1000;
  }, [gestures]);
}

/**
 * Offers a drag on `ref` to `handlers`. Every pan the pointer went down in is a candidate; the
 * first one on the axis the pointer moves along that accepts it takes the whole drag. Candidates
 * registered with `capture` go first (outermost first), then the rest, innermost first.
 */
export function usePan(
  ref: RefObject<HTMLElement | null>,
  handlers: PanHandlers,
  options: { capture?: boolean; enabled?: boolean } = {}
): void {
  const latest = useRef(handlers);
  latest.current = handlers;
  const { capture = false, enabled = true } = options;
  const { tracked } = useGestures();

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;
    const proxy: PanHandlers = {
      get axis() {
        return latest.current.axis;
      },
      canStart: (i) => latest.current.canStart?.(i) ?? true,
      onStart: (i) => latest.current.onStart?.(i),
      onMove: (i) => latest.current.onMove(i),
      onEnd: (i, c) => latest.current.onEnd(i, c),
    };
    const down = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      const types = latest.current.pointerTypes;
      if (types && !types.includes(event.pointerType)) return;
      let entry = tracked.get(event.pointerId);
      if (!entry || entry.owner || entry.samples[0].t !== event.timeStamp) {
        entry = {
          candidates: [],
          samples: [{ x: event.clientX, y: event.clientY, t: event.timeStamp }],
          pointerType: event.pointerType,
          target: event.target,
          owner: null,
          unclaimed: false,
        };
        tracked.set(event.pointerId, entry);
      }
      entry.candidates.push(proxy);
    };
    element.addEventListener('pointerdown', down, { capture });
    return () => element.removeEventListener('pointerdown', down, { capture });
  }, [ref, capture, enabled, tracked]);
}

/** Screen pixels per phone point: the device is drawn at 402 points wide and scaled to fit. */
export function phoneScale(element: HTMLElement): number {
  return element.offsetWidth ? element.getBoundingClientRect().width / element.offsetWidth : 1;
}
