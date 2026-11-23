import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { JSAnimation, useMotionValue, useTransform } from 'motion/react';
import { phoneScale, usePan, useSwallowNextClick } from '../lib/gesture';
import { rubberBand, animateTo, spring } from '../lib/springs';
import { Icon, type IconName } from './Icon';
import { Motion } from './Motion';

export interface SwipeAction {
  label: string;
  icon: IconName;
  color: string;
  onTrigger: () => void;
  /** The row folds away before the action runs, as a row the action deletes. */
  removes?: boolean;
}

const ACTION_WIDTH = 70;
const ACTION_GAP = 8;
/** Share of the row's width past which a full swipe runs the first trailing action. */
const FULL_SWIPE = 0.6;

interface OpenRows {
  announce: (owner: symbol) => void;
  listen: (listener: (owner: symbol) => void) => () => void;
}

const OpenRowsContext = createContext<OpenRows | null>(null);

/** Keeps one row open in the phone: opening one closes the others, as UITableView does. */
export function SwipeRowScope({ children }: { children: ReactNode }) {
  const [rows] = useState<OpenRows>(() => {
    const listeners = new Set<(owner: symbol) => void>();
    return {
      announce: (owner) => listeners.forEach((listener) => listener(owner)),
      listen: (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
    };
  });
  return <OpenRowsContext.Provider value={rows}>{children}</OpenRowsContext.Provider>;
}

function revealWidth(count: number): number {
  return count ? count * ACTION_WIDTH + count * ACTION_GAP : 0;
}

/** A list row whose actions slide out from under it. */
export function SwipeRow({
  leading = [],
  trailing = [],
  fullSwipe = false,
  className,
  children,
}: {
  className?: string;
  leading?: SwipeAction[];
  trailing?: SwipeAction[];
  /** Whether a long trailing swipe runs the first trailing action. */
  fullSwipe?: boolean;
  children: ReactNode;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const owner = useRef(Symbol('swipe-row'));
  const rows = useContext(OpenRowsContext);
  const swallowNextClick = useSwallowNextClick();
  if (!rows) throw new Error('SwipeRow needs a SwipeRowScope above it');
  const x = useMotionValue(0);
  const dragFrom = useRef(0);
  const [armed, setArmed] = useState(false);
  const [open, setOpen] = useState(false);
  const folded = useRef(false);
  const trailingWidth = useTransform(x, (v) => Math.max(0, -v - ACTION_GAP));
  const leadingWidth = useTransform(x, (v) => Math.max(0, v - ACTION_GAP));

  const settle = (target: number, velocity = 0) => {
    setOpen(target !== 0);
    if (target !== 0) rows.announce(owner.current);
    animateTo(x, target, { ...spring('swipe'), velocity });
  };

  useEffect(() => {
    const listener = (other: symbol) => {
      if (other !== owner.current && x.get() !== 0) settle(0);
    };
    return rows.listen(listener);
  }, [rows, x]);

  // A tap anywhere else in the phone closes the open row and does nothing more, as in UITableView.
  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      const target = event.target as Element;
      if (rowRef.current?.contains(target)) return;
      if (target.closest?.('.td-ph-app')) swallowNextClick(event);
      settle(0);
    };
    window.addEventListener('pointerdown', onDown, true);
    return () => window.removeEventListener('pointerdown', onDown, true);
  }, [open, swallowNextClick]);

  // A folded row that its list keeps, as one a filter change brings back, opens up again closed.
  useLayoutEffect(() => {
    if (!folded.current) return;
    folded.current = false;
    const row = rowRef.current!;
    row.style.height = row.style.opacity = row.style.overflow = '';
    x.set(0);
    setOpen(false);
  });

  const run = (action: SwipeAction) => {
    if (!action.removes) {
      settle(0);
      action.onTrigger();
      return;
    }
    const row = rowRef.current!;
    const height = row.offsetHeight;
    row.style.overflow = 'hidden';
    new JSAnimation({
      keyframes: [1, 0],
      ...spring('smooth'),
      onUpdate: (p: number) => {
        row.style.height = `${height * p}px`;
        row.style.opacity = String(p);
      },
      onComplete: () => {
        folded.current = true;
        action.onTrigger();
      },
    });
  };

  usePan(rowRef, {
    axis: 'x',
    canStart: (info) =>
      x.get() !== 0 || (info.dx < 0 ? trailing.length > 0 : leading.length > 0),
    onStart: () => {
      x.stop();
      dragFrom.current = x.get();
      rows.announce(owner.current);
    },
    onMove: (info) => {
      const element = rowRef.current!;
      const width = element.offsetWidth;
      const raw = dragFrom.current + info.dx / phoneScale(element);
      const limit = raw < 0 ? revealWidth(trailing.length) : revealWidth(leading.length);
      let next = raw;
      if (raw < 0 && fullSwipe && trailing.length) {
        next = Math.max(raw, -width);
      } else if (Math.abs(raw) > limit) {
        next = Math.sign(raw) * (limit + rubberBand(Math.abs(raw) - limit, width, 0.3));
      }
      x.set(next);
      setArmed(fullSwipe && next < -width * FULL_SWIPE);
    },
    onEnd: (info) => {
      const element = rowRef.current!;
      const width = element.offsetWidth;
      const velocity = info.vx / phoneScale(element);
      const value = x.get();
      if (armed && trailing.length) {
        setArmed(false);
        animateTo(x, -width, { ...spring('swipe'), velocity }).then(() => run(trailing[0]));
        return;
      }
      setArmed(false);
      const side = value < 0 ? trailing : leading;
      const reveal = revealWidth(side.length);
      const flung = Math.abs(velocity) > 400;
      const opens = reveal > 0 && (flung ? Math.sign(velocity) === Math.sign(value) : Math.abs(value) > reveal / 2);
      settle(opens ? Math.sign(value) * reveal : 0, velocity);
    },
  });

  const actions = (list: SwipeAction[], side: 'leading' | 'trailing') => (
    <Motion
      className={`td-ph-swipe-actions td-ph-swipe-actions--${side}`}
      style={{ width: side === 'trailing' ? trailingWidth : leadingWidth }}
    >
      {list.map((action, index) => (
        <button
          key={action.label}
          type="button"
          className="td-ph-swipe-action"
          style={{
            background: action.color,
            flex: armed && side === 'trailing' ? (index === 0 ? 1 : 0.0001) : 1,
            transition: 'flex-grow 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
          aria-label={action.label}
          tabIndex={open ? 0 : -1}
          onClick={() => run(action)}
        >
          <Icon name={action.icon} />
        </button>
      ))}
    </Motion>
  );

  return (
    <div ref={rowRef} className={className ? `td-ph-swipe ${className}` : 'td-ph-swipe'}>
      {leading.length ? actions(leading, 'leading') : null}
      {trailing.length ? actions(trailing, 'trailing') : null}
      <Motion
        className="td-ph-swipe-face"
        style={{ x }}
        onClickCapture={(event) => {
          if (x.get() === 0) return;
          event.stopPropagation();
          event.preventDefault();
          settle(0);
        }}
      >
        {children}
      </Motion>
    </div>
  );
}
