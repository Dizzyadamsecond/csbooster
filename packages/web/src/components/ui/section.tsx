import React from "react";
import { cn } from "@/lib/cn";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  subtitle?: string;
}

export const Section: React.FC<SectionProps> = ({
  id,
  subtitle,
  children,
  className,
  ...props
}) => {
  return (
    <section
      id={id}
      className={cn("mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16", className)}
      {...props}
    >
      {subtitle && (
        <p className="mb-3 font-mono text-xs font-bold uppercase tracking-widest text-primary-text">
          {subtitle}
        </p>
      )}
      {children}
    </section>
  );
};

export const SectionTitle: React.FC<{
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}> = ({ eyebrow, title, subtitle, center = false }) => {
  return (
    <div className={cn("max-w-2xl", center && "mx-auto text-center")}>
      {eyebrow && (
        <p className="mb-3 font-mono text-xs font-bold uppercase tracking-widest text-primary-text">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl font-bold tracking-tight text-text sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-3 text-base leading-relaxed text-muted">{subtitle}</p>}
    </div>
  );
};
