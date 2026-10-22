"use client";

import React, { useEffect, useRef } from "react";
import { useMotionValue, animate, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { EASE } from "@/lib/motion";

export type CounterEase =
  | [number, number, number, number]
  | readonly [number, number, number, number]
  | "linear"
  | "easeIn"
  | "easeOut"
  | "easeInOut"
  | "circIn"
  | "circOut"
  | "circInOut"
  | "backIn"
  | "backOut"
  | "backInOut"
  | (string & {});

export interface AnimatedCounterProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /**
   * The target numerical value to display and interpolate towards.
   */
  value: number;

  /**
   * Optional initial starting value. If provided and different from `value`,
   * component animates from `from` to `value` on mount (or initial render).
   */
  from?: number;

  /**
   * Whether to animate from 0 (or `from`) on initial component mount.
   * Default: false (displays target `value` immediately upon mount to prevent CLS and SSR churn).
   */
  animateInitial?: boolean;

  /**
   * Static prefix string rendered before the number (e.g. "R$ ", "+", "~").
   */
  prefix?: string;

  /**
   * Static suffix string rendered after the number (e.g. " ms", " FPS", "h", "%").
   */
  suffix?: string;

  /**
   * Number of fixed decimal places to format.
   * Default: 0.
   */
  decimals?: number;

  /**
   * Locale string for number formatting (e.g. "pt-BR", "en-US").
   * Default: "pt-BR".
   */
  locale?: string;

  /**
   * Custom formatting function. Receives current interpolated number and returns string.
   * Overrides standard `toLocaleString(locale, { ... })`.
   */
  formatter?: (val: number) => string;

  /**
   * Animation duration in seconds.
   * Default: 0.35 (mirrors MonoRed slow transition token).
   */
  duration?: number;

  /**
   * Framer motion easing curve.
   * Default: EASE.standard ([0.4, 0, 0.2, 1] per MonoRed design system).
   */
  ease?: CounterEase;

  /**
   * Optional custom CSS class for the prefix span (allows semantic tokens like `text-primary-text`).
   */
  prefixClassName?: string;

  /**
   * Optional custom CSS class for the suffix span (allows semantic tokens like `text-muted`).
   */
  suffixClassName?: string;
}

/**
 * Format a number using either a custom formatter or standard locale formatting.
 * Defensively clamps decimals to [0, 20] to avoid RangeError in toLocaleString,
 * and eliminates negative zero ("-0" / "-0.00") when rounding negative floats.
 */
function formatValue(
  val: number,
  decimals: number = 0,
  locale: string = "pt-BR",
  formatter?: (val: number) => string
): string {
  if (formatter) {
    return formatter(val);
  }

  // Defensively clamp decimals between 0 and 20 (safe across all JS/ECMA-402 engines)
  const safeDecimals = Number.isFinite(decimals)
    ? Math.max(0, Math.min(20, Math.floor(decimals)))
    : 0;

  // Handle non-finite numbers (NaN, Infinity, -Infinity)
  if (!Number.isFinite(val)) {
    try {
      return val.toLocaleString(locale);
    } catch {
      return String(val);
    }
  }

  // Prevent negative zero output ("-0", "-0.00") when negative floats round to zero
  const rounded = Number(val.toFixed(safeDecimals));
  const sanitizedVal = rounded === 0 ? 0 : val;

  try {
    return sanitizedVal.toLocaleString(locale, {
      minimumFractionDigits: safeDecimals,
      maximumFractionDigits: safeDecimals,
    });
  } catch {
    // Fallback if locale tag is invalid in runtime environment
    try {
      return sanitizedVal.toLocaleString(undefined, {
        minimumFractionDigits: safeDecimals,
        maximumFractionDigits: safeDecimals,
      });
    } catch {
      return safeDecimals > 0
        ? sanitizedVal.toFixed(safeDecimals)
        : String(Math.round(sanitizedVal));
    }
  }
}

/**
 * AnimatedCounter — High-performance, layout-stable numeric rolling counter.
 *
 * Key Architectural Highlights:
 * 1. Zero React re-renders during motion: Directly mutates DOM textContent via
 *    Framer Motion `animate(motionValue)`.
 * 2. Layout Shift Proof: Enforces `font-mono tabular-nums` to prevent horizontal jitter.
 * 3. Accessibility / Reduced-Motion: Instantly snaps to target `value` if `prefersReducedMotion`
 *    is enabled or if `duration === 0`.
 * 4. SSR Safe: Initial render produces server-matching HTML, preventing React 19 hydration mismatches.
 * 5. MonoRed Token Compliant: Uses semantic tokens only (`font-mono`, `tabular-nums`, `EASE.standard`).
 */
export function AnimatedCounter({
  value,
  from,
  animateInitial = false,
  prefix,
  suffix,
  decimals = 0,
  locale = "pt-BR",
  formatter,
  duration = 0.35,
  ease = EASE.standard,
  prefixClassName,
  suffixClassName,
  className,
  "aria-label": ariaLabelProp,
  ...rest
}: AnimatedCounterProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const isFirstRender = useRef(true);

  // Compute initial starting value
  const initialValue = animateInitial ? (from ?? 0) : (from ?? value);
  const motionVal = useMotionValue(initialValue);

  // Update text content whenever motion value changes
  useEffect(() => {
    const updateText = (val: number) => {
      if (spanRef.current) {
        spanRef.current.textContent = formatValue(val, decimals, locale, formatter);
      }
    };

    // Ensure immediate sync if format dependencies change
    updateText(motionVal.get());

    const unsubscribe = motionVal.on("change", updateText);
    return unsubscribe;
  }, [motionVal, decimals, locale, formatter]);

  // Handle target value animations
  useEffect(() => {
    // Skip animation on initial mount if animateInitial is false and from is omitted
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (!animateInitial && from === undefined) {
        motionVal.set(value);
        if (spanRef.current) {
          spanRef.current.textContent = formatValue(value, decimals, locale, formatter);
        }
        return;
      }
    }

    // Reduced motion or zero duration or non-finite: instant snap
    if (shouldReduceMotion || duration <= 0 || !Number.isFinite(value)) {
      motionVal.set(value);
      if (spanRef.current) {
        spanRef.current.textContent = formatValue(value, decimals, locale, formatter);
      }
      return;
    }

    // Animate smoothly to new target value
    // Explicit cast for ease overload resolution in Framer Motion 14
    const controls = animate(motionVal, value, {
      duration,
      ease: ease as any,
    });

    return () => controls.stop();
  }, [
    value,
    duration,
    ease,
    shouldReduceMotion,
    animateInitial,
    from,
    motionVal,
    decimals,
    locale,
    formatter,
  ]);

  const initialRenderText = formatValue(initialValue, decimals, locale, formatter);
  const accessibleLabel =
    ariaLabelProp ??
    `${prefix ?? ""}${formatValue(value, decimals, locale, formatter)}${suffix ?? ""}`.trim();

  // Optimized single-node render if no prefix or suffix is specified
  if (!prefix && !suffix) {
    return (
      <span
        ref={spanRef}
        className={cn("font-mono tabular-nums", className)}
        aria-label={accessibleLabel}
        {...rest}
      >
        {initialRenderText}
      </span>
    );
  }

  // Multi-segment render with sub-element styling capabilities
  return (
    <span
      className={cn("inline-flex items-baseline font-mono tabular-nums", className)}
      aria-label={accessibleLabel}
      {...rest}
    >
      {prefix && (
        <span className={cn("select-none", prefixClassName)} aria-hidden="true">
          {prefix}
        </span>
      )}
      <span ref={spanRef}>{initialRenderText}</span>
      {suffix && (
        <span className={cn("select-none", suffixClassName)} aria-hidden="true">
          {suffix}
        </span>
      )}
    </span>
  );
}
