"use client";

import React from "react";
import { Monitor, Zap, EyeOff, ShieldCheck, ShieldAlert, Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { AddOnState, ADD_ON_DEFINITIONS } from "./pricingEngine";

export interface AddOnsPanelProps {
  addOns: AddOnState;
  onChange: (key: keyof AddOnState, value: boolean) => void;
  basePrice: number;
  disabled?: boolean;
}

const ICON_MAP = {
  streamMatch: Monitor,
  expressDelivery: Zap,
  offlineMode: EyeOff,
  specificRoles: ShieldCheck,
  antiDerank: ShieldAlert,
};

export function AddOnsPanel({
  addOns,
  onChange,
  basePrice,
  disabled = false,
}: AddOnsPanelProps) {
  return (
    <div className="space-y-2.5" role="group" aria-label="Adicionais Táticos">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
          <span>EXTRAS E PROTEÇÕES TÁTICAS</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {ADD_ON_DEFINITIONS.map((def) => {
          const checked = addOns[def.id];
          const Icon = ICON_MAP[def.id];

          let priceText = "GRÁTIS";
          if (def.priceType === "percentage") {
            const calculatedCost = Math.round(basePrice * def.priceValue);
            priceText = `+R$ ${calculatedCost}`;
          } else if (def.priceValue > 0) {
            priceText = `+R$ ${def.priceValue}`;
          }

          return (
            <button
              key={def.id}
              type="button"
              role="switch"
              aria-checked={checked}
              aria-label={`${def.label}: ${priceText}`}
              disabled={disabled}
              onClick={() => onChange(def.id, !checked)}
              className={cn(
                "flex items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-150 ease-out",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                checked
                  ? "border-white bg-white/[0.08] shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                  : "border-white/10 bg-[#121214] hover:border-white/20 hover:bg-white/[0.03]",
                disabled && "opacity-40 pointer-events-none"
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                    checked
                      ? "bg-white text-black shadow-md shadow-white/20"
                      : "bg-white/5 text-neutral-400 border border-white/10"
                  )}
                >
                  {checked ? <Check className="h-4 w-4 stroke-[3]" /> : <Icon className="h-4 w-4" />}
                </div>
                <span className="font-display text-xs font-bold text-white tracking-wide truncate">
                  {def.label}
                </span>
              </div>

              <span
                className={cn(
                  "font-mono text-xs font-bold shrink-0",
                  checked ? "text-white" : "text-neutral-400"
                )}
              >
                {priceText}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
