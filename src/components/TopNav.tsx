import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import {
  APP_STORE_URL,
  DISCORD_URL,
  GDG_NTUST_URL,
  GITHUB_ORG_URL,
  GOOGLE_PLAY_URL,
  SUPPORT_FORM_URL,
} from '@/lib/constants';
import { detectPlatform, type Platform } from '@/lib/detectPlatform';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LocaleToggle } from '@/components/LocaleToggle';
import { useLocale } from '@/hooks/useLocale';
import { tFor } from '@/lib/messages';
import { getPath, navigate } from '@/lib/router';

const DOWNLOAD_URL_BY_PLATFORM: Record<Exclude<Platform, 'desktop'>, string> = {
  ios: APP_STORE_URL,
  android: GOOGLE_PLAY_URL,
};

export function TopNav() {
  const { locale } = useLocale();
  const messages = tFor(locale).nav;
  const [platform, setPlatform] = useState<Platform>('desktop');

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  const downloadHref = platform === 'desktop' ? null : DOWNLOAD_URL_BY_PLATFORM[platform];

  const handleBrandClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (getPath() === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="td-nav" aria-label={messages.ariaLabel}>
      <div className="td-nav-inner">
        <a href="/" className="td-nav-brand" onClick={handleBrandClick}>
          <img src="/logo.png" alt="" className="td-nav-brand-icon" width={28} height={28} />
          <span>TigerDuck</span>
        </a>
        <div className="td-nav-links">
          <a href={GDG_NTUST_URL} className="td-nav-link">
            {messages.gdg}
          </a>
          <a href={GITHUB_ORG_URL} className="td-nav-link">
            {messages.github}
          </a>
          <a href={DISCORD_URL} className="td-nav-link">
            {messages.discord}
          </a>
          <a href={SUPPORT_FORM_URL} className="td-nav-link">
            {messages.feedback}
          </a>
          {downloadHref ? (
            <a href={downloadHref} className="td-nav-link td-nav-cta">
              {messages.download}
            </a>
          ) : null}
          <ThemeToggle />
          <LocaleToggle />
        </div>
      </div>
    </nav>
  );
}
