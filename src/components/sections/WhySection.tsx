import type { ReactNode } from 'react';
import { useLocale } from '@/hooks/useLocale';
import { tFor } from '@/lib/messages';

const icons: ReactNode[] = [
  (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  ),
  (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m4.93 4.93 4.24 4.24" />
      <path d="m14.83 9.17 4.24-4.24" />
      <path d="m14.83 14.83 4.24 4.24" />
      <path d="m9.17 14.83-4.24 4.24" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  ),
];

export function WhySection() {
  const { locale } = useLocale();
  const messages = tFor(locale).why;

  return (
    <section id="why" className="td-section td-section--soft" aria-labelledby="why-heading">
      <div className="td-container">
        <div style={{ maxWidth: 720, marginBottom: 56 }}>
          <h2 id="why-heading" className="td-h2">
            {messages.title}
          </h2>
          <p className="td-lede">{messages.lede}</p>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 16,
          }}
        >
          {messages.items.map((it, i) => (
            <div key={i} className="td-fcard td-reveal" style={{ background: 'var(--td-bg-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: 'var(--td-blue)',
                    color: 'white',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  {icons[i]}
                </div>
              </div>
              <div>
                <h3 className="td-fcard-title" style={{ fontSize: 18, marginBottom: 8 }}>
                  {it.pain}
                </h3>
                <p className="td-fcard-tag" style={{ lineHeight: 1.6 }}>
                  {it.sol}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
