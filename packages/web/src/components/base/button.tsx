/** Modern Button Component */
import { forwardRef } from "react";
import { clsx } from "clsx";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "glass" | "neumorph";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
  ripple?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", glow = false, ripple = false, children, disabled, ...props }, ref) => {
    const base = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer relative overflow-hidden";
    const variants = {
      primary: "bg-primary text-bg hover:bg-primary-700 shadow-sm hover:shadow-md active:translate-y-0.5",
      secondary: "bg-transparent text-text border border-line-strong hover:bg-surface-2 hover:border-line-strong",
      ghost: "bg-transparent text-muted hover:text-text hover:bg-surface-2 hover:border-transparent",
      outline: "bg-transparent text-text border border-line-strong hover:bg-surface-2 hover:border-line-strong",
      glass: "bg-glass text-text border border-glass-border backdrop-filter backdrop-blur-xl hover:bg-glass-backdrop hover:border-glass-border hover:shadow-glass-hover",
      neumorph: "bg-surface-2 text-text border border-transparent shadow-neumorph hover:shadow-neumorph-hover hover:bg-surface-3",
    };
    const sizes = { sm: "h-8 px-3 text-xs rounded-sm", md: "h-10 px-4 text-sm rounded-md", lg: "h-12 px-6 text-base rounded-lg" };
    const classes = clsx(base, variants[variant], sizes[size], className);
    const style = glow
      ? { boxShadow: "0 0 20px rgba(var(--color-primary-rgb) / 0.35)" }
      : undefined;
    return (
      <button ref={ref} className={classes} style={style} disabled={disabled} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
