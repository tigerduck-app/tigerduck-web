import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Link } from '@/components/Link';
import { useLocale } from '@/hooks/useLocale';
import { tFor } from '@/lib/messages';

const SUPPORT_EMAIL = 'tigerduckapp@gmail.com';
const NTUST_CC_URL = 'https://www.cc.ntust.edu.tw/';

function richText(input: string): ReactNode {
  const parts = input.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

export function DeleteAccount() {
  const { locale } = useLocale();
  const messages = tFor(locale).deleteAccount;

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
            <time dateTime="2026-04-19">2026-04-19</time>
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
            <p>{richText(messages.s1Body)}</p>
          </div>
        </section>

        <section className="td-doc-section td-reveal">
          <div className="td-doc-section-num">02</div>
          <h2 className="td-doc-section-title">{messages.s2Title}</h2>
          <div className="td-doc-section-body">
            <p>{messages.s2Intro}</p>
            <ol className="td-policy-steps">
              {messages.s2Steps.map((step) => (
                <li key={step.label}>
                  <strong>{step.label}</strong> — {step.body}
                </li>
              ))}
              <li>{messages.s2AfterRemoval}</li>
            </ol>
          </div>
        </section>

        <section className="td-doc-section td-reveal">
          <div className="td-doc-section-num">03</div>
          <h2 className="td-doc-section-title">{messages.s3Title}</h2>
          <div className="td-doc-section-body">
            <p>
              {messages.s3Prefix}{' '}
              <a href={NTUST_CC_URL} target="_blank" rel="noreferrer">
                {messages.s3LinkLabel}
              </a>
              {messages.s3Suffix}
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
