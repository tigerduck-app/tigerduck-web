import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { flushSync } from 'react-dom';
import expandIcon from '@phosphor-icons/core/assets/bold/arrows-out-simple-bold.svg?raw';
import closeIcon from '@phosphor-icons/core/assets/bold/x-bold.svg?raw';
import { useLocale } from '@/hooks/useLocale';
import { tFor } from '@/lib/messages';
import './phone-frame.css';

const PhoneApp = lazy(() => import('./PhoneApp'));

const DEVICE_WIDTH = 428;
/** Below this width the 300px frame is over half the viewport, so most swipes would land on it. */
const PREVIEW_QUERY = '(max-width: 600px)';
const HISTORY_KEY = 'tdPhone';

function useMatches(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [query]);
  return matches;
}

/** Marks everything outside `element` inert and returns a function that undoes it. */
function isolate(element: HTMLElement): () => void {
  const changed: HTMLElement[] = [];
  for (let node: HTMLElement | null = element; node && node !== document.body; node = node.parentElement) {
    for (const sibling of node.parentElement?.children ?? []) {
      if (sibling !== node && sibling instanceof HTMLElement && !sibling.inert) {
        sibling.inert = true;
        changed.push(sibling);
      }
    }
  }
  return () => changed.forEach((sibling) => (sibling.inert = false));
}

/** Animates `host` from (or, reversed, to) the rect `other`, as one rect scaling into the other. */
function morph(host: HTMLElement, other: DOMRect, reverse: boolean): Animation {
  const own = host.getBoundingClientRect();
  const away = `translate(${other.left - own.left}px, ${other.top - own.top}px) scale(${other.width / own.width})`;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return host.animate([{ transform: reverse ? 'none' : away }, { transform: reverse ? away : 'none' }], {
    duration: reduce ? 0 : reverse ? 320 : 460,
    easing: 'cubic-bezier(0.2, 0.9, 0.25, 1)',
    fill: 'forwards',
  });
}

/**
 * The device frame; the app inside it loads after the page's first paint. On narrow screens the
 * frame is a preview the page scrolls over, and a tap opens it full screen.
 */
export function PhoneHero() {
  const { locale } = useLocale();
  const messages = tFor(locale).hero;
  const slotRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const openRef = useRef<HTMLButtonElement>(null);
  const narrow = useMatches(PREVIEW_QUERY);
  const [full, setFull] = useState(false);
  const preview = narrow && !full;

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const fit = () => host.style.setProperty('--td-phone-scale', String(host.clientWidth / DEVICE_WIDTH));
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (screenRef.current) screenRef.current.inert = preview;
  }, [preview]);

  // Shrinks the phone back into its slot; every way of closing ends here.
  const shrink = useRef(() => {});
  // Opening adds a history entry, so the browser's back gesture or button closes the phone too.
  const close = () => {
    if ((history.state as Record<string, unknown> | null)?.[HISTORY_KEY]) history.back();
    else shrink.current();
  };
  const open = () => {
    history.pushState({ ...(history.state as object | null), [HISTORY_KEY]: true }, '');
    setFull(true);
  };

  useLayoutEffect(() => {
    if (!full) return;
    const host = hostRef.current!;
    const stage = stageRef.current!;
    const slot = slotRef.current!;
    const grow = morph(host, slot.getBoundingClientRect(), false);
    void grow.finished.then(() => grow.cancel());

    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = 'hidden';
    const restore = isolate(stage);
    stage.focus({ preventScroll: true });

    let closing = false;
    shrink.current = () => {
      if (closing) return;
      closing = true;
      stage.classList.add('td-phone-stage--closing');
      const animation = morph(host, slot.getBoundingClientRect(), true);
      void animation.finished.then(() => {
        flushSync(() => setFull(false));
        animation.cancel();
        openRef.current?.focus({ preventScroll: true });
      });
    };
    const onPopState = () => shrink.current();
    const onKeyDown = (event: KeyboardEvent) => {
      // The app takes Escape first: an open menu, sheet or pushed page closes before the phone.
      if (event.key === 'Escape' && !event.defaultPrevented) close();
    };
    window.addEventListener('popstate', onPopState);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('keydown', onKeyDown);
      root.style.overflow = overflow;
      restore();
    };
  }, [full]);

  return (
    <div ref={slotRef} className="td-phone-slot" role="region" aria-label={messages.phoneAriaLabel}>
      <div
        ref={stageRef}
        className={full ? 'td-phone-stage td-phone-stage--full' : 'td-phone-stage'}
        role={full ? 'dialog' : undefined}
        aria-modal={full ? true : undefined}
        aria-label={full ? messages.phoneAriaLabel : undefined}
        tabIndex={full ? -1 : undefined}
      >
        <div ref={hostRef} className="td-phone-host" style={{ '--td-phone-scale': 0.79 } as CSSProperties}>
          <div className="td-phone-device">
            <span className="td-phone-key td-phone-key--action" />
            <span className="td-phone-key td-phone-key--up" />
            <span className="td-phone-key td-phone-key--down" />
            <span className="td-phone-key td-phone-key--power" />
            <span className="td-phone-key td-phone-key--camera" />
            <div ref={screenRef} className="td-phone-screen">
              <Suspense fallback={<div className="td-phone-boot" />}>
                <PhoneApp locale={locale} />
              </Suspense>
              <div className="td-phone-island" />
            </div>
          </div>
          {preview ? (
            <button
              ref={openRef}
              type="button"
              className="td-phone-open"
              aria-label={messages.phoneAriaLabel}
              aria-haspopup="dialog"
              onClick={open}
            >
              <span className="td-phone-open-badge" aria-hidden="true" dangerouslySetInnerHTML={{ __html: expandIcon }} />
            </button>
          ) : null}
        </div>
        {full ? (
          <button
            type="button"
            className="td-phone-close"
            aria-label={messages.phoneCloseLabel}
            onClick={close}
            dangerouslySetInnerHTML={{ __html: closeIcon }}
          />
        ) : null}
      </div>
    </div>
  );
}
