"use client";

import React, { useState } from "react";
import { UserCheck, EyeOff, HelpCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { SoloDuoModal } from "./SoloDuoModal";

export type BoostMode = "duo" | "solo";

export interface BoostModeToggleProps {
  value: BoostMode;
  onChange: (value: BoostMode) => void;
  disabled?: boolean;
}

const MODES = [
  {
    value: "duo" as BoostMode,
    label: "Duo Lobby",
    sub: "Jogue junto · Sem passar senha",
    badge: "RECOMENDADO",
    icon: UserCheck,
  },
  {
    value: "solo" as BoostMode,
    label: "Solo VPN",
    sub: "Piloto · PIN Family View",
    badge: "+RÁPIDO",
    icon: EyeOff,
  },
];

export function BoostModeToggle({
  value,
  onChange,
  disabled = false,
}: BoostModeToggleProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted">
          Modalidade
        </span>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1 text-xs text-primary-text hover:underline"
        >
          <HelpCircle className="h-3.5 w-3.5" />
          <span>Segurança Solo vs Duo</span>
        </button>
      </div>

      <div
        role="radiogroup"
        aria-label="Modalidade de boost"
        className="grid grid-cols-2 gap-3"
      >
        {MODES.map((mode) => {
          const Icon = mode.icon;
          const isSelected = value === mode.value;

          return (
            <button
              key={mode.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => onChange(mode.value)}
              className={cn(
                "flex items-center justify-between gap-3 rounded-xl border p-4 text-left transition-all duration-150 ease-out",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                isSelected
                  ? "border-white bg-white/[0.08] shadow-[0_0_20px_rgba(255,255,255,0.06)]"
                  : "border-white/10 bg-[#121214] hover:border-white/20 hover:bg-white/[0.04]",
                disabled && "opacity-40 pointer-events-none"
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors",
                    isSelected
                      ? "bg-white text-black shadow-md shadow-white/20"
                      : "bg-white/5 text-neutral-400 border border-white/10"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm font-black uppercase text-white tracking-wide">
                      {mode.label}
                    </span>
                    <span className="hidden sm:inline-block rounded-full bg-white/10 px-2 py-0.5 font-mono text-[9px] font-bold text-white border border-white/20">
                      {mode.badge}
                    </span>
                  </div>
                  <span className="block text-xs text-neutral-400 truncate mt-0.5 font-medium">
                    {mode.sub}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <SoloDuoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedMode={value}
        onSelectMode={onChange}
      />
    </div>
  );
}
