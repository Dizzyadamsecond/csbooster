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
    <div className="app min-h-screen flex flex-col">
      {/* Live Social Proof Marquee */}
      <Ticker />

      {/* Top Navigation with Sliding Pill */}
      <header className="navbar">
        <div className="navbar-inner">
          <div className="logo">
            <div className="logo-icon">CS2</div>
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-extrabold tracking-wider text-text">
                CS2 BOOSTER
              </span>
              <span className="hidden sm:inline-block rounded-full border border-primary/20 bg-primary-soft px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-primary-soft-text">
                PRO
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <nav
              className="nav relative"
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
                      "nav-link relative flex items-center justify-center select-none",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
                      isActive
                        ? "hover:bg-transparent"
                        : "text-muted hover:text-text hover:bg-surface-2"
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeNavTab"
                        className="absolute inset-0 z-0 rounded-full bg-primary shadow-sm shadow-primary/20"
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
                    <span
                      className={cn(
                        "relative z-10 flex items-center gap-1.5",
                        isActive ? "text-primary-foreground font-bold" : ""
                      )}
                    >
                      {tab.label}
                      {tab.id === "tracker" && activeOrder && (
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-primary-text animate-pulse"
                          title="Pedido Ativo"
                        />
                      )}
                    </span>
                  </button>
                );
              })}
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main flex-1">
        {/* Visual Hero Banner with Tournament Esports Presentation */}
        <section className="relative mx-auto mb-8 max-w-6xl overflow-hidden rounded-2xl border border-primary/25 bg-surface/80 p-1 shadow-2xl shadow-primary/10 backdrop-blur-md">
          <img
            src="/images/cs2-tactical-hero.svg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-75"
          />
          {/* Subtle ambient glow overlay */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-6 py-7 sm:px-8 sm:py-8">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-widest text-primary-text">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span>PREMIER TOURNAMENT · 128-TICK SYNC · BOOST & COACHING</span>
              </div>
              <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-text leading-none">
                ELEVE SEU ELO AO <span className="text-primary-text">NÍVEL GLOBAL</span>
              </h1>
              <p className="text-xs sm:text-sm text-muted font-sans max-w-xl leading-relaxed">
                A plataforma de elite para Counter-Strike 2. Suba de patente com players do circuito profissional, lobbies Duo 100% seguros sem compartilhamento de senha e otimização sub-tick.
              </p>
            </div>

            {/* Esports Tactical HUD Telemetry Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2.5 shrink-0 font-mono">
              <div className="rounded-xl border border-line bg-surface/90 px-4 py-3 backdrop-blur-md shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-muted uppercase font-bold tracking-wider">RATING MAX</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                </div>
                <div className="font-display text-xl sm:text-2xl font-black text-text mt-0.5">
                  30.000+
                </div>
                <span className="text-[10px] text-primary-text block font-sans">Tier Ouro Global</span>
              </div>

              <div className="rounded-xl border border-line bg-surface/90 px-4 py-3 backdrop-blur-md shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-muted uppercase font-bold tracking-wider">FILA PRIORITÁRIA</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                </div>
                <div className="font-display text-xl sm:text-2xl font-black text-text mt-0.5">
                  ~15 min
                </div>
                <span className="text-[10px] text-muted block font-sans">Início Garantido</span>
              </div>

              <div className="rounded-xl border border-primary/40 bg-primary-soft/90 px-4 py-3 backdrop-blur-md shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-primary-text uppercase font-bold tracking-wider">PIX AUTOMÁTICO</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                </div>
                <div className="font-display text-xl sm:text-2xl font-black text-primary-text mt-0.5">
                  -5% OFF
                </div>
                <span className="text-[10px] text-primary-text/80 block font-sans">Liberação Imediata</span>
              </div>

              <div className="rounded-xl border border-line bg-surface/90 px-4 py-3 backdrop-blur-md shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-muted uppercase font-bold tracking-wider">SEGURANÇA</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                </div>
                <div className="font-display text-xl sm:text-2xl font-black text-text mt-0.5">
                  VAC SAFE
                </div>
                <span className="text-[10px] text-muted block font-sans">0 Injeção DLL · Ring-3</span>
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
              <div className="mx-auto max-w-6xl pt-6 border-t border-line">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-primary-text block">
                      ARENA COMPETITIVA CS2
                    </span>
                    <h2 className="font-display text-lg sm:text-xl font-black uppercase text-text tracking-tight">
                      Mapas Suportados no Premier &amp; Competitivo
                    </h2>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setActiveTab("maps")}
                    className="hidden sm:inline-flex items-center gap-1.5"
                  >
                    <span>Galeria Completa</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <Cs2MapGallery />
              </div>
            </div>
          )}

          {activeTab === "maps" && (
            <div className="mx-auto max-w-6xl py-2 space-y-6">
              <Cs2MapGallery />

              {/* Tactical Telemetry Action Bar */}
              <Card
                variant="glass"
                className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-line bg-surface/90"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold uppercase text-text tracking-wider">
                    FILA TÁTICA CS2:
                  </span>
                  <Badge tone="neutral" size="sm">
                    SOLO / DUO
                  </Badge>
                  <Badge tone="accent" size="sm">
                    PIX INSTANTÂNEO
                  </Badge>
                  <Badge tone="neutral" size="sm">
                    INÍCIO ~15 MIN
                  </Badge>
                </div>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => setActiveTab("boost")}
                  className="shrink-0"
                >
                  <Zap className="h-4 w-4" />
                  <span>Calcular Rating</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Card>
            </div>
          )}

          {activeTab === "optimizer" && <OptimizerSection />}

          {activeTab === "tracker" && (
            <div className="mx-auto max-w-6xl space-y-5 py-2">
              <Card variant="glass" className="p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-bold font-display uppercase tracking-tight text-text">
                      Rastreador de Pedido
                    </h3>
                    <p className="text-xs text-muted">
                      Informe o ID do pedido ou SteamID.
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
                      className="w-full md:w-60 font-mono text-xs uppercase"
                    />
                    <Button type="submit" variant="primary" size="md">
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
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    )}
                  </form>
                </div>

                {searchStatus === "not_found" && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 p-3 text-xs text-primary-text">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>Pedido não localizado neste dispositivo.</span>
                  </div>
                )}
              </Card>

              {currentDisplayedOrder ? (
                <Card variant="elevated" className="p-6 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-line">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs uppercase text-muted font-bold">
                        PEDIDO:
                      </span>
                      <span className="font-mono text-lg font-black text-text">
                        {currentDisplayedOrder.orderId}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyOrderId(currentDisplayedOrder.orderId)}
                        className="rounded-md p-1.5 text-muted hover:bg-surface-3 hover:text-text transition-colors"
                        title="Copiar ID"
                      >
                        {hasCopiedId ? (
                          <Check className="h-4 w-4 text-primary-text" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    <Badge tone="accent" size="md">
                      <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
                      <span>
                        {currentDisplayedOrder.status === "completed"
                          ? "CONCLUÍDO"
                          : currentDisplayedOrder.status === "in_progress"
                          ? "EM ANDAMENTO"
                          : "NA FILA (#1)"}
                      </span>
                    </Badge>
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
                          "rounded-xl border p-3.5 flex items-center justify-between",
                          item.active
                            ? "border-primary/40 bg-primary/10"
                            : item.completed
                            ? "border-line bg-surface-2"
                            : "border-line bg-surface opacity-60"
                        )}
                      >
                        <span className="font-bold text-sm text-text">{item.title}</span>
                        {item.completed ? (
                          <Check className="h-4 w-4 text-primary-text" />
                        ) : (
                          <Clock className="h-4 w-4 text-muted" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* 4-Metric Strip */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="rounded-xl border border-line bg-surface p-3">
                      <span className="text-muted block text-[10px] uppercase">SERVIÇO</span>
                      <span className="font-bold text-text uppercase mt-0.5 block">
                        {currentDisplayedOrder.serviceType}
                      </span>
                    </div>
                    <div className="rounded-xl border border-line bg-surface p-3">
                      <span className="text-muted block text-[10px] uppercase">MODO</span>
                      <span className="font-bold text-text uppercase mt-0.5 block">
                        {currentDisplayedOrder.boostMode}
                      </span>
                    </div>
                    <div className="rounded-xl border border-line bg-surface p-3">
                      <span className="text-muted block text-[10px] uppercase">META</span>
                      <span className="font-bold text-primary-text mt-0.5 block">
                        {currentDisplayedOrder.currentRating} ➔ {currentDisplayedOrder.targetRating}
                      </span>
                    </div>
                    <div className="rounded-xl border border-line bg-surface p-3">
                      <span className="text-muted block text-[10px] uppercase">TOTAL</span>
                      <span className="font-bold text-text mt-0.5 block">
                        R$ {currentDisplayedOrder.finalPrice || currentDisplayedOrder.totalPrice},00
                      </span>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card variant="glass" className="p-8 text-center space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary-text">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <h4 className="text-base font-bold font-display uppercase text-text">
                    Nenhum pedido ativo
                  </h4>
                  <div>
                    <Button
                      type="button"
                      variant="primary"
                      size="md"
                      onClick={() => setActiveTab("boost")}
                    >
                      <Zap className="h-4 w-4" />
                      <span>Configurar Boost</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          )}

          {activeTab === "faq" && (
            <div className="mx-auto max-w-4xl py-2">
              <Card variant="glass" className="p-6">
                <div className="space-y-2.5">
                  {FAQ.map((item) => (
                    <AccordionItem
                      key={item.question}
                      question={item.question}
                      answer={
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 font-mono text-xs">
                          <span className="text-text">{item.spec}</span>
                          <Badge tone="accent" size="sm" className="shrink-0 self-start sm:self-auto tracking-wider">
                            {item.badge}
                          </Badge>
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

      {/* Minimal Footer */}
      <footer className="mt-10 border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between text-xs text-muted font-mono">
          <span>CS2 BOOTS · PRO ARENA</span>
          <span>100% VAC SAFE · PIX INSTANTÂNEO</span>
        </div>
      </footer>
    </div>
  );
}
