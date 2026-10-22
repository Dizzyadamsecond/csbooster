"use client";

import React from "react";
import { cn } from "@/lib/cn";
import { COMPETITIVE_RANKS } from "./pricingEngine";

/**
 * Authentic CS2 Premier Geometric Slanted Rating Plate (Figma High-Craft SVG)
 * Mirrors the iconic Counter-Strike 2 Premier mode oblique rating badge.
 */
export function Cs2PremierBadge({
  rating,
  size = "md",
  className,
}: {
  rating: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const safeRating = Math.max(1000, Math.min(30000, Math.round(rating)));
  const majorThousands = Math.floor(safeRating / 1000);
  const minorHundreds = String(safeRating % 1000).padStart(3, "0");

  // Intensity tierbars (1 to 6 bars lit based on rating tier)
  const litBars = Math.min(6, Math.max(1, Math.floor(safeRating / 5000) + 1));

  const sizeMap = {
    sm: "h-9 px-3 text-base",
    md: "h-12 px-4 text-2xl",
    lg: "h-14 px-5 text-3xl",
  };

  return (
    <div
      className={cn(
        "relative inline-flex items-center gap-2.5 overflow-hidden rounded-lg border border-primary/40 bg-surface-2 select-none shadow-sm",
        sizeMap[size],
        className
      )}
      aria-label={`CS2 Premier Rating ${safeRating.toLocaleString("pt-BR")}`}
    >
      {/* Left Oblique CS2 Premier Stripes SVG */}
      <svg
        viewBox="0 0 36 44"
        className="h-full w-auto shrink-0 -ml-1 py-1.5"
        fill="none"
        aria-hidden="true"
      >
        {[0, 1, 2, 3, 4].map((idx) => {
          const isLit = idx < litBars;
          const xOffset = idx * 6;
          return (
            <polygon
              key={idx}
              points={`${xOffset + 8},2 ${xOffset + 12},2 ${xOffset + 4},42 ${xOffset},42`}
              className={
                isLit
                  ? "fill-primary transition-colors duration-200"
                  : "fill-line-strong opacity-40 transition-colors duration-200"
              }
            />
          );
        })}
      </svg>

      {/* Monospace Slanted Rating Readout */}
      <div className="flex items-baseline font-mono font-black tracking-tight text-text tabular-nums italic">
        <span className="text-primary-text">{majorThousands}</span>
        <span className="text-muted text-[0.65em] mx-0.5">,</span>
        <span className="text-[0.82em] text-text">{minorHundreds}</span>
      </div>
    </div>
  );
}

/**
 * Authentic CS2 Competitive Skill Group Emblem (SVG Insignia + Stars/Chevrons)
 */
export function Cs2RankBadge({
  rankId,
  className,
}: {
  rankId: number;
  className?: string;
}) {
  const rank =
    COMPETITIVE_RANKS.find((r) => r.id === rankId) ?? COMPETITIVE_RANKS[0];

  // Determine visual rank tier (Silver 1-6, Gold Nova 7-10, MG 11-14, Elite 15-18)
  const starsCount =
    rankId <= 6
      ? Math.min(4, Math.ceil(rankId / 1.5))
      : rankId <= 10
      ? rankId - 6
      : rankId <= 14
      ? rankId - 10
      : rankId - 14;

  const isElite = rankId >= 15;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 rounded-lg border border-line-strong bg-surface-2 px-3.5 py-2 select-none",
        isElite && "border-primary/50 bg-primary-soft",
        className
      )}
    >
      {/* Tactical Crest SVG */}
      <svg
        viewBox="0 0 44 32"
        className="h-7 w-10 shrink-0"
        fill="none"
        aria-hidden="true"
      >
        <polygon
          points="6,2 38,2 42,16 38,30 6,30 2,16"
          className="fill-surface stroke-primary"
          strokeWidth="1.5"
        />
        <polygon
          points="10,6 34,6 37,16 34,26 10,26 7,16"
          className={isElite ? "fill-primary/25" : "fill-surface-3"}
        />
        {/* Center Chevrons / Globe motif */}
        {isElite ? (
          <circle
            cx="22"
            cy="16"
            r="6"
            className="stroke-primary fill-primary/30"
            strokeWidth="1.5"
          />
        ) : (
          <path
            d="M15 19L22 12L29 19"
            className="stroke-primary"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>

      <div className="min-w-0">
        <div className="flex items-center gap-1">
          {Array.from({ length: starsCount }).map((_, idx) => (
            <span
              key={idx}
              className="inline-block h-1.5 w-1.5 rotate-45 bg-primary"
            />
          ))}
        </div>
        <span className="block font-display text-xs font-extrabold uppercase tracking-wider text-text truncate mt-0.5">
          {rank.name}
        </span>
      </div>
    </div>
  );
}
