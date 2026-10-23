"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  RotateCcw,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Trash2,
  Sliders,
  Cpu,
  Wifi,
  Monitor,
  Flame,
  Radio,
} from "lucide-react";
import {
  OPTIMIZER_PROFILES,
  OptimizerProfileId,
  SimulatorStatus,
  TerminalLogEntry,
} from "./types";

export interface OptimizerSimulatorProps {
  /**
   * Currently active profile id (if controlled).
   */
  activeProfile?: OptimizerProfileId;
  /**
   * Callback fired when profile changes.
   */
  onProfileChange?: (profile: OptimizerProfileId) => void;
  /**
   * Current optimization status (if controlled).
   */
  isOptimized?: boolean;
  /**
   * Callback fired when optimization state changes.
   */
  onOptimizationChange?: (isOptimized: boolean) => void;
  /**
   * Optional custom wrapper class.
   */
  className?: string;
}

export const OptimizerSimulator: React.FC<OptimizerSimulatorProps> = ({
  activeProfile: controlledProfile,
  onProfileChange,
  isOptimized: controlledOptimized,
  onOptimizationChange,
  className,
}) => {
  // Uncontrolled state fallbacks
  const [internalProfile, setInternalProfile] = useState<OptimizerProfileId>("competitive");
  const [internalOptimized, setInternalOptimized] = useState(false);
  const [status, setStatus] = useState<SimulatorStatus>("idle");
  const [copiedLogs, setCopiedLogs] = useState(false);

  const selectedProfileId = controlledProfile ?? internalProfile;
  const isOptimized = controlledOptimized ?? internalOptimized;
  const currentProfile = OPTIMIZER_PROFILES[selectedProfileId] || OPTIMIZER_PROFILES.competitive;

  const [logs, setLogs] = useState<TerminalLogEntry[]>([
    {
      id: "init-1",
      timestamp: "00:00.01",
      level: "info",
      prefix: "[INFO]",
      message: "Cs2Booster.exe [v1.0.0] carregado em memória (149 KB Standalone AOT).",
    },
    {
      id: "init-2",
      timestamp: "00:00.04",
      level: "info",
      prefix: "[STATUS]",
      message: "Sistema operacional: Windows 10/11 x64 · Privilégios de Administrador detectados.",
    },
    {
      id: "init-3",
      timestamp: "00:00.08",
      level: "info",
      prefix: "[IDLE]",
      message: "Aguardando seleção de perfil e comando de execução...",
    },
  ]);

  const terminalScrollRef = useRef<HTMLDivElement>(null);
  const timerRefs = useRef<NodeJS.Timeout[]>([]);

  // Clear pending timers on unmount
  useEffect(() => {
    return () => {
      timerRefs.current.forEach((t) => clearTimeout(t));
      timerRefs.current = [];
    };
  }, []);

  // Auto-scroll terminal on new logs
  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleSelectProfile = (id: OptimizerProfileId) => {
    if (status === "optimizing" || status === "restoring") return;
    if (controlledProfile === undefined) {
      setInternalProfile(id);
    }
    onProfileChange?.(id);

    const now = new Date();
    const ts = `${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}.${String(Math.floor(now.getMilliseconds() / 10)).padStart(2, "0")}`;

    setLogs((prev) => [
      ...prev,
      {
        id: `profile-change-${Date.now()}`,
        timestamp: ts,
        level: "info",
        prefix: "[PERFIL]",
        message: `Perfil alterado para: ${OPTIMIZER_PROFILES[id].name}. Requisitos validados.`,
      },
    ]);
  };

  const setOptimizedState = (val: boolean) => {
    if (controlledOptimized === undefined) {
      setInternalOptimized(val);
    }
    onOptimizationChange?.(val);
  };

  const runSimulatedOptimization = () => {
    if (status === "optimizing" || status === "restoring") return;
    setStatus("optimizing");

    timerRefs.current.forEach((t) => clearTimeout(t));
    timerRefs.current = [];

    const plan = [
      {
        delay: 200,
        level: "info" as const,
        prefix: "[SNAPSHOT]",
        message:
          "Criando snapshot automático do Registro: %localappdata%\\Cs2Booster\\backups\\backup_auto.json (100% reversível)",
      },
      {
        delay: 500,
        level: "tweak" as const,
        prefix: "[IFEO]",
        message:
          "Aplicando HKLM\\...\\Image File Execution Options\\cs2.exe\\PerfOptions -> CpuPriorityClass=3 (High Priority)",
      },
      {
        delay: 850,
        level: "tweak" as const,
        prefix: "[SCHEDULER]",
        message:
          "IoPriority=3 (High) configurado. CS2 agora tem prioridade absoluta de CPU e I/O sobre processos de fundo.",
      },
      {
        delay: 1200,
        level: "tweak" as const,
        prefix: "[NETWORK]",
        message:
          "Ajustando pilha TCP: TcpAckFrequency=1 & TcpDelAck=0 (Sub-Tick instantâneo; desativação do delay de 40ms do Windows)",
      },
      {
        delay: 1550,
        level: "tweak" as const,
        prefix: "[NETWORK]",
        message:
          "netsh interface tcp set heuristics disabled · chimney=disabled · rss=enabled (Receive Side Scaling ativo em todos os núcleos)",
      },
      {
        delay: 1900,
        level: "tweak" as const,
        prefix: "[SYSTEM]",
        message:
          "HKCU\\System\\GameConfigStore -> GameDVR_Enabled=0, AppCaptureEnabled=0 (Buffer de gravação nativa desligado)",
      },
      {
        delay: 2250,
        level: "tweak" as const,
        prefix: "[POWER]",
        message:
          "powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c (Plano de Desempenho Máximo ativado · Core Parking desativado)",
      },
      {
        delay: 2600,
        level: "success" as const,
        prefix: "[SUCCESS]",
        message: `Otimização concluída com êxito! Perfil [${currentProfile.name}] ativo. 0 DLLs injetadas · 100% VAC-Safe.`,
      },
    ];

    plan.forEach((step, index) => {
      const timer = setTimeout(() => {
        const now = new Date();
        const ts = `${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}.${String(Math.floor(now.getMilliseconds() / 10)).padStart(2, "0")}`;

        setLogs((prev) => [
          ...prev,
          {
            id: `opt-${Date.now()}-${index}`,
            timestamp: ts,
            level: step.level,
            prefix: step.prefix,
            message: step.message,
          },
        ]);

        if (index === plan.length - 1) {
          setStatus("optimized");
          setOptimizedState(true);
        }
      }, step.delay);

      timerRefs.current.push(timer);
    });
  };

  const runSimulatedRestore = () => {
    if (status === "optimizing" || status === "restoring") return;
    setStatus("restoring");

    timerRefs.current.forEach((t) => clearTimeout(t));
    timerRefs.current = [];

    const plan = [
      {
        delay: 200,
        level: "restore" as const,
        prefix: "[RESTORE]",
        message:
          "Lendo snapshot original: %localappdata%\\Cs2Booster\\backups\\backup_auto.json...",
      },
      {
        delay: 550,
        level: "restore" as const,
        prefix: "[RESTORE]",
        message:
          "Removendo chave IFEO PerfOptions em cs2.exe. Prioridade normal do Windows restaurada.",
      },
      {
        delay: 900,
        level: "restore" as const,
        prefix: "[RESTORE]",
        message:
          "Restaurando parâmetros de rede: TcpAckFrequency=2 e TcpDelAck=1 para os padrões originais do Windows.",
      },
      {
        delay: 1250,
        level: "restore" as const,
        prefix: "[RESTORE]",
        message:
          "Reabilitando GameDVR_Enabled=1 e restaurando plano de energia original: 381b4222-f694-41f0-9685-ff5bb260df2e (Equilibrado).",
      },
      {
        delay: 1600,
        level: "success" as const,
        prefix: "[SUCCESS]",
        message:
          "100% das chaves do Windows restauradas ao estado de fábrica! Nenhum resquício mantido.",
      },
    ];

    plan.forEach((step, index) => {
      const timer = setTimeout(() => {
        const now = new Date();
        const ts = `${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}.${String(Math.floor(now.getMilliseconds() / 10)).padStart(2, "0")}`;

        setLogs((prev) => [
          ...prev,
          {
            id: `res-${Date.now()}-${index}`,
            timestamp: ts,
            level: step.level,
            prefix: step.prefix,
            message: step.message,
          },
        ]);

        if (index === plan.length - 1) {
          setStatus("idle");
          setOptimizedState(false);
        }
      }, step.delay);

      timerRefs.current.push(timer);
    });
  };

  const handleCopyLogs = () => {
    const text = logs
      .map((l) => `[${l.timestamp}] ${l.prefix} ${l.message}`)
      .join("\n");
    if (typeof navigator !== "undefined" && navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
      setCopiedLogs(true);
      const timer = setTimeout(() => setCopiedLogs(false), 2000);
      timerRefs.current.push(timer);
    }
  };

  const handleClearLogs = () => {
    setLogs([
      {
        id: `clear-${Date.now()}`,
        timestamp: "00:00.00",
        level: "info",
        prefix: "[CONSOLE]",
        message: "Terminal limpo pelo usuário. Simulador em execução.",
      },
    ]);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Profile Selector Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-muted">
            <Sliders className="h-4 w-4 text-primary-text" />
            1. Selecione o Perfil de Otimização no Simulador
          </label>
          <span className="text-xs text-muted">
            Ajuste fino de prioridade e rede
          </span>
        </div>

        <div
          role="radiogroup"
          aria-label="Perfil de Otimização"
          className="grid grid-cols-1 gap-3 md:grid-cols-3"
        >
          {(Object.keys(OPTIMIZER_PROFILES) as OptimizerProfileId[]).map((pid) => {
            const p = OPTIMIZER_PROFILES[pid];
            const isSelected = selectedProfileId === pid;

            return (
              <button
                key={pid}
                type="button"
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                onClick={() => handleSelectProfile(pid)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelectProfile(pid);
                  }
                }}
                className={cn(
                  "relative flex flex-col justify-between rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
                  isSelected
                    ? "border-primary bg-surface-2 shadow-md shadow-primary/10"
                    : "border-line bg-surface hover:border-line-strong hover:bg-surface-2"
                )}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-base font-bold text-text">
                      {p.name}
                    </span>
                    <Badge
                      tone={isSelected ? "accent" : "neutral"}
                      size="sm"
                    >
                      {p.badge}
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs text-muted leading-relaxed">
                    {p.tagline}
                  </p>
                </div>

                <div className="mt-4 border-t border-line pt-3 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-muted">Ganhos estimados:</span>
                  <span className="font-bold text-primary-text">
                    +{Math.round(((p.targetFpsLow - p.baseFpsLow) / p.baseFpsLow) * 100)}% 1% Low
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main HUD Window */}
      <div className="overflow-hidden rounded-2xl border border-line-strong bg-surface-2 shadow-xl">
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between border-b border-line bg-surface-3 px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Window control dots */}
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="h-3 w-3 rounded-full bg-primary/80" />
              <span className="h-3 w-3 rounded-full bg-surface-4 border border-line" />
              <span className="h-3 w-3 rounded-full bg-surface-4 border border-line" />
            </div>
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-primary-text" />
              <span className="font-mono text-xs font-semibold text-text">
                Cs2Booster.exe — Interactive HUD & Win32 Shell [v1.0.0]
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {status === "idle" && !isOptimized && (
              <Badge tone="neutral" size="sm">
                BASELINE (PADRÃO WINDOWS)
              </Badge>
            )}
            {status === "optimizing" && (
              <Badge tone="accent" size="sm">
                APLICANDO TWEAKS...
              </Badge>
            )}
            {(status === "optimized" || (status === "idle" && isOptimized)) && (
              <Badge tone="success" size="sm">
                SISTEMA OTIMIZADO
              </Badge>
            )}
            {status === "restoring" && (
              <Badge tone="warning" size="sm">
                REVERTENDO SISTEMA...
              </Badge>
            )}
          </div>
        </div>

        {/* Live Tweaks Pill Bar */}
        <div className="border-b border-line bg-surface/50 px-4 py-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-mono text-muted">Status dos Ajustes Win32:</span>
            <div className="flex flex-wrap items-center gap-2">
              <div
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[11px] border transition-colors",
                  isOptimized
                    ? "border-primary/30 bg-primary/10 text-primary-text"
                    : "border-line bg-surface-2 text-muted"
                )}
              >
                <Cpu className="h-3 w-3" />
                <span>IFEO CpuPriorityClass=3</span>
              </div>

              <div
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[11px] border transition-colors",
                  isOptimized
                    ? "border-primary/30 bg-primary/10 text-primary-text"
                    : "border-line bg-surface-2 text-muted"
                )}
              >
                <Wifi className="h-3 w-3" />
                <span>TcpAckFrequency=1</span>
              </div>

              <div
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[11px] border transition-colors",
                  isOptimized
                    ? "border-primary/30 bg-primary/10 text-primary-text"
                    : "border-line bg-surface-2 text-muted"
                )}
              >
                <Monitor className="h-3 w-3" />
                <span>GameDVR Desativado</span>
              </div>

              <div
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[11px] border transition-colors",
                  isOptimized
                    ? "border-primary/30 bg-primary/10 text-primary-text"
                    : "border-line bg-surface-2 text-muted"
                )}
              >
                <Flame className="h-3 w-3" />
                <span>Ultimate Power Plan</span>
              </div>

              <div
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[11px] border transition-colors",
                  isOptimized
                    ? "border-success/30 bg-success/10 text-success"
                    : "border-line bg-surface-2 text-muted"
                )}
              >
                <ShieldCheck className="h-3 w-3" />
                <span>Snapshot: Ativo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Terminal Log Stream Area */}
        <div className="relative bg-surface-3 p-4">
          <div
            ref={terminalScrollRef}
            className="h-56 overflow-y-auto space-y-1.5 font-mono text-xs text-text selection:bg-primary/30"
          >
            {logs.map((log) => {
              let prefixColor = "text-muted";
              let messageColor = "text-muted";

              if (log.level === "info") {
                prefixColor = "text-primary-text";
                messageColor = "text-text";
              } else if (log.level === "tweak") {
                prefixColor = "text-primary-soft-text";
                messageColor = "text-text";
              } else if (log.level === "success") {
                prefixColor = "text-success";
                messageColor = "text-text font-bold";
              } else if (log.level === "restore") {
                prefixColor = "text-warning";
                messageColor = "text-text";
              }

              return (
                <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                  <span className="select-none text-faint shrink-0">
                    {log.timestamp}
                  </span>
                  <span className={cn("font-bold shrink-0", prefixColor)}>
                    {log.prefix}
                  </span>
                  <span className={messageColor}>{log.message}</span>
                </div>
              );
            })}
          </div>

          {/* Terminal Actions overlay */}
          <div className="absolute right-4 top-4 flex items-center gap-1 bg-surface-3/90 backdrop-blur-sm rounded-lg border border-line p-1">
            <button
              type="button"
              onClick={handleCopyLogs}
              title="Copiar log do terminal"
              className="flex items-center gap-1 rounded px-2 py-1 text-[11px] font-mono text-muted hover:text-text hover:bg-surface-2 transition-colors"
            >
              {copiedLogs ? (
                <>
                  <Check className="h-3 w-3 text-success" />
                  <span>Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copiar</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleClearLogs}
              title="Limpar logs"
              className="flex items-center gap-1 rounded px-2 py-1 text-[11px] font-mono text-muted hover:text-text hover:bg-surface-2 transition-colors"
            >
              <Trash2 className="h-3 w-3" />
              <span>Limpar</span>
            </button>
          </div>
        </div>

        {/* Interactive Controls & Reversion Trigger */}
        <div className="flex flex-col gap-3 border-t border-line bg-surface-2 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={runSimulatedOptimization}
              disabled={status === "optimizing" || status === "restoring"}
              className="font-mono text-xs"
            >
              {status === "optimizing" ? (
                <>
                  <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Aplicando Tweaks no Windows...
                </>
              ) : isOptimized ? (
                <>
                  <Play className="h-3.5 w-3.5" />
                  Re-aplicar Otimização ({currentProfile.name})
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" />
                  Simular Otimização Agora
                </>
              )}
            </Button>

            <Button
              variant="secondary"
              size="md"
              onClick={runSimulatedRestore}
              disabled={
                status === "optimizing" ||
                status === "restoring" ||
                !isOptimized
              }
              className="font-mono text-xs"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Restaurar Backup Original (1-Clique)
            </Button>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted">
            <ShieldCheck className="h-4 w-4 text-primary-text" />
            <span>100% Reversível · 0 DLLs Injetadas · VAC-Safe</span>
          </div>
        </div>
      </div>
    </div>
  );
};
