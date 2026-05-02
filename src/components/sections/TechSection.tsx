import { GITHUB_ORG_URL } from '@/lib/constants';
import { useLocale } from '@/hooks/useLocale';
import { tFor } from '@/lib/messages';

type ContributorRole = 'iOS' | 'Android';

interface Contributor {
  username: string;
  role: ContributorRole;
}

const contributorList: Contributor[] = [
    { username: 'xinshoutw', role: 'iOS' },
    { username: 'ader0226', role: 'iOS' },
    { username: 'yijiunchin', role: 'iOS' },
    { username: 'slimuCS', role: 'iOS' },
    { username: 'SamWang8891', role: 'Android' },
    { username: 'stanleyowen', role: 'Android' },
];

const contributors = contributorList.map((c) => ({
    name: c.username,
    role: c.role,
    url: `https://github.com/${c.username}`,
    avatar: `https://github.com/${c.username}.png?size=120`,
}));

const ShieldIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export function TechSection() {
  const { locale } = useLocale();
  const messages = tFor(locale).tech;
  const privacy = messages.privacy;

  return (
    <section id="tech" className="td-section td-section--soft" aria-labelledby="tech-heading">
      <div className="td-container">
        <div style={{ maxWidth: 720, marginBottom: 56 }}>
          <h2 id="tech-heading" className="td-h2">
            {messages.title}
          </h2>
          <p className="td-lede">{messages.lede}</p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 16,
            marginBottom: 56,
          }}
        >
          {privacy.map((p) => (
            <div
              key={p.t}
              style={{
                background: 'var(--td-bg-card)',
                borderRadius: 'var(--td-radius-xl)',
                padding: 24,
                border: '1px solid var(--td-border-hairline)',
                display: 'flex',
                gap: 14,
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  flexShrink: 0,
                  background: 'var(--td-green)',
                  color: 'white',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <ShieldIcon />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>{p.t}</div>
                <div style={{ fontSize: 14, color: 'var(--td-text-secondary)', lineHeight: 1.6 }}>
                  {p.d}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: 'var(--td-bg-card)',
            borderRadius: 'var(--td-radius-xl)',
            padding: 32,
            border: '1px solid var(--td-border-hairline)',
          }}
        >
          <div className="td-block-header">
            <div>
              <h3
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  letterSpacing: '-0.015em',
                  margin: 0,
                }}
              >
                {messages.contributorsTitle}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: 'var(--td-text-secondary)',
                  margin: '8px 0 0',
                  maxWidth: '46ch',
                }}
              >
                {messages.contributorsLede.map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < messages.contributorsLede.length - 1 ? <br /> : null}
                  </span>
                ))}
              </p>
            </div>
            <a href={GITHUB_ORG_URL} className="td-btn td-btn--secondary td-block-cta">
              GitHub
              <span style={{ fontSize: 14 }}>→</span>
            </a>
          </div>

          <div className="td-contributors-grid">
            {contributors.map((c, i) => (
              <a
                key={`${c.name}-${c.role}-${i}`}
                href={c.url}
                className="td-contributor-card"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <img
                  src={c.avatar}
                  alt={c.name}
                  width={56}
                  height={56}
                  loading="lazy"
                  style={{ borderRadius: '50%', background: 'var(--td-border-soft)' }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.visibility = 'hidden';
                  }}
                />
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: 'var(--td-text)',
                      fontFamily: 'var(--td-font-mono)',
                    }}
                  >
                    @{c.name}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: 'var(--td-text-tertiary)',
                      marginTop: 2,
                      fontFamily: 'var(--td-font-mono)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {c.role}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
