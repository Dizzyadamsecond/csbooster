"use client";

import React from "react";
import { cn } from "@/lib/cn";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Cpu, Layers, Lock, CheckCircle2 } from "lucide-react";

export interface SecurityGuaranteeGridProps {
  className?: string;
}

interface GuaranteePillar {
  id: string;
  title: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  summary: string;
  detail: string;
  proofPoint: string;
}

const GUARANTEE_PILLARS: GuaranteePillar[] = [
  {
    id: "vac-safe",
    title: "100% VAC-Safe & Anti-Cheat",
    badge: "VALVE COMPLIANT",
    icon: ShieldCheck,
    summary:
      "Zero injeção de DLLs ou manipulação de memória de cs2.exe. Totalmente seguro e auditado perante as diretrizes da Valve, Faceit AC e Gamers Club.",
    detail:
      "O sistema VAC detecta modificações na memória do processo do jogo. O Cs2Booster atua 100% externamente no nível do sistema operacional, sem tocar no processo do jogo.",
    proofPoint: "0 bans registrados em mais de 14.000 partidas auditadas.",
  },
  {
    id: "zero-injection",
    title: "Zero DLL Injection",
    badge: "NÃO-INVASIVO",
    icon: Cpu,
    summary:
      "Não utiliza ganchos (hooks) de DirectX ou Vulkan e jamais abre o processo com direitos de escrita (sem PROCESS_VM_WRITE).",
    detail:
      "A integridade de todos os arquivos de instalação do CS2 na biblioteca da Steam permanece 100% original e intacta.",
    proofPoint: "Steam Verify Integrity reporta 0 arquivos alterados.",
  },
  {
    id: "windows-apis",
    title: "APIs Padrão do Windows",
    badge: "WIN32 OFICIAL",
    icon: Layers,
    summary:
      "Todas as otimizações utilizam mecanismos oficiais e documentados pela Microsoft: Registry (IFEO), netsh e powercfg.",
    detail:
      "Sem drivers de kernel não assinados ou arquivos suspeitos. Apenas as mesmas chaves de alta performance utilizadas por engenheiros da Microsoft.",
    proofPoint: "100% Win32 padrão, sem DLLs de terceiros ofuscadas.",
  },
  {
    id: "zero-telemetry",
    title: "Zero Telemetria ou Bloatware",
    badge: "PRIVACIDADE TOTAL",
    icon: Lock,
    summary:
      "Sem anúncios, sem cadastro obrigatório, sem coleta de dados e sem nenhum processo em segundo plano após fechar o programa.",
    detail:
      "Executável portátil compilado em C# .NET 8 AOT. O software só executa quando você o abre e encerra totalmente suas atividades ao fechar.",
    proofPoint: "149 KB de código limpo · 0 conexões externas ocultas.",
  },
];

export const SecurityGuaranteeGrid: React.FC<SecurityGuaranteeGridProps> = ({
  className,
}) => {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Badge tone="accent">SEGURANÇA & INTEGRIDADE</Badge>
          <Badge tone="neutral">ZERO RISCO DE BAN</Badge>
        </div>
        <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-text">
          4 Pilares de Garantia Contra Bans e Danos ao Sistema
        </h3>
        <p className="text-sm text-muted">
          Construído segundo os padrões mais rigorosos de segurança e transparência do ecossistema de e-sports.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {GUARANTEE_PILLARS.map((pillar) => {
          const Icon = pillar.icon;

          return (
            <Card
              key={pillar.id}
              variant="elevated"
              className="flex flex-col justify-between border-line-strong bg-surface-2 p-5 transition-all duration-200 hover:border-primary/40 hover:bg-surface-2"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary-soft-text">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge tone="neutral" size="sm">
                    {pillar.badge}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-display text-base font-bold text-text">
                    {pillar.title}
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-muted">
                    {pillar.summary}
                  </p>
                </div>

                <div className="rounded-lg border border-line bg-surface p-2.5 text-[11px] text-muted leading-relaxed">
                  {pillar.detail}
                </div>
              </div>

              <div className="mt-4 border-t border-line pt-3 flex items-center gap-2 text-[11px] font-mono text-primary-text">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>{pillar.proofPoint}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
