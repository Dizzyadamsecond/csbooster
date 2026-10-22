import React from "react";
import { cn } from "@/lib/cn";

export type BadgeTone = "accent" | "neutral" | "success" | "danger" | "warning";
export type BadgeSize = "sm" | "md";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  size?: BadgeSize;
}

// Monochromatic rule: status uses red ramp steps + icon/label, never a hue.
const toneClasses: Record<BadgeTone, string> = {
  accent: "bg-primary-soft text-primary-soft-text border-primary/25",
  neutral: "bg-surface-2 text-muted border-line",
  success: "bg-success/10 text-success border-success/30",
  danger: "bg-danger/10 text-danger border-danger/30",
  warning: "bg-warning/10 text-error border-warning/30",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "text-[10px] px-2 py-0.5",
  md: "text-xs px-2.5 py-1",
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ tone = "neutral", size = "md", className, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-mono font-bold",
        toneClasses[tone],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
);
Badge.displayName = "Badge";
