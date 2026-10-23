"use client";

import React from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "soft"
  | "glass"
  | "danger";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active shadow-sm hover:shadow-md",
  secondary:
    "bg-surface-2 text-text border border-line-strong hover:bg-surface-3 hover:border-line-strong",
  ghost:
    "bg-transparent text-text-secondary hover:text-text hover:bg-surface-2",
  outline:
    "bg-transparent text-text border border-line-strong hover:border-primary hover:text-primary-text",
  soft: "bg-primary-soft text-primary-soft-text border border-primary/20 hover:bg-primary-soft/70",
  glass:
    "bg-surface/70 backdrop-blur-md text-text border border-line-strong hover:border-primary/60 hover:bg-surface-2/90",
  // Destructive action: `danger` is a distinct ramp step from `primary`, so a
  // destructive button can never be read as the primary CTA.
  danger:
    "bg-danger text-danger-foreground hover:bg-danger/90 active:bg-danger/95 shadow-sm hover:shadow-md",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs rounded-md",
  md: "h-10 px-4 text-sm rounded-md",
  lg: "h-12 px-6 text-base rounded-lg",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-out cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-50 disabled:cursor-not-allowed";

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      className,
      disabled,
      children,
      whileTap,
      whileHover,
      transition,
      ...props
    },
    ref
  ) => {
    const shouldReduceMotion = useReducedMotion();

    return (
      <motion.button
        ref={ref}
        whileHover={
          disabled || shouldReduceMotion
            ? undefined
            : (whileHover ?? { scale: 1.015 })
        }
        whileTap={
          disabled || shouldReduceMotion
            ? undefined
            : (whileTap ?? { scale: 0.97 })
        }
        transition={transition ?? { duration: 0.15, ease: "easeOut" }}
        className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
        disabled={disabled}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

export interface ButtonLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    >
      {children}
    </a>
  )
);
ButtonLink.displayName = "ButtonLink";
