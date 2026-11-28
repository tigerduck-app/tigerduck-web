import { useEffect, useState, type ReactNode } from 'react';
import { useLocale } from '@/hooks/useLocale';
import { detectPlatform, type Platform } from '@/lib/detectPlatform';
import { tFor, type DownloadChannel } from '@/lib/messages';
import { trackEvent } from '@/lib/analytics';
import { AppleIcon, GooglePlayIcon } from '@/components/PlatformCTA';

/** Where Google Play is unavailable, Android visitors get the build without Google services first. */
const NO_GOOGLE_PLAY_TIME_ZONES = new Set(['Asia/Shanghai', 'Asia/Urumqi', 'Asia/Chongqing', 'Asia/Harbin']);

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19.5h14" />
  </svg>
);

const ICONS: Partial<Record<DownloadChannel, () => ReactNode>> = {
  apple: AppleIcon,
  android: GooglePlayIcon,
  apk: DownloadIcon,
};

/** The first two become the store buttons, the rest the smaller links below them. */
function channelOrder(platform: Platform): DownloadChannel[] {
  if (platform !== 'android') return ['apple', 'android', 'testflight', 'fdroid', 'apk'];
  return NO_GOOGLE_PLAY_TIME_ZONES.has(Intl.DateTimeFormat().resolvedOptions().timeZone)
    ? ['apk', 'android', 'fdroid', 'apple', 'testflight']
    : ['android', 'apple', 'fdroid', 'apk', 'testflight'];
}

/**
 * `/download` — every way to install the app, the best one for this device first. Each entry
 * links to `/download/<channel>`, which `public/_redirects` answers with a 302 to the store.
 */
export function DownloadPage() {
  const { locale } = useLocale();
  const all = tFor(locale);
  const messages = all.download;
  const [platform, setPlatform] = useState<Platform>('desktop');

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  useEffect(() => {
    document.title = messages.documentTitle;
  }, [messages.documentTitle]);

  const track = (channel: DownloadChannel) => () =>
    trackEvent('cta_click', { store: channel, placement: 'download_page', detected_platform: platform });
  const order = channelOrder(platform);
  const stores = order.slice(0, 2);
  const others = order.slice(2);

  return (
    <section className="td-download" aria-labelledby="download-heading">
      <img className="td-download-icon" src="/logo.png" width={112} height={112} alt="" />
      <h1 id="download-heading" className="td-display">
        {messages.title}
      </h1>
      <p className="td-lede td-download-lede">{all.hero.tagline}</p>

      <div className="td-download-stores">
        {stores.map((channel, i) => {
          const Icon = ICONS[channel];
          return (
            <div key={channel} className="td-download-store">
              <a
                href={`/download/${channel}`}
                className={`td-btn td-btn--lg ${i === 0 ? 'td-btn--primary' : 'td-btn--ghost'}`}
                onClick={track(channel)}
              >
                {Icon ? <Icon /> : null}
                <span>{messages.channels[channel].name}</span>
              </a>
              <span className="td-download-note">{messages.channels[channel].note}</span>
            </div>
          );
        })}
      </div>

      <nav className="td-download-others" aria-label={messages.others}>
        <h2 className="td-eyebrow">{messages.others}</h2>
        <ul>
          {others.map((channel) => (
            <li key={channel}>
              <a href={`/download/${channel}`} onClick={track(channel)}>
                {messages.channels[channel].name}
              </a>
              <span className="td-download-note">{messages.channels[channel].note}</span>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
