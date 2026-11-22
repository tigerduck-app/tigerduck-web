import { lazy, Suspense, useLayoutEffect, useRef, type CSSProperties } from 'react';
import { useLocale } from '@/hooks/useLocale';
import { tFor } from '@/lib/messages';
import './phone-frame.css';

const PhoneApp = lazy(() => import('./PhoneApp'));

const DEVICE_WIDTH = 428;

/** The device frame; the app inside it loads after the page's first paint. */
export function PhoneHero() {
  const { locale } = useLocale();
  const hostRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const fit = () => host.style.setProperty('--td-phone-scale', String(host.clientWidth / DEVICE_WIDTH));
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={hostRef}
      className="td-phone-host"
      role="region"
      aria-label={tFor(locale).hero.phoneAriaLabel}
      style={{ '--td-phone-scale': 0.79 } as CSSProperties}
    >
      <div className="td-phone-device">
        <span className="td-phone-key td-phone-key--action" />
        <span className="td-phone-key td-phone-key--up" />
        <span className="td-phone-key td-phone-key--down" />
        <span className="td-phone-key td-phone-key--power" />
        <span className="td-phone-key td-phone-key--camera" />
        <div className="td-phone-screen">
          <Suspense fallback={<div className="td-phone-boot" />}>
            <PhoneApp locale={locale} />
          </Suspense>
          <div className="td-phone-island" />
        </div>
      </div>
    </div>
  );
}
