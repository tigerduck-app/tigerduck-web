import { useMemo, useRef, useState } from 'react';
import { k, usePhoneLocale } from '../../lib/i18n';
import { dueLabel } from '../../lib/format';
import { taipei } from '../../lib/time';
import { useMenu } from '../../ui/Menu';
import { useNav } from '../../ui/NavStack';
import { Page } from '../../ui/Page';
import { usePresenter } from '../../ui/sheetContext';
import { SwipeRow } from '../../ui/SwipeRow';
import { EmptyState, GlassButton, Segmented, SectionTitle, SyncDot } from '../../ui/controls';
import { assignmentItems, courseLine, type AssignmentItem } from '../assignments';
import { CourseSheet } from '../course/CourseSheet';
import { AssignmentPage } from '../moodle/AssignmentPage';
import { TimeMachine } from './TimeMachine';
import { useRefresh } from '../useRefresh';

type Filter = 'incomplete' | 'all';

function greeting(now: number): string {
  const hour = taipei(now).hour;
  if (hour >= 5 && hour < 12) return k('greeting_morning');
  if (hour >= 12 && hour < 18) return k('greeting_afternoon');
  return k('greeting_evening');
}

export function HomeScreen({ now }: { now: number }) {
  const { t, locale } = usePhoneLocale();
  const nav = useNav();
  const presenter = usePresenter();
  const openMenu = useMenu();
  const menuButton = useRef<HTMLButtonElement>(null);
  const { busy, refresh } = useRefresh();
  const [filter, setFilter] = useState<Filter>('incomplete');
  const [done, setDone] = useState<ReadonlySet<string>>(new Set());
  const [ignored, setIgnored] = useState<ReadonlySet<string>>(new Set());
  const [reminders, setReminders] = useState({ assignments: true, liveActivity: true });
  const items = useMemo(() => assignmentItems(locale), [locale]);
  const shown = items.filter((item) =>
    filter === 'incomplete' ? !item.submitted && !done.has(item.id) && !ignored.has(item.id) : !ignored.has(item.id)
  );

  return (
    <Page
      title={t(greeting(now))}
      titleMode="app"
      onRefresh={refresh}
      trailing={
        <>
          <SyncDot busy={busy} label={t('feature_home')} />
          <GlassButton
            icon="dots"
            label={t('home_more_actions')}
            buttonRef={menuButton}
            onClick={() =>
              openMenu(menuButton.current!, [
                { label: t('home_edit'), icon: 'pencil', onSelect: () => {} },
                'divider',
                {
                  label: t('settings_assignment_due_reminder'),
                  checked: reminders.assignments,
                  onSelect: () => setReminders((r) => ({ ...r, assignments: !r.assignments })),
                },
                {
                  label: t('live_activity_settings_nav_title'),
                  checked: reminders.liveActivity,
                  onSelect: () => setReminders((r) => ({ ...r, liveActivity: !r.liveActivity })),
                },
              ])
            }
          />
        </>
      }
    >
      <TimeMachine
        now={now}
        onOpen={(meeting) => presenter.present(<CourseSheet course={meeting.course} meeting={meeting} />)}
      />
      <section className="td-ph-section">
        <SectionTitle>{t('live_activity_status_assignment_short')}</SectionTitle>
        <Segmented
          label={t('live_activity_status_assignment_short')}
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'incomplete', label: t('assignment_filter_incomplete') },
            { value: 'all', label: t('assignment_filter_all') },
          ]}
        />
        <div className="td-ph-list" style={{ marginTop: 12 }}>
          {shown.map((item) => (
                  <SwipeRow
                    key={item.id}
                    className="td-ph-list-item"
                    fullSwipe
                    leading={[
                      {
                        label: t('assignment_mark_complete'),
                        icon: 'checkCircle',
                        color: 'var(--ph-green)',
                        removes: filter === 'incomplete',
                        onTrigger: () => setDone((s) => new Set(s).add(item.id)),
                      },
                    ]}
                    trailing={[
                      {
                        label: t('assignment_ignore'),
                        icon: 'archive',
                        color: 'var(--ph-gray)',
                        removes: true,
                        onTrigger: () => setIgnored((s) => new Set(s).add(item.id)),
                      },
                    ]}
                  >
                    <AssignmentRow
                      item={item}
                      now={now}
                      markedDone={done.has(item.id)}
                      onOpen={() => nav.push(<AssignmentPage item={item} />)}
                    />
                  </SwipeRow>
          ))}
          {shown.length === 0 ? <EmptyState icon="checkCircle" title={t('home_assignments_none_incomplete')} /> : null}
        </div>
      </section>
    </Page>
  );
}

function AssignmentRow({
  item,
  now,
  markedDone,
  onOpen,
}: {
  item: AssignmentItem;
  now: number;
  markedDone: boolean;
  onOpen: () => void;
}) {
  const { t } = usePhoneLocale();
  const overdue = !item.submitted && !markedDone && item.due <= now;
  const status = item.submitted
    ? { label: t('assignment_status_submitted'), color: 'var(--ph-green)' }
    : markedDone
      ? { label: t('assignment_mark_complete'), color: 'var(--ph-green)' }
      : overdue
        ? { label: t('assignment_status_overdue'), color: 'var(--ph-red-text)' }
        : null;
  return (
    <button type="button" className="td-ph-card td-ph-assignment" onClick={onOpen}>
      <span className="td-ph-row-main">
        <span>{item.title}</span>
        <span className="td-ph-caption">{courseLine(item)}</span>
      </span>
      <span className="td-ph-assignment-status">
        {status ? <b style={{ color: status.color }}>{status.label}</b> : null}
        <span style={overdue ? { color: 'var(--ph-red-text)', fontWeight: 700 } : undefined}>
          {dueLabel(item.due, now, t)}
        </span>
      </span>
    </button>
  );
}
