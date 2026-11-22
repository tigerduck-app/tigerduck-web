import { demo, demoTime, text, type MoodleCourse, type MoodleDiscussion, type MoodleForum, type MoodleMember } from '../../lib/demo';
import { k, usePhoneLocale } from '../../lib/i18n';
import { monthDayTime } from '../../lib/time';
import { Icon } from '../../ui/Icon';
import { useNav } from '../../ui/NavStack';
import { Page } from '../../ui/Page';
import { DemoHtml, Group, Row } from '../../ui/controls';
import { FileRows } from './FileRows';

/** The app's MoodleMemberSection.Placement order: auditors come before students. */
const ROLE_ORDER: { roles: string[]; key: string }[] = [
  { roles: ['editingteacher'], key: k('course_detail_instructor_label') },
  { roles: ['teacher'], key: k('course_members_tas') },
  { roles: ['auditor_student'], key: k('course_members_auditors') },
  { roles: ['student'], key: k('course_members_students') },
];

/** Moodle writes a student as `ID @ Name`; the list shows the name. */
function shownName(member: MoodleMember, locale: 'zh' | 'en'): string {
  const full = text(member.name, locale);
  return full.includes(' @ ') ? full.split(' @ ')[1] : full;
}

function Avatar({ name }: { name: string }) {
  return (
    <span className="td-ph-avatar" aria-hidden="true">
      {name.slice(0, 1)}
    </span>
  );
}

export function MembersPage({ course }: { course: MoodleCourse }) {
  const { t, locale } = usePhoneLocale();
  const nav = useNav();
  const me = demo.moodle?.ownMemberId;
  return (
    <Page title={t('course_detail_members_label')}>
      {ROLE_ORDER.map(({ roles, key }) => {
        // Sorted by the full name, which leads with the student ID for students, the visitor first.
        const members = (course.members ?? [])
          .filter((m) => roles.includes(m.role ?? 'student'))
          .sort((a, b) => Number(b.id === me) - Number(a.id === me) || text(a.name, locale).localeCompare(text(b.name, locale)));
        if (!members.length) return null;
        return (
          <Group key={key} header={`${t(key)} · ${members.length}`}>
            {members.map((member) => {
              const name = shownName(member, locale);
              return (
                <button
                  key={member.id}
                  type="button"
                  className="td-ph-row"
                  style={{ '--ph-sep-inset': '62px' } as React.CSSProperties}
                  onClick={() => nav.push(<MemberPage member={member} />)}
                >
                  <Avatar name={name} />
                  <span className="td-ph-row-main">
                    <span>{name}</span>
                  </span>
                  {member.id === me ? <span className="td-ph-tag">{t('course_member_me')}</span> : null}
                  <Icon name="chevron" className="td-ph-row-chevron" />
                </button>
              );
            })}
          </Group>
        );
      })}
    </Page>
  );
}

function MemberPage({ member }: { member: MoodleMember }) {
  const { t, locale } = usePhoneLocale();
  const name = shownName(member, locale);
  return (
    <Page title={name}>
      <div className="td-ph-member-hero">
        <Avatar name={name} />
      </div>
      <Group>
        {member.email ? <Row title={t('course_member_email')} value={member.email} /> : null}
        {member.interests?.length ? <Row title={member.interests.join(', ')} /> : null}
      </Group>
      {member.description ? (
        <div className="td-ph-section">
          <div className="td-ph-card td-ph-pad">
            <DemoHtml html={text(member.description, locale)} />
          </div>
        </div>
      ) : null}
    </Page>
  );
}

export function ForumsPage({ course }: { course: MoodleCourse }) {
  const { t, locale } = usePhoneLocale();
  const nav = useNav();
  const forums = course.forums ?? [];
  if (forums.length === 1) return <ForumPage forum={forums[0]} />;
  return (
    <Page title={t('course_detail_forums_label')}>
      <Group>
        {forums.map((forum) => (
          <Row key={forum.id} icon="chats" title={text(forum.name, locale)} onClick={() => nav.push(<ForumPage forum={forum} />)} />
        ))}
      </Group>
    </Page>
  );
}

function ForumPage({ forum }: { forum: MoodleForum }) {
  const { t, locale } = usePhoneLocale();
  const nav = useNav();
  return (
    <Page title={text(forum.name, locale)}>
      {forum.intro ? (
        <p className="td-ph-sub" style={{ padding: '0 16px 12px' }}>
          {text(forum.intro, locale)}
        </p>
      ) : null}
      <div className="td-ph-list">
        {(forum.discussions ?? []).map((discussion) => {
          const first = discussion.posts[0];
          const unread = discussion.posts.some((p) => p.unread);
          return (
            <div key={discussion.id} className="td-ph-list-item">
              <button
                type="button"
                className="td-ph-card td-ph-post"
                onClick={() => nav.push(<DiscussionPage discussion={discussion} />)}
              >
                <span className="td-ph-post-head">
                  {unread ? <span className="td-ph-dot" aria-label={t('bulletin_unread_dot_label')} /> : null}
                  {discussion.pinned ? <Icon name="pin" className="td-ph-post-pin" /> : null}
                  <strong>{text(discussion.title, locale)}</strong>
                </span>
                <span className="td-ph-caption">
                  {first ? `${text(first.author, locale)} · ${monthDayTime(demoTime(first.created) ?? 0)}` : ''}
                  {' · '}
                  <Icon name="chats" /> {discussion.posts.length}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </Page>
  );
}

function DiscussionPage({ discussion }: { discussion: MoodleDiscussion }) {
  const { t, locale } = usePhoneLocale();
  const depthOf = (id: number | undefined, seen = 0): number => {
    const post = discussion.posts.find((p) => p.id === id);
    return post?.parent === undefined || seen > 4 ? seen : depthOf(post.parent, seen + 1);
  };
  return (
    <Page title={text(discussion.title, locale)}>
      <div className="td-ph-list">
        {discussion.posts.map((post) => (
          <div
            key={post.id}
            className="td-ph-list-item"
            style={{ paddingLeft: 16 + Math.min(depthOf(post.id), 3) * 14 }}
          >
            <article className="td-ph-card td-ph-pad td-ph-forum-post" style={post.deleted ? { opacity: 0.5 } : undefined}>
              <header>
                <Avatar name={text(post.author, locale)} />
                <span className="td-ph-row-main">
                  <b>{text(post.author, locale)}</b>
                  <span className="td-ph-caption">{monthDayTime(demoTime(post.created) ?? 0)}</span>
                </span>
                {post.unread ? <span className="td-ph-dot" aria-label={t('bulletin_unread_dot_label')} /> : null}
              </header>
              <DemoHtml html={text(post.message, locale)} />
              {post.attachments?.length ? (
                <div className="td-ph-group td-ph-inner-group">
                  <FileRows files={post.attachments} />
                </div>
              ) : null}
            </article>
          </div>
        ))}
      </div>
    </Page>
  );
}
