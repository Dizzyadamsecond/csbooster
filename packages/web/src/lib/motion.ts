/**
 * MonoRed motion presets — shared Framer Motion variants & easings.
 * Ownership rule: framer-motion owns state-driven React animation
 * (entrances, exits, tabs, layout). GSAP owns timelines/scroll (see lib/gsap.ts).
 * Values mirror design/tokens.json motion tokens.
 */
import type { Variants } from "framer-motion";

export type Bezier = [number, number, number, number];

export const EASE: Record<"standard" | "entrance" | "exit", Bezier> = {
  standard: [0.4, 0, 0.2, 1],
  entrance: [0, 0, 0.2, 1],
  exit: [0.4, 0, 1, 1],
};

export const DURATION = { fast: 0.15, base: 0.2, slow: 0.3, slower: 0.5 } as const;

/** Standard scroll/in-view reveal */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE.entrance },
  },
};

/** Parent stagger — pair with fadeUp children */
export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

/** Tab/page section transition (used with AnimatePresence mode="wait") */
export const tabSection: Variants = {
  enter: { opacity: 0, y: 12 },
  center: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE.entrance },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: DURATION.base, ease: EASE.exit },
  },
};

/** Hero heading entrance */
export const heroTitle: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE.standard },
  },
};
