"use client";

import React, { useState } from "react";
import { cn } from "@/lib/cn";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Copy,
  Check,
  ShieldCheck,
  CheckCircle2,
  FileArchive,
  Info,
  Monitor,
} from "lucide-react";

export interface OptimizerDownloadCardProps {
  className?: string;
}

const SHA256_HASH = "D89226FAA969C77A488C0828BED4F1D78D0EC9F57859E3DD6ACABFA9740857F5";

export const OptimizerDownloadCard: React.FC<OptimizerDownloadCardProps> = ({
  className,
}) => {
  const [copiedHash, setCopiedHash] = useState(false);

  const handleCopyHash = () => {
    if (typeof navigator !== "undefined" && navigator?.clipboard?.writeText) {
      navigator.clipboard
        .writeText(SHA256_HASH)
        .catch(() => {});
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  return (
    <Card
      variant="elevated"
      className={cn(
        "relative overflow-hidden border-line-strong bg-gradient-to-b from-surface-2 to-surface p-6 sm:p-8 shadow-2xl",
        className
      )}
    >
      {/* Subtle background glow */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Product Info & Copy */}
        <div className="space-y-3 lg:max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="accent">DOWNLOAD OFICIAL</Badge>
            <Badge tone="neutral">VERSÃO 1.0.0 ESTÁVEL</Badge>
            <Badge tone="accent">149 KB PORTÁTIL</Badge>
          </div>

          <h3 className="font-display text-lg font-bold tracking-tight text-text sm:text-xl">
            Pronto para Jogar CS2 com Menor Latência e Zero Stutter?
          </h3>

          <p className="text-xs leading-relaxed text-muted sm:text-sm">
            Baixe o executável nativo em C# .NET 8 AOT. Não requer instalação, não requer cadastro e
            cria backup automático das suas configurações do Windows antes de aplicar qualquer ajuste.
          </p>

          {/* System Requirements Pills */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-muted">
            <span className="flex items-center gap-1.5 font-mono">
              <Monitor className="h-3.5 w-3.5 text-primary-text" />
              Windows 10/11 (64-bit)
            </span>
            <span className="text-line">•</span>
            <span className="flex items-center gap-1.5 font-mono">
              <ShieldCheck className="h-3.5 w-3.5 text-primary-text" />
              100% VAC-Safe
            </span>
            <span className="text-line">•</span>
            <span className="flex items-center gap-1.5 font-mono">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary-text" />
              1-Clique para Restaurar
            </span>
          </div>
        </div>

        {/* Right: High-Converting CTAs */}
        <div className="flex flex-col gap-3 sm:min-w-[280px]">
          <ButtonLink
            href="/downloads/Cs2Booster.exe"
            download="Cs2Booster.exe"
            variant="primary"
            size="lg"
            className="w-full font-mono text-sm shadow-lg shadow-primary/20"
          >
            <Download className="h-4 w-4" />
            Baixar Cs2Booster.exe (149 KB)
          </ButtonLink>

          <ButtonLink
            href="/downloads/Cs2Booster-v1.0.0.zip"
            download="Cs2Booster-v1.0.0.zip"
            variant="glass"
            size="md"
            className="w-full font-mono text-xs"
          >
            <FileArchive className="h-4 w-4" />
            Baixar Pacote Completo (.zip)
          </ButtonLink>

          <span className="text-center font-mono text-[11px] text-faint">
            Gratuito · Sem anúncios · Sem telemetria
          </span>
        </div>
      </div>

      {/* SHA-256 Hash Verification Strip */}
      <div className="mt-6 border-t border-line pt-4">
        <div className="flex flex-col gap-2 rounded-xl border border-line bg-surface-3 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="font-mono text-xs font-bold uppercase text-muted shrink-0">
              SHA-256:
            </span>
            <code className="truncate font-mono text-xs text-primary-soft-text select-all">
              {SHA256_HASH}
            </code>
          </div>

          <button
            type="button"
            onClick={handleCopyHash}
            className="flex items-center gap-1.5 self-start rounded-md border border-line bg-surface-2 px-2.5 py-1 text-xs font-mono text-muted hover:text-text hover:bg-surface-3 transition-colors shrink-0 sm:self-auto cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            title="Copiar hash de verificação SHA-256"
          >
            {copiedHash ? (
              <>
                <Check className="h-3.5 w-3.5 text-success" />
                <span className="text-success font-semibold">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copiar Hash</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Card>
  );
};
