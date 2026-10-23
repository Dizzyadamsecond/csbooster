"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import {
  Users,
  Sliders,
  MapPin,
  Cpu,
  Trophy,
  ArrowRight,
  ArrowLeft,
  X,
  Play,
  Pause,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Sparkles,
  ChevronRight,
  Volume2,
  VolumeX,
  RefreshCw,
  Gamepad2,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

export interface OnboardingGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tabId: "overview" | "simulator" | "benchmarks" | "maps" | "security" | "faq") => void;
  initialStep?: number;
}

interface StepItem {
  id: string;
  tabTarget: "overview" | "simulator" | "benchmarks" | "maps" | "security" | "faq";
  stepNumber: string;
  category: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  ctaLabel: string;
}

const STEPS: StepItem[] = [
  {
    id: "architecture",
    tabTarget: "overview",
    stepNumber: "01",
    category: "ARQUITETURA & PORTABILIDADE",
    title: "CS2BOOSTER.EXE: STANDALONE AOT",
    description:
      "Software executável nativo ultraleve (149 KB) compilado em C# .NET 8 AOT para Windows 10/11 x64. Sem instalador, sem processos ocultos e zero telemetria.",
    icon: Cpu,
    features: [
      "149 KB portátil: abre em qualquer pasta sem instalação",
      "Compilado em .NET 8 AOT para resposta de milissegundos",
      "Hash SHA-256 verificado e auditável publicamente",
    ],
    ctaLabel: "Ver Visão Geral",
  },
  {
    id: "timer",
    tabTarget: "simulator",
    stepNumber: "02",
    category: "KERNEL & LATÊNCIA",
    title: "TIMER RESOLUTION EM 0.500MS",
    description:
      "Substitui a taxa de interrupção padrão de 15.6ms do Windows por 0.500ms via NtSetTimerResolution, eliminando o atraso de entrega de frames ao monitor.",
    icon: Sliders,
    features: [
      "Taxa de clock do sistema cravada em exatos 0.500ms",
      "Isolamento de DPC e interrupções fora do Core 0",
      "Prioridade GPU MMCSS Games configurada em Priority 8",
    ],
    ctaLabel: "Abrir Console HUD",
  },
  {
    id: "subtick",
    tabTarget: "maps",
    stepNumber: "03",
    category: "SUB-TICK & REDE",
    title: "BUFFER ZERO NO MOTOR DO CS2",
    description:
      "Desativa os 40ms de atraso do algoritmo Nagle com TcpAckFrequency=1 e TcpDelAck=0, sincronizando cada clique de tiro instantaneamente com o sub-tick da Valve.",
    icon: Zap,
    features: [
      "Disparo de pacotes sem buffering artificial do Windows",
      "Variação de jitter reduzida em mais de 57% em servidores SA",
      "Receive Side Scaling (RSS) ativo em todas as interfaces",
    ],
    ctaLabel: "Explorar Mapas & Resoluções",
  },
  {
    id: "benchmarks",
    tabTarget: "benchmarks",
    stepNumber: "04",
    category: "BENCHMARKS DE FRAMETIME",
    title: "+88% DE ESTABILIDADE NO 1% LOW",
    description:
      "Elimine quedas súbitas de FPS em duelos intensos e smokes volumétricas. Frametime linear projetado para telas de 144Hz a 540Hz.",
    icon: Trophy,
    features: [
      "Elevação média de 142 para 268 FPS no 1% Low",
      "Redução de 63% na latência DPC de drivers do sistema",
      "Despejo dinâmico de Standby RAM (EmptyWorkingSet)",
    ],
    ctaLabel: "Ver Comparativo Completo",
  },
  {
    id: "security",
    tabTarget: "security",
    stepNumber: "05",
    category: "SEGURANÇA & VAC SAFE",
    title: "100% VAC SAFE & RESTAURAÇÃO EM 1-CLIQUE",
    description:
      "Opera 100% em Ring-3 User Mode sem tocar na memória do cs2.exe. Cria snapshot binário automático no Windows para reverter tudo em 1 clique.",
    icon: ShieldCheck,
    features: [
      "0 DLLs injetadas e zero chamadas a PROCESS_VM_WRITE",
      "Compatibilidade total com VAC, Faceit AC e Gamers Club",
      "Snapshot automático em %localappdata%\\Cs2Booster\\backups",
    ],
    ctaLabel: "Conferir Auditoria VAC",
  },
];

const AUTO_ADVANCE_DURATION = 8000; // 8 seconds per story

export function OnboardingGuide({
  isOpen,
  onClose,
  onNavigateTab,
  initialStep = 0,
}: OnboardingGuideProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [progress, setProgress] = useState(0);

  // Independent pause controls (manual button vs. hover/touch)
  const [isManualPaused, setIsManualPaused] = useState(false);
  const [isHoverPaused, setIsHoverPaused] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);

  // Interactive state for Software Demo widgets (High retention)
  const [demoCopiedHash, setDemoCopiedHash] = useState(false);
  const [demoTimerActive, setDemoTimerActive] = useState<boolean>(true);
  const [demoTcpBypass, setDemoTcpBypass] = useState<boolean>(true);
  const [demoBenchmarkActive, setDemoBenchmarkActive] = useState<boolean>(true);
  const [demoSnapshotReverted, setDemoSnapshotReverted] = useState<boolean>(false);

  const shouldReduceMotion = useReducedMotion();
  const startTimeRef = useRef<number>(Date.now());
  const elapsedBeforePauseRef = useRef<number>(0);

  // Touch swipe support
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchHoldTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isPaused = isManualPaused || isHoverPaused;

  // Synthesized Web Audio tick for luxury game feel (0 network assets)
  const playSound = useCallback(
    (type: "tick" | "next" | "complete" = "tick") => {
      if (!isSoundEnabled || typeof window === "undefined") return;
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";

        const freq = type === "complete" ? 880 : type === "next" ? 587.33 : 440;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.035, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.07);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.07);
      } catch {
        // audio context blocked or unsupported
      }
    },
    [isSoundEnabled]
  );

  // Sync step if opened with initialStep
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(initialStep);
      setProgress(0);
      elapsedBeforePauseRef.current = 0;
      startTimeRef.current = Date.now();
      setIsManualPaused(false);
      setIsHoverPaused(false);
    }
  }, [isOpen, initialStep]);

  // Handle Mark Complete in localStorage
  const handleComplete = useCallback(() => {
    try {
      localStorage.setItem("cs2booster_guide_completed", "true");
    } catch {
      // safe fallback
    }
    playSound("complete");
    onClose();
  }, [onClose, playSound]);

  const handleNext = useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
      setProgress(0);
      elapsedBeforePauseRef.current = 0;
      startTimeRef.current = Date.now();
      playSound("next");
    } else {
      handleComplete();
    }
  }, [currentStep, handleComplete, playSound]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
      setProgress(0);
      elapsedBeforePauseRef.current = 0;
      startTimeRef.current = Date.now();
      playSound("next");
    }
  }, [currentStep, playSound]);

  const handleSelectStep = (index: number) => {
    if (index === currentStep) return;
    setDirection(index > currentStep ? 1 : -1);
    setCurrentStep(index);
    setProgress(0);
    elapsedBeforePauseRef.current = 0;
    startTimeRef.current = Date.now();
    playSound("tick");
  };

  const handleCtaClick = (tabTarget: StepItem["tabTarget"]) => {
    handleComplete();
    if (onNavigateTab) {
      onNavigateTab(tabTarget);
    }
  };

  // Safe manual pause toggle that correctly captures elapsed time
  const toggleManualPause = useCallback(() => {
    setIsManualPaused((prev) => {
      const next = !prev;
      if (next) {
        // Pausing: persist elapsed time
        elapsedBeforePauseRef.current += Date.now() - startTimeRef.current;
      } else {
        // Resuming: reset start timestamp
        startTimeRef.current = Date.now();
      }
      return next;
    });
  }, []);

  const handleHoverPause = useCallback(() => {
    if (!isHoverPaused) {
      elapsedBeforePauseRef.current += Date.now() - startTimeRef.current;
      setIsHoverPaused(true);
    }
  }, [isHoverPaused]);

  const handleHoverResume = useCallback(() => {
    if (isHoverPaused) {
      startTimeRef.current = Date.now();
      setIsHoverPaused(false);
    }
  }, [isHoverPaused]);

  // Touch Swipe & Hold to Pause handlers (Instagram style)
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;

    // Press-and-hold to pause story
    touchHoldTimerRef.current = setTimeout(() => {
      handleHoverPause();
    }, 180);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchHoldTimerRef.current) {
      clearTimeout(touchHoldTimerRef.current);
      touchHoldTimerRef.current = null;
    }
    handleHoverResume();

    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartXRef.current;
    const deltaY = touch.clientY - touchStartYRef.current;

    // Detect horizontal swipe
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleComplete();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === " ") {
        e.preventDefault();
        toggleManualPause();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleNext, handlePrev, handleComplete, toggleManualPause]);

  // High-retention Auto Progress Loop with synchronized tick
  useEffect(() => {
    if (!isOpen || isPaused) return;

    const interval = 50; // 50ms tick for ultra smooth bar
    const stepDuration = AUTO_ADVANCE_DURATION;

    const tick = () => {
      const now = Date.now();
      const elapsed = elapsedBeforePauseRef.current + (now - startTimeRef.current);
      const currentPct = Math.min((elapsed / stepDuration) * 100, 100);

      setProgress(currentPct);

      if (currentPct >= 100) {
        handleNext();
      }
    };

    const intervalId = setInterval(tick, interval);
    return () => clearInterval(intervalId);
  }, [isOpen, isPaused, currentStep, handleNext]);

  if (!isOpen) return null;

  const currentStepData = STEPS[currentStep];
  const StepIcon = currentStepData.icon;

  const slideVariants: Variants = {
    enter: (dir: number) => ({
      x: shouldReduceMotion ? 0 : dir > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.99,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: shouldReduceMotion
        ? { duration: 0.15 }
        : {
            type: "spring",
            stiffness: 380,
            damping: 32,
            bounce: 0,
          },
    },
    exit: (dir: number) => ({
      x: shouldReduceMotion ? 0 : dir > 0 ? -50 : 50,
      opacity: 0,
      scale: 0.99,
      transition: { duration: 0.16, ease: "easeInOut" },
    }),
  };


  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Guia Rápido de Navegação"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      {/* Immersive Dark Glass Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={handleComplete}
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* Main Stories / Guided Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
          bounce: 0,
        }}
        onMouseEnter={handleHoverPause}
        onMouseLeave={handleHoverResume}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative z-10 w-full max-w-3xl max-h-[92vh] flex flex-col justify-between overflow-y-auto rounded-2xl sm:rounded-3xl border border-white/20 bg-[#0e0e10] p-4 sm:p-7 shadow-2xl shadow-black/90"
      >
        {/* Subtle Ambient Radial Glow */}
        <div className="pointer-events-none absolute -top-32 -left-32 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

        {/* Top Header Controls: Segmented Progress Bar + Action Buttons */}
        <div className="relative z-10 space-y-3.5">
          {/* Instagram Stories Segmented Progress Bar */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {STEPS.map((step, idx) => {
              const isPast = idx < currentStep;
              const isCurrent = idx === currentStep;
              const barWidth = isPast ? "100%" : isCurrent ? `${progress}%` : "0%";

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => handleSelectStep(idx)}
                  className="group relative h-1.5 sm:h-2 flex-1 rounded-full bg-white/15 overflow-hidden transition-all duration-200 hover:bg-white/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
                  title={`Ir para etapa ${idx + 1}: ${step.category}`}
                  aria-label={`Etapa ${idx + 1} de ${STEPS.length}: ${step.category}`}
                >
                  <div
                    style={{ width: barWidth }}
                    className={cn(
                      "h-full rounded-full bg-white transition-[width] duration-75",
                      isCurrent && "shadow-[0_0_8px_rgba(255,255,255,0.7)]"
                    )}
                  />
                </button>
              );
            })}
          </div>

          {/* Sub Header: Step Index & Controls */}
          <div className="flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] sm:text-xs font-black tracking-widest text-neutral-400 uppercase">
                GUIA INTERATIVO // {currentStep + 1} DE {STEPS.length}
              </span>

              {/* Pause/Play Toggle Button */}
              <button
                type="button"
                onClick={toggleManualPause}
                className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-neutral-300 hover:bg-white/10 hover:text-white transition-colors"
                title={isPaused ? "Retomar reprodução automática" : "Pausar reprodução"}
              >
                {isPaused ? (
                  <>
                    <Play className="h-2.5 w-2.5" />
                    <span>Pausado</span>
                  </>
                ) : (
                  <>
                    <Pause className="h-2.5 w-2.5" />
                    <span>Auto</span>
                  </>
                )}
              </button>

              {/* Sound SFX Toggle */}
              <button
                type="button"
                onClick={() => {
                  setIsSoundEnabled((prev) => !prev);
                  if (!isSoundEnabled) playSound("tick");
                }}
                className={cn(
                  "flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] transition-colors",
                  isSoundEnabled
                    ? "border-white/30 bg-white/15 text-white"
                    : "border-white/10 bg-white/5 text-neutral-400 hover:text-neutral-200"
                )}
                title={isSoundEnabled ? "Desativar efeitos sonoros" : "Ativar efeitos sonoros"}
              >
                {isSoundEnabled ? (
                  <Volume2 className="h-2.5 w-2.5 text-white" />
                ) : (
                  <VolumeX className="h-2.5 w-2.5" />
                )}
                <span className="hidden sm:inline">{isSoundEnabled ? "Som Ativo" : "Mudo"}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleComplete}
                className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors px-2 py-1"
              >
                Pular Guia
              </button>
              <button
                type="button"
                onClick={handleComplete}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/5 text-neutral-300 hover:bg-white/15 hover:text-white transition-all"
                aria-label="Fechar guia"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Transition Content Container */}
        <div className="relative z-10 my-4 flex-1 flex flex-col justify-center min-h-[340px]">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentStepData.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-center"
            >
              {/* Left Column: Semantic Explanation & Practical Specs */}
              <div className="lg:col-span-7 space-y-3.5">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 font-mono text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-white">
                  <StepIcon className="h-3.5 w-3.5" />
                  <span>{currentStepData.category}</span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-display text-lg sm:text-2xl lg:text-3xl font-black uppercase text-white tracking-tight leading-tight">
                    {currentStepData.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                    {currentStepData.description}
                  </p>
                </div>

                {/* Practical Bullet Highlights */}
                <div className="space-y-2 pt-1">
                  {currentStepData.features.map((item, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2.5 text-xs text-neutral-200 font-mono">
                      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white text-black font-black text-[9px]">
                        ✓
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Interactive Live Visual Widget (High Retention) */}
              <div className="lg:col-span-5">
                <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#141416] p-4 shadow-xl">
                  {/* Step 1 Preview Widget: Architecture & Standalone AOT */}
                  {currentStep === 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span className="font-mono text-[10px] uppercase font-bold text-neutral-400">
                          BINÁRIO STANDALONE AOT
                        </span>
                        <span className="rounded-full bg-white px-2 py-0.5 font-mono text-[9px] font-black uppercase text-black">
                          149 KB
                        </span>
                      </div>

                      <div className="space-y-2 font-mono text-xs">
                        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-2.5">
                          <span className="text-neutral-400 text-[11px]">Compilação</span>
                          <span className="font-bold text-white text-[11px]">C# .NET 8 Native AOT</span>
                        </div>
                        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-2.5">
                          <span className="text-neutral-400 text-[11px]">Dependências</span>
                          <span className="font-bold text-white text-[11px]">0 DLLs externas (Autocontido)</span>
                        </div>
                        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-2.5">
                          <span className="text-neutral-400 text-[11px]">Processos Ocultos</span>
                          <span className="font-bold text-white text-[11px]">Zero em segundo plano</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between rounded-lg bg-black/40 px-2.5 py-1.5 font-mono text-[10px] text-neutral-400 border border-white/5">
                        <span>SHA-256: 3A71A3A8...F4E1</span>
                        <button
                          type="button"
                          onClick={() => {
                            if (typeof navigator !== "undefined" && navigator.clipboard) {
                              navigator.clipboard.writeText("D89226FAA969C77A488C0828BED4F1D78D0EC9F57859E3DD6ACABFA9740857F5");
                              setDemoCopiedHash(true);
                              playSound("tick");
                              setTimeout(() => setDemoCopiedHash(false), 2000);
                            }
                          }}
                          className="text-white hover:underline font-bold"
                        >
                          {demoCopiedHash ? "COPIADO!" : "COPIAR HASH"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 2 Preview Widget: Timer Resolution & MMCSS */}
                  {currentStep === 1 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span className="font-mono text-[10px] uppercase font-bold text-neutral-400">
                          TAXA DE CLOCK DO KERNEL
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setDemoTimerActive((prev) => !prev);
                            playSound("tick");
                          }}
                          className={cn(
                            "rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase transition-all border",
                            demoTimerActive
                              ? "border-white bg-white text-black"
                              : "border-white/20 bg-white/10 text-white hover:bg-white/20"
                          )}
                        >
                          {demoTimerActive ? "0.500 MS (ATIVO)" : "15.6 MS (PADRÃO)"}
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-center font-mono">
                        <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
                          <span className="text-[10px] text-neutral-400 block uppercase">Timer Kernel</span>
                          <span className="font-display text-lg font-black text-white">
                            {demoTimerActive ? "0.500 ms" : "15.625 ms"}
                          </span>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
                          <span className="text-[10px] text-neutral-400 block uppercase">Jitter de Input</span>
                          <span className="font-display text-lg font-black text-white">
                            {demoTimerActive ? "±0.12 ms" : "±8.40 ms"}
                          </span>
                        </div>
                      </div>

                      <div className="rounded-lg bg-black/40 px-2.5 py-1.5 font-mono text-[10px] text-neutral-400 border border-white/5 flex items-center justify-between">
                        <span>NtSetTimerResolution API</span>
                        <span className="text-white font-bold">{demoTimerActive ? "TRAVADO EM 0.5MS" : "WINDOWS PADRÃO"}</span>
                      </div>
                    </div>
                  )}

                  {/* Step 3 Preview Widget: Sub-Tick TCP Buffer Bypass */}
                  {currentStep === 2 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span className="font-mono text-[10px] uppercase font-bold text-neutral-400">
                          SUB-TICK NETWORK STACK
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setDemoTcpBypass((prev) => !prev);
                            playSound("tick");
                          }}
                          className={cn(
                            "rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase transition-all border",
                            demoTcpBypass
                              ? "border-white bg-white text-black"
                              : "border-white/20 bg-white/10 text-white hover:bg-white/20"
                          )}
                        >
                          {demoTcpBypass ? "BUFFER ZERO (ATIVO)" : "DELAY 40MS (OFF)"}
                        </button>
                      </div>

                      <div className="space-y-2 font-mono text-xs">
                        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-2.5">
                          <span className="text-neutral-400 text-[11px]">TcpAckFrequency</span>
                          <span className="font-bold text-white text-[11px]">
                            {demoTcpBypass ? "= 1 (Sem atraso de ACK)" : "= 2 (Windows Padrão)"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-2.5">
                          <span className="text-neutral-400 text-[11px]">TcpDelAckTicks</span>
                          <span className="font-bold text-white text-[11px]">
                            {demoTcpBypass ? "= 0 (Disparo imediato)" : "= 4 (Delay 40ms)"}
                          </span>
                        </div>
                      </div>

                      <div className="rounded-lg bg-black/40 px-2.5 py-1.5 font-mono text-[10px] text-neutral-400 border border-white/5 flex items-center justify-between">
                        <span>DESPACHO DE TIROS SUB-TICK</span>
                        <span className="text-white font-bold">{demoTcpBypass ? "SINCRONIA TOTAL" : "BUFFERIZADO"}</span>
                      </div>
                    </div>
                  )}

                  {/* Step 4 Preview Widget: Benchmarks 1% Low */}
                  {currentStep === 3 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span className="font-mono text-[10px] uppercase font-bold text-neutral-400">
                          AUDITORIA DE FRAMETIME CS2
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setDemoBenchmarkActive((prev) => !prev);
                            playSound("tick");
                          }}
                          className={cn(
                            "rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase transition-all border",
                            demoBenchmarkActive
                              ? "border-white bg-white text-black"
                              : "border-white/20 bg-white/10 text-white hover:bg-white/20"
                          )}
                        >
                          {demoBenchmarkActive ? "OTIMIZADO" : "BASELINE"}
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-center font-mono">
                        <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
                          <span className="text-[10px] text-neutral-400 block uppercase">1% Low FPS</span>
                          <span className="font-display text-lg font-black text-white">
                            {demoBenchmarkActive ? "268 FPS" : "142 FPS"}
                          </span>
                          <span className="text-[10px] text-neutral-300">
                            {demoBenchmarkActive ? "+88% Consistência" : "Baseline Windows"}
                          </span>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
                          <span className="text-[10px] text-neutral-400 block uppercase">DPC Input Lag</span>
                          <span className="font-display text-lg font-black text-white">
                            {demoBenchmarkActive ? "4.2 ms" : "11.4 ms"}
                          </span>
                          <span className="text-[10px] text-neutral-300">
                            {demoBenchmarkActive ? "-63% Menos Delay" : "Fila Padrão"}
                          </span>
                        </div>
                      </div>

                      <div className="rounded-lg bg-black/40 px-2.5 py-1.5 font-mono text-[10px] text-neutral-400 border border-white/5 flex items-center justify-between">
                        <span>TESTADO EM CS2 PREMIER</span>
                        <span className="text-white font-bold">SMOKES ESTÁVEIS</span>
                      </div>
                    </div>
                  )}

                  {/* Step 5 Preview Widget: VAC Safe & 1-Click Restore */}
                  {currentStep === 4 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span className="font-mono text-[10px] uppercase font-bold text-neutral-400">
                          INTEGRIDADE &amp; SEGURANÇA
                        </span>
                        <span className="rounded-full bg-white px-2 py-0.5 font-mono text-[9px] font-black uppercase text-black">
                          100% VAC SAFE
                        </span>
                      </div>

                      <div className="space-y-2 font-mono text-xs">
                        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-2.5">
                          <span className="text-neutral-400 text-[11px]">Nível de Execução</span>
                          <span className="font-bold text-white text-[11px]">Ring-3 User Mode (Sem Hooks)</span>
                        </div>
                        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-2.5">
                          <span className="text-neutral-400 text-[11px]">DLL Injection</span>
                          <span className="font-bold text-white text-[11px]">0 DLLs (Zero Injeção)</span>
                        </div>
                        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-2.5">
                          <span className="text-neutral-400 text-[11px]">Snapshot Automático</span>
                          <span className="font-bold text-white text-[11px]">backup_auto.json</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between rounded-lg bg-black/40 px-2.5 py-1.5 font-mono text-[10px] text-neutral-400 border border-white/5">
                        <span>REVERSÃO DE FÁBRICA</span>
                        <button
                          type="button"
                          onClick={() => {
                            setDemoSnapshotReverted((prev) => !prev);
                            playSound("tick");
                          }}
                          className="text-white hover:underline font-bold"
                        >
                          {demoSnapshotReverted ? "RESTAURADO (1 CLIQUE)" : "SIMULAR 1-CLIQUE"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Interactive Navigation & Action Bar */}
        <div className="relative z-10 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left/Right Step Prev/Next Arrows */}
          <div className="flex items-center gap-2 order-2 sm:order-1 w-full sm:w-auto justify-between sm:justify-start">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={currentStep === 0}
              onClick={handlePrev}
              className={cn(
                "border border-white/15 bg-white/5 text-white hover:bg-white/10 active:scale-95 transition-all text-xs",
                currentStep === 0 && "opacity-40 cursor-not-allowed hover:bg-white/5"
              )}
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              <span>Anterior</span>
            </Button>

            <span className="font-mono text-xs text-neutral-400 hidden sm:inline-block px-1">
              {currentStep + 1} / {STEPS.length}
            </span>

            {currentStep < STEPS.length - 1 ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleNext}
                className="border border-white/15 bg-white/5 text-white hover:bg-white/10 active:scale-95 transition-all text-xs"
              >
                <span>Próximo</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            ) : null}
          </div>

          {/* Direct CTA Action Button */}
          <div className="order-1 sm:order-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() => handleCtaClick(currentStepData.tabTarget)}
              className="w-full sm:w-auto bg-white text-black font-black uppercase tracking-wider hover:bg-neutral-200 active:scale-95 shadow-lg shadow-white/20 text-xs sm:text-sm py-2 sm:py-2.5 px-5"
            >
              <span>{currentStepData.ctaLabel}</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
