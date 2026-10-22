import React from "react";
import { cn } from "@/lib/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", disabled, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "w-full rounded-md border border-line-strong bg-surface-2 px-3 py-2 font-mono text-sm text-text transition-colors duration-200",
        "placeholder:text-muted",
        "focus:border-focus-ring focus:outline-none focus:ring-2 focus:ring-focus-ring/30",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-[invalid=true]:border-danger aria-[invalid=true]:ring-danger/30",
        className
      )}
      disabled={disabled}
      {...props}
    />
  )
);
Input.displayName = "Input";
