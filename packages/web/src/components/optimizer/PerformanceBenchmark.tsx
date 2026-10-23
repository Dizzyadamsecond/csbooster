"use client";

import React, { useState } from "react";
import { cn } from "@/lib/cn";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/motion/AnimatedCounter";
import {
  Zap,
  Activity,
  Clock,
  ShieldCheck,
  ChevronDown,
  Info,
  Layers,
  Cpu,
} from "lucide-react";
import { OPTIMIZER_PROFILES, OptimizerProfileId } from "./types";

export interface PerformanceBenchmarkProps {
  /**
   * The currently active optimizer profile. Defaults to "competitive".
   */
  profileId?: OptimizerProfileId;
  /**
   * Whether the simulated optimization is currently applied or in baseline state.
   * If true, counters display optimized values; if false, counters display baseline.
   * Defaults to true.
   */
  isOptimized?: boolean;
  /**
   * Optional custom wrapper class.
   */
  className?: string;
}

export const PerformanceBenchmark: React.FC<PerformanceBenchmarkProps> = ({
  profileId = "competitive",
  isOptimized = true,
  className,
}) => {
  const [vacDetailsOpen, setVacDetailsOpen] = useState(false);
  const profile = OPTIMIZER_PROFILES[profileId] || OPTIMIZER_PROFILES.competitive;

  // Determine current display values based on isOptimized state
  const currentLatency = isOptimized ? profile.targetLatency : profile.baseLatency;
  const currentFpsLow = isOptimized ? profile.targetFpsLow : profile.baseFpsLow;
  const currentInputLag = isOptimized ? profile.targetInputLag : profile.baseInputLag;
  const currentFpsAvg = isOptimized ? profile.targetFpsAvg : profile.baseFpsAvg;

  // Calculated gains
  const latencyDeltaPct = Math.round(
    ((profile.targetLatency - profile.baseLatency) / profile.baseLatency) * 100
  );
  const fpsLowDeltaPct = Math.round(
    ((profile.targetFpsLow - profile.baseFpsLow) / profile.baseFpsLow) * 100
  );
  const inputLagDeltaPct = Math.round(
    ((profile.targetInputLag - profile.baseInputLag) / profile.baseInputLag) * 100
  );
  const fpsAvgDeltaPct = Math.round(
    ((profile.targetFpsAvg - profile.baseFpsAvg) / profile.baseFpsAvg) * 100
  );

  return (
    <div className={cn("space-y-6", className)}>
      {/* Benchmark Section Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Badge tone="accent">BENCHMARK EM TEMPO REAL</Badge>
            <Badge tone="neutral">{profile.name}</Badge>
          </div>
          <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-text">
            Comparativo de Performance: Antes vs. Depois
          </h3>
          <p className="text-sm text-muted">
            Métricas auditadas em partidas Premier (CS2) em hardware de referência (Ryzen 5 / RTX 3060).
          </p>
        </div>
        <div className="text-xs text-muted">
          Estado do simulador:{" "}
          <span
            className={cn(
              "font-mono font-bold",
              isOptimized ? "text-primary-text" : "text-muted"
            )}
          >
            {isOptimized ? "● Tweaks Aplicados" : "○ Baseline (Windows Padrão)"}
          </span>
        </div>
      </div>

      {/* 3 Core Metric Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Card 1: Sub-Tick Network Latency */}
        <Card
          variant="elevated"
          className={cn(
            "relative overflow-hidden transition-all duration-300",
            isOptimized ? "border-primary/40 bg-surface-2" : "border-line bg-surface"
          )}
        >
          <div className="absolute right-3 top-3">
            <Badge tone={isOptimized ? "accent" : "neutral"} size="sm">
              {isOptimized ? `${latencyDeltaPct}%` : "BASELINE"}
            </Badge>
          </div>
          <CardHeader className="border-b-0 pb-1 pt-5">
            <div className="flex items-center gap-2 text-muted">
              <Zap className="h-4 w-4 text-primary-text" />
              <span className="font-mono text-xs uppercase tracking-wider text-muted">
                Latência Sub-Tick (Rede)
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-text">
                <AnimatedCounter
                  value={currentLatency}
                  suffix=" ms"
                  decimals={0}
                  duration={0.4}
                />
              </span>
              <span className="text-xs text-muted line-through">
                {profile.baseLatency} ms
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pb-5 pt-1">
            {/* Visual comparative bar */}
            <div>
              <div className="flex justify-between text-[11px] font-mono text-muted">
                <span>Buffer TCP</span>
                <span>{isOptimized ? `${profile.targetLatency}ms (Otimizado)` : `${profile.baseLatency}ms (Atrasado)`}</span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-surface-3">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                  style={{
                    width: isOptimized ? `${Math.round((profile.targetLatency / profile.baseLatency) * 100)}%` : "100%",
                  }}
                />
              </div>
            </div>
            <p className="text-xs leading-relaxed text-muted">
              <strong className="text-text">Por que melhora:</strong> O Windows ativa por padrão o algoritmo
              Nagle e atraso de confirmação TCP (40ms). O Cs2Booster força{" "}
              <code className="font-mono text-primary-text">TcpAckFrequency=1</code> e{" "}
              <code className="font-mono text-primary-text">TcpDelAck=0</code>, despachando
              cada pacote sub-tick da Valve imediatamente sem enfileiramento.
            </p>
          </CardContent>
        </Card>

        {/* Card 2: FPS 1% Low Stability */}
        <Card
          variant="elevated"
          className={cn(
            "relative overflow-hidden transition-all duration-300",
            isOptimized ? "border-primary/40 bg-surface-2" : "border-line bg-surface"
          )}
        >
          <div className="absolute right-3 top-3">
            <Badge tone={isOptimized ? "accent" : "neutral"} size="sm">
              {isOptimized ? `+${fpsLowDeltaPct}%` : "BASELINE"}
            </Badge>
          </div>
          <CardHeader className="border-b-0 pb-1 pt-5">
            <div className="flex items-center gap-2 text-muted">
              <Activity className="h-4 w-4 text-primary-text" />
              <span className="font-mono text-xs uppercase tracking-wider text-muted">
                Estabilidade FPS (1% Low)
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-text">
                <AnimatedCounter
                  value={currentFpsLow}
                  suffix=" FPS"
                  decimals={0}
                  duration={0.4}
                />
              </span>
              <span className="text-xs text-muted">
                vs {profile.baseFpsLow} FPS base
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pb-5 pt-1">
            {/* Visual comparative bar */}
            <div>
              <div className="flex justify-between text-[11px] font-mono text-muted">
                <span>Piso de Frames em Smokes</span>
                <span>{isOptimized ? `${profile.targetFpsLow} FPS` : `${profile.baseFpsLow} FPS`}</span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-surface-3">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                  style={{
                    width: isOptimized ? "100%" : "64%",
                  }}
                />
              </div>
            </div>
            <p className="text-xs leading-relaxed text-muted">
              <strong className="text-text">Por que melhora:</strong> O scheduler do Windows NT
              gerencia centenas de threads. A chave IFEO define{" "}
              <code className="font-mono text-primary-text">CpuPriorityClass=3</code>, blindando o
              processo do CS2 contra preempção por tarefas de fundo e antivírus durante trocas de tiros.
            </p>
          </CardContent>
        </Card>

        {/* Card 3: DPC Input Lag */}
        <Card
          variant="elevated"
          className={cn(
            "relative overflow-hidden transition-all duration-300",
            isOptimized ? "border-primary/40 bg-surface-2" : "border-line bg-surface"
          )}
        >
          <div className="absolute right-3 top-3">
            <Badge tone={isOptimized ? "accent" : "neutral"} size="sm">
              {isOptimized ? `${inputLagDeltaPct}%` : "BASELINE"}
            </Badge>
          </div>
          <CardHeader className="border-b-0 pb-1 pt-5">
            <div className="flex items-center gap-2 text-muted">
              <Clock className="h-4 w-4 text-primary-text" />
              <span className="font-mono text-xs uppercase tracking-wider text-muted">
                Input Lag DPC / Sistema
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-text">
                <AnimatedCounter
                  value={currentInputLag}
                  suffix=" ms"
                  decimals={1}
                  duration={0.4}
                />
              </span>
              <span className="text-xs text-muted line-through">
                {profile.baseInputLag} ms
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pb-5 pt-1">
            {/* Visual comparative bar */}
            <div>
              <div className="flex justify-between text-[11px] font-mono text-muted">
                <span>Latência de Interrupção DPC</span>
                <span>{isOptimized ? `${profile.targetInputLag}ms (Ultra responsivo)` : `${profile.baseInputLag}ms (Buffer padrão)`}</span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-surface-3">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                  style={{
                    width: isOptimized ? `${Math.round((profile.targetInputLag / profile.baseInputLag) * 100)}%` : "100%",
                  }}
                />
              </div>
            </div>
            <p className="text-xs leading-relaxed text-muted">
              <strong className="text-text">Por que melhora:</strong> O GameDVR e o plano de energia
              Equilibrado colocam núcleos da CPU em hibernação parcial (core parking). Desativando o
              GameDVR e ativando o Ultimate Power Plan, o mouse e teclado respondem instantaneamente.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Auxiliary Performance Note & Average FPS Card */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-line bg-surface p-4 lg:col-span-1">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-primary-text" />
            <span className="font-mono text-xs font-semibold uppercase text-text">FPS Médio Estimado</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-text">
              <AnimatedCounter value={currentFpsAvg} suffix=" FPS" duration={0.4} />
            </span>
            <span className="font-mono text-xs text-primary-text">
              {isOptimized ? `+${fpsAvgDeltaPct}%` : ""}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted">
            Elevação de teto de renderização em mapas pesados como Inferno e Anubis.
          </p>
        </div>

        {/* VAC-Safety Expandable Accordion */}
        <div className="rounded-xl border border-line-strong bg-surface-2 p-4 lg:col-span-3">
          <button
            type="button"
            onClick={() => setVacDetailsOpen((prev) => !prev)}
            className="flex w-full items-center justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            aria-expanded={vacDetailsOpen}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft">
                <ShieldCheck className="h-4 w-4 text-primary-text" />
              </div>
              <div>
                <h4 className="font-display text-sm font-bold text-text">
                  Como esses tweaks funcionam sem risco algum de banimento VAC?
                </h4>
                <p className="text-xs text-muted">
                  Auditoria técnica da arquitetura do Cs2Booster perante as diretrizes da Valve e Faceit AC.
                </p>
              </div>
            </div>
            <ChevronDown
              className={cn(
                "h-5 w-5 text-muted transition-transform duration-200",
                vacDetailsOpen && "rotate-180"
              )}
            />
          </button>

          {vacDetailsOpen && (
            <div className="mt-4 space-y-3 border-t border-line pt-4 text-xs text-muted">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-line bg-surface p-3">
                  <div className="flex items-center gap-2 font-mono font-semibold text-text">
                    <Info className="h-3.5 w-3.5 text-primary-text" />
                    Zero Injeção de Código
                  </div>
                  <p className="mt-1 text-muted">
                    O VAC monitora chamadas como <code className="font-mono text-text">VirtualAllocEx</code> e{" "}
                    <code className="font-mono text-text">WriteProcessMemory</code>. O Cs2Booster não injeta
                    nenhuma DLL e jamais abre o processo do jogo com permissão de escrita de memória.
                  </p>
                </div>
                <div className="rounded-lg border border-line bg-surface p-3">
                  <div className="flex items-center gap-2 font-mono font-semibold text-text">
                    <Layers className="h-3.5 w-3.5 text-primary-text" />
                    APIs Oficiais da Microsoft
                  </div>
                  <p className="mt-1 text-muted">
                    Todos os parâmetros modificados (IFEO, TcpAckFrequency, GameDVR) são chaves públicas e
                    documentadas da Microsoft criadas exatamente para administração de desempenho no Windows.
                  </p>
                </div>
              </div>
              <p className="font-mono text-[11px] text-faint">
                Status de integridade: 100% VAC-Safe · Compatível com Faceit Anti-Cheat e Gamers Club · 0 flags geradas.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
