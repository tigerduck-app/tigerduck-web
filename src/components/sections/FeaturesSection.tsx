import { useState } from 'react';
import { useLocale } from '@/hooks/useLocale';
import { tFor } from '@/lib/messages';

const screenshots = [
  '/screenshots/homeworks.png',
  '/screenshots/classtable.png',
  '/screenshots/calendar.png',
  '/screenshots/announcement.png',
  '/screenshots/library.png',
  '/screenshots/grades.png',
  '/screenshots/customize.png',
];

export function FeaturesSection() {
  const { locale } = useLocale();
  const messages = tFor(locale).features;
  const features = messages.items;
  const total = features.length;
  const [idx, setIdx] = useState(0);
  const f = features[idx % total];

  const go = (n: number) => setIdx((n + total) % total);

  return (
    <section id="features" className="td-section" aria-labelledby="features-heading">
      <div className="td-container">
        <div style={{ maxWidth: 720, marginBottom: 56 }}>
          <h2 id="features-heading" className="td-h2">
            {messages.title}
          </h2>
          <p className="td-lede">{messages.lede}</p>
        </div>

        <div className="td-section-features-carousel">
          <div className="td-feature-copy-col">
            <div className="td-feature-copy" key={idx}>
              <h3
                style={{
                  fontSize: 'clamp(28px, 3.4vw, 40px)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  margin: '12px 0 0',
                  color: 'var(--td-text)',
                }}
              >
                {f.tc}
              </h3>
              <p
                style={{
                  fontSize: 18,
                  lineHeight: 1.55,
                  color: 'var(--td-text-secondary)',
                  margin: '12px 0 0',
                  maxWidth: '40ch',
                }}
              >
                {f.tagline}
              </p>
              <ul className="td-fcard-bullets" style={{ marginTop: 16 }}>
                {f.bullets.map((b, j) => (
                  <li key={j} style={{ fontSize: 15, color: 'var(--td-text)' }}>
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <div className="td-feature-pager">
              <button
                onClick={() => go(idx - 1)}
                aria-label={messages.prevAriaLabel}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  border: '1px solid var(--td-border-hairline)',
                  background: 'var(--td-bg-card)',
                  color: 'var(--td-text)',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <div style={{ display: 'flex', gap: 6 }}>
                {features.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIdx(i)}
                    aria-label={messages.goToAriaLabel(i + 1)}
                    aria-current={i === idx ? 'true' : undefined}
                    style={{
                      width: i === idx ? 24 : 8,
                      height: 8,
                      borderRadius: 980,
                      background: i === idx ? 'var(--td-text)' : 'var(--td-border-soft)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'width .25s ease, background .15s',
                    }}
                  />
                ))}
              </div>
              <button
                onClick={() => go(idx + 1)}
                aria-label={messages.nextAriaLabel}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  border: '1px solid var(--td-border-hairline)',
                  background: 'var(--td-bg-card)',
                  color: 'var(--td-text)',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>

          <div className="td-feature-visual">
            <div className="td-feature-stack" aria-hidden={false}>
              {features.map((feat, i) => (
                <img
                  key={i}
                  src={screenshots[i]}
                  alt={i === idx ? feat.alt : ''}
                  className={`td-feature-shot${i === idx ? ' is-active' : ''}`}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  width={1419}
                  height={2796}
                  draggable={false}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
