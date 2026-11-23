import { createContext, createElement, useContext, useMemo, useState, type ReactNode } from 'react';
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

const DEFAULT_SUBSCRIBED: readonly number[] = (demo.clubs ?? []).filter((club) => club.subscribed).map((club) => club.id);

export interface ClubSubscriptions {
  /** Club ids in subscription order. */
  ids: readonly number[];
  set: (id: number, on: boolean) => void;
}

const SubscriptionsContext = createContext<ClubSubscriptions | null>(null);

/** Holds the visitor's club subscriptions for the life of one phone, starting from the demo's. */
export function ClubSubscriptionsProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState(DEFAULT_SUBSCRIBED);
  const value = useMemo<ClubSubscriptions>(
    () => ({
      ids,
      set: (id, on) => setIds((list) => [...list.filter((other) => other !== id), ...(on ? [id] : [])]),
    }),
    [ids]
  );
  return createElement(SubscriptionsContext.Provider, { value }, children);
}

export function useClubSubscriptions(): ClubSubscriptions {
  const value = useContext(SubscriptionsContext);
  if (!value) throw new Error('useClubSubscriptions needs a ClubSubscriptionsProvider above it');
  return value;
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
