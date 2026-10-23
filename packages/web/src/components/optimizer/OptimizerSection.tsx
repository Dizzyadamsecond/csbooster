"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  Download,
  RotateCcw,
  ShieldCheck,
  Cpu,
  Zap,
  Check,
  Sliders,
  Gauge,
  Layers,
  Terminal,
} from "lucide-react";
import { AnimatedCounter } from "@/components/motion/AnimatedCounter";
import { OptimizerProfileId } from "./types";

export interface OptimizerSectionProps {
  className?: string;
}

const PROFILES: {
  id: OptimizerProfileId;
  label: string;
  fps: number;
  ping: number;
  dpc: string;
}[] = [
  { id: "competitive", label: "Competitivo Pro", fps: 268, ping: 18, dpc: "4.2 ms" },
  { id: "streaming", label: "Streaming OBS", fps: 242, ping: 19, dpc: "5.1 ms" },
  { id: "lowend", label: "Anti-Stutter", fps: 195, ping: 20, dpc: "5.8 ms" },
];

export const OptimizerSection: React.FC<OptimizerSectionProps> = ({
  className,
}) => {
  const [activeProfile, setActiveProfile] = useState<OptimizerProfileId>("competitive");
  const [isOptimized, setIsOptimized] = useState(true);
  const [copiedSha, setCopiedSha] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // 4 Low-Latency Engine Modules Toggles
  const [timerResolution, setTimerResolution] = useState(true);
  const [pcoreAffinity, setPcoreAffinity] = useState(true);
  const [workingSetFlush, setWorkingSetFlush] = useState(true);
  const [mmcssPriority, setMmcssPriority] = useState(true);

  const current =
    PROFILES.find((p) => p.id === activeProfile) ?? PROFILES[0];

  // Dynamic calculations based on enabled low-latency modules
  const enabledCount =
    (timerResolution ? 1 : 0) +
    (pcoreAffinity ? 1 : 0) +
    (workingSetFlush ? 1 : 0) +
    (mmcssPriority ? 1 : 0);

  const displayFps = isOptimized
    ? Math.round(current.fps - (4 - enabledCount) * 12)
    : 142;
  const displayPing = isOptimized
    ? Math.max(14, current.ping + (4 - enabledCount) * 4)
    : 42;
  const displayDpc = isOptimized
    ? timerResolution
      ? "0.5 ms"
      : current.dpc
    : "11.4 ms";

  const copyHash = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard
        .writeText("3A71A3A8A90835622B92942D12241A908C4EC18E30DA4B9E8A4C19A1C5F1F4E1")
        .catch(() => {});
      setCopiedSha(true);
      setTimeout(() => setCopiedSha(false), 2000);
    }
  };

  return (
    <section
      className={cn("w-full max-w-6xl mx-auto py-2", className)}
      aria-label="CS2 Optimizer Desktop"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Native Windows App Frame + Live Telemetry & Low Latency Lab (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-line-strong bg-surface overflow-hidden shadow-lg">
          {/* Native Windows Titlebar Chrome */}
          <div className="flex items-center justify-between border-b border-line bg-surface-2 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-primary font-display text-[10px] font-black text-primary-foreground">
                CS2
              </span>
              <span className="font-mono text-xs font-bold text-text">
                Cs2Booster.exe — v3.0.0 Noir Pro Arena (Low-Latency)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
              <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
            </div>
          </div>

          {/* Interactive Hardware Telemetry Panel */}
          <div className="p-5 space-y-5">
            {/* Profile Switcher + 1-Click Restore Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="relative inline-flex rounded-xl border border-line bg-surface-2 p-1">
                {PROFILES.map((prof) => {
                  const active = activeProfile === prof.id;
                  return (
                    <button
                      key={prof.id}
                      type="button"
                      onClick={() => {
                        setActiveProfile(prof.id);
                        setIsOptimized(true);
                      }}
                      className={cn(
                        "relative rounded-lg px-3 py-1.5 font-display text-xs font-bold uppercase transition-colors duration-150 active:scale-95 select-none",
                        active
                          ? "text-primary-foreground font-black"
                          : "text-muted hover:text-text hover:bg-surface-3/40"
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="activeOptimizerProfile"
                          className="absolute inset-0 rounded-lg bg-primary shadow-sm"
                          transition={
                            shouldReduceMotion
                              ? { duration: 0 }
                              : { type: "spring", stiffness: 450, damping: 32 }
                          }
                        />
                      )}
                      <span className="relative z-10">{prof.label}</span>
                    </button>
                  );
                })}
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOptimized((prev) => !prev)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-mono text-xs font-bold transition-all shadow-sm",
                  isOptimized
                    ? "border-primary/40 bg-primary-soft text-primary-text"
                    : "border-line bg-surface-2 text-muted hover:text-text"
                )}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>{isOptimized ? "Backup Ativo (Reverter)" : "Aplicar Otimização"}</span>
              </motion.button>
            </div>

            {/* 3 Refined Hardware Readouts */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="rounded-xl border border-line bg-surface-2 p-3 sm:p-4">
                <span className="block font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-muted">
                  1% LOW FPS
                </span>
                <div className="mt-1 flex items-baseline gap-1 font-display">
                  <AnimatedCounter
                    value={displayFps}
                    className="text-lg sm:text-xl md:text-2xl font-bold text-primary-text tabular-nums"
                  />
                  <span className="font-mono text-[10px] sm:text-[11px] text-muted">FPS</span>
                </div>
              </div>

              <div className="rounded-xl border border-line bg-surface-2 p-3 sm:p-4">
                <span className="block font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-muted">
                  SUB-TICK PING
                </span>
                <div className="mt-1 flex items-baseline gap-1 font-display">
                  <AnimatedCounter
                    value={displayPing}
                    className="text-lg sm:text-xl md:text-2xl font-bold text-text tabular-nums"
                  />
                  <span className="font-mono text-[10px] sm:text-[11px] text-muted">ms</span>
                </div>
              </div>

              <div className="rounded-xl border border-line bg-surface-2 p-3 sm:p-4">
                <span className="block font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-muted">
                  KERNEL TIMER
                </span>
                <div className="mt-1 font-display text-base sm:text-lg md:text-xl font-bold text-text tabular-nums">
                  {displayDpc}
                </div>
              </div>
            </div>

            {/* Interactive Low-Latency Modules Toggle Strip */}
            <div className="rounded-xl border border-line bg-surface-2 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-primary-text" />
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-text">
                    Módulos Nativos de Baixa Latência (Ring-3 / Kernel)
                  </span>
                </div>
                <span className="font-mono text-[10px] text-muted">
                  {enabledCount}/4 ATIVOS
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {/* Module 1: Kernel Timer */}
                <motion.button
                  type="button"
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.01 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                  onClick={() => setTimerResolution((p) => !p)}
                  className={cn(
                    "flex items-center justify-between rounded-lg border p-2.5 transition-colors duration-150 text-left",
                    timerResolution
                      ? "border-primary/40 bg-primary-soft/40 text-text hover:border-primary/60"
                      : "border-line bg-surface text-muted hover:border-line-strong hover:text-text"
                  )}
                >
                  <div>
                    <span className="block font-bold">NtSetTimerResolution</span>
                    <span className="text-[10px] text-muted block">0.50 ms clock tick</span>
                  </div>
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase transition-colors duration-150",
                      timerResolution
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-surface-3 text-muted"
                    )}
                  >
                    {timerResolution ? "0.5ms" : "15.6ms"}
                  </span>
                </motion.button>

                {/* Module 2: P-Core Affinity */}
                <motion.button
                  type="button"
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.01 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                  onClick={() => setPcoreAffinity((p) => !p)}
                  className={cn(
                    "flex items-center justify-between rounded-lg border p-2.5 transition-colors duration-150 text-left",
                    pcoreAffinity
                      ? "border-primary/40 bg-primary-soft/40 text-text hover:border-primary/60"
                      : "border-line bg-surface text-muted hover:border-line-strong hover:text-text"
                  )}
                >
                  <div>
                    <span className="block font-bold">P-Core Affinity Pinning</span>
                    <span className="text-[10px] text-muted block">Core 0 DPC Bypass</span>
                  </div>
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase transition-colors duration-150",
                      pcoreAffinity
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-surface-3 text-muted"
                    )}
                  >
                    {pcoreAffinity ? "ISOLADO" : "PADRÃO"}
                  </span>
                </motion.button>

                {/* Module 3: EmptyWorkingSet */}
                <motion.button
                  type="button"
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.01 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                  onClick={() => setWorkingSetFlush((p) => !p)}
                  className={cn(
                    "flex items-center justify-between rounded-lg border p-2.5 transition-colors duration-150 text-left",
                    workingSetFlush
                      ? "border-primary/40 bg-primary-soft/40 text-text hover:border-primary/60"
                      : "border-line bg-surface text-muted hover:border-line-strong hover:text-text"
                  )}
                >
                  <div>
                    <span className="block font-bold">EmptyWorkingSet</span>
                    <span className="text-[10px] text-muted block">Flush Standby RAM</span>
                  </div>
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase transition-colors duration-150",
                      workingSetFlush
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-surface-3 text-muted"
                    )}
                  >
                    {workingSetFlush ? "LIMPO" : "CACHE"}
                  </span>
                </motion.button>

                {/* Module 4: MMCSS GPU Priority */}
                <motion.button
                  type="button"
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.01 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                  onClick={() => setMmcssPriority((p) => !p)}
                  className={cn(
                    "flex items-center justify-between rounded-lg border p-2.5 transition-colors duration-150 text-left",
                    mmcssPriority
                      ? "border-primary/40 bg-primary-soft/40 text-text hover:border-primary/60"
                      : "border-line bg-surface text-muted hover:border-line-strong hover:text-text"
                  )}
                >
                  <div>
                    <span className="block font-bold">MMCSS Tasks\\Games</span>
                    <span className="text-[10px] text-muted block">GPU Priority = 8</span>
                  </div>
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase transition-colors duration-150",
                      mmcssPriority
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-surface-3 text-muted"
                    )}
                  >
                    {mmcssPriority ? "HIGH/8" : "PADRÃO"}
                  </span>
                </motion.button>
              </div>
            </div>

            {/* Real Native WPF Screenshot Preview */}
            <div className="group relative overflow-hidden rounded-xl border border-line bg-surface-2 transition-all duration-300 hover:border-white/30 hover:shadow-2xl">
              <img
                src="/images/wpf-live.png"
                alt="Interface real do aplicativo desktop Cs2Booster.exe no Windows"
                className="w-full h-auto object-cover block outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10 transition-transform duration-500 ease-out group-hover:scale-[1.015]"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
              <div className="flex items-center justify-between border-t border-line bg-surface/95 px-3.5 py-2 font-mono text-[11px] text-muted">
                <span>Captura real do cliente Windows WPF (.NET 8)</span>
                <span className="text-primary-text font-bold">Ring-3 User Mode</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Clean Single-CTA Download Card (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 rounded-2xl border border-line-strong bg-surface p-6 space-y-5 shadow-md">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary-text block">
                PORTÁVEL · SEM INSTALADOR
              </span>
              <h3 className="font-display text-2xl font-black uppercase text-text mt-0.5">
                Cs2Booster.exe
              </h3>
            </div>
            <span className="rounded-lg border border-primary/30 bg-primary-soft px-2.5 py-1 font-mono text-xs font-bold text-primary-text">
              149 KB
            </span>
          </div>

          {/* 4 Ultra-Concise Specs */}
          <div className="space-y-2.5 font-mono text-xs">
            <div className="flex items-center justify-between rounded-xl border border-line bg-surface-2 px-3.5 py-2.5">
              <span className="flex items-center gap-2 text-muted">
                <Gauge className="h-4 w-4 text-primary-text" />
                Kernel Timer Resolution
              </span>
              <span className="font-bold text-text">0.50 ms</span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-line bg-surface-2 px-3.5 py-2.5">
              <span className="flex items-center gap-2 text-muted">
                <Cpu className="h-4 w-4 text-primary-text" />
                Isolamento P-Core (DPC)
              </span>
              <span className="font-bold text-text">Automático</span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-line bg-surface-2 px-3.5 py-2.5">
              <span className="flex items-center gap-2 text-muted">
                <RotateCcw className="h-4 w-4 text-primary-text" />
                Backup Integral do Registro
              </span>
              <span className="font-bold text-text">1 Clique</span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-line bg-surface-2 px-3.5 py-2.5">
              <span className="flex items-center gap-2 text-muted">
                <ShieldCheck className="h-4 w-4 text-primary-text" />
                Zero Injeção DLL / Memória
              </span>
              <span className="font-bold text-primary-text">100% VAC Safe</span>
            </div>
          </div>

          {/* Single Primary Download CTA */}
          <div className="space-y-2.5 pt-1">
            <a
              href="/downloads/Cs2Booster.exe"
              download
              className="w-full py-4 pl-6 pr-5 rounded-xl font-display font-extrabold text-sm uppercase tracking-wider bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:brightness-110 enabled:active:scale-[0.96] transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-out flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              <span>Baixar Cs2Booster.exe</span>
            </a>

            <a
              href="/downloads/Cs2Booster-v1.0.0.zip"
              download
              className="w-full py-2.5 px-4 rounded-xl font-mono text-xs font-bold text-muted hover:text-text border border-line hover:bg-surface-2 enabled:active:scale-[0.96] transition-[background-color,border-color,color,transform] duration-150 ease-out flex items-center justify-center gap-2"
            >
              <span>Pacote Completo (.ZIP · 81 KB)</span>
            </a>
          </div>

          {/* Minimal SHA-256 Verification Line */}
          <div className="flex items-center justify-between border-t border-line pt-3 font-mono text-[11px] text-muted">
            <span>Windows 10 / 11 (x64)</span>
            <button
              type="button"
              onClick={copyHash}
              className="inline-flex items-center gap-1 text-primary-text hover:underline"
            >
              {copiedSha ? (
                <>
                  <Check className="h-3 w-3" />
                  <span>SHA-256 Copiado</span>
                </>
              ) : (
                <>
                  <Zap className="h-3 w-3" />
                  <span>Verificar SHA-256</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
