"use client";

import React, {
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/cn";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Container height transition curve for tab switching (CLS = 0) */
export const tabContainerTransition = {
  duration: 0.35,
  ease: [0.2, 0, 0, 1] as [number, number, number, number], // MonoRed emphasized easing
};

export const tabContainerTransitionReduced = {
  duration: 0,
};

/** Directional fade-and-settle variants for tab content panels */
export const tabContentVariants: Variants = {
  enter: {
    opacity: 0,
    y: 8,
  },
  center: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0, 0, 0.2, 1], // Entrance easing
      delay: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.15,
      ease: [0.4, 0, 1, 1], // Exit easing
    },
  },
};

/** Accessibility reduced-motion tab variants */
export const tabContentVariantsReduced: Variants = {
  enter: { opacity: 0, y: 0 },
  center: { opacity: 1, y: 0, transition: { duration: 0 } },
  exit: { opacity: 0, y: 0, transition: { duration: 0 } },
};

export interface TabMotionContainerProps {
  activeTab: string;
  children: ReactNode;
  className?: string;
  autoScrollOnShrink?: boolean;
  navbarHeight?: number;
}

/**
 * TabMotionContainer guarantees Layout Stability (CLS = 0) during tab switching.
 * - Animates actual CSS height rather than FLIP scaleY, preventing child distortion.
 * - Downstream elements glide smoothly without sudden layout shifts.
 * - Eliminates page jumping when switching from tall tabs via smart scroll anchoring.
 * - Unlocks to overflow: visible when idle so tooltips and focus rings are not clipped.
 * - 100% compliant with prefers-reduced-motion.
 */
export function TabMotionContainer({
  activeTab,
  children,
  className,
  autoScrollOnShrink = true,
  navbarHeight = 72,
}: TabMotionContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const [height, setHeight] = useState<number | "auto">("auto");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevTabRef = useRef(activeTab);
  const fallbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Measure content height and manage height lock/transition on tab change
  useIsomorphicLayoutEffect(() => {
    if (prevTabRef.current !== activeTab) {
      prevTabRef.current = activeTab;

      if (shouldReduceMotion) {
        setHeight("auto");
        setIsTransitioning(false);
        return;
      }

      // Lock current height before old tab exits to prevent container collapse
      if (containerRef.current) {
        const currentContainerHeight =
          containerRef.current.getBoundingClientRect().height;
        if (currentContainerHeight > 0) {
          setHeight(currentContainerHeight);
          setIsTransitioning(true);

          // Safety timeout: ensure container unlocks even if onAnimationComplete fails to fire
          if (fallbackTimeoutRef.current) clearTimeout(fallbackTimeoutRef.current);
          fallbackTimeoutRef.current = setTimeout(() => {
            setIsTransitioning(false);
            setHeight("auto");
          }, 800);
        }
      }

      // Smart scroll anchoring: if user scrolled down into a tall tab, bring viewport
      // smoothly up to tab container header so they are not stranded staring at the footer
      if (autoScrollOnShrink && typeof window !== "undefined" && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const containerTopAbs = rect.top + window.scrollY;
        const targetScrollY = Math.max(0, containerTopAbs - navbarHeight - 16);

        if (window.scrollY > targetScrollY) {
          window.scrollTo({
            top: targetScrollY,
            behavior: shouldReduceMotion ? "auto" : "smooth",
          });
        }
      }
    }
  }, [activeTab, shouldReduceMotion, autoScrollOnShrink, navbarHeight]);

  // Continuously observe content height changes (when new tab mounts or accordion expands)
  useEffect(() => {
    if (!contentRef.current || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newHeight =
          entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
        if (newHeight > 0 && isTransitioning) {
          setHeight(newHeight);
        }
      }
    });

    observer.observe(contentRef.current);
    return () => {
      observer.disconnect();
      if (fallbackTimeoutRef.current) clearTimeout(fallbackTimeoutRef.current);
    };
  }, [isTransitioning]);

  const handleAnimationComplete = useCallback(() => {
    if (fallbackTimeoutRef.current) clearTimeout(fallbackTimeoutRef.current);
    setIsTransitioning(false);
    setHeight("auto");
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className={cn("relative w-full", className)}
      style={{
        overflow: isTransitioning ? "hidden" : "visible",
      }}
      animate={{ height }}
      transition={
        shouldReduceMotion ? tabContainerTransitionReduced : tabContainerTransition
      }
      onAnimationComplete={handleAnimationComplete}
    >
      <div ref={contentRef} className="w-full">
        <AnimatePresence
          mode="wait"
          initial={false}
          onExitComplete={() => {
            // When exiting tab completes unmount, measure newly mounted tab immediately
            if (contentRef.current && !shouldReduceMotion) {
              const newHeight = contentRef.current.getBoundingClientRect().height;
              if (newHeight > 0) {
                setHeight(newHeight);
              }
            }
          }}
        >
          <motion.div
            key={activeTab}
            id={`panel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
            tabIndex={0}
            variants={
              shouldReduceMotion ? tabContentVariantsReduced : tabContentVariants
            }
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full focus-visible:outline-none"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
