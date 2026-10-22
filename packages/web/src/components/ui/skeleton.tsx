"use client";

import { cn } from "@/lib/cn";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  animation?: "pulse" | "wave" | "none";
}

export function Skeleton({
  className,
  variant = "text",
  animation = "pulse",
  style,
  ...props
}: SkeletonProps) {
  const baseStyles: React.CSSProperties = {
    backgroundColor: "var(--color-surface-3)",
    overflow: "hidden",
  };

  const variantStyles: Record<NonNullable<SkeletonProps["variant"]>, React.CSSProperties> = {
    text: { borderRadius: "var(--radius-sm)", height: "1rem" },
    circular: { borderRadius: "var(--radius-full)", width: "100%", aspectRatio: "1 / 1" },
    rectangular: { borderRadius: "var(--radius-md)", width: "100%", height: "100%" },
  };

  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-shimmer",
    none: "",
  };

  return (
    <div
      className={cn(animationClasses[animation], className)}
      style={{ ...baseStyles, ...variantStyles[variant], ...style }}
      {...props}
    />
  );
}

export function SkeletonText({ lines = 3, className, ...props }: { lines?: number } & Omit<SkeletonProps, "variant">) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} variant="text" style={{ width: i === lines - 1 ? "60%" : "100%" }} {...props} />
      ))}
    </div>
  );
}

export function SkeletonCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-xl border border-line bg-surface p-4 space-y-4", className)} {...props}>
      <Skeleton variant="circular" className="h-10 w-10" />
      <SkeletonText lines={3} />
      <Skeleton variant="rectangular" className="h-8 w-3/4" />
    </div>
  );
}