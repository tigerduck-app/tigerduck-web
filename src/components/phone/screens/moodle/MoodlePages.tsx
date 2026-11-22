import { useState } from 'react';
import {
  demoTime,
  text,
  type MoodleAnnouncement,
  type MoodleCourse,
  type MoodleMaterialItem,
} from '../../lib/demo';
import { usePhoneLocale } from '../../lib/i18n';
import { monthDayTime } from '../../lib/time';
import { Icon } from '../../ui/Icon';
import { useNav } from '../../ui/NavStack';
import { Page } from '../../ui/Page';
import { DemoHtml, Group, Row } from '../../ui/controls';
import { FileRows } from './FileRows';

export function plainText(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

export function AnnouncementsPage({ course }: { course: MoodleCourse }) {
  const { t, locale } = usePhoneLocale();
  const nav = useNav();
  const [read, setRead] = useState<ReadonlySet<number>>(new Set());
  const list = [...(course.announcements ?? [])].sort(
    (a, b) => Number(b.pinned ?? false) - Number(a.pinned ?? false) || (demoTime(b.created) ?? 0) - (demoTime(a.created) ?? 0)
  );
  return (
    <Page title={t('feature_announcements')}>
      <div className="td-ph-list">
        {list.map((a) => {
          const unread = a.unread && !read.has(a.id);
          return (
            <div key={a.id} className="td-ph-list-item">
              <button
                type="button"
                className="td-ph-card td-ph-post"
                onClick={() => {
                  setRead((s) => new Set(s).add(a.id));
                  nav.push(<AnnouncementPage announcement={a} />);
                }}
              >
                <span className="td-ph-post-head">
                  {unread ? <span className="td-ph-dot" aria-label={t('bulletin_unread_dot_label')} /> : null}
                  {a.pinned ? <Icon name="pin" className="td-ph-post-pin" /> : null}
                  <strong>{text(a.title, locale)}</strong>
                </span>
                <span className="td-ph-post-preview">{plainText(text(a.message, locale))}</span>
                <span className="td-ph-caption">
                  {text(a.author, locale)} · {monthDayTime(demoTime(a.created) ?? 0)}
                  {a.attachments?.length ? (
                    <>
                      {' '}
                      · <Icon name="paperclip" /> {a.attachments.length}
                    </>
                  ) : null}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </Page>
  );
}

export function AnnouncementPage({ announcement }: { announcement: MoodleAnnouncement }) {
  const { t, locale } = usePhoneLocale();
  return (
    <Page title={text(announcement.title, locale)}>
      <p className="td-ph-sub" style={{ padding: '0 16px 12px' }}>
        {text(announcement.author, locale)} · {monthDayTime(demoTime(announcement.created) ?? 0)}
      </p>
      <div className="td-ph-card td-ph-pad">
        <DemoHtml html={text(announcement.message, locale)} />
      </div>
      {announcement.attachments?.length ? (
        <Group header={t('school_mail_attachments')}>
          <FileRows files={announcement.attachments} />
        </Group>
      ) : null}
    </Page>
  );
}

function MaterialRow({ item }: { item: MoodleMaterialItem }) {
  const { locale } = usePhoneLocale();
  const nav = useNav();
  const name = text(item.name, locale);
  if (item.type === 'folder') {
    return (
      <Row
        icon="folder"
        title={name}
        value={String(item.files?.length ?? 0)}
        onClick={() =>
          nav.push(
            <Page title={name}>
              <Group>
                <FileRows files={item.files ?? []} />
              </Group>
            </Page>
          )
        }
      />
    );
  }
  if (item.type === 'link') {
    return <Row icon="link" title={name} subtitle={item.url} chevron={false} />;
  }
  return item.file ? <Row icon="doc" title={name} subtitle={item.file.name} /> : null;
}

export function MaterialsPage({ course }: { course: MoodleCourse }) {
  const { t, locale } = usePhoneLocale();
  return (
    <Page title={t('course_detail_files_label')}>
      {(course.materials ?? []).map((section) => (
        <Group key={section.id} header={text(section.name, locale) || undefined}>
          {(section.items ?? []).map((item) => (
            <MaterialRow key={item.id} item={item} />
          ))}
        </Group>
      ))}
    </Page>
  );
}

export function GradesPage({ course }: { course: MoodleCourse }) {
  const { t, locale } = usePhoneLocale();
  const [open, setOpen] = useState<number | null>(null);
  const grades = course.grades ?? [];
  const items = grades.filter((g) => g.type !== 'course');
  const total = grades.find((g) => g.type === 'course');
  return (
    <Page title={t('course_detail_moodle_grades_label')}>
      {total ? (
        <div className="td-ph-card td-ph-pad td-ph-total">
          <span className="td-ph-caption">{t('score_credit_total')}</span>
          <span>
            <b>{total.grade}</b>
            {total.max !== undefined ? <small> / {total.max}</small> : null}
          </span>
        </div>
      ) : null}
      <Group>
        {items.map((grade, index) => (
          <div key={index} className="td-ph-row-wrap">
            <Row
              title={text(grade.name, locale)}
              subtitle={grade.max !== undefined ? t('course_moodle_grade_out_of', grade.max) : undefined}
              value={<b style={{ color: 'var(--ph-text)' }}>{grade.grade ?? '-'}</b>}
              onClick={grade.feedback ? () => setOpen(open === index ? null : index) : undefined}
              chevron={false}
            />
            {grade.feedback && open === index ? (
              <div className="td-ph-feedback">
                <DemoHtml html={text(grade.feedback, locale)} />
              </div>
            ) : null}
          </div>
        ))}
      </Group>
    </Page>
  );
}
