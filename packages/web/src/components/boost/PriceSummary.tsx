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
    <div className="rounded-2xl border border-primary/30 bg-surface/85 backdrop-blur-md p-6 space-y-5 shadow-2xl shadow-primary/10">
      {/* Top Status Strip */}
      <div className="flex items-center justify-between border-b border-line pb-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-text">
            3 Boosters FPL Online
          </span>
        </div>
        <span className="flex items-center gap-1 font-mono text-xs text-muted">
          <Clock className="h-3.5 w-3.5 text-primary-text" />
          ~{estimatedHours}h
        </span>
      </div>

      {/* Compact Itemized Lines */}
      <dl className="space-y-2 text-xs font-mono">
        {breakdown.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between gap-2">
            <dt className="text-muted truncate">{item.label}</dt>
            <dd className="font-bold text-text shrink-0">
              {item.amount > 0 ? `R$ ${item.amount}` : "Incluso"}
            </dd>
          </div>
        ))}
      </dl>

      {/* Main Price Readout */}
      <div className="rounded-xl border border-primary/30 bg-surface-2/90 backdrop-blur-sm p-4 space-y-3 shadow-inner">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="block font-mono text-[10px] uppercase tracking-wider text-muted">
              TOTAL NO PIX (5% OFF)
            </span>
            <div className="mt-1 flex items-baseline gap-1 font-display">
              <span className="text-base font-bold text-primary-text">R$</span>
              <AnimatedCounter
                value={pixTotalPrice}
                className="text-4xl sm:text-5xl font-black tracking-tight text-text tabular-nums"
              />
              <span className="font-mono text-xs text-muted">,00</span>
            </div>
          </div>

          <div className="text-right font-mono">
            <span className="inline-flex items-center gap-1 rounded bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary-text border border-primary/30">
              <QrCode className="h-3 w-3" />
              -R$ {pixDiscountAmount}
            </span>
            <span className="block text-[11px] text-muted mt-1 line-through">
              Cartão: R$ {totalPrice},00
            </span>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <button
        type="button"
        onClick={onCheckout}
        disabled={disabled || isLoading}
        aria-label="Iniciar pedido agora"
        className={cn(
          "w-full py-4 px-6 rounded-xl font-display font-extrabold text-sm uppercase tracking-wider",
          "bg-primary text-primary-foreground shadow-lg shadow-primary/20",
          "hover:brightness-110 esports-button-glow enabled:active:scale-[0.96] transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-out flex items-center justify-center gap-2 pl-6 pr-5",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
          disabled && "opacity-50 pointer-events-none"
        )}
      >
        <span>Iniciar Boost Agora</span>
        <ArrowRight className="h-4 w-4" />
      </button>

      {/* Minimalist Trust Footer */}
      <div className="flex items-center justify-between pt-1 font-mono text-[11px] text-muted">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-primary-text" />
          100% VAC Safe
        </span>
        <span className="flex items-center gap-1.5">
          <Lock className="h-3.5 w-3.5 text-primary-text" />
          Início em 15 min
        </span>
      </div>
    </div>
  );
}
