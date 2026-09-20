import { useEffect } from 'react';
import { Link } from '@/components/Link';
import { useEmbed } from '@/hooks/useEmbed';
import { useLocale } from '@/hooks/useLocale';
import { tFor } from '@/lib/messages';
import { HELP_TOPICS } from '@/lib/help';

/**
 * `/help` — index of help topics, driven by the registry in `@/lib/help`.
 * Structurally this mirrors `TigerSync` / `HelpReceiveMail` (same
 * `td-doc-*` / `td-container` shell) so it reads as part of the same set of
 * pages, and so it automatically picks up the shared `?embed=1` styling.
 */
export function HelpIndex() {
  const { locale } = useLocale();
  const embedded = useEmbed();
  const messages = tFor(locale).helpIndex;

  useEffect(() => {
    document.title = messages.documentTitle;
  }, [messages.documentTitle]);

  return (
    <article className="td-doc-page">
      <header className="td-doc-header">
        <div className="td-container">
          {/* In the WebView there is no site to go back to — the app owns the
              back button — and an in-app Link would drop the embed params. */}
          {embedded ? null : (
            <Link to="/" className="td-doc-back">
              {messages.back}
            </Link>
          )}
          <div
            className="td-eyebrow"
            style={{ marginTop: embedded ? 0 : 24, marginBottom: 12 }}
          >
            {messages.eyebrow}
          </div>
          <h1 className="td-display td-doc-title">{messages.title}</h1>
          <p className="td-lede" style={{ marginTop: 16 }}>
            {messages.lede}
          </p>
        </div>
      </header>

      <main className="td-container td-doc-body">
        <ul className="td-help-topic-list">
          {HELP_TOPICS.map((topic) => {
            const copy = messages.topics[topic.id];
            return (
              <li key={topic.id}>
                <Link to={topic.path} className="td-help-topic td-doc-section td-reveal">
                  <h2 className="td-doc-section-title">{copy.title}</h2>
                  <div className="td-doc-section-body">
                    <p>{copy.summary}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </main>
    </article>
  );
}
