import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Link } from '@/components/Link';
import { useLocale } from '@/hooks/useLocale';
import { tFor } from '@/lib/messages';

const SUPPORT_EMAIL = 'tigerduckapp@gmail.com';

function richText(input: string): ReactNode {
  const parts = input.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

export function TigerSync() {
  const { locale } = useLocale();
  const messages = tFor(locale).tigerSync;

  useEffect(() => {
    document.title = messages.documentTitle;
  }, [messages.documentTitle]);

  return (
    <article className="td-doc-page">
      <header className="td-doc-header">
        <div className="td-container">
          <Link to="/" className="td-doc-back">
            {messages.back}
          </Link>
          <div className="td-eyebrow" style={{ marginTop: 24, marginBottom: 12 }}>
            {messages.eyebrow}
          </div>
          <h1 className="td-display td-doc-title">{messages.title}</h1>
          <p className="td-lede" style={{ marginTop: 16 }}>
            {messages.lede}
          </p>
          <div className="td-doc-meta">
            <span>{messages.lastUpdated}</span>
            <time dateTime="2026-09-13">2026-09-13</time>
          </div>
        </div>
      </header>

      <main className="td-container td-doc-body">
        <section className="td-doc-callout td-reveal">
          <div className="td-eyebrow" style={{ marginBottom: 8, color: 'var(--td-orange)' }}>
            {messages.importantLabel}
          </div>
          <p>{messages.importantBody}</p>
        </section>

        <section className="td-doc-section td-reveal">
          <div className="td-doc-section-num">01</div>
          <h2 className="td-doc-section-title">{messages.s1Title}</h2>
          <div className="td-doc-section-body">
            {messages.s1Body.map((p, i) => (
              <p key={i}>{richText(p)}</p>
            ))}
          </div>
        </section>

        <section className="td-doc-section td-reveal">
          <div className="td-doc-section-num">02</div>
          <h2 className="td-doc-section-title">{messages.s2Title}</h2>
          <div className="td-doc-section-body">
            <p>{messages.s2Intro}</p>
            <ol className="td-policy-steps">
              {messages.s2Items.map((item) => (
                <li key={item.label}>
                  <strong>{item.label}</strong> — {item.body}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="td-doc-section td-reveal">
          <div className="td-doc-section-num">03</div>
          <h2 className="td-doc-section-title">{messages.s3Title}</h2>
          <div className="td-doc-section-body">
            <p>{richText(messages.s3Intro)}</p>
            {messages.s3Platforms.map((platform) => (
              <div key={platform.title} className="td-policy-block">
                <h3 className="td-policy-subhead">{platform.title}</h3>
                <p>{platform.body}</p>
              </div>
            ))}
            <p>{messages.s3Note}</p>
          </div>
        </section>

        <section className="td-doc-section td-reveal">
          <div className="td-doc-section-num">04</div>
          <h2 className="td-doc-section-title">{messages.s4Title}</h2>
          <div className="td-doc-section-body">
            <p>{messages.s4Intro}</p>
            <h3 className="td-policy-subhead">{messages.s4DeviceTitle}</h3>
            <ul className="td-policy-list">
              {messages.s4Device.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
            <h3 className="td-policy-subhead">{messages.s4AccountTitle}</h3>
            <ul className="td-policy-list">
              {messages.s4Account.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
            <p>{messages.s4Note}</p>
          </div>
        </section>

        <section className="td-doc-section td-reveal">
          <div className="td-doc-section-num">05</div>
          <h2 className="td-doc-section-title">{messages.s5Title}</h2>
          <div className="td-doc-section-body">
            <p>
              {messages.s5Prefix}
              {locale === 'en' ? ' ' : ''}
              <Link to="/delete-account">{messages.s5LinkLabel}</Link>
              {messages.s5Suffix}
            </p>
          </div>
        </section>

        <section className="td-doc-section td-doc-contact td-reveal">
          <h2 className="td-doc-section-title">{messages.contactTitle}</h2>
          <p>
            {messages.contactPrefix}{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="td-doc-mail">
              {SUPPORT_EMAIL}
            </a>
          </p>
        </section>
      </main>
    </article>
  );
}
