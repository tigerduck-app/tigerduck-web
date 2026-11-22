import type { Locale } from '@/lib/locale';
import { demo, text, type DemoCourse } from './demo';
import type { Translate } from './i18n';
import { DAY_MS, MINUTE_MS, minutesOf, startOfTaipeiDay, taipei } from './time';

/** NTUST's periods, as the app's `AppConstants.PeriodTimes`. */
export const PERIODS: { id: string; start: string; end: string }[] = [
  { id: '1', start: '08:10', end: '09:00' },
  { id: '2', start: '09:10', end: '10:00' },
  { id: '3', start: '10:20', end: '11:10' },
  { id: '4', start: '11:20', end: '12:10' },
  { id: '5', start: '12:20', end: '13:10' },
  { id: '6', start: '13:20', end: '14:10' },
  { id: '7', start: '14:20', end: '15:10' },
  { id: '8', start: '15:30', end: '16:20' },
  { id: '9', start: '16:30', end: '17:20' },
  { id: '10', start: '17:30', end: '18:20' },
  { id: 'A', start: '18:25', end: '19:15' },
  { id: 'B', start: '19:20', end: '20:10' },
  { id: 'C', start: '20:15', end: '21:05' },
  { id: 'D', start: '21:10', end: '22:00' },
];

const PERIOD_INDEX = new Map(PERIODS.map((p, i) => [p.id, i]));

/** The app's 20-colour course palette, `TigerDuckTheme.coursePaletteHexes`. */
export const PALETTE = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#F39C12', '#DDA0DD', '#2ECC71', '#E74C3C', '#3498DB', '#F7DC6F', '#9B59B6',
  '#1ABC9C', '#E67E22', '#85C1E9', '#D35400', '#27AE60', '#C0392B', '#8E44AD', '#16A085', '#F1C40F', '#2980B9',
];

export function fnv1a(value: string): number {
  let hash = 2166136261;
  for (const char of value) hash = Math.imul(hash ^ char.codePointAt(0)!, 16777619) >>> 0;
  return hash;
}

export function courseColor(course: Pick<DemoCourse, 'courseNo' | 'colorHex'>): string {
  return course.colorHex ?? PALETTE[fnv1a(course.courseNo) % PALETTE.length];
}

/** `#RRGGBB` at an opacity. */
export function tint(hex: string, alpha: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

/** A regular term: the ROC school year and its semester. */
export interface Term {
  year: number;
  semester: 1 | 2;
}

/** The term `now` falls in, as the app's AcademicTerm.estimated: the first from August, the second from February. */
export function currentTerm(now: number): Term {
  const { year, month } = taipei(now);
  if (month >= 8) return { year: year - 1911, semester: 1 };
  return month === 1 ? { year: year - 1912, semester: 1 } : { year: year - 1912, semester: 2 };
}

/** The regular term `count` before `term`, as the app's AcademicTerm.previousRegular. */
export function termsBefore(term: Term, count: number): Term {
  const index = term.year * 2 + term.semester - 1 - count;
  return { year: Math.floor(index / 2), semester: ((index % 2) + 1) as 1 | 2 };
}

/** The coming `weekday` from today, today included: the app's ClassTableViewModel.nextDate. */
export function comingDay(weekday: number, now: number): number {
  const today = startOfTaipeiDay(now);
  return today + ((weekday - taipei(today).weekday + 7) % 7) * DAY_MS;
}

// Placed once a load, as the app places them when the demo account signs in.
const CHANGES = (demo.courseChanges ?? []).map((change) => ({ ...change, day: comingDay(change.weekday, Date.now()) }));

export type CourseChange = (typeof CHANGES)[number];

/** The changes to a course on the Taipei day `day` that cover any of `periods`. */
export function changesOn(courseNo: string, day: number, periods: string[]): CourseChange[] {
  return CHANGES.filter(
    (c) => c.courseNo === courseNo && c.day === day && (!c.periods || c.periods.some((p) => periods.includes(p)))
  );
}

/** Each day from `from` on with a change to the course, in order. */
export function changeDays(courseNo: string, from: number): number[] {
  const days = CHANGES.filter((c) => c.courseNo === courseNo && c.day >= startOfTaipeiDay(from)).map((c) => c.day);
  return [...new Set(days)].sort((a, b) => a - b);
}

export const isAssessment = (changes: CourseChange[]) => changes.some((c) => c.kind === 'assessment');

/** The app's CourseChange.changedRoom: a room change's room, or Online for a class held online. */
export function changedRoom(changes: CourseChange[], t: Translate): string | null {
  const change = changes.find((c) => (c.kind === 'room' && c.room) || c.kind === 'online');
  if (!change) return null;
  return change.kind === 'room' ? change.room! : t('course_change_online');
}

export interface Meeting {
  id: string;
  course: DemoCourse;
  title: string;
  instructor: string;
  room: string;
  color: string;
  weekday: number;
  periods: string[];
  /** Epoch milliseconds. */
  start: number;
  end: number;
  changes: CourseChange[];
}

/** A course's periods on one weekday, joined into runs of back-to-back periods. */
export function periodRuns(periods: string[]): string[][] {
  const sorted = periods.filter((p) => PERIOD_INDEX.has(p)).sort((a, b) => PERIOD_INDEX.get(a)! - PERIOD_INDEX.get(b)!);
  const runs: string[][] = [];
  for (const period of sorted) {
    const last = runs[runs.length - 1];
    if (last && PERIOD_INDEX.get(period)! === PERIOD_INDEX.get(last[last.length - 1])! + 1) last.push(period);
    else runs.push([period]);
  }
  return runs;
}

export function roomFor(course: DemoCourse, weekday: number, period: string): string {
  return course.classroomMap?.[`${weekday}-${period}`] ?? course.classroom ?? '';
}

/** Every class meeting on the Taipei day that `dayMs` falls in. */
export function meetingsOn(courses: DemoCourse[], dayMs: number, locale: Locale): Meeting[] {
  const midnight = startOfTaipeiDay(dayMs);
  const weekday = taipei(midnight).weekday;
  return courses
    .flatMap((course) =>
      periodRuns(course.schedule?.[String(weekday)] ?? []).map((run): Meeting => {
        const first = PERIODS[PERIOD_INDEX.get(run[0])!];
        const last = PERIODS[PERIOD_INDEX.get(run[run.length - 1])!];
        return {
          id: `${course.courseNo}-${midnight}-${run[0]}`,
          course,
          title: text(course.name, locale),
          instructor: text(course.instructor, locale),
          room: roomFor(course, weekday, run[0]),
          color: courseColor(course),
          weekday,
          periods: run,
          start: midnight + minutesOf(first.start) * MINUTE_MS,
          end: midnight + minutesOf(last.end) * MINUTE_MS,
          changes: changesOn(course.courseNo, midnight, run),
        };
      })
    )
    .sort((a, b) => a.start - b.start);
}

/** Meetings from `radius` days before to `radius` days after `now`. */
export function meetingsAround(courses: DemoCourse[], now: number, locale: Locale, radius = 3): Meeting[] {
  const today = startOfTaipeiDay(now);
  return Array.from({ length: radius * 2 + 1 }, (_, i) => today + (i - radius) * DAY_MS).flatMap((day) =>
    meetingsOn(courses, day, locale)
  );
}
