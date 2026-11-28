import { useEffect, useState, type ReactNode } from 'react';
import { useLocale } from '@/hooks/useLocale';
import { detectPlatform, type Platform } from '@/lib/detectPlatform';
import { tFor, type DownloadChannel } from '@/lib/messages';
import { trackEvent } from '@/lib/analytics';
import { AppleIcon, GooglePlayIcon } from '@/components/PlatformCTA';

const ICONS: Partial<Record<DownloadChannel, () => ReactNode>> = {
  apple: AppleIcon,
  android: GooglePlayIcon,
};

/** The first two become the store buttons, the rest the smaller links below them. */
function channelOrder(platform: Platform): DownloadChannel[] {
  return platform === 'android'
    ? ['android', 'apple', 'fdroid', 'testflight']
    : ['apple', 'android', 'testflight', 'fdroid'];
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
                <span className="td-download-other-name">{messages.channels[channel].name}</span>
                <span className="td-download-note">{messages.channels[channel].note}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
