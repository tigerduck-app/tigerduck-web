import { useState, type ReactNode } from 'react';
import { moodleCourse, text, type DemoCourse, type MoodleCourse } from '../../lib/demo';
import { usePhoneLocale } from '../../lib/i18n';
import { courseColor, type Meeting } from '../../lib/schedule';
import { hhmm } from '../../lib/time';
import { Icon, type IconName } from '../../ui/Icon';
import { NavStack, useNav } from '../../ui/NavStack';
import { Page } from '../../ui/Page';
import { DemoHtml, SectionTitle } from '../../ui/controls';
import { assignmentItems } from '../assignments';
import { AssignmentPage } from '../moodle/AssignmentPage';
import { AnnouncementsPage, GradesPage, MaterialsPage } from '../moodle/MoodlePages';
import { ForumsPage, MembersPage } from '../moodle/MoodlePeople';

/** A course's detail sheet, with its Moodle pages pushed inside it. */
export function CourseSheet({ course, meeting }: { course: DemoCourse; meeting?: Meeting }) {
  return <NavStack root={<CourseDetail course={course} meeting={meeting} />} />;
}

function CourseDetail({ course, meeting }: { course: DemoCourse; meeting?: Meeting }) {
  const { t, locale } = usePhoneLocale();
  const nav = useNav();
  const [copied, setCopied] = useState(false);
  const moodle = moodleCourse(course.courseNo);
  const open = assignmentItems(locale).filter((a) => a.courseNo === course.courseNo && !a.submitted);
  const color = courseColor(course);
  const room = meeting?.room ?? course.classroom ?? '';

  return (
    <Page title={text(course.name, locale)}>
      <div className="td-ph-course-bar" style={{ background: color }} />
      <div className="td-ph-course-facts">
        {room ? <Fact label={t('course_detail_classroom_label')} value={room} /> : null}
        {meeting ? (
          <Fact label={t('course_detail_time_label')} value={`${hhmm(meeting.start)} - ${hhmm(meeting.end)}`} />
        ) : null}
      </div>
      <dl className="td-ph-course-rows">
        {course.instructor ? <InfoRow label={t('course_detail_instructor_label')}>{text(course.instructor, locale)}</InfoRow> : null}
        <InfoRow label={t('course_detail_code_label')}>
          <button
            type="button"
            className="td-ph-copy"
            aria-label={t('course_detail_copy_code')}
            onClick={() => {
              void navigator.clipboard?.writeText(course.courseNo).catch(() => {});
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1600);
            }}
          >
            <Icon name="copy" />
            {course.courseNo}
          </button>
        </InfoRow>
        {course.credits !== undefined ? <InfoRow label={t('course_detail_credits_label')}>{course.credits}</InfoRow> : null}
      </dl>
      {copied ? (
        <div className="td-ph-toast td-ph-glass" role="status">
          {t('course_detail_code_copied')}
        </div>
      ) : null}
      {open.length ? (
        <section className="td-ph-section">
          <SectionTitle>{t('course_detail_incomplete_assignments')}</SectionTitle>
          <div className="td-ph-card td-ph-rows">
            {open.map((item) => (
              <button key={item.id} type="button" className="td-ph-row" onClick={() => nav.push(<AssignmentPage item={item} />)}>
                <span className="td-ph-row-main">{item.title}</span>
                <Icon name="chevron" className="td-ph-row-chevron" />
              </button>
            ))}
          </div>
        </section>
      ) : null}
      {moodle ? <MoodleSection course={moodle} /> : null}
    </Page>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="td-ph-card td-ph-fact">
      <span className="td-ph-caption">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function MoodleSection({ course }: { course: MoodleCourse }) {
  const { t, locale } = usePhoneLocale();
  const nav = useNav();
  const items = assignmentItems(locale).filter((a) => a.courseNo === course.courseNo);
  const all: { icon: IconName; label: string; count: number; unread?: boolean; page: ReactNode }[] = [
    {
      icon: 'megaphoneLine',
      label: t('feature_announcements'),
      count: course.announcements?.length ?? 0,
      unread: course.announcements?.some((a) => a.unread),
      page: <AnnouncementsPage course={course} />,
    },
    {
      icon: 'folder',
      label: t('course_detail_files_label'),
      count: course.materials?.reduce((n, s) => n + (s.items?.length ?? 0), 0) ?? 0,
      page: <MaterialsPage course={course} />,
    },
    {
      icon: 'doc',
      label: t('course_detail_assignments_label'),
      count: items.length,
      page: (
        <Page title={t('course_detail_assignments_label')}>
          <div className="td-ph-card td-ph-rows">
            {items.map((item) => (
              <button key={item.id} type="button" className="td-ph-row" onClick={() => nav.push(<AssignmentPage item={item} />)}>
                <span className="td-ph-row-main">{item.title}</span>
                <Icon name="chevron" className="td-ph-row-chevron" />
              </button>
            ))}
          </div>
        </Page>
      ),
    },
    {
      icon: 'chartLine',
      label: t('course_detail_moodle_grades_label'),
      count: course.grades?.filter((g) => g.type !== 'course').length ?? 0,
      page: <GradesPage course={course} />,
    },
    {
      icon: 'people',
      label: t('course_detail_members_label'),
      count: course.members?.length ?? 0,
      page: <MembersPage course={course} />,
    },
    {
      icon: 'chats',
      label: t('course_detail_forums_label'),
      count: course.forums?.reduce((n, f) => n + (f.discussions?.length ?? 0), 0) ?? 0,
      page: <ForumsPage course={course} />,
    },
  ];
  const rows = all.filter((row) => row.count > 0);

  return (
    <section className="td-ph-section">
      <hr className="td-ph-divider" />
      <SectionTitle>{t('calendar_source_moodle')}</SectionTitle>
      {rows.length ? (
        <div className="td-ph-card td-ph-rows">
          {rows.map((row) => (
            <button
              key={row.label}
              type="button"
              className="td-ph-row"
              style={{ '--ph-sep-inset': '52px' } as React.CSSProperties}
              onClick={() => nav.push(row.page)}
            >
              <Icon name={row.icon} className="td-ph-row-icon" />
              <span className="td-ph-row-main">{row.label}</span>
              {row.unread ? <span className="td-ph-dot" aria-label={t('bulletin_unread_dot_label')} /> : null}
              <span className="td-ph-row-value">{row.count}</span>
              <Icon name="chevron" className="td-ph-row-chevron" />
            </button>
          ))}
        </div>
      ) : null}
      {course.summary ? (
        <div style={{ padding: '16px 16px 0' }}>
          <h3 className="td-ph-caption" style={{ marginBottom: 6 }}>
            {t('course_detail_summary_label')}
          </h3>
          <DemoHtml html={text(course.summary, locale)} />
        </div>
      ) : null}
    </section>
  );
}
