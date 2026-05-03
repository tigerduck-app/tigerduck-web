import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocale } from '@/hooks/useLocale';
import { tFor } from '@/lib/messages';

const screenshots = [
  '/screenshots/homeworks.png',
  '/screenshots/classtable.png',
  '/screenshots/calendar.png',
  '/screenshots/announcement.png',
  '/screenshots/library.png',
  '/screenshots/grades.png',
  '/screenshots/customize.png',
];

const SWIPE_THRESHOLD_PX = 48;
const LOCK_THRESHOLD_PX = 6;
const MAX_BLUR_PX = 6;
const MIN_OPACITY = 0.35;
const VISIBLE_RANGE = 1.5;

function shortestDelta(i: number, idx: number, total: number): number {
  let delta = i - idx;
  const half = total / 2;
  if (delta > half) delta -= total;
  else if (delta < -half) delta += total;
  return delta;
}

export function FeaturesSection() {
  const { locale } = useLocale();
  const messages = tFor(locale).features;
  const features = messages.items;
  const total = features.length;
  const [idx, setIdx] = useState(0);
  const f = features[idx % total];

  const go = (n: number) => setIdx((n + total) % total);

  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [pointerActive, setPointerActive] = useState(false);

  const stackRef = useRef<HTMLDivElement | null>(null);
  const pointerStartXRef = useRef(0);
  const pointerStartYRef = useRef(0);
  const pointerIdRef = useRef<number | null>(null);
  const horizontalLockedRef = useRef<'h' | 'v' | null>(null);
  const slideWidthRef = useRef(0);
  const dragOffsetRef = useRef(0);

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
  }, [total]);

  useEffect(() => {
    if (!pointerActive) return;
    document.body.classList.add('td-swipe-active');
    return () => {
      document.body.classList.remove('td-swipe-active');
    };
  }, [pointerActive]);

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
    slideWidthRef.current = stackRef.current?.getBoundingClientRect().width ?? 0;
    dragOffsetRef.current = 0;
    setPointerActive(true);
  };

  const slideWidth = slideWidthRef.current || 1;
  const dragPx = isDragging ? dragOffset : 0;

  return (
    <section id="features" className="td-section" aria-labelledby="features-heading">
      <div className="td-container">
        <div style={{ maxWidth: 720, marginBottom: 56 }}>
          <h2 id="features-heading" className="td-h2">
            {messages.title}
          </h2>
          <p className="td-lede">{messages.lede}</p>
        </div>

        <div className="td-section-features-carousel">
          <div className="td-feature-copy-col">
            <div className="td-feature-copy" key={idx}>
              <h3
                style={{
                  fontSize: 'clamp(28px, 3.4vw, 40px)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  margin: '12px 0 0',
                  color: 'var(--td-text)',
                }}
              >
                {f.tc}
              </h3>
              <p
                style={{
                  fontSize: 18,
                  lineHeight: 1.55,
                  color: 'var(--td-text-secondary)',
                  margin: '12px 0 0',
                  maxWidth: '40ch',
                }}
              >
                {f.tagline}
              </p>
              <ul className="td-fcard-bullets" style={{ marginTop: 16 }}>
                {f.bullets.map((b, j) => (
                  <li key={j} style={{ fontSize: 15, color: 'var(--td-text)' }}>
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <div className="td-feature-pager">
              <button
                onClick={() => go(idx - 1)}
                aria-label={messages.prevAriaLabel}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  border: '1px solid var(--td-border-hairline)',
                  background: 'var(--td-bg-card)',
                  color: 'var(--td-text)',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <div style={{ display: 'flex', gap: 6 }}>
                {features.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIdx(i)}
                    aria-label={messages.goToAriaLabel(i + 1)}
                    aria-current={i === idx ? 'true' : undefined}
                    style={{
                      width: i === idx ? 24 : 8,
                      height: 8,
                      borderRadius: 980,
                      background: i === idx ? 'var(--td-text)' : 'var(--td-border-soft)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'width .25s ease, background .15s',
                    }}
                  />
                ))}
              </div>
              <button
                onClick={() => go(idx + 1)}
                aria-label={messages.nextAriaLabel}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  border: '1px solid var(--td-border-hairline)',
                  background: 'var(--td-bg-card)',
                  color: 'var(--td-text)',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>

          <div className="td-feature-visual">
            <div
              ref={stackRef}
              className={`td-feature-stack${isDragging ? ' is-dragging' : ''}`}
              onPointerDown={onPointerDown}
              role="group"
              aria-roledescription="carousel"
              aria-label={messages.title}
            >
              {features.map((feat, i) => {
                const delta = shortestDelta(i, idx, total);
                const effectiveDelta = delta + dragPx / slideWidth;
                const absEffective = Math.abs(effectiveDelta);
                const visible = absEffective < VISIBLE_RANGE;
                const progress = Math.min(absEffective, 1);
                const opacity = visible ? 1 - progress * (1 - MIN_OPACITY) : 0;
                const blurPx = visible ? progress * MAX_BLUR_PX : 0;
                return (
                  <img
                    key={i}
                    src={screenshots[i]}
                    alt={i === idx ? feat.alt : ''}
                    className="td-feature-shot"
                    style={{
                      transform: `translate3d(calc(${delta * 100}% + ${dragPx}px), 0, 0)`,
                      opacity,
                      filter: blurPx > 0.05 ? `blur(${blurPx.toFixed(2)}px)` : 'none',
                      visibility: visible ? 'visible' : 'hidden',
                    }}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    width={1419}
                    height={2796}
                    draggable={false}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
