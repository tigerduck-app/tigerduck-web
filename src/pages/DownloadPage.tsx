import { useEffect, useState } from 'react';
import { Link } from '@/components/Link';
import { useLocale } from '@/hooks/useLocale';
import { detectPlatform, type Platform } from '@/lib/detectPlatform';
import { tFor, type DownloadChannel } from '@/lib/messages';
import { trackEvent } from '@/lib/analytics';

/** Where Google Play is unavailable, Android visitors get the builds without Google services first. */
const NO_GOOGLE_PLAY_TIME_ZONES = new Set(['Asia/Shanghai', 'Asia/Urumqi', 'Asia/Chongqing', 'Asia/Harbin']);

function channelOrder(platform: Platform): DownloadChannel[] {
  switch (platform) {
    case 'ios':
    case 'mac':
      return ['apple', 'testflight', 'android', 'fdroid', 'apk'];
    case 'android':
      return NO_GOOGLE_PLAY_TIME_ZONES.has(Intl.DateTimeFormat().resolvedOptions().timeZone)
        ? ['apk', 'fdroid', 'android', 'apple', 'testflight']
        : ['android', 'fdroid', 'apk', 'apple', 'testflight'];
    case 'desktop':
      return ['apple', 'android', 'fdroid', 'apk', 'testflight'];
  }
}

/**
 * `/download` — every way to install the app, the best one for this device first. Each entry
 * links to `/download/<channel>`, which `public/_redirects` answers with a 302 to the store.
 */
export function DownloadPage() {
  const { locale } = useLocale();
  const messages = tFor(locale).download;
  const [platform, setPlatform] = useState<Platform>('desktop');

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  useEffect(() => {
    document.title = messages.documentTitle;
  }, [messages.documentTitle]);

  const [first, ...rest] = channelOrder(platform);
  const entry = (channel: DownloadChannel, primary: boolean) => (
    <li key={channel}>
      <a
        href={`/download/${channel}`}
        className={primary ? 'td-help-topic td-doc-section td-download-primary' : 'td-help-topic td-doc-section'}
        onClick={() => trackEvent('cta_click', { store: channel, placement: 'download_page', detected_platform: platform })}
      >
        <h2 className="td-doc-section-title">{messages.channels[channel].name}</h2>
        <div className="td-doc-section-body">
          <p>{messages.channels[channel].note}</p>
        </div>
      </a>
    </li>
  );

  return (
    <article className="td-doc-page">
      <header className="td-doc-header">
        <div className="td-container">
          <Link to="/" className="td-doc-back">
            {messages.back}
          </Link>
          <h1 className="td-display td-doc-title" style={{ marginTop: 24 }}>
            {messages.title}
          </h1>
        </div>
      </header>

      <main className="td-container td-doc-body">
        <ul className="td-help-topic-list">{entry(first, true)}</ul>
        <h2 className="td-eyebrow td-download-others">{messages.others}</h2>
        <ul className="td-help-topic-list">{rest.map((channel) => entry(channel, false))}</ul>
      </main>
    </article>
  );
}
