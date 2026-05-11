import { useEffect, useState } from 'react';
import { detectPlatform, type Platform } from '@/lib/detectPlatform';
import { APP_STORE_URL, GOOGLE_PLAY_URL } from '@/lib/constants';
import { trackEvent } from '@/lib/analytics';

type Props = {
  size?: 'md' | 'lg';
  secondary?: boolean;
  placement?: string;
};

function fireCtaClick(store: 'testflight' | 'apk', placement: string, plat: Platform) {
  trackEvent('cta_click', {
    store,
    placement,
    detected_platform: plat,
  });
}

const AppleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.05 12.04c-.03-2.96 2.42-4.38 2.53-4.45-1.38-2.02-3.53-2.3-4.3-2.33-1.83-.18-3.57 1.07-4.5 1.07-.93 0-2.36-1.04-3.88-1.01-2 .03-3.84 1.16-4.87 2.94-2.07 3.6-.53 8.91 1.5 11.83 1 1.43 2.18 3.04 3.73 2.98 1.5-.06 2.07-.97 3.88-.97s2.32.97 3.9.94c1.61-.03 2.63-1.46 3.62-2.9 1.14-1.66 1.61-3.27 1.64-3.36-.04-.02-3.13-1.2-3.16-4.74zM14.46 3.42c.83-1 1.39-2.39 1.24-3.78-1.2.05-2.66.8-3.51 1.8-.77.88-1.44 2.3-1.26 3.66 1.34.1 2.71-.68 3.53-1.68z" />
  </svg>
);

const GooglePlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3.609 1.814 13.792 12 3.61 22.186a1.5 1.5 0 0 1-.61-1.21V3.024a1.5 1.5 0 0 1 .609-1.21z" fill="#00C3FF" />
    <path d="M16.81 8.99 6.05 2.78a1.5 1.5 0 0 0-1.44-.06l10.18 10.18 2.02-2.02a.92.92 0 0 0 0-1.3l-.001-.001z" fill="#00DE76" />
    <path d="M16.81 15.01a.92.92 0 0 0 0-1.3l-2.02-2.02L4.61 21.87a1.5 1.5 0 0 0 1.44-.06l10.76-6.21z" fill="#FF3A44" />
    <path d="M20.16 10.81 17.6 9.34l-2.27 2.27 2.27 2.27 2.56-1.47a1.5 1.5 0 0 0 0-2.6z" fill="#FFC107" />
  </svg>
);

export function PlatformCTA({ size = 'lg', secondary = false, placement = 'unknown' }: Props) {
  const [plat, setPlat] = useState<Platform>('desktop');

  useEffect(() => {
    setPlat(detectPlatform());
  }, []);

  const cls = `td-btn td-btn--${size}`;
  const primaryCls = `${cls} ${secondary ? 'td-btn--ghost' : 'td-btn--primary'}`;
  const ghostCls = `${cls} td-btn--ghost`;

  if (plat === 'ios') {
    return (
      <a
        href={APP_STORE_URL}
        className={primaryCls}
        onClick={() => fireCtaClick('testflight', placement, plat)}
      >
        <AppleIcon />
        <span>TestFlight</span>
      </a>
    );
  }
  if (plat === 'android') {
    return (
      <a
        href={GOOGLE_PLAY_URL}
        className={primaryCls}
        onClick={() => fireCtaClick('apk', placement, plat)}
      >
        <GooglePlayIcon />
        <span>Google Play</span>
      </a>
    );
  }
  return (
    <>
      <a
        href={APP_STORE_URL}
        className={primaryCls}
        onClick={() => fireCtaClick('testflight', placement, plat)}
      >
        <AppleIcon />
        <span>TestFlight</span>
      </a>
      <a
        href={GOOGLE_PLAY_URL}
        className={ghostCls}
        onClick={() => fireCtaClick('apk', placement, plat)}
      >
        <GooglePlayIcon />
        <span>Google Play</span>
      </a>
    </>
  );
}
