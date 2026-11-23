import { useLayoutEffect, useRef, useState } from 'react';
import { useMotionValue } from 'motion/react';
import { phoneScale, usePan } from '../lib/gesture';
import { animateTo, spring } from '../lib/springs';
import { Icon, type IconName } from './Icon';
import { useLongPress } from './Menu';
import { Motion } from './Motion';

export interface TabItem<T extends string> {
  id: T;
  label: string;
  icon: IconName;
}

const BAR_PADDING = 4;

/**
 * iOS 26's floating glass tab bar. The selected tab sits on a lens that slides between tabs; a
 * finger on the bar lifts the lens, which can be dragged to another tab.
 */
export function TabBar<T extends string>({
  tabs,
  selected,
  onSelect,
  onLongPress,
  label,
}: {
  tabs: TabItem<T>[];
  selected: T;
  onSelect: (id: T) => void;
  onLongPress?: (id: T, anchor: HTMLElement) => void;
  label: string;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const index = Math.max(0, tabs.findIndex((tab) => tab.id === selected));
  const lensX = useMotionValue(0);
  const lensScale = useMotionValue(1);
  const [itemWidth, setItemWidth] = useState(0);
  const [lifted, setLifted] = useState(false);
  const dragFrom = useRef(0);
  const pressedTab = useRef<T | null>(null);
  const longPress = useLongPress((target) => {
    const id = pressedTab.current;
    if (id && onLongPress) onLongPress(id, target);
  });

  useLayoutEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const width = (bar.offsetWidth - BAR_PADDING * 2) / tabs.length;
    setItemWidth(width);
    if (lensX.get() === 0 && index === 0) return;
    animateTo(lensX, index * width, spring('lens'));
  }, [index, lensX, tabs.length]);

  const lift = (on: boolean) => {
    setLifted(on);
    animateTo(lensScale, on ? 1.18 : 1, spring('lens'));
  };

  usePan(barRef, {
    axis: 'x',
    onStart: () => {
      longPress.cancel();
      lensX.stop();
      dragFrom.current = lensX.get();
      lift(true);
    },
    onMove: (info) => {
      const max = itemWidth * (tabs.length - 1);
      const x = dragFrom.current + info.dx / phoneScale(barRef.current!);
      lensX.set(Math.min(max + 12, Math.max(-12, x)));
    },
    onEnd: () => {
      const nearest = Math.min(tabs.length - 1, Math.max(0, Math.round(lensX.get() / itemWidth)));
      lift(false);
      animateTo(lensX, nearest * itemWidth, spring('lens'));
      onSelect(tabs[nearest].id);
    },
  });

  return (
    <div
      ref={barRef}
      className="td-ph-tabbar td-ph-glass"
      role="tablist"
      aria-label={label}
      onPointerDown={() => lift(true)}
      onPointerUp={() => lift(false)}
      onPointerLeave={() => lifted && lift(false)}
      onKeyDown={(event) => {
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
        event.preventDefault();
        const next = (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
        onSelect(tabs[next].id);
        barRef.current?.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus();
      }}
    >
      <Motion
        className={lifted ? 'td-ph-tabbar-lens td-ph-tabbar-lens--lifted' : 'td-ph-tabbar-lens'}
        style={{ x: lensX, scale: lensScale, width: itemWidth, left: BAR_PADDING }}
      />
      {tabs.map((tab, i) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={tab.id === selected}
          tabIndex={i === index ? 0 : -1}
          className="td-ph-tab-item"
          {...longPress.handlers}
          onPointerDown={(event) => {
            pressedTab.current = tab.id;
            longPress.handlers.onPointerDown(event);
          }}
          onClick={() => {
            if (longPress.consumeFired()) return;
            onSelect(tab.id);
          }}
        >
          <Icon name={tab.icon} />
          <small>{tab.label}</small>
        </button>
      ))}
    </div>
  );
}
