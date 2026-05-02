import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocale } from '@/hooks/useLocale';
import { tFor } from '@/lib/messages';

type SlideKey =
  | 'home'
  | 'homeworks'
  | 'classtable'
  | 'calendar'
  | 'announcement'
  | 'library'
  | 'grades'
  | 'customize';

interface SlideShape {
  src: string;
  key: SlideKey;
}

const slides: SlideShape[] = [
  { src: '/screenshots/hero.png', key: 'home' },
  { src: '/screenshots/homeworks.png', key: 'homeworks' },
  { src: '/screenshots/classtable.png', key: 'classtable' },
  { src: '/screenshots/calendar.png', key: 'calendar' },
  { src: '/screenshots/announcement.png', key: 'announcement' },
  { src: '/screenshots/library.png', key: 'library' },
  { src: '/screenshots/grades.png', key: 'grades' },
  { src: '/screenshots/customize.png', key: 'customize' },
];

const AUTO_INTERVAL_MS = 4200;
const RESUME_AFTER_INTERACTION_MS = 6000;
const SWIPE_THRESHOLD_PX = 48;
const LOCK_THRESHOLD_PX = 6;

export function HeroCarousel() {
  const { locale } = useLocale();
  const messages = tFor(locale).hero;
  const total = slides.length;
  const [idx, setIdx] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [pointerActive, setPointerActive] = useState(false);
  const [paused, setPaused] = useState(false);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const pointerStartXRef = useRef(0);
  const pointerStartYRef = useRef(0);
  const pointerIdRef = useRef<number | null>(null);
  const horizontalLockedRef = useRef<'h' | 'v' | null>(null);
  const slideWidthRef = useRef(0);
  const dragOffsetRef = useRef(0);
  const resumeTimerRef = useRef<number | null>(null);

  const goTo = useCallback(
    (n: number) => {
      setIdx(((n % total) + total) % total);
    },
    [total]
  );

  const next = useCallback(() => goTo(idx + 1), [goTo, idx]);
  const prev = useCallback(() => goTo(idx - 1), [goTo, idx]);

  useEffect(() => {
    if (paused || isDragging) return;
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % total);
    }, AUTO_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused, isDragging, total]);

  const scheduleResume = useCallback(() => {
    if (resumeTimerRef.current !== null) {
      window.clearTimeout(resumeTimerRef.current);
    }
    resumeTimerRef.current = window.setTimeout(() => {
      setPaused(false);
      resumeTimerRef.current = null;
    }, RESUME_AFTER_INTERACTION_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current !== null) {
        window.clearTimeout(resumeTimerRef.current);
      }
    };
  }, []);

  const endDrag = useCallback(() => {
    if (pointerIdRef.current === null) return;
    pointerIdRef.current = null;

    const dx = dragOffsetRef.current;
    dragOffsetRef.current = 0;
    const wasHorizontal = horizontalLockedRef.current === 'h';
    horizontalLockedRef.current = null;

    setPointerActive(false);
    setIsDragging(false);
    setDragOffset(0);

    if (wasHorizontal && Math.abs(dx) > SWIPE_THRESHOLD_PX) {
      const step = dx < 0 ? 1 : -1;
      setIdx((i) => (((i + step) % total) + total) % total);
    }
    scheduleResume();
  }, [scheduleResume, total]);

  // Window-level listeners ensure release is detected even if the pointer
  // leaves the viewport (or the document) before being released.
  useEffect(() => {
    if (!pointerActive) return;

    const matches = (e: PointerEvent) =>
      pointerIdRef.current !== null && e.pointerId === pointerIdRef.current;

    const onMove = (e: PointerEvent) => {
      if (!matches(e)) return;
      const dx = e.clientX - pointerStartXRef.current;
      const dy = e.clientY - pointerStartYRef.current;

      if (horizontalLockedRef.current === null) {
        if (Math.abs(dx) < LOCK_THRESHOLD_PX && Math.abs(dy) < LOCK_THRESHOLD_PX) return;
        horizontalLockedRef.current = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
      }
      if (horizontalLockedRef.current !== 'h') return;

      if (e.cancelable) e.preventDefault();
      setIsDragging(true);
      dragOffsetRef.current = dx;
      setDragOffset(dx);
    };

    const onEnd = (e: PointerEvent) => {
      if (!matches(e)) return;
      endDrag();
    };

    const onBlur = () => endDrag();

    window.addEventListener('pointermove', onMove, { passive: false });
    window.addEventListener('pointerup', onEnd);
    window.addEventListener('pointercancel', onEnd);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onEnd);
      window.removeEventListener('pointercancel', onEnd);
      window.removeEventListener('blur', onBlur);
    };
  }, [pointerActive, endDrag]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (pointerIdRef.current !== null) return;
    pointerIdRef.current = e.pointerId;
    pointerStartXRef.current = e.clientX;
    pointerStartYRef.current = e.clientY;
    horizontalLockedRef.current = null;
    slideWidthRef.current = trackRef.current?.getBoundingClientRect().width ?? 0;
    dragOffsetRef.current = 0;
    setPaused(true);
    setPointerActive(true);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
      setPaused(true);
      scheduleResume();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
      setPaused(true);
      scheduleResume();
    }
  };

  const slideWidth = slideWidthRef.current || 1;
  const offsetPct = -idx * 100 + (isDragging ? (dragOffset / slideWidth) * 100 : 0);

  return (
    <div
      className="td-hero-carousel"
      role="group"
      aria-roledescription="carousel"
      aria-label={messages.carouselAriaLabel}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        if (!pointerActive) setPaused(false);
      }}
    >
      <div
        ref={trackRef}
        className="td-hero-carousel-viewport"
        onPointerDown={onPointerDown}
      >
        <div
          className={`td-hero-carousel-track${isDragging ? ' is-dragging' : ''}`}
          style={{ transform: `translate3d(${offsetPct}%, 0, 0)` }}
        >
          {slides.map((s, i) => (
            <div
              key={s.src}
              className="td-hero-carousel-slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${total}`}
              aria-hidden={i === idx ? undefined : true}
            >
              <img
                src={s.src}
                alt={i === idx ? messages.alts[s.key] : ''}
                className="td-hero-image"
                width={1419}
                height={2796}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                fetchPriority={i === 0 ? 'high' : 'auto'}
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="td-hero-carousel-dots" role="tablist" aria-label={messages.dotsAriaLabel}>
        {slides.map((s, i) => (
          <button
            key={s.src}
            type="button"
            role="tab"
            aria-selected={i === idx}
            aria-label={messages.slideAriaLabel(i + 1, messages.alts[s.key])}
            className={`td-hero-carousel-dot${i === idx ? ' is-active' : ''}`}
            onClick={() => {
              goTo(i);
              setPaused(true);
              scheduleResume();
            }}
          />
        ))}
      </div>
    </div>
  );
}
