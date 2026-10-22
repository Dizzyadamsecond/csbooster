"use client";

import React, { useCallback } from "react";
import { Slider } from "@/components/ui/slider";
import { Minus, Plus, ArrowRight } from "lucide-react";
import {
  ServiceType,
  COMPETITIVE_RANKS,
  COACHING_HOURLY_RATE,
} from "./pricingEngine";
import { Cs2PremierBadge, Cs2RankBadge } from "./Cs2RankBadge";

export interface RatingSlidersProps {
  serviceType: ServiceType;
  currentRating: number;
  targetRating: number;
  onCurrentChange: (value: number) => void;
  onTargetChange: (value: number) => void;
  disabled?: boolean;
}

export function RatingSliders({
  serviceType,
  currentRating,
  targetRating,
  onCurrentChange,
  onTargetChange,
  disabled = false,
}: RatingSlidersProps) {
  const handleCurrentPremier = useCallback(
    (val: number) => {
      onCurrentChange(val);
      if (val >= targetRating) {
        onTargetChange(Math.min(30000, val + 1000));
      }
    },
    [onCurrentChange, onTargetChange, targetRating]
  );

  const handleTargetPremier = useCallback(
    (val: number) => {
      if (val <= currentRating) {
        onTargetChange(Math.min(30000, currentRating + 500));
      } else {
        onTargetChange(val);
      }
    },
    [currentRating, onTargetChange]
  );

  const handleCurrentCompetitive = useCallback(
    (val: number) => {
      onCurrentChange(val);
      if (val >= targetRating) {
        onTargetChange(Math.min(18, val + 1));
      }
    },
    [onCurrentChange, onTargetChange, targetRating]
  );

  const handleTargetCompetitive = useCallback(
    (val: number) => {
      if (val <= currentRating) {
        onTargetChange(Math.min(18, currentRating + 1));
      } else {
        onTargetChange(val);
      }
    },
    [currentRating, onTargetChange]
  );

  const handleCoachingHoursChange = useCallback(
    (delta: number) => {
      const next = Math.max(1, Math.min(20, targetRating + delta));
      onTargetChange(next);
      onCurrentChange(next);
    },
    [targetRating, onTargetChange, onCurrentChange]
  );

  return (
    <div className="rounded-2xl border border-primary/25 bg-surface/85 backdrop-blur-md p-5 sm:p-6 space-y-6 shadow-xl shadow-primary/5">
      {/* PREMIER MODE: Visual CS2 Rating Plates + Sliders */}
      {serviceType === "premier" && (
        <div className="space-y-6" role="group" aria-label="CS Rating Premier">
          {/* Visual CS2 Rating Plate Comparison Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-primary/20 bg-surface-2/90 backdrop-blur-sm p-4 shadow-sm">
            <div className="space-y-1">
              <span className="block font-mono text-[10px] uppercase tracking-wider text-muted">
                ATUAL
              </span>
              <Cs2PremierBadge rating={currentRating} size="md" />
            </div>

            <div className="flex flex-col items-center gap-1 px-2">
              <ArrowRight className="h-5 w-5 text-primary-text" />
              <span className="rounded-full bg-primary-soft px-2.5 py-0.5 font-mono text-[11px] font-bold text-primary-text border border-primary/30">
                +{Math.max(0, targetRating - currentRating).toLocaleString("pt-BR")} PTS
              </span>
            </div>

            <div className="space-y-1 text-right">
              <span className="block font-mono text-[10px] uppercase tracking-wider text-primary-text font-bold">
                OBJETIVO
              </span>
              <Cs2PremierBadge rating={targetRating} size="md" />
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-5">
            <Slider
              label="Rating Atual"
              min={1000}
              max={29000}
              step={250}
              value={currentRating}
              onChange={handleCurrentPremier}
              formatValue={(v) => `${v.toLocaleString("pt-BR")} pts`}
              disabled={disabled}
              ariaLabel="Rating Premier atual"
            />

            <Slider
              label="Rating Alvo"
              min={Math.max(1500, currentRating + 250)}
              max={30000}
              step={250}
              value={targetRating}
              onChange={handleTargetPremier}
              formatValue={(v) => `${v.toLocaleString("pt-BR")} pts`}
              disabled={disabled}
              ariaLabel="Rating Premier desejado"
            />
          </div>
        </div>
      )}

      {/* COMPETITIVE MODE: Visual Rank Crests + Sliders */}
      {serviceType === "competitive" && (
        <div className="space-y-6" role="group" aria-label="Patentes Competitivas">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface-2 p-4">
            <Cs2RankBadge rankId={currentRating} />
            <ArrowRight className="h-4 w-4 text-primary-text shrink-0" />
            <Cs2RankBadge rankId={targetRating} />
          </div>

          <div className="space-y-5">
            <Slider
              label="Patente Atual"
              min={1}
              max={17}
              step={1}
              value={currentRating}
              onChange={handleCurrentCompetitive}
              formatValue={(id) =>
                COMPETITIVE_RANKS.find((r) => r.id === id)?.name || `Rank ${id}`
              }
              disabled={disabled}
              ariaLabel="Patente competitiva atual"
            />

            <Slider
              label="Patente Alvo"
              min={Math.max(2, currentRating + 1)}
              max={18}
              step={1}
              value={targetRating}
              onChange={handleTargetCompetitive}
              formatValue={(id) =>
                COMPETITIVE_RANKS.find((r) => r.id === id)?.name || `Rank ${id}`
              }
              disabled={disabled}
              ariaLabel="Patente competitiva desejada"
            />
          </div>
        </div>
      )}

      {/* COACHING MODE: Clean Hour Control */}
      {serviceType === "coaching" && (
        <div className="space-y-5" role="group" aria-label="Coaching Pro">
          <div className="flex items-center justify-between rounded-xl border border-line bg-surface-2 p-4">
            <div>
              <span className="block font-mono text-[10px] uppercase tracking-wider text-muted">
                SESSÃO 1V1 · FPL COACH
              </span>
              <span className="font-mono text-sm font-bold text-primary-text">
                R$ {COACHING_HOURLY_RATE}/hora
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Diminuir horas"
                disabled={disabled || targetRating <= 1}
                onClick={() => handleCoachingHoursChange(-1)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface hover:bg-surface-3 disabled:opacity-40 transition-colors"
              >
                <Minus className="h-4 w-4 text-text" />
              </button>
              <span className="font-display text-3xl font-black text-text min-w-[3.2rem] text-center tabular-nums">
                {targetRating}h
              </span>
              <button
                type="button"
                aria-label="Aumentar horas"
                disabled={disabled || targetRating >= 20}
                onClick={() => handleCoachingHoursChange(1)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface hover:bg-surface-3 disabled:opacity-40 transition-colors"
              >
                <Plus className="h-4 w-4 text-text" />
              </button>
            </div>
          </div>

          <Slider
            label="Duração"
            min={1}
            max={20}
            step={1}
            value={targetRating}
            onChange={(val) => {
              onTargetChange(val);
              onCurrentChange(val);
            }}
            formatValue={(val) => `${val}h`}
            disabled={disabled}
            ariaLabel="Horas de coaching"
          />
        </div>
      )}
    </div>
  );
}
