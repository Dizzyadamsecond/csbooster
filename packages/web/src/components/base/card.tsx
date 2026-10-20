/** Modern Card Component */
import { forwardRef } from "react";
import { clsx } from "clsx";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "flat" | "glass" | "neumorph" | "elevated";
  glow?: boolean;
  hoverable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", variant = "flat", glow = false, hoverable = false, children, ...props }, ref) => {
    const base = "rounded-xl border transition-all duration-200";
    const variants = {
      flat: "bg-surface-card border-line shadow-sm hover:shadow-md",
      glass: "bg-glass backdrop-filter backdrop-blur-xl border-glass-border shadow-lg shadow-glass hover:shadow-glass-hover",
      neumorph: "bg-surface-2 border border-transparent shadow-neumorph hover:shadow-neumorph-hover",
      elevated: "bg-surface-elevated border border-line shadow-md hover:shadow-lg",
    };
    const classes = clsx(base, variants[variant], glow && "glow-primary", hoverable && "hover:cursor-pointer hover:translate-y-1", className);
    return (
      <div ref={ref} className={classes} style={glow && { boxShadow: "var(--color-primary) 0 0 20px rgba(220,38,38,0.3)" }} {...props}>
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";
