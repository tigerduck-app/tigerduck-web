import { demo, demoTime, type DemoBulletin } from '../../lib/demo';
import { usePhoneLocale } from '../../lib/i18n';
import { listDate } from '../../lib/format';
import { monthDayTime, useNow } from '../../lib/time';
import { useNav } from '../../ui/NavStack';
import { Page } from '../../ui/Page';
import { EmptyState } from '../../ui/controls';
import { useRefresh } from '../useRefresh';

export function BulletinsPage() {
  const now = useNow();
  const { t } = usePhoneLocale();
  const nav = useNav();
  const { refresh } = useRefresh();
  const bulletins = [...(demo.bulletins ?? [])].sort((a, b) => (demoTime(b.postedAt) ?? 0) - (demoTime(a.postedAt) ?? 0));
  return (
    <Page title={t('feature_announcements')} onRefresh={refresh}>
      {bulletins.length ? (
        <div className="td-ph-list">
          {bulletins.map((bulletin) => (
            <div key={bulletin.title} className="td-ph-list-item">
              <button
                type="button"
                className="td-ph-card td-ph-post"
                onClick={() => nav.push(<BulletinPage bulletin={bulletin} />)}
              >
                <span className="td-ph-post-meta">
                  {bulletin.org ? <span className="td-ph-tag">{bulletin.org}</span> : null}
                  <span className="td-ph-caption">{listDate(demoTime(bulletin.postedAt) ?? 0, now)}</span>
                </span>
                <strong>{bulletin.title}</strong>
                {bulletin.summary ? <span className="td-ph-post-preview">{bulletin.summary}</span> : null}
                {bulletin.tags?.length ? (
                  <span className="td-ph-tags">
                    {bulletin.tags.map((tag) => (
                      <span key={tag}>#{tag}</span>
                    ))}
                  </span>
                ) : null}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon="megaphone" title={t('bulletin_no_bulletins_title')} />
      )}
    </Page>
  );
}

function BulletinPage({ bulletin }: { bulletin: DemoBulletin }) {
  const posted = demoTime(bulletin.postedAt);
  return (
    <Page title={bulletin.title}>
      <p className="td-ph-sub" style={{ padding: '0 16px 12px' }}>
        {[bulletin.org, posted !== null ? monthDayTime(posted) : null].filter(Boolean).join(' · ')}
      </p>
      <div className="td-ph-card td-ph-pad td-ph-html">{bulletin.summary}</div>
    </Page>
  );
}
