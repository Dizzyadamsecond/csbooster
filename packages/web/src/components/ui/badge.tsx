import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  tone?: "red" | "neutral" | "success";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  tone = "neutral",
  size = "md",
}) => {
  const tones = {
    red: {
      sm: "bg-red-500/10 text-red-400 border border-red-500/20",
      md: "bg-red-500/10 text-red-400 border border-red-500/25",
    },
    neutral: {
      sm: "bg-surface-2 text-muted border border-line",
      md: "bg-surface-2 text-muted border border-line",
    },
    success: {
      sm: "bg-red-500/10 text-red-400 border border-emerald-500/20",
      md: "bg-red-500/10 text-red-400 border border-emerald-500/25",
    },
  };

  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full border font-mono font-bold ${tones[tone][size]}`}
    >
      {children}
    </span>
  );
};

export const Aurora: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div
      className={`absolute inset-0 rounded-lg bg-gradient-to-r from-red-500/5 via-red-500/10 to-red-500/5 ${className}`}
      aria-hidden="true"
    />
  );
};
