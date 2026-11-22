import { startOfTaipeiDay } from './time';

/** The time machine's track: class time at a fixed scale, the gaps between classes compressed. */
export const POINTS_PER_MINUTE = 0.9;
const REFERENCE_MINUTES = 30;
const MIN_GAP = 20;
const MAX_GAP = 80;
const DAY_GAP = 40;
const HOUR_MS = 3600_000;

interface Anchor {
  t: number;
  x: number;
}

function gapWidth(minutes: number): number {
  if (minutes <= 0) return MIN_GAP;
  const linear = minutes * POINTS_PER_MINUTE;
  const compressed = Math.log(1 + minutes / REFERENCE_MINUTES) * POINTS_PER_MINUTE * REFERENCE_MINUTES;
  return Math.min(Math.max(Math.min(linear, compressed), MIN_GAP), MAX_GAP);
}

export function timelineAnchors(items: { start: number; end: number }[]): Anchor[] {
  const busy: { start: number; end: number }[] = [];
  for (const item of [...items].sort((a, b) => a.start - b.start)) {
    const last = busy[busy.length - 1];
    if (last && item.start <= last.end) last.end = Math.max(last.end, item.end);
    else busy.push({ ...item });
  }
  if (!busy.length) return [];
  const anchors: Anchor[] = [{ t: busy[0].start - HOUR_MS, x: 0 }];
  let x = gapWidth(60);
  busy.forEach((span, i) => {
    anchors.push({ t: span.start, x });
    x += ((span.end - span.start) / 60_000) * POINTS_PER_MINUTE;
    anchors.push({ t: span.end, x });
    const next = busy[i + 1];
    if (!next) return;
    const crossesDay = startOfTaipeiDay(span.start) !== startOfTaipeiDay(next.start);
    x += crossesDay ? DAY_GAP : gapWidth((next.start - span.end) / 60_000);
  });
  x += gapWidth(60);
  anchors.push({ t: busy[busy.length - 1].end + HOUR_MS, x });
  return anchors;
}

function interpolate(anchors: Anchor[], value: number, from: 't' | 'x', to: 't' | 'x', perUnit: number): number {
  const first = anchors[0];
  const last = anchors[anchors.length - 1];
  if (value <= first[from]) return first[to] - (first[from] - value) * perUnit;
  if (value >= last[from]) return last[to] + (value - last[from]) * perUnit;
  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i];
    const b = anchors[i + 1];
    if (value >= a[from] && value <= b[from]) {
      const span = b[from] - a[from];
      return span > 0 ? a[to] + ((value - a[from]) / span) * (b[to] - a[to]) : a[to];
    }
  }
  return 0;
}

export function xFor(anchors: Anchor[], t: number): number {
  return anchors.length < 2 ? 0 : interpolate(anchors, t, 't', 'x', POINTS_PER_MINUTE / 60_000);
}

export function timeFor(anchors: Anchor[], x: number, fallback: number): number {
  return anchors.length < 2 ? fallback : interpolate(anchors, x, 'x', 't', 60_000 / POINTS_PER_MINUTE);
}
