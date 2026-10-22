"use client";

import React, { useCallback } from "react";
import { Slider } from "@/components/ui/slider";
import { Minus, Plus, ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
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
    <div className="rounded-2xl border border-white/10 bg-[#121214] backdrop-blur-md p-4 sm:p-7 space-y-6 shadow-2xl">
      {/* PREMIER MODE: Visual CS2 Rating Plates + Sliders */}
      {serviceType === "premier" && (
        <div className="space-y-6" role="group" aria-label="CS Rating Premier">
          {/* Visual CS2 Rating Plate Comparison Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/15 bg-white/[0.03] backdrop-blur-sm p-4 sm:p-5 shadow-inner">
            <div className="space-y-1">
              <span className="block font-mono text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                RATING ATUAL
              </span>
              <Cs2PremierBadge rating={currentRating} size="md" />
            </div>

            <div className="flex flex-col items-center gap-1.5 px-2">
              <ArrowRight className="h-5 w-5 text-white" />
              <span className="rounded-full bg-white px-3 py-1 font-mono text-[11px] font-black text-black shadow-md shadow-white/20">
                +{Math.max(0, targetRating - currentRating).toLocaleString("pt-BR")} PTS
              </span>
            </div>

            <div className="space-y-1 text-right">
              <span className="block font-mono text-[10px] uppercase tracking-widest text-white font-black">
                RATING ALVO
              </span>
              <Cs2PremierBadge rating={targetRating} size="md" />
            </div>
          </div>

          {/* Quick Target Tiers Shortcut */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-neutral-400 uppercase font-bold tracking-wider block">
              Atalhos de Patente Alvo:
            </span>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {[
                { label: "10K", desc: "Intermediário", val: 10000 },
                { label: "15K", desc: "Avançado", val: 15000 },
                { label: "20K", desc: "Elite", val: 20000 },
                { label: "25K", desc: "Pro", val: 25000 },
                { label: "30K", desc: "Global", val: 30000 },
              ].map((tier) => (
                <button
                  key={tier.val}
                  type="button"
                  onClick={() => handleTargetPremier(tier.val)}
                  disabled={disabled}
                  className={cn(
                    "px-2.5 sm:px-3 py-1.5 rounded-lg font-mono text-xs font-bold border transition-all duration-150 flex items-center gap-1",
                    targetRating === tier.val
                      ? "border-white bg-white text-black shadow-md shadow-white/10"
                      : "border-white/10 bg-white/5 text-neutral-300 hover:border-white/30 hover:bg-white/10"
                  )}
                >
                  <span>{tier.label}</span>
                  <span className={cn("text-[10px] hidden sm:inline", targetRating === tier.val ? "text-neutral-700" : "text-neutral-400")}>
                    ({tier.desc})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-6 pt-2">
            <Slider
              label="Rating Premier Atual"
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
              label="Rating Premier Desejado"
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
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/15 bg-white/[0.03] p-4 sm:p-5">
            <Cs2RankBadge rankId={currentRating} />
            <ArrowRight className="h-5 w-5 text-white shrink-0" />
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
          <div className="flex items-center justify-between rounded-xl border border-white/15 bg-white/[0.03] p-4 sm:p-5">
            <div>
              <span className="block font-mono text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                SESSÃO 1V1 · FPL COACH
              </span>
              <span className="font-mono text-sm font-bold text-white">
                R$ {COACHING_HOURLY_RATE}/hora
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Diminuir horas"
                disabled={disabled || targetRating <= 1}
                onClick={() => handleCoachingHoursChange(-1)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-colors"
              >
                <Minus className="h-4 w-4 text-white" />
              </button>
              <span className="font-display text-3xl font-black text-white min-w-[3.5rem] text-center tabular-nums">
                {targetRating}h
              </span>
              <button
                type="button"
                aria-label="Aumentar horas"
                disabled={disabled || targetRating >= 20}
                onClick={() => handleCoachingHoursChange(1)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-colors"
              >
                <Plus className="h-4 w-4 text-white" />
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
