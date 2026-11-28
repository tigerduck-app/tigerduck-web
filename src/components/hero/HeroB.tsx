import { Link } from '@/components/Link';
import { PlatformCTA } from '@/components/PlatformCTA';
import { trackEvent } from '@/lib/analytics';
import { PhoneHero } from '@/components/phone/PhoneHero';
import { useLocale } from '@/hooks/useLocale';
import { tFor } from '@/lib/messages';

export function HeroB() {
  const { locale } = useLocale();
  const all = tFor(locale);
  const messages = all.hero;

  return (
    <section className="td-page td-hero" aria-labelledby="hero-heading">
      <div className="td-hero-grid">
        <div>
          <h1 id="hero-heading" className="td-display" style={{ marginBottom: 20 }}>
            TigerDuck
          </h1>
          <p
            className="td-lede"
            style={{
              marginBottom: 12,
              fontSize: 'clamp(17px, 2vw, 19px)',
              color: 'var(--td-text)',
            }}
          >
            {messages.tagline}
          </p>
          <p className="td-body" style={{ marginBottom: 32, fontSize: 15, maxWidth: '46ch' }}>
            {messages.desc1}
            <br />
            {messages.desc2}
          </p>

          <div className="td-cta-row" style={{ marginBottom: 24 }}>
            <PlatformCTA placement="hero" />
            <Link
              to="/download"
              className="td-btn td-btn--lg td-btn--link"
              onClick={() => trackEvent('cta_click', { store: 'download_page', placement: 'hero' })}
            >
              <span>{all.download.others}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="td-hero-visual">
          <PhoneHero />
        </div>
      </div>
    </section>
  );
}
