import type { Locale } from '@/lib/locale';
import { demo, demoCourse, demoTime, moodleCourse, text, type MoodleAssignment } from '../lib/demo';

export interface AssignmentItem {
  id: string;
  title: string;
  courseNo: string;
  courseName: string;
  due: number;
  submitted: boolean;
  moodle?: MoodleAssignment;
}

export function assignmentItems(locale: Locale): AssignmentItem[] {
  return (demo.assignments ?? [])
    .map((a): AssignmentItem | null => {
      const due = demoTime(a.due);
      if (due === null) return null;
      const course = demoCourse(a.courseNo);
      return {
        id: a.id,
        title: text(a.title, locale),
        courseNo: a.courseNo,
        courseName: course ? text(course.name, locale) : text(a.courseName, locale),
        due,
        submitted: a.completed ?? false,
        moodle: moodleCourse(a.courseNo)?.assignments?.find((m) => String(m.id) === a.id),
      };
    })
    .filter((a): a is AssignmentItem => a !== null)
    .sort((a, b) => a.due - b.due);
}

/** `Name • CODE`, as the app's assignment rows write the course. */
export function courseLine(item: AssignmentItem): string {
  return item.courseName && item.courseName !== item.courseNo ? `${item.courseName} • ${item.courseNo}` : item.courseNo;
}
