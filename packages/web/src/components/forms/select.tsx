/**
 * Modern Select Component
 * - Glassmorphism style
 * - WCAG 2.1 AA accessible
 */

import { clsx } from "clsx";
import { forwardRef } from "react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  variant?: "flat" | "glass";
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className = "",
      label,
      variant = "glass",
      children,
      id,
      ...props
    },
    ref
  ) => {
    const idProp = id || props.name;

    return (
      <div className="w-full relative">
        {label && (
          <label
            htmlFor={idProp}
            className="block text-sm font-medium text-text mb-1.5 tracking-wide"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={idProp}
          className={clsx(
            "w-full px-3.5 py-2.5 rounded-lg text-sm transition-all duration-200",
            "bg-surface-2 border border-line-strong",
            "text-text placeholder:text-faint",
            "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
            "appearance-none cursor-pointer",
            variant === "glass" && "bg-glass backdrop-filter backdrop-blur-xl border-glass-border",
            "pr-10",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-faint pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    );
  }
);

Select.displayName = "Select";
