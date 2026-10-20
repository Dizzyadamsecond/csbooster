import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  tone?: "accent" | "neutral" | "success";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  tone = "neutral",
  size = "md",
}) => {
  const tones = {
    accent: "bg-primary/10 text-primary-text border-primary/25",
    neutral: "bg-surface-2 text-muted border-line",
    // Monochromatic status: red ramp + icon/label (never a different hue)
    success: "bg-primary-soft text-primary-soft-text border-primary/30",
  } as const;

  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
  } as const;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border font-mono font-bold ${tones[tone]} ${sizes[size]}`}
    >
      {children}
    </span>
  );
};

