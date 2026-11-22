import { useState, type ReactNode } from 'react';
import { moodleCourse, text, type DemoCourse, type MoodleCourse } from '../../lib/demo';
import type { Locale } from '@/lib/locale';
import { usePhoneLocale, type Translate } from '../../lib/i18n';
import { changeDays, changedRoom, courseColor, meetingsOn, type CourseChange, type Meeting } from '../../lib/schedule';
import { hhmm, startOfTaipeiDay, taipei } from '../../lib/time';
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
  const moved = meeting ? changedRoom(meeting.changes, t) : null;
  const room = moved ?? meeting?.room ?? course.classroom ?? '';

  return (
    <Page title={text(course.name, locale)}>
      <div className="td-ph-course-bar" style={{ background: color }} />
      <div className="td-ph-course-facts">
        {room ? <Fact label={t('course_detail_classroom_label')} value={room} changed={moved !== null} /> : null}
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
      {meeting ? <CourseChanges course={course} onCards={meeting} /> : null}
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

/** A course name; for a class with an assessment, the app's dashed underline in assessment ink. */
export function CourseName({ name, assessment }: { name: string; assessment: boolean }) {
  const { t } = usePhoneLocale();
  if (!assessment) return <>{name}</>;
  return (
    <span className="td-ph-assessment" aria-label={`${name}, ${t('course_change_assessment')}`}>
      {name}
    </span>
  );
}

export function Fact({ label, value, changed = false }: { label: string; value: string; changed?: boolean }) {
  return (
    <div className="td-ph-card td-ph-fact">
      <span className="td-ph-caption">{label}</span>
      <strong style={changed ? { color: 'var(--ph-change)' } : undefined}>{value}</strong>
    </div>
  );
}

/** The app's CourseDetailChanges: the course's coming days with a change, up to eight. */
function CourseChanges({ course, onCards }: { course: DemoCourse; onCards: Meeting }) {
  const { t, locale } = usePhoneLocale();
  const rows = changeDays(course.courseNo, Date.now())
    .map((day) => ({ day, summary: changeSummary(meetingsOn([course], day, locale), onCards, t, locale) }))
    .filter((row) => row.summary)
    .slice(0, 8);
  if (!rows.length) return null;
  return (
    <section className="td-ph-course-changes">
      <hr className="td-ph-divider" />
      <h3>{t('course_detail_changes')}</h3>
      <dl>
        {rows.map((row) => (
          <div key={row.day}>
            <dt>{dayWeekday(row.day, locale)}</dt>
            <dd>{row.summary}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** `M/d (narrow weekday)`, as the app's Date.dayWeekdayFormatter. */
function dayWeekday(day: number, locale: Locale): string {
  const { month, day: date } = taipei(day);
  const weekday = new Intl.DateTimeFormat(locale === 'zh' ? 'zh-Hant' : 'en', {
    weekday: 'narrow',
    timeZone: 'Asia/Taipei',
  }).format(day);
  return `${month}/${date} (${weekday})`;
}

/** The app's CourseChange.listedText. */
function listedText(change: CourseChange, t: Translate, locale: Locale): string | null {
  const note = text(change.note, locale) || null;
  if (change.kind === 'assessment') return note && `${t('course_change_assessment')} · ${note}`;
  if (change.kind === 'online') return [t('course_change_online'), note].filter(Boolean).join(' · ');
  return note;
}

/**
 * The app's CourseDetailChanges.changeSummary: a day's changed rooms and listed changes. The class
 * on the sheet's cards, which show its own room, lists only rooms of its other periods.
 */
function changeSummary(meetings: Meeting[], onCards: Meeting, t: Translate, locale: Locale): string {
  const parts: string[] = [];
  for (const meeting of meetings) {
    const rooms = meeting.changes.filter((c) => c.kind === 'room' && c.room);
    const onCard =
      startOfTaipeiDay(meeting.start) === startOfTaipeiDay(onCards.start) &&
      meeting.periods.some((p) => onCards.periods.includes(p));
    parts.push(
      ...rooms
        .filter((c) => !onCard || !onCards.periods.some((p) => !c.periods || c.periods.includes(p)))
        .map((c) => c.room!)
    );
  }
  const held = meetings.flatMap((m) => m.changes);
  const listed = ['assessment', 'online', 'note'].flatMap((kind) => held.filter((c) => c.kind === kind));
  const seenIds = new Set<number>();
  for (const change of listed) {
    if (seenIds.has(change.id)) continue;
    seenIds.add(change.id);
    const line = listedText(change, t, locale);
    if (line) parts.push(line);
  }
  return [...new Set(parts)].join(' · ');
}

export function InfoRow({ label, children }: { label: string; children: ReactNode }) {
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
