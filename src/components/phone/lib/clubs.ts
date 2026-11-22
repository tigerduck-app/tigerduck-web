import { useSyncExternalStore } from 'react';
import type { Locale } from '@/lib/locale';
import { demo, text } from './demo';
import { comingDay, fnv1a, PALETTE } from './schedule';
import { MINUTE_MS, minutesOf } from './time';

/** One activity of a subscribed club, as the app's ClubOccurrence. */
export interface ClubOccurrence {
  kind: 'club';
  /** The activity's id. */
  id: number;
  clubId: number;
  clubName: string;
  name: string;
  color: string;
  /** The club's place in the subscriptions, 0 first; where two clubs overlap, the lower one shows. */
  priority: number;
  /** Epoch milliseconds. */
  start: number;
  end: number;
  location: string;
  /** The feed's activity type: 社課或會議, 活動 or another the feed names. */
  type?: string;
  content: string;
}

// The visitor's subscriptions, kept in memory for the visit.
let subscribed: readonly number[] = (demo.clubs ?? []).filter((club) => club.subscribed).map((club) => club.id);
const listeners = new Set<() => void>();

export function useSubscribedClubs(): readonly number[] {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => subscribed
  );
}

export function setSubscribed(id: number, on: boolean) {
  subscribed = on ? [...subscribed.filter((other) => other !== id), id] : subscribed.filter((other) => other !== id);
  listeners.forEach((listener) => listener());
}

/** The app's ClubSubscriptions.defaultColor. */
export function clubColor(id: number): string {
  return PALETTE[fnv1a(String(id)) % PALETTE.length];
}

/** The subscribed clubs' activities, each on its coming weekday from `now`. */
export function clubOccurrences(ids: readonly number[], now: number, locale: Locale): ClubOccurrence[] {
  return ids.flatMap((id, priority) => {
    const club = demo.clubs?.find((c) => c.id === id);
    if (!club) return [];
    return (club.activities ?? []).map((activity): ClubOccurrence => {
      const day = comingDay(activity.weekday, now);
      return {
        kind: 'club',
        id: activity.id,
        clubId: club.id,
        clubName: text(club.name, locale),
        name: text(activity.name, locale),
        color: clubColor(club.id),
        priority,
        start: day + minutesOf(activity.start) * MINUTE_MS,
        end: day + minutesOf(activity.end) * MINUTE_MS,
        location: text(activity.location, locale),
        type: activity.type,
        content: text(activity.content ?? undefined, locale),
      };
    });
  });
}
