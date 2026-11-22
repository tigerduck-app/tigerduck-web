import { hhmm } from '../lib/time';

/** The status bar: the time in the left ear of the Dynamic Island, signal and battery on the right. */
export function StatusBar({ now }: { now: number }) {
  return (
    <div className="td-ph-statusbar" aria-hidden="true">
      <time>{hhmm(now)}</time>
      <span>
        <svg width="19" height="12" viewBox="0 0 19 12" fill="currentColor">
          <rect x="0" y="8" width="3.2" height="4" rx="1" />
          <rect x="5" y="5.5" width="3.2" height="6.5" rx="1" />
          <rect x="10" y="3" width="3.2" height="9" rx="1" />
          <rect x="15" y="0" width="3.2" height="12" rx="1" />
        </svg>
        <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
          <path d="M8.5 2.3c2.4 0 4.6.9 6.3 2.5l1.2-1.2A10.6 10.6 0 0 0 8.5.6 10.6 10.6 0 0 0 1 3.6l1.2 1.2A8.9 8.9 0 0 1 8.5 2.3Z" />
          <path d="M8.5 5.6c1.5 0 2.9.6 4 1.5l1.2-1.2a7.4 7.4 0 0 0-10.4 0l1.2 1.2c1.1-1 2.5-1.5 4-1.5Z" />
          <path d="M8.5 8.8c.7 0 1.3.3 1.8.7L8.5 11.3 6.7 9.5c.5-.4 1.1-.7 1.8-.7Z" />
        </svg>
        <svg width="28" height="13" viewBox="0 0 28 13">
          <rect x="0.5" y="0.5" width="24" height="12" rx="3.8" fill="none" stroke="currentColor" opacity="0.4" />
          <rect x="2.2" y="2.2" width="17" height="8.6" rx="2.2" fill="currentColor" />
          <path d="M26 4.4v4.2c.8-.3 1.4-1.1 1.4-2.1s-.6-1.8-1.4-2.1Z" fill="currentColor" opacity="0.45" />
        </svg>
      </span>
    </div>
  );
}
