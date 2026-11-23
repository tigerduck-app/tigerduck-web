import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useMotionValue, useTransform, type MotionValue } from 'motion/react';
import { usePhoneLocale } from '../lib/i18n';
import { phoneScale, usePan } from '../lib/gesture';
import { animateTo, decay, prefersReducedMotion, rubberBand, spring } from '../lib/springs';
import { useNav } from './NavStack';
import { useInSheet } from './sheetContext';
import { GlassButton } from './controls';
import { Motion } from './Motion';

/**
 * `large`: iOS's large title, collapsing into the bar's inline title.
 * `bar`: the app's title bar, a 22-point heading on the bar's row beside its controls, as each
 * tab's page and the features More opens.
 * `inline`: a centred title on the bar's row, as the app's sheets and Moodle lists.
 */
export type TitleMode = 'large' | 'bar' | 'inline';

interface PageProps {
  title: string;
  titleMode?: TitleMode;
  /** Controls at the trailing end of the bar. */
  trailing?: ReactNode;
  /** Replaces the back or close button, as a compose sheet's Cancel. */
  leading?: ReactNode;
  /** Floats over the page, such as the mail list's compose button. */
  overlay?: ReactNode;
  onRefresh?: () => Promise<void>;
  children: ReactNode;
}

/** Pull distance that starts a refresh, and where the list rests while it runs. */
const REFRESH_AT = 92;
const REFRESH_REST = 58;
const SCREEN_HEIGHT = 874;
/** Scroll offset by which the large title has passed under the bar. */
const LARGE_TITLE_END = 44;

export function Page({ title, titleMode = 'large', leading, trailing, overlay, onRefresh, children }: PageProps) {
  const { t } = usePhoneLocale();
  const nav = useNav();
  const inSheet = useInSheet();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollY = useMotionValue(0);
  const pull = useMotionValue(0);
  const [refreshing, setRefreshing] = useState(false);
  const refreshingRef = useRef(false);
  const onRefreshRef = useRef(onRefresh);
  onRefreshRef.current = onRefresh;

  const inlineOpacity = useTransform(scrollY, [LARGE_TITLE_END - 14, LARGE_TITLE_END], [0, 1]);
  const barOpacity = useTransform(scrollY, [0, 12], [0, 1]);
  const largeScale = useTransform(pull, [0, 200], [1, 1.12], { clamp: true });

  const startRefresh = async () => {
    const refresh = onRefreshRef.current;
    if (!refresh || refreshingRef.current) return;
    refreshingRef.current = true;
    setRefreshing(true);
    animateTo(pull, REFRESH_REST, spring('rubber'));
    await refresh();
    refreshingRef.current = false;
    setRefreshing(false);
    animateTo(pull, 0, spring('rubber'));
  };

  const releasePull = (velocity: number) => {
    if (onRefreshRef.current && pull.get() >= REFRESH_AT) {
      void startRefresh();
      return;
    }
    animateTo(pull, refreshingRef.current ? REFRESH_REST : 0, { ...spring('rubber'), velocity });
  };

  /** Puts a scroll offset that may run past either end onto the scroller and the pull. */
  const place = (offset: number) => {
    const scroller = scrollerRef.current!;
    const max = scroller.scrollHeight - scroller.clientHeight;
    const rest = refreshingRef.current ? REFRESH_REST : 0;
    if (offset < 0) {
      scroller.scrollTop = 0;
      pull.set(rest + rubberBand(-offset, SCREEN_HEIGHT));
    } else if (offset > max) {
      scroller.scrollTop = max;
      pull.set(-rubberBand(offset - max, SCREEN_HEIGHT));
    } else {
      scroller.scrollTop = offset;
      pull.set(rest);
    }
  };

  // A mouse drags the content as a finger would, with momentum and the rubber band.
  const virtual = useMotionValue(0);
  const dragFrom = useRef(0);
  usePan(
    scrollerRef,
    {
      axis: 'y',
      pointerTypes: ['mouse', 'pen'],
      canStart: (info) => {
        const scroller = scrollerRef.current!;
        if (!inSheet) return true;
        const atTop = scroller.scrollTop <= 0;
        // At the top of a sheet's content, a pull down moves the sheet; at a smaller detent,
        // a push up grows it first.
        if (atTop && info.dy > 0) return false;
        return inSheet.isAtLargest() || info.dy > 0;
      },
      onStart: () => {
        virtual.stop();
        pull.stop();
        dragFrom.current = scrollerRef.current!.scrollTop - Math.max(0, pull.get());
      },
      onMove: (info) => place(dragFrom.current - info.dy / phoneScale(scrollerRef.current!)),
      onEnd: (info) => {
        const scroller = scrollerRef.current!;
        const velocity = -info.vy / phoneScale(scroller);
        if (pull.get() > 0.5 || pull.get() < -0.5) {
          releasePull(pull.get() > 0 ? 0 : velocity);
          return;
        }
        if (prefersReducedMotion() || Math.abs(velocity) < 60) return;
        virtual.set(scroller.scrollTop);
        decay(virtual, {
          velocity,
          power: 0.5,
          timeConstant: 500,
          min: 0,
          max: scroller.scrollHeight - scroller.clientHeight,
          bounceStiffness: 320,
          bounceDamping: 36,
          restDelta: 0.5,
        });
      },
    }
  );
  useEffect(() => virtual.on('change', (value) => place(value)), [virtual]);

  // A finger scrolls natively; at the top, a pull down refreshes or moves the sheet.
  useEffect(() => {
    const scroller = scrollerRef.current!;
    let startY: number | null = null;
    let pulling = false;
    let lastY = 0;
    let lastT = 0;
    let velocity = 0;
    const onStart = (event: TouchEvent) => {
      virtual.stop();
      startY = scroller.scrollTop <= 0 ? event.touches[0].clientY : null;
      pulling = false;
    };
    const onMove = (event: TouchEvent) => {
      if (startY === null || (!onRefreshRef.current && !inSheet)) return;
      const y = event.touches[0].clientY;
      const dy = (y - startY) / phoneScale(scroller);
      if (!pulling) {
        if (dy <= 2 || scroller.scrollTop > 0) {
          if (dy < -2) startY = null;
          return;
        }
        pulling = true;
        if (inSheet) inSheet.drag.start();
      }
      if (event.cancelable) event.preventDefault();
      const now = event.timeStamp;
      if (now > lastT) velocity = ((y - lastY) / (now - lastT)) * 1000;
      lastY = y;
      lastT = now;
      if (inSheet) inSheet.drag.move(Math.max(0, dy));
      else pull.set(rubberBand(Math.max(0, dy), SCREEN_HEIGHT));
    };
    const onEnd = () => {
      if (pulling) {
        if (inSheet) inSheet.drag.end(velocity / phoneScale(scroller));
        else releasePull(0);
      }
      startY = null;
      pulling = false;
    };
    scroller.addEventListener('touchstart', onStart, { passive: true });
    scroller.addEventListener('touchmove', onMove, { passive: false });
    scroller.addEventListener('touchend', onEnd);
    scroller.addEventListener('touchcancel', onEnd);
    scroller.addEventListener('wheel', () => virtual.stop(), { passive: true });
    return () => {
      scroller.removeEventListener('touchstart', onStart);
      scroller.removeEventListener('touchmove', onMove);
      scroller.removeEventListener('touchend', onEnd);
      scroller.removeEventListener('touchcancel', onEnd);
    };
  }, [inSheet, pull, virtual]);

  const showsBack = !leading && nav.depth > 0;
  const showsClose = !leading && inSheet !== null && !showsBack;
  const heading =
    titleMode === 'large' ? (
      <Motion className="td-ph-large-title" role="heading" aria-level={1} style={{ scale: largeScale }}>
        {title}
      </Motion>
    ) : null;

  return (
    <div className={inSheet ? 'td-ph-page td-ph-page--sheet' : 'td-ph-page'}>
      <div
        ref={scrollerRef}
        className="td-ph-scroller"
        onScroll={(event) => scrollY.set(event.currentTarget.scrollTop)}
      >
        {onRefresh ? <RefreshSpinner pull={pull} spinning={refreshing} inSheet={inSheet !== null} /> : null}
        <Motion className="td-ph-content" style={{ y: pull }}>
          {heading}
          {children}
        </Motion>
      </div>
      <div className="td-ph-bar">
        <Motion className="td-ph-bar-bg" style={{ opacity: barOpacity }} />
        {leading}
        {showsBack ? <GlassButton icon="back" label={t('action_back')} onClick={nav.pop} /> : null}
        {titleMode === 'bar' ? (
          <span className="td-ph-bar-heading" role="heading" aria-level={1}>
            {title}
          </span>
        ) : titleMode === 'inline' ? (
          <span className="td-ph-bar-title" role="heading" aria-level={1}>
            {title}
          </span>
        ) : (
          <Motion as="span" className="td-ph-bar-title" style={{ opacity: inlineOpacity }} aria-hidden="true">
            {title}
          </Motion>
        )}
        <span className="td-ph-bar-spacer" />
        <span className="td-ph-bar-tools">{trailing}</span>
        {showsClose ? <GlassButton icon="close" label={t('action_close')} onClick={inSheet.dismiss} /> : null}
      </div>
      {overlay}
    </div>
  );
}

function RefreshSpinner({ pull, spinning, inSheet }: { pull: MotionValue<number>; spinning: boolean; inSheet: boolean }) {
  const opacity = useTransform(pull, [12, REFRESH_AT * 0.6], [0, 1]);
  const y = useTransform(pull, (p) => Math.max(0, p / 2 - 15) - (inSheet ? 48 : 0));
  const rotate = useTransform(pull, [0, REFRESH_AT], [-90, 0]);
  return (
    <Motion
      className={spinning ? 'td-ph-refresh td-ph-refresh--spinning' : 'td-ph-refresh'}
      style={{ opacity, y, rotate: spinning ? undefined : rotate }}
      aria-hidden="true"
    >
      {Array.from({ length: 8 }, (_, i) => (
        <span key={i} style={{ transform: `rotate(${i * 45}deg)`, opacity: 1 - i * 0.1 }} />
      ))}
    </Motion>
  );
}
