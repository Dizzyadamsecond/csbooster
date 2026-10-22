import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, disabled, children, ...props }, ref) => (
    <div className={cn("relative w-full", className)}>
      <select
        ref={ref}
        className={cn(
          "w-full appearance-none rounded-md border border-line-strong bg-surface-2 py-2 pl-3 pr-9 font-mono text-sm text-text transition-colors duration-200",
          "focus:border-focus-ring focus:outline-none focus:ring-2 focus:ring-focus-ring/30",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "aria-[invalid=true]:border-danger aria-[invalid=true]:ring-danger/30"
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
      />
    </div>
  )
);
Select.displayName = "Select";
