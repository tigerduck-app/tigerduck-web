import type { Locale } from '@/lib/locale';
import type { Translate } from './i18n';
import { monthDay, monthDayTime, hhmm, startOfTaipeiDay } from './time';

/** An assignment's due time as the app's lists write it: relative ahead, absolute once past. */
export function dueLabel(due: number, now: number, t: Translate): string {
  const seconds = (due - now) / 1000;
  if (seconds <= 0) return monthDayTime(due);
  const later = t('assignment_time_suffix_later');
  const days = Math.ceil(seconds / 86400);
  if (days > 3) return t('assignment_time_days_with_suffix', days, later);
  return t('assignment_time_hours_with_suffix', Math.ceil(seconds / 3600), later);
}

/** A list date: the time today, otherwise `M/d`. */
export function listDate(ms: number, now: number): string {
  return startOfTaipeiDay(ms) === startOfTaipeiDay(now) ? hhmm(ms) : monthDay(ms);
}

export function fileSize(bytes: number | undefined): string {
  if (bytes === undefined) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** A span such as "2 days, 5 hr", as Apple's abbreviated duration format writes it; two units at most. */
export function durationText(ms: number, locale: Locale): string {
  const tag = locale === 'zh' ? 'zh-Hant' : 'en';
  const unit = (value: number, name: 'day' | 'hour' | 'minute') =>
    new Intl.NumberFormat(tag, { style: 'unit', unit: name, unitDisplay: 'short' }).format(value);
  const minutes = Math.max(1, Math.floor(ms / 60_000));
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const parts = days
    ? [unit(days, 'day'), hours ? unit(hours, 'hour') : '']
    : hours
      ? [unit(hours, 'hour'), minutes % 60 ? unit(minutes % 60, 'minute') : '']
      : [unit(minutes, 'minute')];
  return parts.filter(Boolean).join(locale === 'zh' ? ' ' : ', ');
}
