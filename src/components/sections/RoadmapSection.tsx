import { useLocale } from '@/hooks/useLocale';
import { tFor } from '@/lib/messages';

export function RoadmapSection() {
  const { locale } = useLocale();
  const messages = tFor(locale).roadmap;

  return (
    <section id="roadmap" className="td-section" aria-labelledby="roadmap-heading">
      <div className="td-container">
        <div className="td-block-header td-block-header--lg">
          <div style={{ maxWidth: 640 }}>
            <h2 id="roadmap-heading" className="td-h2">
              {messages.title}
            </h2>
            <p className="td-lede">{messages.lede}</p>
          </div>
          <a
            href="https://github.com/tigerduck-app/tigerduck-app#%E9%96%8B%E7%99%BC%E8%A6%8F%E5%8A%83"
            target="_blank"
            className="td-btn td-btn--secondary td-block-cta"
          >
            {messages.cta}
            <span style={{ fontSize: 14 }}>→</span>
          </a>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 16,
          }}
        >
          {messages.items.map((it) => (
            <div key={it.t} className="td-fcard td-reveal">
              <h3 className="td-fcard-title">{it.t}</h3>
              <p className="td-fcard-tag" style={{ lineHeight: 1.65 }}>
                {it.d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
