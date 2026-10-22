"use client";

import React, { useState } from "react";
import { cn } from "@/lib/cn";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Download,
  ShieldCheck,
  Zap,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  FileCode,
  HardDrive,
  Cpu,
  Layers,
} from "lucide-react";

export interface OnboardingWalkthroughProps {
  className?: string;
}

interface StepData {
  number: number;
  title: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  summary: string;
  highlights: string[];
  snippetLabel: string;
  snippetCode: string;
}

const STEPS: StepData[] = [
  {
    number: 1,
    title: "Baixar Portátil (149 KB)",
    badge: "ZERO INSTALADOR",
    icon: Download,
    summary:
      "Sem instaladores pesados (MSI ou setup wizards) e sem programas ocultos que inicializam com o Windows e consomem memória RAM.",
    highlights: [
      "Executável nativo compilado em C# .NET 8 com compilação Ahead-of-Time (AOT)",
      "Tamanho minúsculo de apenas 149 KB — download finalizado em menos de 1 segundo",
      "Portátil: execute de qualquer pasta ou pendrive, sem criar entradas no Painel de Controle",
      "Assinatura e checksum SHA-256 disponíveis publicamente para verificação de integridade",
    ],
    snippetLabel: "Executável Portátil",
    snippetCode: "Cs2Booster.exe · 149 KB Standalone AOT · Zero Telemetria",
  },
  {
    number: 2,
    title: "Snapshot Automático de Registro",
    badge: "SEGURANÇA ATIVA",
    icon: ShieldCheck,
    summary:
      "Antes de aplicar qualquer modificação de desempenho, o software faz uma cópia binária completa dos valores originais do seu sistema operacional.",
    highlights: [
      "Snapshot gerado em %localappdata%\\Cs2Booster\\backups\\backup_info.json",
      "Salva o estado original do scheduler, configurações TCP e planos de energia",
      "Auditoria prévia com hash SHA-256 local para garantir restauração matematicamente idêntica",
      "Zero risco: se houver qualquer dúvida ou necessidade, seu Windows pode ser 100% restaurado",
    ],
    snippetLabel: "Arquivo Local de Segurança",
    snippetCode: "%LocalAppData%\\Cs2Booster\\backups\\backup_20261021_auto.json",
  },
  {
    number: 3,
    title: "Ativação Sub-Tick & Scheduler",
    badge: "1-CLIQUE",
    icon: Zap,
    summary:
      "Com 1 clique no perfil desejado, as chaves de prioridade de CPU e os buffers TCP da sua placa de rede são alinhados com o motor do CS2.",
    highlights: [
      "IFEO PerfOptions: CpuPriorityClass=3 (High) e IoPriority=3 garantidos para cs2.exe",
      "TcpAckFrequency=1 e TcpDelAck=0 eliminam o atraso de buffer TCP de 40ms do Windows",
      "Plano Ultimate Performance desativa core parking de núcleos da CPU",
      "100% externo: nenhuma DLL é injetada na memória do CS2, mantendo compatibilidade VAC total",
    ],
    snippetLabel: "Chave do Registro Aplicada",
    snippetCode:
      "HKLM\\...\\Image File Execution Options\\cs2.exe\\PerfOptions -> CpuPriorityClass=3",
  },
  {
    number: 4,
    title: "Reversão Instantânea em 1-Clique",
    badge: "100% REVERSÍVEL",
    icon: RotateCcw,
    summary:
      "Quer voltar ao padrão exato de fábrica da Microsoft? Basta abrir o software e clicar em 'Restaurar Padrões' a qualquer momento.",
    highlights: [
      "Lê o snapshot original e restabelece 100% dos parâmetros anteriores em menos de 1 segundo",
      "Remove overrides de IFEO, devolve TcpAckFrequency=2 e restaura o Plano Equilibrado",
      "Reativa o GameDVR do Windows caso você queira a gravação nativa de volta",
      "Não deixa arquivos residuais no sistema: desinstalação limpa com apenas 1 clique",
    ],
    snippetLabel: "Comando de Restauração",
    snippetCode: "Cs2Booster.exe --revert (Restauração atômica sem resquícios)",
  },
];

export const OnboardingWalkthrough: React.FC<OnboardingWalkthroughProps> = ({
  className,
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const currentStep = STEPS[activeStepIndex];
  const StepIcon = currentStep.icon;

  const handleNext = () => {
    setActiveStepIndex((prev) => Math.min(STEPS.length - 1, prev + 1));
  };

  const handlePrev = () => {
    setActiveStepIndex((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Section Header */}
      <div>
        <div className="flex items-center gap-2">
          <Badge tone="accent">ONBOARDING SIMPLIFICADO</Badge>
          <Badge tone="neutral">FLUXO EM 4 ETAPAS</Badge>
        </div>
        <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-text">
          Como Funciona: Da Instalação à Reversão em 1-Clique
        </h3>
        <p className="text-sm text-muted">
          Entenda o ciclo completo de uso do Cs2Booster com transparência total e zero atrito técnico.
        </p>
      </div>

      {/* Stepper Navigation Bar */}
      <div className="relative">
        {/* Connecting Progress Line (Desktop) */}
        <div
          className="absolute left-6 right-6 top-6 hidden h-0.5 bg-line md:block"
          aria-hidden="true"
        >
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{
              width: `${(activeStepIndex / (STEPS.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Step Buttons */}
        <div
          role="tablist"
          aria-label="Etapas de Onboarding"
          className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
        >
          {STEPS.map((step, idx) => {
            const isCurrent = idx === activeStepIndex;
            const isPast = idx < activeStepIndex;
            const IconComponent = step.icon;

            return (
              <button
                key={step.number}
                type="button"
                role="tab"
                aria-selected={isCurrent}
                aria-controls={`step-panel-${step.number}`}
                id={`step-tab-${step.number}`}
                onClick={() => setActiveStepIndex(idx)}
                className={cn(
                  "relative z-10 flex flex-col items-center rounded-xl border p-4 text-center transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
                  isCurrent
                    ? "border-primary bg-surface-2 shadow-md shadow-primary/10"
                    : isPast
                    ? "border-primary/40 bg-surface hover:border-line-strong"
                    : "border-line bg-surface hover:border-line-strong hover:bg-surface-2"
                )}
              >
                <div
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-200",
                    isCurrent
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : isPast
                      ? "border-primary/40 bg-primary-soft text-primary-soft-text"
                      : "border-line bg-surface-2 text-muted"
                  )}
                >
                  {isPast ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <IconComponent className="h-5 w-5" />
                  )}
                </div>

                <div className="mt-3">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                    Passo {step.number}
                  </span>
                  <div className="font-display text-xs font-bold text-text line-clamp-1 mt-0.5">
                    {step.title}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Detail Card (Progressive Disclosure) */}
      <Card
        id={`step-panel-${currentStep.number}`}
        role="tabpanel"
        aria-labelledby={`step-tab-${currentStep.number}`}
        variant="elevated"
        className="overflow-hidden border-line-strong bg-surface-2 p-6"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          {/* Left Column: Info & Highlights */}
          <div className="space-y-4 lg:max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-text">
                <StepIcon className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Badge tone="accent" size="sm">
                    {currentStep.badge}
                  </Badge>
                  <span className="font-mono text-xs text-muted">
                    Etapa {currentStep.number} de {STEPS.length}
                  </span>
                </div>
                <h4 className="mt-1 font-display text-xl font-bold text-text">
                  {currentStep.title}
                </h4>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-muted">
              {currentStep.summary}
            </p>

            <div className="space-y-2.5 pt-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-text">
                Garantias e Detalhes Desta Etapa:
              </span>
              <ul className="space-y-2">
                {currentStep.highlights.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-muted">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-text" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Code Snippet & Navigation */}
          <div className="flex flex-col justify-between gap-4 rounded-xl border border-line bg-surface p-4 lg:w-80">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs text-muted">
                <FileCode className="h-4 w-4 text-primary-text" />
                <span>{currentStep.snippetLabel}</span>
              </div>
              <div className="rounded-lg border border-line-strong bg-surface-3 p-3 font-mono text-xs text-primary-soft-text break-all">
                {currentStep.snippetCode}
              </div>
            </div>

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between border-t border-line pt-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={handlePrev}
                disabled={activeStepIndex === 0}
                className="font-mono text-xs"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Anterior
              </Button>

              <span className="font-mono text-xs text-muted">
                {activeStepIndex + 1} / {STEPS.length}
              </span>

              <Button
                variant="primary"
                size="sm"
                onClick={handleNext}
                disabled={activeStepIndex === STEPS.length - 1}
                className="font-mono text-xs"
              >
                Próximo
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
