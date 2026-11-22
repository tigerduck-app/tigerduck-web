import { useEffect, useState } from 'react';

/** The app shows every time in Taipei, which keeps UTC+8 all year. */
const TAIPEI_OFFSET_MS = 8 * 3600_000;
export const DAY_MS = 86_400_000;
export const MINUTE_MS = 60_000;

export interface WallClock {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  /** 1 is Monday and 7 Sunday, as the class table counts. */
  weekday: number;
}

export function taipei(ms: number): WallClock {
  const d = new Date(ms + TAIPEI_OFFSET_MS);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
    hour: d.getUTCHours(),
    minute: d.getUTCMinutes(),
    weekday: ((d.getUTCDay() + 6) % 7) + 1,
  };
}

export function startOfTaipeiDay(ms: number): number {
  return Math.floor((ms + TAIPEI_OFFSET_MS) / DAY_MS) * DAY_MS - TAIPEI_OFFSET_MS;
}

/** A demo.json time: an ISO date with a zone, or a Taipei wall-clock date or date-time. */
export function parseDemoTime(text: string | undefined): number | null {
  if (!text) return null;
  const normalized = text.trim().replace(' ', 'T');
  const hasZone = /(Z|[+-]\d{2}:?\d{2})$/.test(normalized);
  const withTime = normalized.includes('T') ? normalized : `${normalized}T00:00`;
  const ms = Date.parse(hasZone ? withTime : `${withTime}+08:00`);
  return Number.isNaN(ms) ? null : ms;
}

const pad = (n: number) => String(n).padStart(2, '0');

export function hhmm(ms: number): string {
  const c = taipei(ms);
  return `${pad(c.hour)}:${pad(c.minute)}`;
}

/** `M/d`, as the app's lists show dates. */
export function monthDay(ms: number): string {
  const c = taipei(ms);
  return `${c.month}/${c.day}`;
}

export function monthDayTime(ms: number): string {
  return `${monthDay(ms)} ${hhmm(ms)}`;
}

/** Minutes after Taipei midnight for `HH:mm`. */
export function minutesOf(text: string): number {
  const [h, m] = text.split(':').map(Number);
  return h * 60 + m;
}

/** The current time, ticking on whole minutes. */
export function useNow(): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    let timer = 0;
    const schedule = () => {
      timer = window.setTimeout(() => {
        setNow(Date.now());
        schedule();
      }, MINUTE_MS - (Date.now() % MINUTE_MS) + 50);
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, []);
  return now;
}
