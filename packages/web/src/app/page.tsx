"use client";

import { useState, useEffect, useRef } from "react";
import {
  OptimizerSection,
  OptimizerSimulator,
  PerformanceBenchmark,
  OnboardingWalkthrough,
  SecurityGuaranteeGrid,
  OptimizerDownloadCard,
} from "@/components/optimizer";
import {
  AccordionItem,
  Button,
  Card,
  Badge,
} from "@/components/ui";
import {
  Zap,
  Download,
  ShieldCheck,
  Cpu,
  Gauge,
  Layers,
  Sliders,
  ChevronRight,
  ArrowRight,
  Terminal,
  RotateCcw,
  Check,
  Copy,
  Sparkles,
  Gamepad2,
  Lock,
  Activity,
  Monitor,
  CheckCircle2,
  Clock,
  Crosshair,
  Trophy,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { TabMotionContainer } from "@/components/motion";
import { Ticker } from "@/components/motion/Ticker";
import { Cs2MapGallery } from "@/components/features";
import { OnboardingGuide } from "@/components/navigation";
import { cn } from "@/lib/cn";

const tabs = [
  { id: "overview" as const, label: "Visão Geral (.exe)" },
  { id: "simulator" as const, label: "Console & HUD" },
  { id: "benchmarks" as const, label: "Benchmarks 1% Low" },
  { id: "maps" as const, label: "Mapas & Resoluções" },
  { id: "security" as const, label: "Segurança VAC Safe" },
  { id: "faq" as const, label: "FAQ & Manual" },
];

const ARCH_PILLARS = [
  {
    icon: Gauge,
    title: "NtSetTimerResolution (0.500 ms)",
    desc: "Substitui a taxa de interrupção padrão de 15.6ms do Windows por 0.500ms cravados, acelerando a resposta de cliques do mouse e sincronia de frames.",
    badge: "KERNEL TIMER",
  },
  {
    icon: Cpu,
    title: "Isolamento P-Core & DPC",
    desc: "Fixa as threads pesadas do cs2.exe nos núcleos de alta performance (P-Cores), isolando interrupções do sistema (DPC) no Core 0.",
    badge: "THREAD AFFINITY",
  },
  {
    icon: Zap,
    title: "Sub-Tick TCP Buffer Bypass",
    desc: "Configura TcpAckFrequency=1 e TcpDelAck=0 nas interfaces ativas, anulando os 40ms de atraso do algoritmo Nagle do Windows.",
    badge: "SUB-TICK STACK",
  },
  {
    icon: Layers,
    title: "MMCSS GPU Priority 8 & RAM",
    desc: "Define a prioridade de GPU em Tasks\\Games para 8 e executa esvaziamento dinâmico de Standby RAM via EmptyWorkingSet.",
    badge: "MMCSS / MEMORY",
  },
];

const RESOLUTIONS = [
  {
    name: "4:3 Stretched (1280x960)",
    tag: "PRO CHOICE #1",
    aspect: "4:3",
    description:
      "Modelos de personagens 33% mais largos horizontalmente na tela. Menor carga de pixel fill-rate na GPU, mantendo o 1% Low FPS extremamente estável em tiroteios.",
    pros: [
      "Modelos de inimigos mais fáceis de visualizar",
      "Frametimes lineares sem quedas bruscas",
      "Sensibilidade de mira horizontal rápida",
    ],
    usage: "Utilizado por ~78% dos atletas do Tier 1 (m0NESY, ZywOo, NiKo)",
  },
  {
    name: "16:9 Nativo (1920x1080)",
    tag: "FOV MÁXIMO",
    aspect: "16:9",
    description:
      "Campo de visão periférico total (FOV 90). Clareza geométrica máxima em longas distâncias (Dust II Fundo, Mirage Janela) sem distorção e sem cortes no radar.",
    pros: [
      "Campo visual horizontal ampliado em 90°",
      "Nitidez nativa sem blur ou interpolação",
      "Perfeito para suporte tático e leitura de radar",
    ],
    usage: "Preferido por riflers estratégicos (ropz)",
  },
  {
    name: "16:10 Stretched (1680x1050)",
    tag: "EQUILÍBRIO TÁTICO",
    aspect: "16:10",
    description:
      "O equilíbrio cirúrgico entre modelos levemente alargados e retenção de visão periférica. Excelente para mira de sniper AWP sem perda excessiva de ângulos laterais.",
    pros: [
      "Modelos moderadamente largos sem distorção extrema",
      "Maior FOV que a proporção 4:3",
      "Transição de mira suave para tiros rápidos",
    ],
    usage: "Proporção em alta constante entre snipers competitivos",
  },
];

const HARDWARE_RIGS = [
  {
    name: "Rig Alpha · Esports 540Hz",
    cpu: "AMD Ryzen 7 7800X3D (3D V-Cache)",
    gpu: "NVIDIA GeForce RTX 4070 SUPER",
    ram: "32GB DDR5-6000 CL30",
    baselineFps: "390 FPS (1% Low: 195 FPS)",
    optimizedFps: "580 FPS (1% Low: 380 FPS)",
    gainLow: "+95% 1% Low",
    latency: "0.50 ms DPC",
  },
  {
    name: "Rig Beta · Mainstream 240Hz",
    cpu: "Intel Core i5-13400F (P-Cores Isolados)",
    gpu: "NVIDIA GeForce RTX 3060 12GB",
    ram: "16GB DDR4-3600 CL16",
    baselineFps: "240 FPS (1% Low: 142 FPS)",
    optimizedFps: "340 FPS (1% Low: 268 FPS)",
    gainLow: "+88% 1% Low",
    latency: "0.50 ms DPC",
  },
  {
    name: "Rig Gamma · Entry-Level 144Hz",
    cpu: "AMD Ryzen 5 5600",
    gpu: "NVIDIA GeForce GTX 1660 SUPER",
    ram: "16GB DDR4-3200 CL16",
    baselineFps: "165 FPS (1% Low: 88 FPS)",
    optimizedFps: "235 FPS (1% Low: 165 FPS)",
    gainLow: "+87% 1% Low",
    latency: "0.50 ms DPC",
  },
];

const FAQ = [
  {
    question: "Existe algum risco de ban VAC, Faceit AC ou punição da Valve?",
    answer:
      "Zero risco de ban. O Cs2Booster.exe é um executável portátil compilado em C# .NET 8 AOT que opera estritamente em Ring-3 User Mode no nível do sistema operacional Windows. Ele NÃO injeta DLLs, NÃO utiliza ganchos (hooks) de DirectX/Vulkan e JAMAIS abre o processo cs2.exe com permissões de gravação de memória (0 chamadas a PROCESS_VM_WRITE). Todos os arquivos da pasta do CS2 na biblioteca da Steam permanecem 100% íntegros e intocados.",
    spec: "Ring-3 User Mode · 0 injeção DLL · 100% VAC Safe & Faceit AC",
    badge: "100% VAC SAFE",
  },
  {
    question: "Como o Cs2Booster otimiza o sub-tick e o registro de tiros no CS2?",
    answer:
      "O Windows por padrão adiciona um delay artificial de buffering de até 40ms em pacotes de rede (algoritmo Nagle e atraso de ACK). O Cs2Booster configura as chaves de registro TcpAckFrequency=1 e TcpDelAck=0 nas interfaces ativas, garantindo envio imediato de cada ação de movimento e disparo para o servidor Valve sem enfileiramento. Além disso, alinha a prioridade de I/O e threads com as taxas de sub-tick.",
    spec: "TcpAckFrequency=1 · TcpDelAck=0 · Zero Buffer Bloat",
    badge: "SUB-TICK ZERO LAG",
  },
  {
    question: "Como funciona o ajuste de Timer Resolution para 0.500ms?",
    answer:
      "O timer padrão do kernel do Windows opera em 15.6ms, o que gera micro-stutters e inconsistência de frametimes em monitores de alta taxa de atualização (144Hz, 240Hz, 360Hz, 540Hz). O Cs2Booster invoca a API nativa NtSetTimerResolution do Win32 para travar a taxa de clock do sistema em exatos 0.500ms, proporcionando resposta instantânea do cursor e eliminação de atrasos no frame delivery.",
    spec: "NtSetTimerResolution · 0.500ms precision · DPC Bypass",
    badge: "0.5MS TIMER",
  },
  {
    question: "Como funciona o backup automático e como reverto as alterações?",
    answer:
      "Antes de aplicar qualquer tweak, o Cs2Booster gera automaticamente uma cópia exata de segurança das suas configurações originais em %localappdata%\\Cs2Booster\\backups\\backup_auto.json com validação criptográfica SHA-256. A qualquer momento, basta abrir o programa e clicar em 'Restaurar Padrões' para que o Windows retorne 100% ao estado de fábrica em menos de 1 segundo.",
    spec: "Backup JSON local · Reversão em 1 clique · Zero resíduos",
    badge: "100% REVERSÍVEL",
  },
  {
    question: "Preciso deixar o Cs2Booster aberto enquanto jogo?",
    answer:
      "Não obrigatoriamente. As otimizações de registro, prioridade IFEO e planos de energia do Windows persistem no sistema. No entanto, manter o Cs2Booster aberto em segundo plano garante a manutenção contínua do timer em 0.500ms e a limpeza em tempo real de Standby RAM (EmptyWorkingSet), consumindo menos de 12 MB de memória RAM e 0% de uso de CPU.",
    spec: "Executável ultraleve · 149 KB Standalone · < 12 MB RAM",
    badge: "STANDALONE AOT",
  },
  {
    question: "Quais são os requisitos mínimos e compatibilidade do software?",
    answer:
      "Compatível com Windows 10 (versão 1903+) e Windows 11 em arquitetura x64. Suporte nativo a todos os processadores Intel Core (incluindo isolamento P-Core/E-Core) e AMD Ryzen (com agendamento otimizado para CCDs 3D V-Cache). Requer apenas privilégios normais de administrador para salvar as chaves de registro.",
    spec: "Windows 10/11 x64 · Intel Core & AMD Ryzen 3D V-Cache",
    badge: "COMPATIBILIDADE TOTAL",
  },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("overview");
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [guideStep, setGuideStep] = useState(0);
  const [copiedShaTop, setCopiedShaTop] = useState(false);

  const shouldReduceMotion = useReducedMotion();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    try {
      const guideSeen = localStorage.getItem("cs2booster_guide_completed");
      if (!guideSeen) {
        const timer = setTimeout(() => {
          setIsGuideOpen(true);
        }, 800);
        return () => clearTimeout(timer);
      }
    } catch {
      // safe fallback
    }
  }, []);

  const handleOpenGuide = (step = 0) => {
    setGuideStep(step);
    setIsGuideOpen(true);
  };

  const handleTabKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    let targetIndex: number | null = null;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      targetIndex = (currentIndex + 1) % tabs.length;
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      targetIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      targetIndex = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      targetIndex = tabs.length - 1;
    }

    if (targetIndex !== null) {
      const nextTab = tabs[targetIndex];
      setActiveTab(nextTab.id);
      tabRefs.current[targetIndex]?.focus();
    }
  };

  const handleCopyShaTop = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard
        .writeText("9DA6A8D2ABB23B432E6598F37570FE72AA44E83662DEBDBE1C2B5903945E1E24")
        .catch(() => {});
      setCopiedShaTop(true);
      setTimeout(() => setCopiedShaTop(false), 2000);
    }
  };

  return (
    <div className="app min-h-screen flex flex-col bg-[#080808] text-white">
      {/* Live Social Proof Marquee with Software Telemetry */}
      <Ticker />

      {/* Top Floating Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#080808]/95 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Brand & Platform Pill */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black font-display font-black text-sm tracking-wider shadow-lg shadow-white/15">
                CS2
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-display text-base sm:text-lg font-black tracking-widest text-white leading-tight">
                    CS2 BOOSTER
                  </span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[9px] font-extrabold uppercase tracking-widest text-white border border-white/20 hidden sm:inline-block">
                    V3.0
                  </span>
                </div>
                <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider hidden sm:block">
                  Native Windows Engine (.exe)
                </span>
              </div>
            </div>

            {/* Platform Spec Pill */}
            <div className="hidden lg:flex items-center gap-2 rounded-xl border border-white/10 bg-[#121214] px-3 py-1.5 shadow-inner">
              <Gamepad2 className="h-4 w-4 text-white" />
              <div className="flex flex-col text-left">
                <span className="font-display text-[11px] font-black uppercase text-white tracking-wider leading-none">
                  COUNTER-STRIKE 2
                </span>
                <span className="font-mono text-[9px] text-neutral-400 leading-none mt-0.5">
                  Sub-Tick &amp; Input Lag Engine
                </span>
              </div>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <div className="flex items-center gap-2">
            <nav
              className="relative flex items-center gap-1 rounded-full border border-white/10 bg-[#121214] p-1.5 shadow-inner overflow-x-auto scrollbar-none"
              role="tablist"
              aria-label="Navegação do software"
              aria-orientation="horizontal"
            >
              {tabs.map((tab, index) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    ref={(el) => {
                      tabRefs.current[index] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`tab-${tab.id}`}
                    aria-selected={isActive}
                    aria-controls={`panel-${tab.id}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => setActiveTab(tab.id)}
                    onKeyDown={(e) => handleTabKeyDown(e, index)}
                    className={cn(
                      "relative px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-150 select-none whitespace-nowrap",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                      isActive
                        ? "text-black font-black"
                        : "text-neutral-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeNavTab"
                        className="absolute inset-0 z-0 rounded-full bg-white shadow-md shadow-white/20"
                        transition={
                          shouldReduceMotion
                            ? { duration: 0 }
                            : {
                                type: "spring",
                                stiffness: 450,
                                damping: 32,
                                mass: 0.8,
                              }
                        }
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5 uppercase font-mono text-[11px] tracking-wider">
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Telemetry Status Pill */}
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-[#121214] px-3 py-1.5 shadow-inner shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span className="font-mono text-[10px] font-extrabold uppercase tracking-widest text-neutral-300">
                0.5MS TIMER · VAC SAFE
              </span>
            </div>

            {/* Quick Interactive Guide Button */}
            <button
              type="button"
              onClick={() => handleOpenGuide(0)}
              className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 px-3 py-1.5 font-mono text-[10px] font-black uppercase tracking-wider text-white transition-all active:scale-95 shadow-sm shrink-0"
              title="Abrir Guia Rápido do Software"
            >
              <Sparkles className="h-3 w-3 text-white" />
              <span className="hidden sm:inline">Guia Rápido</span>
              <span className="sm:hidden">Guia</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <TabMotionContainer activeTab={activeTab}>
          {/* TAB 1: VISÃO GERAL */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Software Hero Banner */}
              <section className="relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-[#141416] to-[#0c0c0e] p-6 sm:p-8 shadow-2xl">
                {/* Clean Subtle Ambient Glow */}
                <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/[0.04] blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-white/[0.02] blur-3xl" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-white/10 pb-8">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                      </span>
                      <span>ENGINE V3.0.0 // STANDALONE AOT · WINDOWS 10 &amp; 11 X64</span>
                    </div>

                    <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                      CS2 BOOSTER <span className="text-neutral-400 font-light">//</span> MOTOR DE BAIXA LATÊNCIA &amp; SUB-TICK
                    </h1>

                    <p className="font-sans text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl">
                      Software executável nativo ultraleve (149 KB) em C# .NET 8 AOT para Windows. Fixa a taxa de clock do kernel em 0.500ms, isola interrupções DPC fora do Core 0, elimina o atraso artificial de 40ms do TCP e estabiliza o 1% Low FPS em tiroteios e smokes. 100% Ring-3 User Mode sem injeção de DLL.
                    </p>

                    {/* Quick CTAs with Tactile Micro-Interactions */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <motion.a
                        href="/downloads/Cs2Booster.exe"
                        download
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-white px-6 py-3.5 font-display text-xs font-bold uppercase tracking-wider text-black shadow-lg shadow-white/15 hover:bg-neutral-200 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        <span>Baixar Cs2Booster.exe (149 KB)</span>
                      </motion.a>

                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab("simulator")}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10 hover:border-white/30 transition-all backdrop-blur-sm"
                      >
                        <Terminal className="h-4 w-4" />
                        <span>Testar Console HUD</span>
                      </motion.button>
                    </div>

                    {/* Security Micro Badge Strip */}
                    <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] font-mono text-neutral-400">
                      <span className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-white" /> 100% VAC Safe
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-white" /> Zero Injeção DLL
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-white" /> 1-Click Revert
                      </span>
                    </div>
                  </div>

                  {/* Clean Visual Mockup Card */}
                  <div className="lg:col-span-5">
                    <motion.div
                      whileHover={{ y: -3, scale: 1.01 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="group relative overflow-hidden rounded-xl border border-white/20 bg-black/60 shadow-2xl backdrop-blur-md"
                    >
                      <img
                        src="/images/cs2-booster-hero.jpg"
                        alt="CS2 Booster Low-Latency Engine Interface"
                        className="w-full h-auto object-cover block transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono bg-black/70 backdrop-blur-md px-3 py-2 rounded-lg border border-white/10">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                          <span className="text-white font-bold text-[11px]">CS2BOOSTER.EXE // LIVE HUD</span>
                        </div>
                        <span className="text-neutral-400 text-[10px]">0.500ms · 540 FPS</span>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* 4 Architecture Highlight Cards with Smooth Motion */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-6">
                  {ARCH_PILLARS.map((pillar) => {
                    const Icon = pillar.icon;
                    return (
                      <motion.div
                        key={pillar.title}
                        whileHover={{ y: -3, borderColor: "rgba(255, 255, 255, 0.25)", backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-col justify-between space-y-3 cursor-default transition-colors"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <Icon className="h-4 w-4 text-white" />
                            <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-neutral-400 border border-white/10 px-2 py-0.5 rounded">
                              {pillar.badge}
                            </span>
                          </div>
                          <h4 className="font-display text-xs font-bold uppercase text-white tracking-wide">
                            {pillar.title}
                          </h4>
                          <p className="font-mono text-[11px] text-neutral-400 leading-snug">
                            {pillar.desc}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </section>

              {/* Integrated Optimizer Suite: Hardware Telemetry Panel & Download Card */}
              <OptimizerSection />

              {/* Security Banner Card */}
              <div className="rounded-2xl border border-white/15 bg-[#121214] p-6 sm:p-8 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400 block">
                      GARANTIA DE CONFORMIDADE
                    </span>
                    <h3 className="font-display text-xl font-black uppercase text-white tracking-tight mt-0.5">
                      AUDITORIA VALVE ANTI-CHEAT &amp; REVERSÃO EM 1 CLIQUE
                    </h3>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setActiveTab("security")}
                    className="self-start sm:self-auto inline-flex items-center gap-1.5 border border-white/20 bg-white/5 text-white hover:bg-white/10"
                  >
                    <span>Ver Relatório de Segurança</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                    <span className="text-neutral-400 block text-[10px] uppercase font-bold">RING-3 USER MODE</span>
                    <span className="text-white font-bold mt-1 block">Zero injeção de DLLs na memória</span>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                    <span className="text-neutral-400 block text-[10px] uppercase font-bold">SNAPSHOT DE REGISTRO</span>
                    <span className="text-white font-bold mt-1 block">Cópia automática em %localappdata%</span>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                    <span className="text-neutral-400 block text-[10px] uppercase font-bold">INTEGRIDADE STEAM</span>
                    <span className="text-white font-bold mt-1 block">0 arquivos modificados na biblioteca</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SIMULADOR & HUD */}
          {activeTab === "simulator" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/15 bg-[#121214] p-6 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400 block">
                      CONSOLE INTERATIVO // WIN32 HUD
                    </span>
                    <h2 className="font-display text-xl sm:text-2xl font-black uppercase text-white tracking-tight mt-0.5">
                      SIMULADOR DE EXECUÇÃO CS2BOOSTER.EXE
                    </h2>
                    <p className="font-mono text-xs text-neutral-400 mt-1">
                      Teste os perfis de otimização, acompanhe as chamadas de registro em tempo real e simule a reversão instantânea de 1 clique.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => handleOpenGuide(1)}
                      className="bg-white text-black font-black uppercase tracking-wider text-xs hover:bg-neutral-200"
                    >
                      <Sparkles className="h-3.5 w-3.5 mr-1" />
                      <span>Ver Passo a Passo</span>
                    </Button>
                  </div>
                </div>

                <div className="mt-6">
                  <OptimizerSimulator />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BENCHMARKS */}
          {activeTab === "benchmarks" && (
            <div className="space-y-8">
              {/* Benchmark Suite */}
              <div className="rounded-2xl border border-white/15 bg-[#121214] p-6 sm:p-8 shadow-2xl">
                <PerformanceBenchmark />
              </div>

              {/* Frametime Stability Comparison Analysis */}
              <div className="rounded-2xl border border-white/15 bg-[#121214] p-6 sm:p-8 shadow-xl">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400 block">
                      TELEMETRIA COMPARATIVA // FRAMETIME JITTER
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl font-black uppercase text-white tracking-tight mt-0.5">
                      POR QUE O 1% LOW FPS IMPORTA MAIS QUE O FPS MÉDIO?
                    </h3>
                  </div>
                  <Badge tone="accent">0.5MS SYNCHRONIZED</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Baseline Windows Frametime */}
                  <div className="rounded-xl border border-white/10 bg-black/40 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-sm font-bold uppercase text-neutral-400">
                        WINDOWS PADRÃO (BASELINE)
                      </span>
                      <span className="font-mono text-[11px] text-neutral-400">Timer 15.6ms</span>
                    </div>
                    <div className="h-24 w-full rounded-lg border border-white/10 bg-black/60 p-2 flex items-end gap-1 overflow-hidden">
                      {/* Simulação de oscilações irregulares */}
                      {[32, 28, 64, 40, 85, 30, 95, 34, 78, 29, 90, 31, 88, 35, 70, 30].map(
                        (h, idx) => (
                          <div
                            key={idx}
                            style={{ height: `${h}%` }}
                            className="flex-1 bg-neutral-600 rounded-t transition-all"
                            title={`Frametime spike: ${(h * 0.25).toFixed(1)}ms`}
                          />
                        )
                      )}
                    </div>
                    <p className="font-mono text-xs text-neutral-400 leading-relaxed">
                      Micro-stutters periódicos causados pela interrupção de 15.6ms do kernel e acúmulo de pacotes de rede pelo algoritmo Nagle. A mira parece pesada durante tiroteios intensos.
                    </p>
                  </div>

                  {/* Cs2Booster Optimized Frametime */}
                  <div className="rounded-xl border border-white/20 bg-white/[0.04] p-5 space-y-3 shadow-lg shadow-white/5">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-sm font-black uppercase text-white">
                        CS2BOOSTER.EXE (OTIMIZADO)
                      </span>
                      <span className="font-mono text-[11px] text-white font-bold">Timer 0.500ms</span>
                    </div>
                    <div className="h-24 w-full rounded-lg border border-white/20 bg-black/60 p-2 flex items-end gap-1 overflow-hidden">
                      {/* Simulação de linha perfeitamente estável */}
                      {[38, 37, 39, 38, 37, 38, 39, 38, 37, 38, 39, 38, 37, 38, 38, 37].map(
                        (h, idx) => (
                          <div
                            key={idx}
                            style={{ height: `${h}%` }}
                            className="flex-1 bg-white rounded-t transition-all shadow-[0_0_6px_rgba(255,255,255,0.4)]"
                            title={`Frametime linear: ${(h * 0.1).toFixed(1)}ms`}
                          />
                        )
                      )}
                    </div>
                    <p className="font-mono text-xs text-neutral-300 leading-relaxed">
                      Frametime horizontal e uniforme. 1% Low elevado em +88%, permitindo rastreamento de alvos suave e cliques instantâneos sem atraso de interpolação.
                    </p>
                  </div>
                </div>
              </div>

              {/* Hardware Test Lab Rig Matrix */}
              <div className="rounded-2xl border border-white/15 bg-[#121214] p-6 sm:p-8 shadow-xl">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400 block">
                      MATRIZ DE LABORATÓRIO // TEST RIGS
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl font-black uppercase text-white tracking-tight mt-0.5">
                      BENCHMARKS REAIS EM 3 CONFIGURAÇÕES DE HARDWARE
                    </h3>
                  </div>
                  <span className="font-mono text-xs text-neutral-400">
                    CS2 PREMIER BUILD 2026
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {HARDWARE_RIGS.map((rig) => (
                    <div
                      key={rig.name}
                      className="rounded-xl border border-white/10 bg-black/40 p-5 space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <span className="font-display text-xs font-black uppercase text-white block">
                          {rig.name}
                        </span>
                        <div className="space-y-1 font-mono text-[11px] text-neutral-400">
                          <p>CPU: {rig.cpu}</p>
                          <p>GPU: {rig.gpu}</p>
                          <p>RAM: {rig.ram}</p>
                        </div>
                      </div>

                      <div className="space-y-2 border-t border-white/10 pt-3 font-mono text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-neutral-400">Baseline:</span>
                          <span className="text-neutral-300">{rig.baselineFps}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-neutral-400">Otimizado:</span>
                          <span className="text-white font-black">{rig.optimizedFps}</span>
                        </div>
                        <div className="flex justify-between items-center pt-1 border-t border-white/5">
                          <span className="text-neutral-400">Ganho no 1% Low:</span>
                          <span className="rounded bg-white px-2 py-0.5 font-black text-black text-[10px]">
                            {rig.gainLow}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MAPAS & RESOLUÇÕES */}
          {activeTab === "maps" && (
            <div className="space-y-8">
              {/* Map Pool Gallery */}
              <div className="rounded-2xl border border-white/15 bg-[#121214] p-6 shadow-2xl">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400 block">
                      ACTIVE DUTY POOL // TELEMETRIA DE MAPAS
                    </span>
                    <h2 className="font-display text-xl sm:text-2xl font-black uppercase text-white tracking-tight mt-0.5">
                      7 MAPAS DO COMPETITIVO OFICIAL CS2
                    </h2>
                  </div>
                  <Badge tone="neutral">CS2 ENGINE COMPLIANT</Badge>
                </div>
                <Cs2MapGallery />
              </div>

              {/* Competitive Resolutions Guide */}
              <div className="rounded-2xl border border-white/15 bg-[#121214] p-6 sm:p-8 shadow-xl">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400 block">
                      GUIA TÉCNICO // DISPLAY &amp; PROPORÇÃO DE TELA
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl font-black uppercase text-white tracking-tight mt-0.5">
                      RESOLUÇÕES COMPETITIVAS &amp; ESCALA DE PERFORMANCE
                    </h3>
                  </div>
                  <span className="font-mono text-xs text-neutral-400">
                    4:3 STRETCHED VS 16:9 NATIVO
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {RESOLUTIONS.map((res) => (
                    <div
                      key={res.name}
                      className="rounded-xl border border-white/10 bg-black/40 p-5 space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-display text-sm font-black uppercase text-white">
                            {res.name}
                          </span>
                          <span className="rounded bg-white/10 border border-white/20 px-2 py-0.5 font-mono text-[9px] font-bold text-white">
                            {res.tag}
                          </span>
                        </div>
                        <p className="font-mono text-xs text-neutral-400 leading-relaxed">
                          {res.description}
                        </p>
                      </div>

                      <div className="space-y-2 border-t border-white/10 pt-3">
                        {res.pros.map((pro, pIdx) => (
                          <div key={pIdx} className="flex items-center gap-2 font-mono text-[11px] text-neutral-300">
                            <span className="text-white font-bold">✓</span>
                            <span>{pro}</span>
                          </div>
                        ))}
                        <div className="pt-2 border-t border-white/5 font-mono text-[10px] text-neutral-400">
                          {res.usage}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Launch Options Strip */}
                <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="font-display text-xs font-bold uppercase text-white">
                      Opções de Inicialização Recomendadas na Steam:
                    </span>
                    <p className="font-mono text-xs text-neutral-400">
                      Cole nas propriedades do CS2 na biblioteca para garantir taxa de atualização e threads sincronizadas.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs bg-black/60 px-3 py-2 rounded-lg border border-white/10 shrink-0">
                    <span className="text-neutral-300">-novid -high -threads 8 +fps_max 0 -nojoy</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SEGURANÇA & ONBOARDING */}
          {activeTab === "security" && (
            <div className="space-y-8">
              {/* 4 Pillars of VAC Safety */}
              <div className="rounded-2xl border border-white/15 bg-[#121214] p-6 sm:p-8 shadow-2xl">
                <SecurityGuaranteeGrid />
              </div>

              {/* 4-Step Onboarding Walkthrough */}
              <div className="rounded-2xl border border-white/15 bg-[#121214] p-6 sm:p-8 shadow-xl">
                <OnboardingWalkthrough />
              </div>

              {/* Whitepaper Summary Card */}
              <div className="rounded-2xl border border-white/15 bg-[#121214] p-6 sm:p-8 shadow-xl">
                <div className="mb-4">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400 block">
                    WHITEPAPER TÉCNICO // ANTI-CHEAT COMPLIANCE
                  </span>
                  <h3 className="font-display text-xl font-black uppercase text-white tracking-tight mt-1">
                    RING-3 USER MODE VS DRIVERS DE KERNEL
                  </h3>
                </div>
                <div className="space-y-3 font-mono text-xs text-neutral-300 leading-relaxed">
                  <p>
                    Enquanto programas não autorizados tentam carregar drivers no Kernel (Ring-0) ou injetar código nos módulos do jogo, o <strong>Cs2Booster.exe</strong> opera de forma 100% transparente em User Mode (Ring-3).
                  </p>
                  <p>
                    Todas as ações realizadas utilizam APIs oficiais da Microsoft documentadas no Win32 SDK: <code className="bg-white/10 px-1.5 py-0.5 rounded text-white">NtSetTimerResolution</code> para relógio de alta precisão, <code className="bg-white/10 px-1.5 py-0.5 rounded text-white">SetProcessAffinityMask</code> para agendamento de núcleos e chaves oficiais de registro para tcp e mmcss.
                  </p>
                  <p className="text-neutral-400">
                    Totalmente compatível e auditado perante Valve Anti-Cheat (VAC), Faceit Anti-Cheat e Gamers Club Client.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: FAQ & MANUAL */}
          {activeTab === "faq" && (
            <div className="mx-auto max-w-4xl space-y-8 py-2">
              <Card variant="glass" className="p-6 sm:p-8 border border-white/15 bg-[#121214] shadow-2xl">
                <div className="mb-6">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400 block">
                    CENTRAL DE DÚVIDAS // MANUAL TÉCNICO
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-black uppercase text-white tracking-tight mt-1">
                    PERGUNTAS FREQUENTES &amp; PROTOCOLOS DO CS2BOOSTER.EXE
                  </h3>
                </div>

                <div className="space-y-3">
                  {FAQ.map((item) => (
                    <AccordionItem
                      key={item.question}
                      question={item.question}
                      answer={
                        <div className="space-y-3 pt-1">
                          <p className="text-neutral-300 font-sans text-xs sm:text-sm leading-relaxed">
                            {item.answer}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-white/10 font-mono text-xs">
                            <span className="text-neutral-400">{item.spec}</span>
                            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white border border-white/20 shrink-0 self-start sm:self-auto">
                              {item.badge}
                            </span>
                          </div>
                        </div>
                      }
                    />
                  ))}
                </div>
              </Card>

              {/* Bottom Download CTA Card */}
              <OptimizerDownloadCard />
            </div>
          )}
        </TabMotionContainer>
      </main>

      {/* Minimal Noir Pro Footer */}
      <footer className="mt-16 border-t border-white/10 bg-[#080808]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400 font-mono">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-white" />
            <span className="font-bold text-white tracking-wider">CS2 BOOSTER // SOFTWARE SUITE</span>
            <span className="text-neutral-600">|</span>
            <span>MOTOR DE BAIXA LATÊNCIA &amp; SUB-TICK</span>
          </div>
          <div className="flex items-center gap-4 text-neutral-400">
            <span>100% VAC SAFE · ZERO INJEÇÃO</span>
            <span>•</span>
            <button
              type="button"
              onClick={handleCopyShaTop}
              className="text-neutral-300 hover:text-white transition-colors"
            >
              {copiedShaTop ? "SHA-256 COPIADO!" : "SHA-256 VERIFICADO"}
            </button>
            <span>•</span>
            <a
              href="/downloads/Cs2Booster.exe"
              download
              className="text-white font-bold hover:underline"
            >
              DOWNLOAD .EXE
            </a>
          </div>
        </div>
      </footer>

      {/* High-Retention Guided Tour Modal */}
      <OnboardingGuide
        isOpen={isGuideOpen}
        initialStep={guideStep}
        onClose={() => setIsGuideOpen(false)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
        }}
      />
    </div>
  );
}
