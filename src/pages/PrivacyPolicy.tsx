import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Link } from '@/components/Link';
import { useLocale } from '@/hooks/useLocale';
import { tFor } from '@/lib/messages';

const SUPPORT_EMAIL = 'tigerduckapp@gmail.com';

/**
 * Render text that contains `**bold**` segments. Keeps copy translatable
 * without exposing JSX in the messages file.
 */
function richText(input: string): ReactNode {
  const parts = input.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

export function PrivacyPolicy() {
  const { locale } = useLocale();
  const messages = tFor(locale).privacy;

  useEffect(() => {
    document.title = messages.documentTitle;
  }, [messages.documentTitle]);

  const bodyByIndex: ReactNode[] = [
    <p key="intro">{richText(messages.bodies.intro)}</p>,
    <>
      <p key="auth1">{richText(messages.bodies.auth1)}</p>
      <p key="authIntro">{messages.bodies.authReadIntro}</p>
      <ul key="authList" className="td-policy-list">
        {messages.bodies.authReadList.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
    </>,
    <p key="storage">{richText(messages.bodies.storage)}</p>,
    <p key="external">{richText(messages.bodies.external)}</p>,
    <p key="thirdParty">{richText(messages.bodies.thirdParty)}</p>,
    <p key="cookies">{messages.bodies.cookies}</p>,
    <p key="revisions">{messages.bodies.revisions}</p>,
  ];

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
        {messages.sections.map((s, i) => (
          <section key={s.n} className="td-doc-section td-reveal">
            <div className="td-doc-section-num">{s.n}</div>
            <h2 className="td-doc-section-title">{s.title}</h2>
            <div className="td-doc-section-body">{bodyByIndex[i]}</div>
          </section>
        ))}

        <section className="td-doc-section td-doc-contact td-reveal">
          <h2 className="td-doc-section-title">{messages.contactTitle}</h2>
          <p>
            {messages.contactPrefix}{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="td-doc-mail">
              {SUPPORT_EMAIL}
            </a>
          </p>
          <p className="td-doc-disclaimer">{messages.disclaimer}</p>
        </section>
      </main>
    </article>
  );
}
