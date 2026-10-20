import React from "react";

export interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  subtitle?: string;
}

export const Section: React.FC<SectionProps> = ({
  id,
  subtitle,
  children,
  className = "",
  ...props
}) => {
  return (
    <section id={id} className={`max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16 ${className}`} {...props}>
      {subtitle && (
        <p className="text-red-400 text-xs font-mono font-bold uppercase tracking-widest mb-3">
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
    <div className={`max-w-2xl ${center ? "text-center mx-auto" : ""}`}>
      {eyebrow && (
        <p className="text-red-400 text-xs font-mono font-bold uppercase tracking-widest mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl sm:text-4xl font-bold text-text tracking-tight font-display">
        {title}
      </h2>
      {subtitle && <p className="text-muted text-base mt-3 leading-relaxed">{subtitle}</p>}
    </div>
  );
};
