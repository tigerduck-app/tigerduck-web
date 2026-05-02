import { PlatformCTA } from '@/components/PlatformCTA';
import { HeroCarousel } from '@/components/hero/HeroCarousel';
import { useLocale } from '@/hooks/useLocale';
import { tFor } from '@/lib/messages';

export function HeroB() {
  const { locale } = useLocale();
  const messages = tFor(locale).hero;

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
            <PlatformCTA />
          </div>
        </div>

        <div className="td-hero-visual">
          <HeroCarousel />
        </div>
      </div>
    </section>
  );
}
