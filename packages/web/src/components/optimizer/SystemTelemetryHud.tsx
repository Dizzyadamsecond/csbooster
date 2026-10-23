"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  Cpu,
  Gauge,
  Zap,
  HardDrive,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Clock,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/cn";

export interface TelemetryMetric {
  id: string;
  label: string;
  value: string;
  baseline: string;
  delta: string;
  status: "optimal" | "active" | "locked";
  icon: typeof Gauge;
  description: string;
}

const DEFAULT_METRICS: TelemetryMetric[] = [
  {
    id: "kernel-timer",
    label: "KERNEL TIMER",
    value: "0.500 ms",
    baseline: "15.6 ms",
    delta: "-96.8%",
    status: "optimal",
    icon: Gauge,
    description: "NtSetTimerResolution cravado em 0.5ms para precisão de clique sub-tick",
  },
  {
    id: "dpc-latency",
    label: "DPC LATENCY",
    value: "4.2 μs",
    baseline: "48.0 μs",
    delta: "-91.2%",
    status: "optimal",
    icon: Activity,
    description: "Rotinas de interrupção adiada do driver de vídeo descarregadas da CPU 0",
  },
  {
    id: "tcp-buffer",
    label: "SUB-TICK TCP",
    value: "0 ms LAG",
    baseline: "40.0 ms",
    delta: "-100%",
    status: "optimal",
    icon: Zap,
    description: "Algoritmo de Nagle desativado via TcpAckFrequency=1 & TcpDelAck=0",
  },
  {
    id: "core-affinity",
    label: "P-CORE LOCK",
    value: "CORES 2-7",
    baseline: "E-Cores Misto",
    delta: "Isolado",
    status: "locked",
    icon: Cpu,
    description: "cs2.exe travado exclusivamente nos núcleos Golden Cove / Raptor Cove",
  },
  {
    id: "ram-cleaner",
    label: "STANDBY RAM",
    value: "TRIM ATIVO",
    baseline: "Fragmentado",
    delta: "Auto-purge",
    status: "active",
    icon: HardDrive,
    description: "EmptyWorkingSet dinâmico limpando listas de espera a cada intervalo",
  },
  {
    id: "gpu-mmcss",
    label: "GPU SCHEDULING",
    value: "PRIORITY 8",
    baseline: "Priority 2",
    delta: "+300%",
    status: "optimal",
    icon: ShieldCheck,
    description: "Multimedia Class Scheduler Service forçado em modo Realtime Games",
  },
];

export function SystemTelemetryHud({ className }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion();
  const [activeMetric, setActiveMetric] = useState<string>("kernel-timer");
  const [pulseKey, setPulseKey] = useState<number>(0);
  const [isLive, setIsLive] = useState<boolean>(true);

  // Micro-telemetry refresh pulse
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setPulseKey((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, [isLive]);

  const currentDetail =
    DEFAULT_METRICS.find((m) => m.id === activeMetric) || DEFAULT_METRICS[0];

  return (
    <section
      aria-label="HUD de Monitoramento de Sistema em Tempo Real"
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d0f] p-4 sm:p-5 shadow-xl transition-all",
        className
      )}
    >
      {/* HUD Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-2.5 w-2.5 items-center justify-center">
            <span
              className={cn(
                "absolute h-full w-full rounded-full bg-white opacity-75",
                !shouldReduceMotion && isLive && "animate-ping"
              )}
            />
            <span className="relative h-2 w-2 rounded-full bg-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black uppercase tracking-wider text-white">
              HUD DE TELEMETRIA DO SISTEMA
            </span>
            <span className="rounded-md border border-white/20 bg-white/5 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-neutral-300">
              RING-3 LIVE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setIsLive((v) => !v)}
            className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-300 hover:bg-white/10 hover:text-white transition-colors"
            title="Alternar modo ao vivo"
          >
            <RefreshCw
              className={cn("h-3 w-3", !shouldReduceMotion && isLive && "animate-spin")}
              style={{ animationDuration: "6s" }}
            />
            <span>{isLive ? "SINCRONIZADO" : "PAUSADO"}</span>
          </button>
          <div className="hidden sm:flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[10px] text-neutral-400">
            <Clock className="h-3 w-3 text-neutral-400" />
            <span>SUB-TICK TICKRATE: 64/128</span>
          </div>
        </div>
      </div>

      {/* Grid of 6 Compact Telemetry Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5 pt-3.5">
        {DEFAULT_METRICS.map((metric) => {
          const isSelected = metric.id === activeMetric;
          const Icon = metric.icon;

          return (
            <button
              key={metric.id}
              type="button"
              onClick={() => setActiveMetric(metric.id)}
              className={cn(
                "group relative flex flex-col items-start justify-between rounded-xl border p-2.5 sm:p-3 text-left transition-all outline-none",
                isSelected
                  ? "border-white bg-white/10 shadow-md shadow-white/10"
                  : "border-white/10 bg-[#141416]/70 hover:border-white/25 hover:bg-[#18181c]"
              )}
            >
              <div className="flex w-full items-center justify-between gap-1 mb-1.5">
                <Icon
                  className={cn(
                    "h-3.5 w-3.5 transition-colors",
                    isSelected ? "text-white" : "text-neutral-400 group-hover:text-neutral-200"
                  )}
                />
                <span
                  className={cn(
                    "font-mono text-[9px] font-bold tracking-tight rounded px-1 py-0.2",
                    isSelected
                      ? "bg-white text-black font-black"
                      : "bg-white/10 text-white"
                  )}
                >
                  {metric.delta}
                </span>
              </div>

              <div className="w-full min-w-0">
                <span className="block font-mono text-[9px] font-semibold uppercase tracking-wider text-neutral-400 truncate">
                  {metric.label}
                </span>
                <span className="block font-display text-xs sm:text-sm font-bold tracking-tight text-white tabular-nums mt-0.5 truncate">
                  {metric.value}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Metric Expanded Detail Footer */}
      <div className="mt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-white/10 bg-[#121215] p-3 text-xs">
        <div className="flex items-start sm:items-center gap-2.5 min-w-0">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white">
            <currentDetail.icon className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="font-mono text-xs font-bold text-white tracking-wide">
                {currentDetail.label}:
              </span>
              <span className="font-mono text-xs font-extrabold text-white">
                {currentDetail.value}
              </span>
              <span className="font-mono text-[10px] text-neutral-400">
                (Padrão: {currentDetail.baseline})
              </span>
            </div>
            <p className="font-sans text-[11px] text-neutral-300 leading-snug break-words mt-0.5 line-clamp-2 sm:line-clamp-none">
              {currentDetail.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center font-mono text-[10px] text-neutral-400 border-t sm:border-t-0 border-white/10 pt-1.5 sm:pt-0 w-full sm:w-auto justify-between sm:justify-end">
          <span className="flex items-center gap-1 text-white">
            <CheckCircle2 className="h-3 w-3 text-white" />
            <span>ESTADO VERIFICADO</span>
          </span>
          <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] text-neutral-300">
            PULSO #{pulseKey}
          </span>
        </div>
      </div>
    </section>
  );
}
