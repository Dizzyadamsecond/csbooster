"use client";

import { useState, useEffect, useRef } from "react";
import { BoostCalculator, type OrderPayload } from "@/components/boost";
import { OptimizerSection } from "@/components/optimizer";
import {
  AccordionItem,
  Button,
  Card,
  ThemeToggle,
  Badge,
  Input,
} from "@/components/ui";
import {
  Zap,
  Trophy,
  Search,
  Copy,
  Check,
  Clock,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  MapPin,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { TabMotionContainer } from "@/components/motion";
import { Ticker } from "@/components/motion/Ticker";
import { Cs2MapGallery } from "@/components/features";
import { cn } from "@/lib/cn";

const tabs = [
  { id: "boost" as const, label: "Calculadora de Elo" },
  { id: "maps" as const, label: "Mapas CS2" },
  { id: "optimizer" as const, label: "Software Otimizador (.exe)" },
  { id: "tracker" as const, label: "Tracker do Pedido" },
  { id: "faq" as const, label: "FAQ" },
];

const FAQ = [
  {
    question: "Como funciona o Duo Boost sem senha?",
    spec: "Lobby Direto · Sem credenciais · Jogadores FPL/Major",
    badge: "100% SEGURO",
  },
  {
    question: "Como o Solo Boost protege minhas skins?",
    spec: "VPN Residencial · Steam Family PIN obrigatório",
    badge: "INVENTÁRIO BLINDADO",
  },
  {
    question: "O Cs2Booster.exe dá ban ou altera arquivos do jogo?",
    spec: "Ring-3 User Mode · 0 injeção DLL · 1-clique restore",
    badge: "VAC COMPLIANT",
  },
  {
    question: "Qual o prazo de início após o pagamento via PIX?",
    spec: "Confirmação instantânea · Fila prioritária ~15 min",
    badge: "INSTANTÂNEO",
  },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("boost");
  const [activeOrder, setActiveOrder] = useState<OrderPayload | null>(null);

  const [inquiryQuery, setInquiryQuery] = useState("");
  const [searchedOrder, setSearchedOrder] = useState<OrderPayload | null>(null);
  const [searchStatus, setSearchStatus] = useState<"idle" | "found" | "not_found">("idle");
  const [hasCopiedId, setHasCopiedId] = useState(false);

  const shouldReduceMotion = useReducedMotion();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("cs2booster_active_order");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.orderId) {
          setActiveOrder(parsed);
        }
      }
    } catch {
      // Fallback
    }
  }, []);

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

  const handleCopyOrderId = (id: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(id).catch(() => {});
      setHasCopiedId(true);
      setTimeout(() => setHasCopiedId(false), 2500);
    }
  };

  const handleInquirySearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = inquiryQuery.trim().toUpperCase();
    if (!query) return;

    if (activeOrder && activeOrder.orderId.toUpperCase() === query) {
      setSearchedOrder(activeOrder);
      setSearchStatus("found");
      return;
    }

    try {
      const rawHistory = localStorage.getItem("cs2booster_orders");
      if (rawHistory) {
        const history: OrderPayload[] = JSON.parse(rawHistory);
        if (Array.isArray(history)) {
          const match = history.find(
            (o) =>
              o.orderId?.toUpperCase() === query ||
              o.steamId?.toUpperCase() === query ||
              o.discordTag?.toUpperCase() === query
          );
          if (match) {
            setSearchedOrder(match);
            setSearchStatus("found");
            return;
          }
        }
      }
    } catch {
      // Fallback
    }

    setSearchedOrder(null);
    setSearchStatus("not_found");
  };

  const handleClearSearch = () => {
    setInquiryQuery("");
    setSearchedOrder(null);
    setSearchStatus("idle");
  };

  const currentDisplayedOrder = searchedOrder || activeOrder;

  return (
    <div className="app min-h-screen flex flex-col bg-[#080808] text-white">
      {/* Live Social Proof Marquee */}
      <Ticker />

      {/* Top Floating Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#080808]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black font-display font-black text-sm tracking-wider shadow-lg shadow-white/15">
              CS2
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-black tracking-widest text-white leading-tight">
                  NOIR ARENA
                </span>
                <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[9px] font-extrabold uppercase tracking-widest text-white border border-white/20">
                  PRO
                </span>
              </div>
              <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider hidden sm:block">
                Counter-Strike 2 Competitive
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <nav
              className="relative flex items-center gap-1 rounded-full border border-white/10 bg-[#121214] p-1.5 shadow-inner"
              role="tablist"
              aria-label="Navegação de seções"
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
                      "relative px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-150 select-none",
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
                      {tab.id === "tracker" && activeOrder && (
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-black animate-pulse"
                          title="Pedido Ativo"
                        />
                      )}
                    </span>
                  </button>
                );
              })}
            </nav>
            {/* High-Contrast Tactical Status Indicator */}
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#121214] px-3 py-1.5 shadow-inner">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span className="font-mono text-[10px] font-extrabold uppercase tracking-widest text-neutral-300 hidden sm:inline">
                ARENA ONLINE
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* High-Fashion Editorial Hero Section */}
        <section className="relative mx-auto mb-10 overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-[#141417] to-[#0a0a0c] p-6 sm:p-10 shadow-2xl">
          <img
            src="/images/cs2-tactical-hero.svg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-25 mix-blend-screen"
          />
          {/* Subtle Ambient Radial Glow */}
          <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-white shadow-sm">
                <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                <span>COUNTER-STRIKE 2 // NOIR ARENA 2026</span>
              </div>
              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[1.05]">
                ELEVE SEU RATING AO <span className="underline decoration-white/30 underline-offset-8">NÍVEL GLOBAL</span>
              </h1>
              <p className="text-sm sm:text-base text-neutral-300 font-sans max-w-xl leading-relaxed">
                Plataforma de alta performance para CS2. Suba de rating no Premier ou competitivo com pro-players da FPL, lobbies Duo 100% seguros sem compartilhamento de senha e otimização sub-tick.
              </p>
            </div>

            {/* Esports Tactical HUD Telemetry Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 shrink-0 font-mono">
              <div className="rounded-2xl border border-white/15 bg-black/60 p-4.5 backdrop-blur-md shadow-lg">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest">RATING MÁXIMO</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </div>
                <div className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
                  30.000+
                </div>
                <span className="text-[11px] text-neutral-300 font-sans block mt-0.5">Tier Ouro Premier</span>
              </div>

              <div className="rounded-2xl border border-white/15 bg-black/60 p-4.5 backdrop-blur-md shadow-lg">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest">FILA PRIORITÁRIA</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </div>
                <div className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
                  ~15 min
                </div>
                <span className="text-[11px] text-neutral-300 font-sans block mt-0.5">Início Garantido</span>
              </div>

              <div className="rounded-2xl border border-white bg-white/10 p-4.5 backdrop-blur-md shadow-lg shadow-white/5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-white uppercase font-bold tracking-widest">PIX AUTOMÁTICO</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </div>
                <div className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
                  -5% OFF
                </div>
                <span className="text-[11px] text-white/90 font-sans block mt-0.5 font-bold">Liberação Imediata</span>
              </div>

              <div className="rounded-2xl border border-white/15 bg-black/60 p-4.5 backdrop-blur-md shadow-lg">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest">SEGURANÇA</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </div>
                <div className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
                  VAC SAFE
                </div>
                <span className="text-[11px] text-neutral-300 font-sans block mt-0.5">0 Injeção DLL · Ring-3</span>
              </div>
            </div>
          </div>
        </section>

        {/* Zero-CLS Tab Container */}
        <TabMotionContainer activeTab={activeTab}>
          {activeTab === "boost" && (
            <div className="space-y-8">
              <BoostCalculator
                onCheckoutComplete={(order) => {
                  setActiveOrder(order);
                  setActiveTab("tracker");
                }}
              />

              {/* Showcase active duty pool in boost context */}
              <div className="mx-auto max-w-7xl pt-10 border-t border-white/10">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-neutral-400 block">
                      MAP POOL OFICIAL CS2
                    </span>
                    <h2 className="font-display text-xl sm:text-2xl font-black uppercase text-white tracking-tight mt-0.5">
                      MAPAS SUPORTADOS NO PREMIER &amp; COMPETITIVO
                    </h2>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setActiveTab("maps")}
                    className="self-start sm:self-auto inline-flex items-center gap-1.5 border border-white/20 bg-white/5 text-white hover:bg-white/10"
                  >
                    <span>Ver Análise de Mapas</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <Cs2MapGallery />
              </div>
            </div>
          )}

          {activeTab === "maps" && (
            <div className="mx-auto max-w-7xl py-2 space-y-6">
              <Cs2MapGallery />

              {/* Tactical Telemetry Action Bar */}
              <Card
                variant="glass"
                className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/15 bg-[#121214] shadow-xl"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold uppercase text-white tracking-wider">
                    FILA TÁTICA CS2:
                  </span>
                  <Badge tone="neutral" size="sm">
                    SOLO / DUO
                  </Badge>
                  <span className="rounded-full bg-white px-2.5 py-0.5 font-mono text-[10px] font-black text-black">
                    PIX INSTANTÂNEO
                  </span>
                  <Badge tone="neutral" size="sm">
                    INÍCIO ~15 MIN
                  </Badge>
                </div>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => setActiveTab("boost")}
                  className="shrink-0 bg-white text-black font-black uppercase tracking-wider hover:bg-neutral-200"
                >
                  <Zap className="h-4 w-4" />
                  <span>Calcular Rating Agora</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Card>
            </div>
          )}

          {activeTab === "optimizer" && <OptimizerSection />}

          {activeTab === "tracker" && (
            <div className="mx-auto max-w-5xl space-y-5 py-4">
              <Card variant="glass" className="p-6 border border-white/15 bg-[#121214] shadow-2xl">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-xl font-black font-display uppercase tracking-tight text-white">
                      RASTREADOR DE PEDIDO // TELEMETRIA
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Consulte o status do seu boost informando o ID do pedido ou SteamID.
                    </p>
                  </div>

                  <form
                    onSubmit={handleInquirySearch}
                    className="flex w-full md:w-auto items-center gap-2"
                  >
                    <Input
                      value={inquiryQuery}
                      onChange={(e) => setInquiryQuery(e.target.value)}
                      placeholder="CS2-XXXXX-XXXX"
                      className="w-full md:w-64 font-mono text-xs uppercase bg-black/60 border-white/15 text-white placeholder:text-neutral-500"
                    />
                    <Button type="submit" variant="primary" size="md" className="bg-white text-black font-black hover:bg-neutral-200">
                      <Search className="h-4 w-4" />
                      <span>Buscar</span>
                    </Button>
                    {searchStatus !== "idle" && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="md"
                        onClick={handleClearSearch}
                        title="Limpar"
                        className="border border-white/20 bg-white/5 text-white"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    )}
                  </form>
                </div>

                {searchStatus === "not_found" && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 p-3 text-xs text-neutral-300">
                    <AlertCircle className="h-4 w-4 shrink-0 text-white" />
                    <span>Pedido não localizado neste dispositivo. Verifique o código e tente novamente.</span>
                  </div>
                )}
              </Card>

              {currentDisplayedOrder ? (
                <Card variant="elevated" className="p-6 space-y-6 border border-white/15 bg-[#121214] shadow-2xl">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs uppercase text-neutral-400 font-bold">
                        PEDIDO:
                      </span>
                      <span className="font-mono text-xl font-black text-white">
                        {currentDisplayedOrder.orderId}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyOrderId(currentDisplayedOrder.orderId)}
                        className="rounded-md p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white transition-colors"
                        title="Copiar ID"
                      >
                        {hasCopiedId ? (
                          <Check className="h-4 w-4 text-white" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 font-mono text-xs font-black uppercase text-black shadow-md">
                      <span className="h-2 w-2 rounded-full bg-black animate-ping" />
                      <span>
                        {currentDisplayedOrder.status === "completed"
                          ? "CONCLUÍDO"
                          : currentDisplayedOrder.status === "in_progress"
                          ? "EM ANDAMENTO"
                          : "NA FILA (#1)"}
                      </span>
                    </span>
                  </div>

                  {/* 3-Step Compact Bar */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      {
                        step: 1,
                        title: "1. Pagamento & Fila",
                        active: currentDisplayedOrder.status === "queued",
                        completed: true,
                      },
                      {
                        step: 2,
                        title: "2. Booster em Ação",
                        active: currentDisplayedOrder.status === "in_progress",
                        completed: currentDisplayedOrder.status === "completed",
                      },
                      {
                        step: 3,
                        title: "3. Rating Entregue",
                        active: false,
                        completed: currentDisplayedOrder.status === "completed",
                      },
                    ].map((item) => (
                      <div
                        key={item.step}
                        className={cn(
                          "rounded-xl border p-4 flex items-center justify-between transition-all",
                          item.active
                            ? "border-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                            : item.completed
                            ? "border-white/10 bg-white/[0.04]"
                            : "border-white/5 bg-black/40 opacity-40"
                        )}
                      >
                        <span className="font-bold text-sm text-white">{item.title}</span>
                        {item.completed ? (
                          <Check className="h-4 w-4 text-white" />
                        ) : (
                          <Clock className="h-4 w-4 text-neutral-400" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* 4-Metric Strip */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="rounded-xl border border-white/10 bg-black/40 p-3.5">
                      <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">SERVIÇO</span>
                      <span className="font-black text-white uppercase mt-1 block text-sm">
                        {currentDisplayedOrder.serviceType}
                      </span>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-black/40 p-3.5">
                      <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">MODO</span>
                      <span className="font-black text-white uppercase mt-1 block text-sm">
                        {currentDisplayedOrder.boostMode}
                      </span>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-black/40 p-3.5">
                      <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">META</span>
                      <span className="font-black text-white mt-1 block text-sm">
                        {currentDisplayedOrder.currentRating} ➔ {currentDisplayedOrder.targetRating}
                      </span>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-black/40 p-3.5">
                      <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">TOTAL</span>
                      <span className="font-black text-white mt-1 block text-sm">
                        R$ {currentDisplayedOrder.finalPrice || currentDisplayedOrder.totalPrice},00
                      </span>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card variant="glass" className="p-10 text-center space-y-4 border border-white/15 bg-[#121214]">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-black shadow-lg">
                    <Trophy className="h-7 w-7" />
                  </div>
                  <h4 className="text-lg font-black font-display uppercase text-white tracking-wider">
                    Nenhum Pedido Ativo
                  </h4>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                    Configure seu Elo Boost agora e acompanhe o progresso em tempo real nesta tela.
                  </p>
                  <div>
                    <Button
                      type="button"
                      variant="primary"
                      size="md"
                      onClick={() => setActiveTab("boost")}
                      className="bg-white text-black font-black uppercase tracking-wider hover:bg-neutral-200"
                    >
                      <Zap className="h-4 w-4" />
                      <span>Configurar Boost Agora</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          )}

          {activeTab === "faq" && (
            <div className="mx-auto max-w-4xl py-4">
              <Card variant="glass" className="p-6 sm:p-8 border border-white/15 bg-[#121214] shadow-2xl">
                <div className="mb-6">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400 block">
                    CENTRAL DE DÚVIDAS // FAQ
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-black uppercase text-white tracking-tight mt-1">
                    PERGUNTAS FREQUENTES &amp; PROTOCOLOS DE SEGURANÇA
                  </h3>
                </div>
                <div className="space-y-3">
                  {FAQ.map((item) => (
                    <AccordionItem
                      key={item.question}
                      question={item.question}
                      answer={
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 font-mono text-xs">
                          <span className="text-neutral-300">{item.spec}</span>
                          <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white border border-white/20 shrink-0 self-start sm:self-auto">
                            {item.badge}
                          </span>
                        </div>
                      }
                    />
                  ))}
                </div>
              </Card>
            </div>
          )}
        </TabMotionContainer>
      </main>

      {/* Minimal Noir Pro Footer */}
      <footer className="mt-16 border-t border-white/10 bg-[#080808]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400 font-mono">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-white" />
            <span className="font-bold text-white tracking-wider">CS2 BOOSTER // NOIR ARENA</span>
            <span className="text-neutral-600">|</span>
            <span>TEMPORADA 2026</span>
          </div>
          <div className="flex items-center gap-4 text-neutral-400">
            <span>100% VAC SAFE · ZERO INJEÇÃO</span>
            <span>•</span>
            <span>PIX INSTANTÂNEO</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
