"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { TrendingUp, ShieldCheck, GraduationCap } from "lucide-react";
import { cn } from "@/lib/cn";
import { ServiceType } from "./pricingEngine";

export interface ServiceSwitcherProps {
  value: ServiceType;
  onChange: (value: ServiceType) => void;
  disabled?: boolean;
}

interface ServiceOption {
  value: ServiceType;
  label: string;
  badge?: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SERVICE_OPTIONS: ServiceOption[] = [
  {
    value: "premier",
    label: "CS Rating Premier",
    badge: "Oficial Valve",
    desc: "Rating calibrado de 1.000 a 30.000 pts",
    icon: TrendingUp,
  },
  {
    value: "competitive",
    label: "Rank Competitivo",
    badge: "Por Mapa",
    desc: "De Prata I até O Elite Global",
    icon: ShieldCheck,
  },
  {
    value: "coaching",
    label: "Coaching Pro 1v1",
    badge: "R$ 45/h",
    desc: "Aulas táticas individuais com pro-player",
    icon: GraduationCap,
  },
];

export function ServiceSwitcher({
  value,
  onChange,
  disabled = false,
}: ServiceSwitcherProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
          <span>MODALIDADE DE SERVIÇO CS2</span>
        </label>
        <span className="font-mono text-[11px] text-neutral-400 font-semibold tracking-wider">TEMPORADA 2026 // OFICIAL</span>
      </div>

      <div
        role="radiogroup"
        aria-label="Tipo de serviço"
        className="grid grid-cols-1 sm:grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-[#121214] p-2 backdrop-blur-md shadow-2xl"
      >
        {SERVICE_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isActive = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isActive}
              disabled={disabled}
              onClick={() => !disabled && onChange(option.value)}
              className={cn(
                "relative group flex flex-col items-center justify-center py-4 px-3 rounded-xl transition-all duration-200 select-none text-center",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                isActive
                  ? "text-black font-extrabold"
                  : "text-neutral-400 hover:text-white hover:bg-white/5",
                disabled && "opacity-40 cursor-not-allowed"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeServicePill"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 32,
                    duration: shouldReduceMotion ? 0 : undefined,
                  }}
                  className="absolute inset-0 rounded-xl bg-white shadow-lg shadow-white/10"
                />
              )}

              <div className="relative z-10 flex flex-col items-center gap-1.5 w-full">
                <div className="flex items-center gap-2">
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      isActive ? "text-black" : "text-white"
                    )}
                  />
                  <span className="font-display font-black text-xs sm:text-sm uppercase tracking-wider">
                    {option.label}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "text-[9px] font-mono font-bold leading-none rounded-full px-2 py-0.5 uppercase tracking-wider",
                      isActive
                        ? "bg-black/15 text-black"
                        : "bg-white/10 text-neutral-300 border border-white/10"
                    )}
                  >
                    {option.badge}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] hidden sm:inline line-clamp-1 font-medium",
                      isActive ? "text-black/80" : "text-neutral-400"
                    )}
                  >
                    {option.desc}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}