import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export interface FeatureCardProps {
  feature: {
    id: number;
    title: string;
    description: string;
    icon: LucideIcon;
  };
  className?: string;
}

export default function FeatureCard({ feature, className }: FeatureCardProps) {
  const Icon = feature.icon;

  return (
    <div
      className={cn(
        "group rounded-xl border border-line bg-surface p-6 shadow-sm transition-colors duration-200 hover:border-line-strong hover:bg-surface-2 md:p-8",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary-soft text-primary-soft-text transition-colors duration-200 group-hover:border-primary/45 group-hover:bg-primary/15"
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="mb-1.5 font-display text-base font-bold tracking-tight text-text transition-colors duration-200 group-hover:text-primary-text">
            {feature.title}
          </h3>
          <p className="text-sm leading-relaxed text-muted">{feature.description}</p>
        </div>
      </div>
    </div>
  );
}
