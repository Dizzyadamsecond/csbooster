import React from "react";
import { cn } from "@/lib/cn";

export type CardVariant = "default" | "elevated" | "glass" | "outline";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

const variantClasses: Record<CardVariant, string> = {
  default: "bg-surface border border-line",
  elevated: "bg-surface-2 border border-line-strong shadow-md",
  glass: "bg-surface/80 backdrop-blur-xl border border-line-strong shadow-lg",
  outline: "bg-transparent border border-line-strong",
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl transition-all duration-200",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
Card.displayName = "Card";

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn("p-4 border-b border-line", className)} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => (
  <h3
    className={cn("text-lg font-bold text-text tracking-tight font-display", className)}
    {...props}
  >
    {children}
  </h3>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn("p-4", className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn("p-4 border-t border-line flex items-center gap-3", className)}
    {...props}
  >
    {children}
  </div>
);
