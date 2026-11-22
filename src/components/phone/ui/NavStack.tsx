import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useMotionValue, useTransform } from 'motion/react';
import { usePan, type PanHandlers } from '../lib/gesture';
import { animateTo, spring } from '../lib/springs';
import { useInSheet } from './sheetContext';
import { Motion } from './Motion';

export interface NavApi {
  push: (page: ReactNode) => void;
  pop: () => void;
  /** 0 on the stack's root page. */
  depth: number;
}

const NavContext = createContext<NavApi>({ push: () => {}, pop: () => {}, depth: 0 });

export function useNav(): NavApi {
  return useContext(NavContext);
}

interface Entry {
  key: number;
  page: ReactNode;
  /** The control that pushed the page, which takes focus back when it pops. */
  opener?: Element | null;
}

/** How far a rightward drag from the edge counts as the edge swipe, in points. */
const EDGE_POINTS = 28;
/** The page underneath sits this share of the width to the left, as UIKit's parallax. */
const PARALLAX = 0.3;
/** A fast flick can carry the spring past either end; the pages stop there. */
const inRange = (p: number) => Math.min(1, Math.max(0, p));

/**
 * A UINavigationController-like stack: pages slide in from the right over a parallaxed,
 * dimmed page, and a rightward swipe (from the edge, or anywhere as iOS 26 allows) pops.
 */
export function NavStack({ root }: { root: ReactNode }) {
  // The root page is drawn from the live `root` prop; pushed pages keep the element they were pushed with.
  const [entries, setEntries] = useState<Entry[]>(() => [{ key: 0, page: null }]);
  // 0: the top page is in place; 1: it is off to the right.
  const progress = useMotionValue(0);
  const topX = useTransform(progress, (p) => `${inRange(p) * 100}%`);
  const belowX = useTransform(progress, (p) => `${(inRange(p) - 1) * PARALLAX * 100}%`);
  const dim = useTransform(progress, (p) => (1 - inRange(p)) * 0.1);
  const busy = useRef(false);
  const nextKey = useRef(1);
  const pendingPush = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef(new Map<number, HTMLDivElement>());
  const inSheet = useInSheet();

  const focusTop = useCallback((list: Entry[]) => {
    pageRefs.current.get(list[list.length - 1].key)?.focus({ preventScroll: true });
  }, []);

  const push = useCallback((page: ReactNode) => {
    if (busy.current) return;
    busy.current = true;
    pendingPush.current = true;
    // A sheet opens to its largest detent when a page is pushed in it, as the app's sheets do.
    inSheet?.expand();
    const opener = document.activeElement;
    setEntries((list) => [...list, { key: nextKey.current++, page, opener }]);
  }, [inSheet]);

  const finishPop = useCallback(() => {
    setEntries((list) => {
      const next = list.slice(0, -1);
      const opener = list[list.length - 1].opener;
      requestAnimationFrame(() => {
        if (opener instanceof HTMLElement && opener.isConnected) opener.focus({ preventScroll: true });
        else focusTop(next);
      });
      return next;
    });
    busy.current = false;
  }, [focusTop]);

  const pop = useCallback(
    (velocity = 0) => {
      if (entries.length < 2) return;
      busy.current = true;
      animateTo(progress, 1, { ...spring('navigation'), velocity, onComplete: finishPop });
    },
    [entries.length, finishPop, progress]
  );

  // The new page is in the tree before its first frame, so it can start off-screen.
  useLayoutEffect(() => {
    if (pendingPush.current) {
      pendingPush.current = false;
      progress.set(1);
      focusTop(entries);
      animateTo(progress, 0, {
        ...spring('navigation'),
        onComplete: () => {
          busy.current = false;
        },
      });
    } else {
      progress.set(0);
    }
  }, [entries, focusTop, progress]);

  const swipe = (fromEdgeOnly: boolean): PanHandlers => ({
    axis: 'x',
    canStart: (info) => {
      const element = rootRef.current;
      if (!element || entries.length < 2 || busy.current || info.dx <= 0) return false;
      if (!fromEdgeOnly) return true;
      const scale = element.getBoundingClientRect().width / element.offsetWidth;
      return (info.startX - element.getBoundingClientRect().left) / scale < EDGE_POINTS;
    },
    onStart: () => {
      busy.current = true;
      progress.stop();
    },
    onMove: (info) => {
      const width = rootRef.current?.getBoundingClientRect().width ?? 1;
      progress.set(Math.min(1, Math.max(0, info.dx / width)));
    },
    onEnd: (info, cancelled) => {
      const width = rootRef.current?.getBoundingClientRect().width ?? 1;
      const velocity = info.vx / width;
      const completes = !cancelled && (velocity > 0.5 || (progress.get() > 0.45 && velocity > -0.2));
      if (completes) {
        animateTo(progress, 1, { ...spring('navigation'), velocity, onComplete: finishPop });
      } else {
        animateTo(progress, 0, {
          ...spring('navigation'),
          velocity,
          onComplete: () => {
            busy.current = false;
          },
        });
      }
    },
  });
  usePan(rootRef, swipe(true), { capture: true });
  usePan(rootRef, swipe(false));

  const count = entries.length;
  const apis = useMemo(
    () => entries.map((_, depth): NavApi => ({ push, pop: () => pop(), depth })),
    [entries, push, pop]
  );

  return (
    <div
      ref={rootRef}
      className="td-ph-nav"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && count > 1 && !event.defaultPrevented) {
          event.preventDefault();
          pop();
        }
      }}
    >
      {entries.map((entry, index) => {
        const isTop = index === count - 1;
        const isBelow = index === count - 2;
        return (
          <Motion
            key={entry.key}
            ref={(element: HTMLDivElement | null) => {
              if (!element) {
                pageRefs.current.delete(entry.key);
                return;
              }
              pageRefs.current.set(entry.key, element);
              element.inert = !isTop;
            }}
            tabIndex={-1}
            className={isTop && count > 1 ? 'td-ph-navpage td-ph-navpage--top' : 'td-ph-navpage'}
            data-hidden={index < count - 2 ? '' : undefined}
            style={{ x: isTop && count > 1 ? topX : isBelow ? belowX : 0 }}
          >
            <NavContext.Provider value={apis[index]}>{index === 0 ? root : entry.page}</NavContext.Provider>
            {isBelow ? <Motion className="td-ph-navdim" style={{ opacity: dim }} /> : null}
          </Motion>
        );
      })}
    </div>
  );
}
