import type { Locale } from '@/lib/locale';
import raw from '../data/demo.json';
import { DAY_MS, parseDemoTime, taipei } from './time';

/** A demo.json field that is one string or a `{ zh, en }` pair. */
export type DemoText = string | { zh?: string; en?: string };

export interface DemoCourse {
  courseNo: string;
  name: DemoText;
  instructor?: DemoText;
  credits?: number;
  classroom?: string;
  colorHex?: string;
  /** Weekday ("1" is Monday) to period ids. */
  schedule?: Record<string, string[]>;
  /** `weekday-period` to the room that meeting uses instead. */
  classroomMap?: Record<string, string>;
}

export interface DemoClassmate {
  studentId: string;
  nickname: DemoText;
  courses?: DemoCourse[];
}

export interface DemoAssignment {
  id: string;
  courseNo: string;
  courseName?: DemoText;
  title: DemoText;
  due: string;
  completed?: boolean;
}

export interface DemoBulletin {
  id?: number;
  title: string;
  org?: string;
  summary?: string;
  tags?: string[];
  postedAt?: string;
}

export interface DemoCalendarEntry {
  id?: string;
  title: string;
  date: string;
  source?: string;
}

export interface DemoAddress {
  name?: string;
  address: string;
}

export interface DemoMail {
  folder?: string;
  from: DemoAddress;
  to?: DemoAddress[];
  subject: DemoText;
  date: string;
  seen?: boolean;
  html?: DemoText;
  plain?: DemoText;
  attachments?: { name: DemoText; type?: string; size?: number }[];
}

export interface MoodleFile {
  name: string;
  size?: number;
  mime?: string;
  modified?: string;
}

export interface MoodlePost {
  id: number;
  parent?: number;
  created: string;
  author: DemoText;
  message: DemoText;
  attachments?: MoodleFile[];
  unread?: boolean;
  deleted?: boolean;
}

export interface MoodleAnnouncement {
  id: number;
  created: string;
  pinned?: boolean;
  unread?: boolean;
  author: DemoText;
  title: DemoText;
  message: DemoText;
  attachments?: MoodleFile[];
}

export interface MoodleDiscussion {
  id: number;
  pinned?: boolean;
  title: DemoText;
  posts: MoodlePost[];
}

export interface MoodleForum {
  id: number;
  name: DemoText;
  intro?: DemoText;
  discussions?: MoodleDiscussion[];
}

export interface MoodleMaterialItem {
  id: number;
  type: string;
  name: DemoText;
  file?: MoodleFile;
  files?: MoodleFile[];
  url?: string;
}

export interface MoodleSection {
  id: number;
  name: DemoText;
  items?: MoodleMaterialItem[];
}

export interface MoodleGrade {
  name?: DemoText;
  module?: string;
  type?: string;
  grade?: string;
  max?: number;
  feedback?: DemoText;
}

export interface MoodleMember {
  id: number;
  name: DemoText;
  role?: string;
  email?: string;
  description?: DemoText;
  interests?: string[];
}

export interface MoodleAssignment {
  id: number;
  intro?: DemoText;
  attachments?: MoodleFile[];
  submission?: { status?: string; time?: string; text?: DemoText };
}

export interface MoodleCourse {
  courseNo: string;
  moodleId: number;
  fullname?: DemoText;
  summary?: DemoText;
  announcements?: MoodleAnnouncement[];
  forums?: MoodleForum[];
  materials?: MoodleSection[];
  grades?: MoodleGrade[];
  members?: MoodleMember[];
  assignments?: MoodleAssignment[];
}

export interface DemoPortalEntry {
  category: string;
  name: DemoText;
  url: string;
}

export interface DemoData {
  /** The day the data was written as "today". */
  anchor: string;
  studentId: string;
  mail?: { studentId?: string; displayName?: DemoText; messages?: DemoMail[] };
  libraryQr?: { content: string; modules?: string[] };
  courses?: DemoCourse[];
  classmates?: DemoClassmate[];
  assignments?: DemoAssignment[];
  bulletins?: DemoBulletin[];
  calendar?: DemoCalendarEntry[];
  moodle?: { ownMemberId?: number; courses?: MoodleCourse[] };
  emptyClassroom?: {
    buildings?: Record<string, string>;
    classes?: { name: DemoText; teacher?: DemoText }[];
    rooms?: Record<string, Record<string, string>>;
  };
  informationSystem?: DemoPortalEntry[];
}

const DAY_PREFIX = /^\d{4}-\d{2}-\d{2}/;
const dayNumber = (day: string) => Date.UTC(+day.slice(0, 4), +day.slice(5, 7) - 1, +day.slice(8, 10)) / DAY_MS;

/** The app's DemoFixture.shifted: every string that starts with a day moves by `days`, the rest kept. */
export function shifted<T>(value: T, days: number): T {
  if (typeof value === 'string') {
    if (!DAY_PREFIX.test(value)) return value;
    return (new Date((dayNumber(value) + days) * DAY_MS).toISOString().slice(0, 10) + value.slice(10)) as T;
  }
  if (Array.isArray(value)) return value.map((inner) => shifted(inner, days)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, inner]) => [key, shifted(inner, days)])) as T;
  }
  return value;
}

const today = taipei(Date.now());
const days = Date.UTC(today.year, today.month - 1, today.day) / DAY_MS - dayNumber((raw as { anchor: string }).anchor);

/** The demo data, moved so that its anchor day is today in Taipei. */
export const demo = shifted(raw as unknown as DemoData, days);

export function text(value: DemoText | undefined, locale: Locale): string {
  if (value === undefined) return '';
  if (typeof value === 'string') return value;
  return (locale === 'zh' ? value.zh || value.en : value.en || value.zh) ?? '';
}

/** A demo.json time, already moved to today, in epoch milliseconds. */
export function demoTime(value: string | undefined): number | null {
  return parseDemoTime(value);
}

export function moodleCourse(courseNo: string): MoodleCourse | undefined {
  return demo.moodle?.courses?.find((course) => course.courseNo === courseNo);
}

export function demoCourse(courseNo: string): DemoCourse | undefined {
  return demo.courses?.find((course) => course.courseNo === courseNo);
}
