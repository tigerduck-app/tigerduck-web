import { useCallback, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { demo, demoTime, text, type DemoCourse } from '../../lib/demo';
import { k, usePhoneLocale } from '../../lib/i18n';
import { clubOccurrences, useSubscribedClubs, type ClubOccurrence } from '../../lib/clubs';
import {
  changedRoom,
  changesOn,
  comingDay,
  courseColor,
  currentTerm,
  isAssessment,
  meetingsOn,
  PERIODS,
  periodRuns,
  roomFor,
  tint,
} from '../../lib/schedule';
import { DAY_MS, minutesOf, startOfTaipeiDay, taipei } from '../../lib/time';
import { Icon } from '../../ui/Icon';
import { useMenu, type MenuEntry } from '../../ui/Menu';
import { Page } from '../../ui/Page';
import { usePresenter } from '../../ui/sheetContext';
import { GlassButton, SyncDot } from '../../ui/controls';
import { ClubSheet } from '../course/ClubSheet';
import { CourseName, CourseSheet } from '../course/CourseSheet';
import { ClubsSheet } from './ClubsSheet';
import { useRefresh } from '../useRefresh';

const CELL = 52;
const GAP = 3;
const HEADER = 30;
const NAME_SIZE = 12;
/** The app's TimetableCellMetrics.roomHintSize: the room line under a name, 0.85 of it. */
const ROOM_SIZE = NAME_SIZE * 0.85;
/** The app's ClassTableClubLayout: a club block names its club from this height, and its place from the next. */
const CLUB_NAME_HEIGHT = 24;
const CLUB_LOCATION_HEIGHT = 44;
/** The app's CourseRoomHint.shortRoomCode: only a room code this short fits under a name. */
const SHORT_ROOM =
  /^([A-Za-z0-9]{2}-[A-Za-z0-9]{3}(-[A-Za-z0-9])?|[A-Za-z0-9]{2} [A-Za-z0-9] [A-Za-z0-9]{3}|\p{Script=Han}{1,3}[A-Za-z]?\d{2,4}(-\d)?)$/u;
/** The app's course names shrink to fit their cell down to this factor (`minimumScaleFactor`). */
const MIN_NAME_SCALE = 0.7;
const WEEKDAY_KEYS = [
  k('weekday_mon_short'),
  k('weekday_tue_short'),
  k('weekday_wed_short'),
  k('weekday_thu_short'),
  k('weekday_fri_short'),
  k('weekday_sat_short'),
  k('weekday_sun_short'),
];

/** Whose class table is shown: null for the student's own, or a classmate's student ID. */
export function useTableChoice() {
  const { t, locale } = usePhoneLocale();
  const [shown, setShown] = useState<string | null>(null);
  const menu = useCallback(
    (afterPick: () => void): MenuEntry[] => [
      { label: demo.studentId, checked: shown === null, onSelect: () => (setShown(null), afterPick()) },
      ...(demo.classmates ?? []).map(
        (mate): MenuEntry => ({
          label: text(mate.nickname, locale),
          checked: shown === mate.studentId,
          onSelect: () => (setShown(mate.studentId), afterPick()),
        })
      ),
      'divider',
      { label: t('class_table_list_title'), icon: 'classTable', onSelect: afterPick },
    ],
    [locale, shown, t]
  );
  return { shown, menu };
}

/** `115-1`: the ROC year the school year starts in, and the semester. */
function semesterLabel(now: number): string {
  const { year, semester } = currentTerm(now);
  return `${year}-${semester}`;
}

export function ClassTableScreen({ now, tables }: { now: number; tables: ReturnType<typeof useTableChoice> }) {
  const { t, locale } = usePhoneLocale();
  const presenter = usePresenter();
  const openMenu = useMenu();
  const { busy, refresh } = useRefresh();
  const menuButton = useRef<HTMLButtonElement>(null);
  const switcher = useRef<HTMLButtonElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const mate = demo.classmates?.find((c) => c.studentId === tables.shown);
  const courses = mate ? mate.courses ?? [] : demo.courses ?? [];
  const credits = courses.reduce((sum, c) => sum + (c.credits ?? 0), 0);
  const clubIds = useSubscribedClubs();
  const clubs = useMemo(() => (mate ? [] : clubOccurrences(clubIds, now, locale)), [mate, clubIds, now, locale]);
  const today = taipei(now);
  const semesterStart = demoTime(demo.calendar?.find((e) => e.source === 'semester')?.date);
  const week = semesterStart !== null ? Math.floor((startOfTaipeiDay(now) - semesterStart) / (7 * DAY_MS)) + 1 : null;

  useLayoutEffect(() => {
    grid.current?.querySelectorAll<HTMLElement>('.td-ph-ct-name').forEach((name) => {
      name.style.fontSize = '';
      const scale = name.clientWidth / name.scrollWidth;
      if (scale < 1) name.style.fontSize = `${NAME_SIZE * Math.max(MIN_NAME_SCALE, scale)}px`;
    });
  }, [courses, locale]);

  const weekdays = useMemo(() => {
    const used = new Set(courses.flatMap((c) => Object.keys(c.schedule ?? {}).map(Number)));
    clubs.forEach((club) => used.add(taipei(club.start).weekday));
    return [1, 2, 3, 4, 5, ...[6, 7].filter((d) => used.has(d))];
  }, [courses, clubs]);
  // The app's activePeriods(withClubs:): a period a club's time meets shows too.
  const periods = useMemo(() => {
    const used = new Set(courses.flatMap((c) => Object.values(c.schedule ?? {}).flat()));
    const clubMinutes = clubs.map((club) => [minuteOfDay(club.start), minuteOfDay(club.end)]);
    return PERIODS.filter(
      (p, i) =>
        i < 10 ||
        used.has(p.id) ||
        clubMinutes.some(([start, end]) => start < minutesOf(p.end) && minutesOf(p.start) < end)
    );
  }, [courses, clubs]);

  /** Opens the course at the tapped cell's meeting on its coming day, as the app's class table does. */
  const open = (course: DemoCourse, weekday: number, period: string) => {
    const meeting = meetingsOn([course], comingDay(weekday, now), locale).find((m) => m.periods[0] === period);
    presenter.present(<CourseSheet course={course} meeting={meeting} />);
  };

  const nowMinute = today.hour * 60 + today.minute;
  const nowTop = nowLineTop(nowMinute, periods);
  const columns = `36px repeat(${weekdays.length}, minmax(0, 1fr))`;

  return (
    <Page
      title={t('feature_class_table')}
      titleMode="bar"
      onRefresh={refresh}
      trailing={
        <>
          <SyncDot busy={busy} label={t('feature_class_table')} />
          <GlassButton
            icon="dots"
            label={t('class_table_more_actions')}
            buttonRef={menuButton}
            onClick={() =>
              openMenu(menuButton.current!, [
                { label: t('add_course_title'), icon: 'plus', onSelect: () => {} },
                {
                  label: t('class_table_subscribe_clubs'),
                  icon: 'people',
                  onSelect: () => presenter.present(<ClubsSheet />, { detents: ['large'] }),
                },
                { label: t('class_table_share'), icon: 'qr', onSelect: () => {} },
                'divider',
                { label: t('class_table_export_screenshot'), icon: 'copy', onSelect: () => {} },
                { label: t('class_table_export_ics'), icon: 'calendar', onSelect: () => {} },
              ])
            }
          />
        </>
      }
    >
      <div className="td-ph-ct-bar">
        <span className="td-ph-ct-semester">
          {semesterLabel(now)} <Icon name="chevronDown" />
        </span>
        <button
          ref={switcher}
          type="button"
          className="td-ph-ct-owner"
          onClick={() => openMenu(switcher.current!, tables.menu(() => {}))}
        >
          {mate ? `${text(mate.nickname, locale)} · ` : ''}
          {t('class_table_total_credits_value', credits)}
          <Icon name="chevronDown" />
        </button>
      </div>
      <div ref={grid} className="td-ph-ct" style={{ gridTemplateColumns: columns } as CSSProperties}>
        <span className="td-ph-ct-head td-ph-ct-week">{week !== null && week > 0 ? `W${week}` : ''}</span>
        {weekdays.map((d) => (
          <span key={d} className={d === today.weekday ? 'td-ph-ct-head td-ph-ct-head--today' : 'td-ph-ct-head'}>
            {t(WEEKDAY_KEYS[d - 1])}
          </span>
        ))}
        {periods.map((p, row) => (
          <span key={p.id} className="td-ph-ct-period" style={{ gridRow: row + 2 }}>
            <small>{p.start}</small>
            <b>{p.id}</b>
            <small>{p.end}</small>
          </span>
        ))}
        {periods.flatMap((p, row) =>
          weekdays.map((d, col) => (
            <span key={`${p.id}-${d}`} className="td-ph-ct-empty" style={{ gridRow: row + 2, gridColumn: col + 2 }} />
          ))
        )}
        {courses.flatMap((course) =>
          Object.entries(course.schedule ?? {}).flatMap(([day, ids]) => {
            const col = weekdays.indexOf(Number(day));
            if (col < 0) return [];
            return periodRuns(ids).map((run) => {
              const row = periods.findIndex((p) => p.id === run[0]);
              const color = courseColor(course);
              const name = text(course.name, locale);
              const changes = mate ? [] : changesOn(course.courseNo, comingDay(Number(day), now), run);
              const moved = changedRoom(changes, t);
              const hint = roomFor(course, Number(day), run[0]);
              const room = moved ?? (SHORT_ROOM.test(hint) ? hint : null);
              return (
                <button
                  key={`${course.courseNo}-${day}-${run[0]}`}
                  type="button"
                  className="td-ph-ct-course"
                  style={{
                    gridRow: `${row + 2} / span ${run.length}`,
                    gridColumn: col + 2,
                    // The tint sits on the page colour so the empty cells under a course do not show through.
                    background: `linear-gradient(${tint(color, 0.3)}, ${tint(color, 0.3)}), var(--ph-bg)`,
                  }}
                  aria-label={`${name}, ${t(WEEKDAY_KEYS[Number(day) - 1])} ${run.join(', ')}`}
                  onClick={() => open(course, Number(day), run[0])}
                >
                  <span className="td-ph-ct-name" style={room ? { marginBottom: ROOM_SIZE + 2 } : undefined}>
                    <CourseName name={name} assessment={isAssessment(changes)} />
                  </span>
                  {room ? (
                    <span className={moved ? 'td-ph-ct-room td-ph-ct-room--changed' : 'td-ph-ct-room'}>
                      {moved ? <Icon name="swap" /> : null}
                      {room}
                    </span>
                  ) : null}
                  {changes.some((c) => c.kind === 'note') ? <Icon name="bubble" className="td-ph-ct-note" /> : null}
                </button>
              );
            });
          })
        )}
        {clubBlocks(clubs, courses, periods).map((block) => (
          <button
            key={`${block.club.id}@${block.start}`}
            type="button"
            className="td-ph-ct-club"
            style={{
              top: HEADER + GAP + block.top,
              height: block.height,
              // An absolute grid item ends at the padding edge unless its span is given.
              gridColumn: `${weekdays.indexOf(taipei(block.club.start).weekday) + 2} / span 1`,
              background: `linear-gradient(${tint(block.club.color, 0.3)}, ${tint(block.club.color, 0.3)}), var(--ph-bg)`,
              boxShadow: `inset 3px 0 0 ${block.club.color}`,
            }}
            aria-label={[block.club.clubName, block.club.name, block.club.location].filter(Boolean).join(', ')}
            onClick={() => presenter.present(<ClubSheet club={block.club} />)}
          >
            {block.height >= CLUB_NAME_HEIGHT ? (
              <span className="td-ph-ct-name" style={block.height >= CLUB_LOCATION_HEIGHT ? { marginBottom: ROOM_SIZE + 2 } : undefined}>
                {block.club.clubName}
              </span>
            ) : null}
            {block.height >= CLUB_LOCATION_HEIGHT && block.club.location ? (
              <span className="td-ph-ct-room">{block.club.location}</span>
            ) : null}
          </button>
        ))}
        {nowTop !== null && weekdays.includes(today.weekday) ? (
          <span
            className="td-ph-ct-now"
            style={{ top: HEADER + GAP + nowTop, gridColumn: `${weekdays.indexOf(today.weekday) + 2}` }}
            aria-hidden="true"
          />
        ) : null}
      </div>
    </Page>
  );
}

const minuteOfDay = (ms: number) => taipei(ms).hour * 60 + taipei(ms).minute;

type Interval = [number, number];

/** The app's ClassTableClubLayout.pieces: what is left of `interval` outside every blocker. */
function pieces(interval: Interval, blockers: Interval[]): Interval[] {
  return blockers.reduce<Interval[]>(
    (left, [bStart, bEnd]) =>
      left.flatMap(([start, end]): Interval[] =>
        bStart < end && start < bEnd
          ? ([[start, bStart], [bEnd, end]] as Interval[]).filter(([a, b]) => a < b)
          : [[start, end]]
      ),
    [interval]
  );
}

/**
 * The app's ClassTableClubLayout.segments and blocks: each activity less the day's classes and the
 * activities ranked above it, placed down the grid in points.
 */
function clubBlocks(clubs: ClubOccurrence[], courses: DemoCourse[], periods: { id: string; start: string; end: string }[]) {
  const ranked = [...clubs].sort((a, b) => a.priority - b.priority || a.start - b.start || a.id - b.id);
  const byDay = new Map<number, Interval[]>();
  const first = minutesOf(periods[0].start);
  const last = minutesOf(periods[periods.length - 1].end);
  const y = (minute: number) => nowLineTop(Math.min(Math.max(minute, first), last), periods) ?? 0;
  return ranked.flatMap((club) => {
    const weekday = taipei(club.start).weekday;
    if (!byDay.has(weekday)) {
      const ids = courses.flatMap((c) => c.schedule?.[String(weekday)] ?? []);
      byDay.set(
        weekday,
        PERIODS.filter((p) => ids.includes(p.id)).map((p): Interval => [minutesOf(p.start), minutesOf(p.end)])
      );
    }
    const blockers = byDay.get(weekday)!;
    const own: Interval = [minuteOfDay(club.start), minuteOfDay(club.end)];
    const blocks = pieces(own, blockers).flatMap(([start, end]) => {
      const top = y(start) + (blockers.some(([, b]) => b === start) ? GAP : 0);
      const bottom = y(end) - (blockers.some(([a]) => a === end) ? GAP : 0);
      return bottom > top ? [{ club, start, top, height: bottom - top }] : [];
    });
    blockers.push(own);
    return blocks;
  });
}

/** Where the current minute falls down the grid, or null outside class hours. */
function nowLineTop(minute: number, periods: { start: string; end: string }[]): number | null {
  const pitch = CELL + GAP;
  if (!periods.length || minute < minutesOf(periods[0].start) || minute > minutesOf(periods[periods.length - 1].end)) {
    return null;
  }
  for (let i = 0; i < periods.length; i++) {
    const start = minutesOf(periods[i].start);
    const end = minutesOf(periods[i].end);
    if (minute < start) return i * pitch - GAP / 2;
    if (minute <= end) return i * pitch + (CELL * (minute - start)) / (end - start);
  }
  return null;
}
