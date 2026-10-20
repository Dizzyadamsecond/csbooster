/**
 * Modern Input Component
 * - Glassmorphism style
 * - WCAG 2.1 AA accessible
 * - Focus states with ring
 */

import { clsx } from "clsx";
import { forwardRef } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  variant?: "flat" | "glass";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = "",
      label,
      variant = "glass",
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
        <input
          ref={ref}
          id={idProp}
          className={clsx(
            "w-full px-3.5 py-2.5 rounded-lg text-sm transition-all duration-200",
            "bg-surface-2 border border-line-strong",
            "text-text placeholder:text-faint",
            "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
            "hover:border-primary/30",
            variant === "glass" && "bg-glass backdrop-filter backdrop-blur-xl border-glass-border",
            "pr-10",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
