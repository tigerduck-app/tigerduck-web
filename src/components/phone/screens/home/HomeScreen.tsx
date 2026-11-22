import { useMemo, useRef, useState } from 'react';
import type { SwipeAction } from '../../ui/SwipeRow';
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
import { ClubSheet } from '../course/ClubSheet';
import { CourseSheet } from '../course/CourseSheet';
import { AssignmentPage } from '../moodle/AssignmentPage';
import { TimeMachine } from './TimeMachine';
import { useRefresh } from '../useRefresh';

type Filter = 'incomplete' | 'all' | 'ignored';
/** What the visitor did to an assignment: the app's local completion or its ignore. */
type Mark = 'done' | 'ignored';

/** The app's `upcomingSorted`, `allCandidates` and `ignoredSorted` in Array+Assignments.swift. */
function inFilter(filter: Filter, item: AssignmentItem, mark: Mark | undefined): boolean {
  switch (filter) {
    case 'incomplete':
      return !item.submitted && mark === undefined;
    case 'all':
      return mark !== 'ignored' || item.submitted;
    case 'ignored':
      return mark === 'ignored';
  }
}

const EMPTY_MESSAGE: Record<Filter, string> = {
  incomplete: k('home_assignments_none_incomplete'),
  all: k('home_assignments_none'),
  ignored: k('home_assignments_no_ignored'),
};

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
  const [marks, setMarks] = useState<ReadonlyMap<string, Mark>>(new Map());
  const [reminders, setReminders] = useState({ assignments: true, liveActivity: true });
  const items = useMemo(() => assignmentItems(locale), [locale]);
  const hasIgnored = [...marks.values()].includes('ignored');
  // The app's HomeAssignmentList.recompute: the ignored filter goes with the last ignored assignment.
  if (filter === 'ignored' && !hasIgnored) setFilter('all');
  const shown = items.filter((item) => inFilter(filter, item, marks.get(item.id)));
  const actions = (item: AssignmentItem): { leading: SwipeAction; trailing: SwipeAction } => {
    const mark = marks.get(item.id);
    const action = (label: string, icon: SwipeAction['icon'], color: string, next: Mark | undefined): SwipeAction => ({
      label: t(label),
      icon,
      color,
      removes: !inFilter(filter, item, next),
      onTrigger: () =>
        setMarks((current) => {
          const changed = new Map(current);
          if (next) changed.set(item.id, next);
          else changed.delete(item.id);
          return changed;
        }),
    });
    return {
      leading:
        mark === 'done'
          ? action(k('assignment_mark_complete_undo'), 'undo', 'var(--ph-gray)', undefined)
          : action(k('assignment_mark_complete'), 'checkCircle', 'var(--ph-green)', 'done'),
      trailing:
        mark === 'ignored'
          ? action(k('assignment_ignore_undo'), 'undo', 'var(--ph-gray)', undefined)
          : action(k('assignment_ignore'), 'archive', 'var(--ph-gray)', 'ignored'),
    };
  };

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
        onOpen={(item) =>
          presenter.present(
            'clubId' in item ? <ClubSheet club={item} /> : <CourseSheet course={item.course} meeting={item} />
          )
        }
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
            { value: 'ignored', label: t('assignment_filter_ignored'), hidden: !hasIgnored },
          ]}
        />
        <div className="td-ph-list" style={{ marginTop: 12 }}>
          {shown.map((item) => {
            const { leading, trailing } = actions(item);
            return (
              <SwipeRow key={item.id} className="td-ph-list-item" fullSwipe leading={[leading]} trailing={[trailing]}>
                <AssignmentRow
                  item={item}
                  now={now}
                  mark={marks.get(item.id)}
                  onOpen={() => nav.push(<AssignmentPage item={item} />)}
                />
              </SwipeRow>
            );
          })}
          {shown.length === 0 ? (
            <EmptyState icon="checkCircle" title={t('home_assignments_all_good')} message={t(EMPTY_MESSAGE[filter])} />
          ) : null}
        </div>
      </section>
    </Page>
  );
}

function AssignmentRow({
  item,
  now,
  mark,
  onOpen,
}: {
  item: AssignmentItem;
  now: number;
  mark: Mark | undefined;
  onOpen: () => void;
}) {
  const { t } = usePhoneLocale();
  const pastDue = item.due <= now;
  const overdue = !item.submitted && mark === undefined && pastDue;
  const ignoredLabel = { label: t('assignment_filter_ignored'), color: 'var(--ph-text-2)' };
  const doneLabel = { label: t('assignment_mark_complete'), color: 'var(--ph-green)' };
  const overdueLabel = { label: t('assignment_status_overdue'), color: 'var(--ph-red-text)' };
  // The app's UpcomingAssignmentRow: a submitted row keeps the visitor's mark as a second badge,
  // and a marked row past due keeps its lateness.
  const status = item.submitted
    ? { label: t('assignment_status_submitted'), color: 'var(--ph-green)' }
    : mark === 'ignored'
      ? ignoredLabel
      : mark === 'done'
        ? doneLabel
        : overdue
          ? overdueLabel
          : null;
  const extra = item.submitted
    ? mark === 'done'
      ? doneLabel
      : mark === 'ignored'
        ? ignoredLabel
        : null
    : mark !== undefined && pastDue
      ? overdueLabel
      : null;
  const timeColor = overdue || (!item.submitted && mark !== undefined) ? 'var(--ph-red-text)' : undefined;
  return (
    <button type="button" className="td-ph-card td-ph-assignment" onClick={onOpen}>
      <span className="td-ph-row-main">
        <span>{item.title}</span>
        <span className="td-ph-caption">{courseLine(item)}</span>
      </span>
      <span className="td-ph-assignment-status">
        {extra ? <b style={{ color: extra.color }}>{extra.label}</b> : null}
        {status ? <b style={{ color: status.color }}>{status.label}</b> : null}
        <span style={timeColor ? { color: timeColor, fontWeight: overdue ? 700 : undefined } : undefined}>
          {dueLabel(item.due, now, t)}
        </span>
      </span>
    </button>
  );
}
