import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

export type MenuEntry =
  | { label: string; icon?: IconName; checked?: boolean; destructive?: boolean; onSelect: () => void }
  | 'divider';

interface Open {
  anchor: HTMLElement;
  entries: MenuEntry[];
  x: number;
  y: number;
  originX: 'left' | 'right';
  originY: 'top' | 'bottom';
}

type OpenMenu = (anchor: HTMLElement, entries: MenuEntry[]) => void;

const MenuContext = createContext<OpenMenu>(() => {});

export function useMenu(): OpenMenu {
  return useContext(MenuContext);
}

const MENU_WIDTH = 250;
const GAP = 8;

/** iOS 26's glass pull-down menu, opened from a button or a long press. */
export function MenuHost({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<Open | null>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);

  const openMenu = useCallback<OpenMenu>((anchor, entries) => {
    const host = hostRef.current;
    if (!host) return;
    const hostRect = host.getBoundingClientRect();
    const scale = hostRect.width / host.offsetWidth;
    const rect = anchor.getBoundingClientRect();
    const left = (rect.left - hostRect.left) / scale;
    const right = (rect.right - hostRect.left) / scale;
    const top = (rect.top - hostRect.top) / scale;
    const bottom = (rect.bottom - hostRect.top) / scale;
    const originX = left + (right - left) / 2 > host.offsetWidth / 2 ? 'right' : 'left';
    const originY = top > host.offsetHeight / 2 ? 'bottom' : 'top';
    const x = originX === 'right' ? Math.max(16, right - MENU_WIDTH) : Math.min(left, host.offsetWidth - MENU_WIDTH - 16);
    const y = originY === 'top' ? bottom + GAP : host.offsetHeight - top + GAP;
    setOpen({ anchor, entries, x, y, originX, originY });
  }, []);

  const [closing, setClosing] = useState(false);
  const finishClose = useCallback(() => {
    setClosing(false);
    setOpen((current) => {
      current?.anchor.focus({ preventScroll: true });
      return null;
    });
  }, []);
  // The menu shrinks away in CSS and is removed when that animation ends.
  const close = useCallback(() => setClosing(true), []);

  useEffect(() => {
    if (open) layerRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus({ preventScroll: true });
  }, [open]);

  return (
    <MenuContext.Provider value={openMenu}>
      <div ref={hostRef} style={{ position: 'absolute', inset: 0 }}>
        {children}
        {open ? (
            <div
              ref={layerRef}
              key="menu"
              className="td-ph-menu-layer"
              onPointerDown={(event) => {
                if (event.target === event.currentTarget) close();
              }}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  event.preventDefault();
                  event.stopPropagation();
                  close();
                }
                if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                  event.preventDefault();
                  const items = [...event.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]')];
                  const at = items.indexOf(document.activeElement as HTMLElement);
                  const next = (at + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
                  items[next]?.focus();
                }
              }}
            >
              <div
                className={closing ? 'td-ph-menu td-ph-menu--closing' : 'td-ph-menu'}
                role="menu"
                onAnimationEnd={() => {
                  if (closing) finishClose();
                }}
                style={{
                  width: MENU_WIDTH,
                  left: open.x,
                  ...(open.originY === 'top' ? { top: open.y } : { bottom: open.y }),
                  transformOrigin: `${open.originX} ${open.originY}`,
                }}
              >
                {open.entries.map((entry, index) =>
                  entry === 'divider' ? (
                    <hr key={index} />
                  ) : (
                    <button
                      key={index}
                      type="button"
                      role={entry.checked === undefined ? 'menuitem' : 'menuitemradio'}
                      aria-checked={entry.checked}
                      className={
                        entry.destructive ? 'td-ph-menu-item td-ph-menu-item--destructive' : 'td-ph-menu-item'
                      }
                      onClick={() => {
                        close();
                        entry.onSelect();
                      }}
                    >
                      {entry.checked !== undefined ? (
                        <span className="td-ph-check">{entry.checked ? <Icon name="check" /> : null}</span>
                      ) : null}
                      <span>{entry.label}</span>
                      {entry.icon ? <Icon name={entry.icon} /> : null}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : null}
      </div>
    </MenuContext.Provider>
  );
}

/** Opens a menu from a long press, as the tab bar and list rows do. */
/** How far a finger may drift during a long press, in screen pixels, before it counts as a drag. */
const LONG_PRESS_SLOP = 8;

export function useLongPress(onLongPress: (target: HTMLElement) => void, ms = 450) {
  const timer = useRef(0);
  const fired = useRef(false);
  const start = useRef({ x: 0, y: 0 });
  return useMemo(() => {
    const cancel = () => window.clearTimeout(timer.current);
    return {
      handlers: {
        onPointerDown: (event: React.PointerEvent<HTMLElement>) => {
          fired.current = false;
          start.current = { x: event.clientX, y: event.clientY };
          const target = event.currentTarget;
          cancel();
          timer.current = window.setTimeout(() => {
            fired.current = true;
            onLongPress(target);
          }, ms);
        },
        onPointerMove: (event: React.PointerEvent<HTMLElement>) => {
          if (Math.hypot(event.clientX - start.current.x, event.clientY - start.current.y) > LONG_PRESS_SLOP) cancel();
        },
        onPointerUp: cancel,
        onPointerLeave: cancel,
        onPointerCancel: cancel,
        onContextMenu: (event: React.MouseEvent<HTMLElement>) => {
          event.preventDefault();
          cancel();
          fired.current = true;
          onLongPress(event.currentTarget);
        },
      },
      cancel,
      /** True once, right after a long press, so the click that ends it is ignored. */
      consumeFired: () => {
        const was = fired.current;
        fired.current = false;
        return was;
      },
    };
  }, [ms, onLongPress]);
}
