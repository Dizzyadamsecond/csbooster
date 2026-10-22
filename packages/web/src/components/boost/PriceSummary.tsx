"use client";

import React from "react";
import { Clock, ShieldCheck, Lock, ArrowRight, QrCode } from "lucide-react";
import { cn } from "@/lib/cn";
import { AnimatedCounter } from "@/components/motion/AnimatedCounter";
import { PricingResult } from "./pricingEngine";

export interface PriceSummaryProps {
  pricing: PricingResult;
  onCheckout: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export function PriceSummary({
  pricing,
  onCheckout,
  disabled = false,
  isLoading = false,
}: PriceSummaryProps) {
  const {
    totalPrice,
    pixDiscountAmount,
    pixTotalPrice,
    estimatedHours,
    breakdown,
  } = pricing;

  return (
    <div className="rounded-2xl border border-white/15 bg-[#121214] backdrop-blur-md p-6 sm:p-7 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Decorative top accent hairline */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />

      {/* Pass Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <span className="block font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400">
            ESPORTS MATCH PASS // CS2
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
            <span className="font-display text-sm font-black uppercase tracking-wider text-white">
              3 Boosters FPL em Standby
            </span>
          </div>
        </div>
        <div className="text-right font-mono">
          <span className="inline-flex items-center gap-1 text-xs text-neutral-300 font-bold bg-white/5 border border-white/10 px-2 py-1 rounded-md">
            <Clock className="h-3.5 w-3.5 text-white" />
            ~{estimatedHours}h ETA
          </span>
        </div>
      </div>

      {/* Itemized Breakdown Lines */}
      <div className="space-y-2.5">
        <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-neutral-400 block">
          DISCRIMINAÇÃO DO PACOTE
        </span>
        <dl className="space-y-2 text-xs font-mono">
          {breakdown.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-2 py-0.5 border-b border-white/[0.04]">
              <dt className="text-neutral-400 truncate">{item.label}</dt>
              <dd className="font-bold text-white shrink-0">
                {item.amount > 0 ? `R$ ${item.amount},00` : "INCLUSO"}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Perforated Ticket Total Card */}
      <div className="rounded-xl border border-dashed border-white/20 bg-white/[0.03] p-5 space-y-3 relative">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <span className="block font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              VALOR FINAL NO PIX
            </span>
            <div className="mt-1 flex items-baseline gap-1 font-display">
              <span className="text-lg font-bold text-white">R$</span>
              <AnimatedCounter
                value={pixTotalPrice}
                className="text-4xl sm:text-5xl font-black tracking-tight text-white tabular-nums"
              />
              <span className="font-mono text-sm text-neutral-400">,00</span>
            </div>
          </div>

          <div className="text-right font-mono space-y-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-[10px] font-black text-black shadow-md shadow-white/20">
              <QrCode className="h-3 w-3" />
              -5% PIX (R$ {pixDiscountAmount})
            </span>
            <span className="block text-[11px] text-neutral-400 line-through">
              Cartão: R$ {totalPrice},00
            </span>
          </div>
        </div>
      </div>

      {/* Primary Action Button: Pure White Inverted High-Fashion Button */}
      <button
        type="button"
        onClick={onCheckout}
        disabled={disabled || isLoading}
        aria-label="Iniciar pedido agora"
        className={cn(
          "w-full py-4.5 px-6 rounded-xl font-display font-black text-sm uppercase tracking-widest",
          "bg-white text-black shadow-[0_4px_24px_rgba(255,255,255,0.2)]",
          "hover:bg-neutral-200 active:scale-[0.98] transition-all duration-150 ease-out flex items-center justify-center gap-2 cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
          disabled && "opacity-40 pointer-events-none"
        )}
      >
        <span>CONTRATAR BOOST AGORA</span>
        <ArrowRight className="h-4 w-4 stroke-[3]" />
      </button>

      {/* Trust & Compliance Telemetry */}
      <div className="flex items-center justify-between pt-2 border-t border-white/10 font-mono text-[10px] text-neutral-400 uppercase tracking-wider">
        <span className="flex items-center gap-1.5 text-neutral-300">
          <ShieldCheck className="h-3.5 w-3.5 text-white" />
          100% VAC SAFE · RING-3
        </span>
        <span className="flex items-center gap-1.5 text-neutral-300">
          <Lock className="h-3.5 w-3.5 text-white" />
          INÍCIO EM ~15 MIN
        </span>
      </div>
    </div>
  );
}
