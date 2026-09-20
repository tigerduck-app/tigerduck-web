import { useEffect, useState } from 'react';
import { Link } from '@/components/Link';
import { useEmbed } from '@/hooks/useEmbed';
import { useLocale } from '@/hooks/useLocale';
import { tFor } from '@/lib/messages';
import { navigate } from '@/lib/router';

/**
 * `/help/receive-mail/:platform` — how to read NTUST school mail in a
 * third-party mail app. Linked from the apps, and opened inside the Android
 * app's WebView with `?embed=1&theme=…&lang=…` (see `@/lib/embed`).
 *
 * NOTE: this is a stub while the real instructions (with screenshots) are
 * written. Only the header and the platform toggle, plus a placeholder
 * notice below them, are shown; the numbered steps/server-settings/
 * troubleshooting sections come back once that content exists.
 */
export type HelpMailPlatform = 'android' | 'apple' | 'other' | 'unknown';

/** The platform a toggle can actually select; `null` means none — the
    neutral/unknown copy is shown. */
type SelectedPlatform = 'android' | 'apple' | 'other' | null;

const LAST_UPDATED = '2026-09-20';

/**
 * Must match the `/help/receive-mail` prefix registered in `App.tsx`'s
 * `helpMailPlatform()` and `@/lib/help`'s `HELP_TOPICS` entry — this is where
 * the toggle sends `navigate()` when it changes the selected platform.
 */
const RECEIVE_MAIL_PATH = '/help/receive-mail';

/** Real platforms, in toggle/display order. */
const KNOWN_PLATFORMS = ['android', 'apple', 'other'] as const;

function selectedFromPlatform(platform: HelpMailPlatform): SelectedPlatform {
  return platform === 'android' || platform === 'apple' || platform === 'other'
    ? platform
    : null;
}

export function HelpReceiveMail({ platform }: { platform: HelpMailPlatform }) {
  const { locale } = useLocale();
  const embedded = useEmbed();
  const messages = tFor(locale).helpReceiveMail;
  // Seeded from the URL segment (App.tsx's `platform` prop) so hard-coded
  // in-app links like `/help/receive-mail/android` still land pre-selected.
  // A later URL-driven change (Link/back-forward) remounts this component —
  // App.tsx keys the page on `path` — so this only needs to run once.
  const [selected, setSelected] = useState<SelectedPlatform>(() =>
    selectedFromPlatform(platform)
  );
  const copy = messages.platforms[selected ?? 'unknown'];

  useEffect(() => {
    document.title = copy.documentTitle;
  }, [copy.documentTitle]);

  /**
   * Clicking the active toggle deselects it (back to showing both); clicking
   * the inactive one selects it.
   *
   * Embedded: state only — never touches the URL. Navigating inside the
   * WebView would drop `?embed/&theme/&lang/&bg/&fg` (read from
   * `location.search`) and pop the site chrome back up mid-guide, so the
   * embedded branch returns before `navigate()` is anywhere in reach.
   *
   * Non-embedded: the URL is the source of truth, so this pushes the new
   * path instead of setting state directly — `navigate()` dispatches the
   * router's event, `path` changes, and App.tsx's `key={path}` remounts this
   * component with the right initial `selected` value.
   */
  function toggle(target: 'android' | 'apple' | 'other') {
    const next = selected === target ? null : target;
    if (embedded) {
      setSelected(next);
      return;
    }
    navigate(next ? `${RECEIVE_MAIL_PATH}/${next}` : RECEIVE_MAIL_PATH);
  }

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
            {messages.eyebrow} · {copy.label}
          </div>
          <h1 className="td-display td-doc-title">{messages.title}</h1>
          <p className="td-lede" style={{ marginTop: 16 }}>
            {copy.lede}
          </p>

          <div className="td-doc-meta">
            <span>{messages.lastUpdated}</span>
            <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time>
          </div>

          {/* Selects which platform's copy (lede/documentTitle) is shown
              above. Kept working even while the page below is just a
              placeholder notice, since the real per-platform steps will read
              this same selection once they exist. Stays visible in the
              embed — an Android-app user may still want to set up an iPad. */}
          <div
            className="td-platform-toggle"
            role="group"
            aria-label={messages.platformToggleLabel}
          >
            {KNOWN_PLATFORMS.map((p) => (
              <button
                key={p}
                type="button"
                className="td-platform-toggle-btn"
                aria-pressed={selected === p}
                onClick={() => toggle(p)}
              >
                {messages.platforms[p].label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="td-container td-doc-body">
        <section className="td-doc-section td-reveal">
          <div className="td-doc-section-num">01</div>
          <h2 className="td-doc-section-title">{messages.s1Title}</h2>
          <div className="td-doc-section-body">
            <p>{messages.s1Intro}</p>
          </div>
        </section>
      </main>
    </article>
  );
}
