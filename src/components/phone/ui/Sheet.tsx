import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useMotionValue, useTransform } from 'motion/react';
import { phoneScale, usePan } from '../lib/gesture';
import { rubberBand, animateTo, spring } from '../lib/springs';
import {
  InSheetContext,
  PresenterContext,
  type Detent,
  type InSheet,
  type Presenter,
  type SheetOptions,
} from './sheetContext';
import { Motion } from './Motion';

const SCREEN_HEIGHT = 874;
const DETENT_Y: Record<Detent, number> = { large: 64, medium: SCREEN_HEIGHT / 2 };
const CLOSED_Y = SCREEN_HEIGHT;
/** How far a release's velocity carries the sheet before it picks a detent, in seconds. */
const PROJECTION_S = 0.18;

interface Shown {
  key: number;
  content: ReactNode;
  detents: Detent[];
  returnFocus: Element | null;
}

/**
 * Hosts the app's stage and one sheet over it, with detents, drag to dismiss, the dimmed
 * backdrop and the stage stepping back at the large detent.
 */
export function SheetHost({ children }: { children: ReactNode }) {
  const [shown, setShown] = useState<Shown | null>(null);
  const y = useMotionValue(CLOSED_Y);
  const sheetRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const nextKey = useRef(0);
  const dragStart = useRef(0);
  const shownRef = useRef(shown);
  shownRef.current = shown;

  const largest = shown?.detents.includes('large') ? DETENT_Y.large : DETENT_Y.medium;
  const backdrop = useTransform(y, [DETENT_Y.medium, CLOSED_Y], [1, 0]);
  const stageScale = useTransform(y, [DETENT_Y.large, DETENT_Y.medium], [0.92, 1]);
  const stageRadius = useTransform(y, [DETENT_Y.large, DETENT_Y.medium], [40, 0]);
  const stageY = useTransform(y, [DETENT_Y.large, DETENT_Y.medium], [12, 0]);
  const inset = useTransform(y, [DETENT_Y.large, DETENT_Y.medium], [0, 8]);

  const settle = useCallback(
    (target: number, velocity = 0) => {
      animateTo(y, target, {
        ...spring('sheet'),
        velocity,
        onComplete: () => {
          if (target !== CLOSED_Y) return;
          const closing = shownRef.current;
          setShown(null);
          if (closing?.returnFocus instanceof HTMLElement) closing.returnFocus.focus({ preventScroll: true });
        },
      });
    },
    [y]
  );

  const present = useCallback<Presenter['present']>(
    (content, options: SheetOptions = {}) => {
      const detents = options.detents ?? ['medium', 'large'];
      const initial = options.initial ?? detents[0];
      y.set(CLOSED_Y);
      setShown({ key: nextKey.current++, content, detents, returnFocus: document.activeElement });
      requestAnimationFrame(() => {
        sheetRef.current?.focus({ preventScroll: true });
        settle(DETENT_Y[initial]);
      });
    },
    [settle, y]
  );

  const release = useCallback(
    (velocity: number) => {
      const current = shownRef.current;
      if (!current) return;
      const projected = y.get() + velocity * PROJECTION_S;
      const stops = [...current.detents.map((d) => DETENT_Y[d]), CLOSED_Y];
      const target = stops.reduce((best, stop) =>
        Math.abs(stop - projected) < Math.abs(best - projected) ? stop : best
      );
      settle(target, velocity);
    },
    [settle, y]
  );

  const move = useCallback(
    (dy: number) => {
      const next = dragStart.current + dy;
      y.set(next < largest ? largest - rubberBand(largest - next, SCREEN_HEIGHT) : next);
    },
    [largest, y]
  );

  const inSheet = useMemo<InSheet>(
    () => ({
      dismiss: () => settle(CLOSED_Y),
      expand: () => {
        if (shownRef.current?.detents.includes('large')) settle(DETENT_Y.large);
      },
      isAtLargest: () => Math.abs(y.get() - largest) < 1,
      drag: {
        start: () => {
          y.stop();
          dragStart.current = y.get();
        },
        move,
        end: release,
      },
    }),
    [largest, move, release, settle, y]
  );

  usePan(sheetRef, {
    axis: 'y',
    canStart: (info) =>
      info.pointerType !== 'touch' ||
      (info.target instanceof Element && info.target.closest('.td-ph-sheet-grabber, .td-ph-bar') !== null),
    onStart: () => inSheet.drag.start(),
    onMove: (info) => move(info.dy / phoneScale(sheetRef.current!)),
    onEnd: (info) => release(info.vy / phoneScale(sheetRef.current!)),
  }, { enabled: shown !== null });

  useEffect(() => {
    const stage = stageRef.current;
    if (stage) stage.inert = shown !== null;
  }, [shown]);

  return (
    <PresenterContext.Provider value={useMemo(() => ({ present }), [present])}>
      <Motion
        ref={stageRef}
        className="td-ph-stage"
        style={{ scale: stageScale, borderRadius: stageRadius, y: stageY }}
      >
        {children}
      </Motion>
      {shown ? (
        <>
          <Motion className="td-ph-backdrop" style={{ opacity: backdrop }} onClick={() => settle(CLOSED_Y)} />
          <Motion
            ref={sheetRef}
            className="td-ph-sheet"
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
            style={{
              y,
              left: inset,
              right: inset,
              height: SCREEN_HEIGHT - DETENT_Y.large,
              borderRadius: 38,
            }}
            onKeyDown={(event) => {
              if (event.key === 'Escape' && !event.defaultPrevented) {
                event.preventDefault();
                settle(CLOSED_Y);
              }
            }}
          >
            {shown.detents.length > 1 ? <div className="td-ph-sheet-grabber" aria-hidden="true" /> : null}
            <InSheetContext.Provider key={shown.key} value={inSheet}>
              {shown.content}
            </InSheetContext.Provider>
          </Motion>
        </>
      ) : null}
    </PresenterContext.Provider>
  );
}
