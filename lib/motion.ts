import type { Variants, Transition } from "framer-motion";

/**
 * Shared motion language.
 *
 * Three rules hold everything together:
 *   1. One easing curve for entrances — a custom cubic-bezier with a long tail,
 *      which is what separates "premium" from "an element appeared".
 *   2. Distance scales with importance. A hero line travels further than a card.
 *   3. Stagger is always parent-driven, never a hand-tuned delay per child.
 *
 * Every consumer must honour prefers-reduced-motion. `useMotionSafe()` below
 * returns a flag; components swap in `noMotion` when it is true rather than
 * disabling the animation with a zero duration, which still runs a frame loop.
 */

/** Long-tail ease-out. The signature curve for this site. */
export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Softer curve for hover and press — shorter distance, quicker settle. */
export const EASE_SOFT: [number, number, number, number] = [0.32, 0.72, 0, 1];

export const springSoft: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 30,
  mass: 0.9,
};

/* ------------------------------------------------------------------------- */
/* Hero — an orchestrated entrance, not six independent fades                 */
/* ------------------------------------------------------------------------- */

export const heroContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      // Small initial pause lets the page paint before anything moves.
      delayChildren: 0.15,
      staggerChildren: 0.09,
    },
  },
};

/** Eyebrow, paragraph, list items, buttons. */
export const heroItem: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: EASE_OUT },
  },
};

/**
 * The headline travels further and takes longer — it is the one element the
 * eye should follow, and matching its timing to the body copy flattens the
 * whole composition.
 */
export const heroHeadline: Variants = {
  hidden: { opacity: 0, y: 38 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.05, ease: EASE_OUT },
  },
};

/** The gold rule under the headline draws itself rather than fading in. */
export const heroRule: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.9, ease: EASE_OUT, delay: 0.1 },
  },
};

/** The hero's right-hand panel arrives from the opposite side. */
export const heroPanel: Variants = {
  hidden: { opacity: 0, x: 34, scale: 0.985 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 1.1, ease: EASE_OUT, delay: 0.3 },
  },
};

/* ------------------------------------------------------------------------- */
/* Grids — staggered fade-in-up on scroll                                     */
/* ------------------------------------------------------------------------- */

export const gridContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.075, delayChildren: 0.05 },
  },
};

export const gridCard: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};

/** Rows in a list — shorter travel, tighter stagger than cards. */
export const listItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT },
  },
};

/** Tab panels — cross-fade with a small lift, no horizontal slide. */
export const tabPanel: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: EASE_SOFT } },
};

/** Applied when the user prefers reduced motion — present, but inert. */
export const noMotion: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { duration: 0 } },
};

/** Standard viewport config so every scroll reveal triggers consistently. */
export const viewportOnce = { once: true, margin: "-90px" } as const;
