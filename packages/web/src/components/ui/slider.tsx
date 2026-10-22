"use client";

import React, { useRef, useEffect, useState, useCallback, useId, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { SPRING } from "@/lib/motion";

export interface SliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange?: (value: number) => void;
  onValueChange?: (value: number) => void;
  formatValue?: (value: number) => string;
  disabled?: boolean;
  error?: string;
  ariaLabel?: string;
  showTooltip?: "auto" | "always" | "never";
}

/**
 * MonoRed Tactile Slider with spring physics micro-interactions,
 * continuous mouse/touch dragging via window listeners, floating badge tooltip,
 * and full WAI-ARIA compliance.
 */
export function Slider({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  onValueChange,
  formatValue = (v) => v.toLocaleString(),
  disabled = false,
  error,
  ariaLabel,
  showTooltip = "auto",
  className,
  id,
  "aria-describedby": ariaDescribedBy,
  ...props
}: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLButtonElement>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const reactId = useId();
  const sliderId = id || `slider-${reactId.replace(/:/g, "")}`;
  const labelId = `${sliderId}-label`;
  const valueTextId = `${sliderId}-value-text`;
  const errorId = `${sliderId}-error`;

  const shouldReduceMotion = useReducedMotion();

  // Unified change trigger maintaining dual contract compatibility (onChange and onValueChange)
  const triggerChange = useCallback(
    (newValue: number) => {
      onValueChange?.(newValue);
      onChange?.(newValue);
    },
    [onValueChange, onChange]
  );

  // Defensive bounds & step sanitization
  const safeStep = Number.isFinite(step) && step > 0 ? step : 1;

  const [safeMin, safeMax] = useMemo(() => {
    const rawMin = Number.isFinite(min) ? min : 0;
    const rawMax = Number.isFinite(max) ? max : 100;
    if (rawMin > rawMax) {
      return [rawMax, rawMin];
    }
    return [rawMin, rawMax];
  }, [min, max]);

  // Decimal places helper to guard against floating-point inaccuracies, supporting scientific notation
  const stepDecimals = useMemo(() => {
    if (!Number.isFinite(safeStep) || safeStep <= 0) return 0;
    const str = safeStep.toString();
    if (str.includes("e-")) {
      const [base, exp] = str.split("e-");
      const baseDecimals = base.includes(".") ? base.split(".")[1].length : 0;
      return Math.min(20, baseDecimals + (parseInt(exp, 10) || 0));
    }
    const parts = str.split(".");
    return parts.length > 1 ? Math.min(20, parts[1].length) : 0;
  }, [safeStep]);

  // Round value to nearest discrete step interval within [safeMin, safeMax]
  const clampAndStep = useCallback(
    (val: number) => {
      if (!Number.isFinite(val)) return safeMin;
      const stepped = Math.round((val - safeMin) / safeStep) * safeStep + safeMin;
      const rounded = stepDecimals > 0 ? Number(stepped.toFixed(stepDecimals)) : Math.round(stepped);
      return Math.max(safeMin, Math.min(safeMax, rounded));
    },
    [safeMin, safeMax, safeStep, stepDecimals]
  );

  const clampedValue = useMemo(() => clampAndStep(value), [value, clampAndStep]);

  const percentage = useMemo(() => {
    if (safeMax <= safeMin) return 0;
    const pct = ((clampedValue - safeMin) / (safeMax - safeMin)) * 100;
    return Number.isFinite(pct) ? Math.max(0, Math.min(100, pct)) : 0;
  }, [clampedValue, safeMin, safeMax]);

  // Translate clientX screen coordinate to discrete slider value
  const getValueFromClientX = useCallback(
    (clientX: number) => {
      if (!trackRef.current || !Number.isFinite(clientX)) return clampedValue;
      const rect = trackRef.current.getBoundingClientRect();
      if (rect.width <= 0) return clampedValue;

      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const rawValue = safeMin + ratio * (safeMax - safeMin);
      return clampAndStep(rawValue);
    },
    [clampedValue, safeMin, safeMax, clampAndStep]
  );

  // Robust global window listeners for continuous mouse & touch tracking
  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (e.cancelable && "touches" in e) {
        e.preventDefault();
      }
      const clientX = "touches" in e ? e.touches[0]?.clientX : (e as MouseEvent).clientX;
      if (clientX !== undefined) {
        const nextVal = getValueFromClientX(clientX);
        triggerChange(nextVal);
      }
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
    window.addEventListener("touchmove", handlePointerMove, { passive: false });
    window.addEventListener("touchend", handlePointerUp);
    window.addEventListener("touchcancel", handlePointerUp);

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
      window.removeEventListener("touchcancel", handlePointerUp);
    };
  }, [isDragging, getValueFromClientX, triggerChange]);

  // Direct track click: jump thumb and smoothly initiate continuous drag
  const handleTrackPointerDown = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (disabled) return;
    const clientX = "touches" in e ? e.touches[0]?.clientX : (e as React.MouseEvent).clientX;
    if (clientX !== undefined) {
      const nextVal = getValueFromClientX(clientX);
      triggerChange(nextVal);
      setIsDragging(true);
      thumbRef.current?.focus();
    }
  };

  // Full WAI-ARIA keyboard navigation handler
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;

      let newValue = clampedValue;
      const stepMultiplier = event.shiftKey ? 10 : 1;
      const largeStep = Math.max(safeStep * 10, Math.round((safeMax - safeMin) / 10)) || safeStep;

      switch (event.key) {
        case "ArrowRight":
        case "ArrowUp":
          event.preventDefault();
          newValue = clampAndStep(clampedValue + safeStep * stepMultiplier);
          break;
        case "ArrowLeft":
        case "ArrowDown":
          event.preventDefault();
          newValue = clampAndStep(clampedValue - safeStep * stepMultiplier);
          break;
        case "PageUp":
          event.preventDefault();
          newValue = clampAndStep(clampedValue + largeStep);
          break;
        case "PageDown":
          event.preventDefault();
          newValue = clampAndStep(clampedValue - largeStep);
          break;
        case "Home":
          event.preventDefault();
          newValue = safeMin;
          break;
        case "End":
          event.preventDefault();
          newValue = safeMax;
          break;
        default:
          return;
      }

      triggerChange(newValue);
    },
    [disabled, clampedValue, safeMin, safeMax, safeStep, clampAndStep, triggerChange]
  );

  const describedBy = [ariaDescribedBy, valueTextId, error && errorId].filter(Boolean).join(" ") || undefined;

  const isTooltipVisible =
    !disabled && (showTooltip === "always" || (showTooltip === "auto" && (isDragging || isHovered || isFocused)));

  // Tactile spring physics configurations
  const thumbSpring = shouldReduceMotion
    ? { duration: 0.1 }
    : (SPRING.tactile ?? { type: "spring" as const, stiffness: 400, damping: 25, mass: 0.8 });

  const tooltipSpring = shouldReduceMotion
    ? { duration: 0.1 }
    : (SPRING.tooltip ?? { type: "spring" as const, stiffness: 450, damping: 28, mass: 0.6 });

  return (
    <div className={cn("w-full select-none", className)} {...props}>
      {/* Header Label and formatted live value display */}
      <label id={labelId} htmlFor={sliderId} className="block mb-3 cursor-pointer">
        <span className="flex items-center justify-between text-sm font-medium text-text">
          <span>{label}</span>
          <span id={valueTextId} className="font-mono text-primary-text font-bold" aria-live="polite">
            {formatValue(clampedValue)}
          </span>
        </span>
      </label>

      {/* Slider Interactive Track & Thumb Container */}
      <div className="relative pt-6 pb-2">
        <div
          ref={trackRef}
          className={cn(
            "relative h-6 flex items-center cursor-pointer",
            disabled && "cursor-not-allowed"
          )}
          style={{ touchAction: "none" }}
          onMouseDown={handleTrackPointerDown}
          onTouchStart={handleTrackPointerDown}
        >
          {/* Background rail track */}
          <div className="w-full h-2 rounded-full bg-surface-3 border border-white/10 relative overflow-hidden" aria-hidden="true">
            {/* Active filled track */}
            <div
              className="absolute top-0 left-0 h-full rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all duration-75"
              style={{ width: `${percentage}%` }}
              aria-hidden="true"
            />
          </div>

          {/* Floating Tooltip Anchor (tracks percentage synchronously without thumb scale distortion) */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none"
            style={{ left: `${percentage}%` }}
          >
            <AnimatePresence>
              {isTooltipVisible && (
                <motion.div
                  key="slider-tooltip"
                  initial={{ opacity: 0, y: 6, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.85 }}
                  transition={tooltipSpring}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 pointer-events-none z-20"
                  aria-hidden="true"
                >
                  <div className="relative px-2.5 py-0.5 rounded-md bg-[#121214] border border-white/20 shadow-xl backdrop-blur-md">
                    <span className="font-mono text-xs font-bold text-white whitespace-nowrap">
                      {formatValue(clampedValue)}
                    </span>
                    {/* Downward Caret pointing directly towards the thumb */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-white/20" />
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[2px] w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-[#121214]" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Interactive Tactile Thumb Button */}
          <motion.button
            ref={thumbRef}
            type="button"
            role="slider"
            id={sliderId}
            tabIndex={disabled ? -1 : 0}
            aria-label={ariaLabel || label}
            aria-labelledby={ariaLabel ? undefined : labelId}
            aria-valuemin={safeMin}
            aria-valuemax={safeMax}
            aria-valuenow={clampedValue}
            aria-valuetext={formatValue(clampedValue)}
            aria-orientation="horizontal"
            aria-disabled={disabled}
            aria-describedby={describedBy}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 -translate-x-1/2",
              "h-6 w-6 rounded-full bg-white border-2 border-neutral-300 shadow-[0_2px_8px_rgba(0,0,0,0.8),0_0_8px_rgba(255,255,255,0.4)]",
              "cursor-grab active:cursor-grabbing flex items-center justify-center",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808]",
              disabled && "opacity-50 cursor-not-allowed pointer-events-none",
              isFocused && "ring-2 ring-white ring-offset-2 ring-offset-[#080808]"
            )}
            style={{ left: `${percentage}%` }}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onMouseEnter={() => !disabled && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseDown={(e) => {
              if (disabled) return;
              e.stopPropagation();
              setIsDragging(true);
            }}
            onTouchStart={(e) => {
              if (disabled) return;
              e.stopPropagation();
              setIsDragging(true);
            }}
            whileHover={disabled || shouldReduceMotion ? undefined : { scale: 1.15 }}
            whileTap={disabled || shouldReduceMotion ? undefined : { scale: 1.25 }}
            animate={{
              scale: disabled ? 1 : isDragging ? 1.25 : isHovered ? 1.15 : 1,
            }}
            transition={thumbSpring}
            disabled={disabled}
          >
            <span className="sr-only">{formatValue(clampedValue)}</span>
          </motion.button>
        </div>

        {/* Boundary Legend Range Displays */}
        <div className="flex justify-between mt-2 text-[10px] font-mono text-muted">
          <span>{formatValue(safeMin)}</span>
          <span>{formatValue(safeMax)}</span>
        </div>
      </div>

      {/* Accessible Error Readout */}
      {error && (
        <p id={errorId} className="mt-1.5 text-sm font-mono text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}