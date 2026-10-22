"use client";

import React, { useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { 
  ShieldCheck, 
  Lock, 
  Wifi, 
  UserCheck, 
  EyeOff, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  KeyRound,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/cn";

export interface SoloDuoModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMode?: "solo" | "duo";
  onSelectMode?: (mode: "solo" | "duo") => void;
}

export function SoloDuoModal({
  isOpen,
  onClose,
  selectedMode = "duo",
  onSelectMode,
}: SoloDuoModalProps) {
  const shouldReduceMotion = useReducedMotion();
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="solo-duo-modal-title"
            aria-describedby="solo-duo-modal-desc"
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95, y: shouldReduceMotion ? 0 : 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95, y: shouldReduceMotion ? 0 : 10 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="relative w-full max-w-4xl rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-2xl my-8 z-10 max-h-[90vh] overflow-y-auto overscroll-contain"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-line pb-5">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary-soft border border-primary/20 text-primary-text font-mono text-xs font-bold uppercase tracking-wider mb-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary-text" />
                  Protocolo de Segurança & Anti-Theft
                </div>
                <h2 id="solo-duo-modal-title" className="text-xl sm:text-2xl font-black uppercase tracking-tight text-text font-display">
                  Solo Boost vs Duo Boost: <span className="text-primary-text">Garantias & Proteção</span>
                </h2>
                <p id="solo-duo-modal-desc" className="mt-1 text-xs font-mono text-muted uppercase tracking-wider">
                  Matriz de Isolamento de Conta · Telemetria Anti-Ban VAC & Proteção de Skins
                </p>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Fechar comparativo de segurança"
                className="rounded-lg p-2 text-muted hover:bg-surface-2 hover:text-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Side-by-Side Comparison Matrix */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Solo Boost Column */}
              <div
                className={cn(
                  "flex flex-col rounded-xl border p-5 transition-all",
                  selectedMode === "solo"
                    ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                    : "border-line bg-surface-2"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary-text">
                      <EyeOff className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-text">Solo Boost</h3>
                      <span className="font-mono text-xs text-muted">Booster joga na sua conta</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-surface-3 font-mono text-[10px] font-bold uppercase tracking-wider text-primary-text">
                    Mais Rápido
                  </span>
                </div>

                {/* Telemetry Badges */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1 font-mono text-[11px] font-bold text-text">
                    <Wifi className="h-3.5 w-3.5 text-primary-text" />
                    VPN: RESIDENCIAL
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1 font-mono text-[11px] font-bold text-text">
                    <Lock className="h-3.5 w-3.5 text-primary-text" />
                    PIN: 4-DÍGITOS
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1 font-mono text-[11px] font-bold text-text">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary-text" />
                    HARDWARE DEDICADO
                  </span>
                </div>

                {/* Structured Spec Matrix */}
                <div className="mt-3 divide-y divide-line rounded-xl border border-line bg-surface p-1 text-xs font-mono">
                  <div className="flex items-center justify-between p-2">
                    <span className="text-muted uppercase">Conexão:</span>
                    <span className="font-bold text-text">Subnet Residencial Local</span>
                  </div>
                  <div className="flex items-center justify-between p-2">
                    <span className="text-muted uppercase">Skins / Inventário:</span>
                    <span className="font-bold text-primary-text">Steam PIN Blindado</span>
                  </div>
                  <div className="flex items-center justify-between p-2">
                    <span className="text-muted uppercase">Ambiente:</span>
                    <span className="font-bold text-text">Ring-3 / Zero Terceiros</span>
                  </div>
                </div>

                {onSelectMode && (
                  <button
                    type="button"
                    onClick={() => {
                      onSelectMode("solo");
                      onClose();
                    }}
                    className={cn(
                      "mt-5 w-full rounded-lg py-2.5 text-xs font-bold uppercase tracking-wider enabled:active:scale-[0.96] transition-[background-color,border-color,color,transform] duration-150 ease-out",
                      selectedMode === "solo"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "border border-line bg-surface hover:border-line-strong text-text"
                    )}
                  >
                    {selectedMode === "solo" ? "Modo Selecionado" : "Escolher Solo Boost"}
                  </button>
                )}
              </div>

              {/* Duo Boost Column */}
              <div
                className={cn(
                  "flex flex-col rounded-xl border p-5 transition-all",
                  selectedMode === "duo"
                    ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                    : "border-line bg-surface-2"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary-text">
                      <UserCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-text">Duo Boost</h3>
                      <span className="font-mono text-xs text-muted">Você joga no mesmo lobby</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 font-mono text-[10px] font-bold uppercase tracking-wider text-primary-text">
                    100% Seguro
                  </span>
                </div>

                {/* Telemetry Badges */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1 font-mono text-[11px] font-bold text-text">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary-text" />
                    ZERO COMPARTILHAMENTO DE SENHA
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1 font-mono text-[11px] font-bold text-text">
                    <Sparkles className="h-3.5 w-3.5 text-primary-text" />
                    CALL: DISCORD PRO
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1 font-mono text-[11px] font-bold text-text">
                    <UserCheck className="h-3.5 w-3.5 text-primary-text" />
                    LOBBY ORGÂNICO
                  </span>
                </div>

                {/* Structured Spec Matrix */}
                <div className="mt-3 divide-y divide-line rounded-xl border border-line bg-surface p-1 text-xs font-mono">
                  <div className="flex items-center justify-between p-2">
                    <span className="text-muted uppercase">Credenciais:</span>
                    <span className="font-bold text-text">Zero Acesso / Você Logado</span>
                  </div>
                  <div className="flex items-center justify-between p-2">
                    <span className="text-muted uppercase">Comunicação:</span>
                    <span className="font-bold text-primary-text">Discord Tático Privado</span>
                  </div>
                  <div className="flex items-center justify-between p-2">
                    <span className="text-muted uppercase">Conformidade:</span>
                    <span className="font-bold text-text">100% Termos Valve (Lobby)</span>
                  </div>
                </div>

                {onSelectMode && (
                  <button
                    type="button"
                    onClick={() => {
                      onSelectMode("duo");
                      onClose();
                    }}
                    className={cn(
                      "mt-5 w-full rounded-lg py-2.5 text-xs font-bold uppercase tracking-wider enabled:active:scale-[0.96] transition-[background-color,border-color,color,transform] duration-150 ease-out",
                      selectedMode === "duo"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "border border-line bg-surface hover:border-line-strong text-text"
                    )}
                  >
                    {selectedMode === "duo" ? "Modo Selecionado" : "Escolher Duo Boost"}
                  </button>
                )}
              </div>
            </div>

            {/* Steam Family View PIN Telemetry Guide */}
            <div className="mt-6 rounded-xl border border-line bg-surface-2 p-4">
              <div className="flex items-center gap-2 mb-3">
                <KeyRound className="h-4 w-4 text-primary-text" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-text font-mono">
                  CONFIGURAÇÃO STEAM FAMILY VIEW PIN · 3 ETAPAS TÁTICAS
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-xs">
                <div className="rounded-lg border border-line bg-surface p-2.5">
                  <span className="font-bold text-primary-text text-[10px] tracking-wider uppercase block">
                    ETAPA 01 · RESTRIÇÃO
                  </span>
                  <span className="text-text text-[11px] mt-1 block">
                    Steam → Configurações → Família: Permitir apenas CS2
                  </span>
                </div>
                <div className="rounded-lg border border-line bg-surface p-2.5">
                  <span className="font-bold text-primary-text text-[10px] tracking-wider uppercase block">
                    ETAPA 02 · PIN 4 DÍGITOS
                  </span>
                  <span className="text-text text-[11px] mt-1 block">
                    Definir PIN: Bloqueio total de inventário, trocas e loja
                  </span>
                </div>
                <div className="rounded-lg border border-line bg-surface p-2.5">
                  <span className="font-bold text-primary-text text-[10px] tracking-wider uppercase block">
                    ETAPA 03 · REVOGAÇÃO
                  </span>
                  <span className="text-text text-[11px] mt-1 block">
                    Pós-boost: Revogar sessões ou redefinir senha em 1 clique
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Summary */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-line pt-4 text-xs font-mono text-muted">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary-text" />
                <span>TELEMETRIA AUDITADA · 100% VAC SAFE</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg bg-surface-3 px-4 py-2 font-bold text-text hover:bg-surface-2 transition-colors cursor-pointer"
              >
                Confirmar e Fechar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
