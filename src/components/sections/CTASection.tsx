import { PlatformCTA } from '@/components/PlatformCTA';
import { GITHUB_ORG_URL } from '@/lib/constants';
import { useLocale } from '@/hooks/useLocale';
import { tFor } from '@/lib/messages';

const GitHubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

export function CTASection() {
  const { locale } = useLocale();
  const messages = tFor(locale).cta;

  return (
    <section className="td-section td-cta-band" aria-labelledby="cta-heading">
      <div className="td-container" style={{ textAlign: 'center' }}>
        <img
          src="/logo.png"
          alt="TigerDuck logo"
          className="td-cta-logo"
          width={96}
          height={96}
        />
        <h2 id="cta-heading" className="td-h2" style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>
          {messages.title}
        </h2>
        <p className="td-lede" style={{ margin: '12px auto 32px', maxWidth: '40ch' }}>
          {messages.lede}
        </p>
        <div className="td-cta-row" style={{ justifyContent: 'center' }}>
          <PlatformCTA />
          <a href={GITHUB_ORG_URL} className="td-btn td-btn--ghost td-btn--lg td-cta-github">
            <GitHubIcon />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </section>
  );
}
