import {
  createElement,
  forwardRef,
  useCallback,
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { isMotionValue, type MotionValue } from 'motion/react';

type Value = string | number | MotionValue<number> | MotionValue<string>;
type MotionStyle = { [key: string]: Value | undefined };

const TRANSFORM_KEYS = ['x', 'y', 'scale', 'rotate'];
const UNITLESS = new Set(['opacity', 'scale', 'zIndex']);

const read = (value: Value | undefined) => (isMotionValue(value) ? value.get() : value);
const withUnit = (key: string, value: string | number) =>
  typeof value === 'number' && !UNITLESS.has(key) ? `${value}px` : String(value);

function transformOf(style: MotionStyle): string {
  const x = read(style.x);
  const y = read(style.y);
  const scale = read(style.scale);
  const rotate = read(style.rotate);
  return [
    x !== undefined && x !== 0 ? `translateX(${withUnit('x', x)})` : '',
    y !== undefined && y !== 0 ? `translateY(${withUnit('y', y)})` : '',
    scale !== undefined && scale !== 1 ? `scale(${scale})` : '',
    rotate !== undefined && rotate !== 0 ? `rotate(${typeof rotate === 'number' ? `${rotate}deg` : rotate})` : '',
  ]
    .filter(Boolean)
    .join(' ');
}

/** Writes the style's motion values, and its x, y, scale and rotate, straight to the element. */
function apply(element: HTMLElement, style: MotionStyle) {
  element.style.transform = transformOf(style);
  for (const [key, value] of Object.entries(style)) {
    if (!TRANSFORM_KEYS.includes(key) && isMotionValue(value)) {
      element.style.setProperty(key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`), withUnit(key, value.get()));
    }
  }
}

/**
 * A div or span whose style may hold motion values, which update the element without a React
 * render. Motion's own `m` components do this too, but bring a renderer three times this
 * library's size.
 */
export const Motion = forwardRef<
  HTMLElement,
  Omit<HTMLAttributes<HTMLElement>, 'style'> & { as?: 'div' | 'span'; style?: MotionStyle; children?: ReactNode }
>(function Motion({ as = 'div', style = {}, ...props }, ref) {
  const element = useRef<HTMLElement | null>(null);
  const styleRef = useRef(style);
  styleRef.current = style;

  const setRef = useCallback(
    (node: HTMLElement | null) => {
      element.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref]
  );

  useLayoutEffect(() => {
    const node = element.current;
    if (!node) return;
    apply(node, style);
    const update = () => apply(node, styleRef.current);
    const stops = Object.values(style)
      .filter(isMotionValue)
      .map((value) => value.on('change', update));
    return () => stops.forEach((stop) => stop());
  });

  const plain: CSSProperties = {};
  for (const [key, value] of Object.entries(style)) {
    if (!TRANSFORM_KEYS.includes(key) && !isMotionValue(value)) (plain as Record<string, unknown>)[key] = value;
  }
  return createElement(as, { ...props, ref: setRef, style: plain });
});
