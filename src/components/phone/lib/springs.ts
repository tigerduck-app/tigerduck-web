import { JSAnimation, type MotionValue, type Transition } from 'motion/react';

/**
 * SwiftUI's `spring(response:dampingFraction:)` for a unit mass: stiffness (2π/response)²,
 * damping 4π·dampingFraction/response.
 */
function swiftSpring(response: number, dampingFraction: number): Transition {
  return {
    type: 'spring',
    stiffness: (2 * Math.PI / response) ** 2,
    damping: (4 * Math.PI * dampingFraction) / response,
    mass: 1,
  };
}

/** Every animation the phone runs, so they can be tuned together. */
export const SPRINGS = {
  /** The app's `Animation.smoothSpring`. */
  smooth: swiftSpring(0.35, 0.8),
  /** The app's `Animation.quickSpring`. */
  quick: swiftSpring(0.25, 0.7),
  /** A push or a tapped back button: critically damped, a little quicker than UIKit's. */
  navigation: swiftSpring(0.4, 1),
  /** A released swipe back, finishing or returning from the finger's speed. */
  swipeBack: swiftSpring(0.5, 1),
  /** Sheet presentation and detent changes. */
  sheet: swiftSpring(0.48, 0.86),
  /** The tab bar's glass lens sliding between tabs. */
  lens: swiftSpring(0.4, 0.72),
  /** A swipe row settling open or closed. */
  swipe: swiftSpring(0.32, 1),
  /** A pulled list springing back after release. */
  rubber: swiftSpring(0.4, 1),
} satisfies Record<string, Transition>;

export type SpringName = keyof typeof SPRINGS;

const reducedQuery =
  typeof window !== 'undefined' ? window.matchMedia?.('(prefers-reduced-motion: reduce)') : undefined;

export function prefersReducedMotion(): boolean {
  return reducedQuery?.matches ?? false;
}

/** The named spring, or an instant change when the visitor asks for reduced motion. */
export function spring(name: SpringName): Transition {
  return prefersReducedMotion() ? { duration: 0 } : SPRINGS[name];
}

/** iOS's rubber band: the farther past the edge, the less the content follows. */
export function rubberBand(distance: number, dimension: number, constant = 0.55): number {
  const sign = Math.sign(distance);
  const d = Math.abs(distance);
  return sign * (1 - 1 / ((d * constant) / dimension + 1)) * dimension;
}

type Options = Transition & { velocity?: number; onComplete?: () => void };

/**
 * Runs one value animation on a motion value. Motion's own `animate` also handles elements and
 * sequences, which the phone never uses and which triple the library's share of the bundle.
 * Without a `velocity`, it carries on only the speed of an animation it interrupts: a value
 * just moved with `set`, as a pushed page placed off screen, would report that jump as speed.
 */
export function animateTo(value: MotionValue<number>, to: number, options: Options): Promise<void> {
  const { onComplete, ...transition } = options;
  // Read before `start`, which stops the running animation first.
  const velocity = value.isAnimating() ? value.getVelocity() : 0;
  return value.start(
    (complete) =>
      new JSAnimation({
        keyframes: [value.get(), to],
        velocity,
        ...transition,
        motionValue: value,
        onUpdate: (latest: number) => value.set(latest),
        onComplete: () => {
          complete();
          onComplete?.();
        },
      } as ConstructorParameters<typeof JSAnimation<number>>[0])
  );
}

/** A fling that slows to a stop, bouncing back inside `min`..`max`. */
export function decay(value: MotionValue<number>, options: Transition & { velocity: number }): void {
  value.start(
    (complete) =>
      new JSAnimation({
        keyframes: [value.get()],
        ...options,
        type: 'inertia',
        motionValue: value,
        onUpdate: (latest: number) => value.set(latest),
        onComplete: complete,
      } as ConstructorParameters<typeof JSAnimation<number>>[0])
  );
}
