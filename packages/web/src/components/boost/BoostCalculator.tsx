"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Zap, 
  Users, 
  UserCheck, 
  GraduationCap, 
  Radio, 
  Sparkles, 
  Lock, 
  CreditCard, 
  Clock, 
  TrendingUp, 
  Flame,
  ArrowRight,
  ChevronRight,
  EyeOff
} from "lucide-react";

export function BoostCalculator() {
  const [serviceType, setServiceType] = useState<"premier" | "competitive" | "coaching">("premier");
  const [boostMode, setBoostMode] = useState<"duo" | "solo">("duo");
  
  // Premier rating states
  const [currentRating, setCurrentRating] = useState<number>(8500);
  const [targetRating, setTargetRating] = useState<number>(16000);

  // Add-ons
  const [streamMatch, setStreamMatch] = useState<boolean>(true);
  const [expressDelivery, setExpressDelivery] = useState<boolean>(false);
  const [offlineMode, setOfflineMode] = useState<boolean>(true);
  const [specificRoles, setSpecificRoles] = useState<boolean>(false);

  // Rating bracket calculations
  const ratingDiff = Math.max(0, targetRating - currentRating);
  const basePricePerThousand = boostMode === "duo" ? 38 : 28;
  const rawPrice = Math.round((ratingDiff / 1000) * basePricePerThousand);
  
  const addOnsCost = 
    (streamMatch ? 25 : 0) + 
    (expressDelivery ? Math.round(rawPrice * 0.25) : 0) +
    (specificRoles ? 20 : 0);

  const totalPrice = Math.max(35, rawPrice + addOnsCost);
  const estimatedHours = Math.max(4, Math.round((ratingDiff / 1000) * 2.2));

  // Rating color helper
  const getRatingColor = (rating: number) => {
    if (rating >= 25000) return "text-amber-400 border-amber-400/40 bg-amber-400/10";
    if (rating >= 20000) return "text-rose-400 border-rose-400/40 bg-rose-400/10";
    if (rating >= 15000) return "text-fuchsia-400 border-fuchsia-400/40 bg-fuchsia-400/10";
    if (rating >= 10000) return "text-blue-400 border-blue-400/40 bg-blue-400/10";
    if (rating >= 5000) return "text-cyan-400 border-cyan-400/40 bg-cyan-400/10";
    return "text-slate-400 border-slate-400/40 bg-slate-400/10";
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-4">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          CALCULADORA DE ELO PREMIER & COACHING
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display uppercase">
          Configure seu <span className="text-amber-400">Boost Tático</span> em Segundos
        </h2>
        <p className="text-slate-400 text-sm sm:text-base mt-3">
          Algoritmo com precificação transparente em tempo real, proteção anti-ban por hardware e boosters verificados nível FPL / Major.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Parameters (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Service Switcher Tabs */}
          <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-[#121722] border border-white/[0.08]">
            {[
              { id: "premier", label: "CS Rating Premier", icon: TrendingUp },
              { id: "competitive", label: "Rank Competitivo", icon: ShieldCheck },
              { id: "coaching", label: "Pro Coaching", icon: GraduationCap },
            ].map((s) => {
              const Icon = s.icon;
              const active = serviceType === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setServiceType(s.id as any)}
                  className={`relative py-3 px-3 rounded-xl text-xs sm:text-sm font-bold flex flex-col sm:flex-row items-center justify-center gap-2 transition-all ${
                    active ? "text-black font-extrabold shadow-lg" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="activeServicePill"
                      className="absolute inset-0 bg-amber-400 rounded-xl"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Icon className="w-4 h-4" />
                    <span>{s.label}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Mode Selector: Duo Boost vs Solo */}
          <div className="glass-panel p-6 rounded-2xl border border-white/[0.08] space-y-4">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold block">
              1. Selecione a Modalidade de Execução
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setBoostMode("duo")}
                className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
                  boostMode === "duo"
                    ? "border-amber-400/80 bg-amber-400/[0.08] text-white"
                    : "border-white/[0.08] bg-black/20 text-slate-400 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-amber-400" />
                    <span className="font-bold text-white text-base font-display">Duo Boost (Lobby Juntos)</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                    Mais Seguro
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Jogue no seu próprio computador e conta junto com nosso booster profissional no mesmo lobby. Não precisa passar senha.
                </p>
              </button>

              <button
                onClick={() => setBoostMode("solo")}
                className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
                  boostMode === "solo"
                    ? "border-amber-400/80 bg-amber-400/[0.08] text-white"
                    : "border-white/[0.08] bg-black/20 text-slate-400 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-cyan-400" />
                    <span className="font-bold text-white text-base font-display">Solo Boost (Piloto)</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-cyan-400/20 text-cyan-300 px-2 py-0.5 rounded font-bold">
                    Mais Rápido
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  O pro-player entra na sua conta utilizando VPN da sua cidade e proteção de inventário para entrega ultra veloz.
                </p>
              </button>
            </div>
          </div>

          {/* Rating Sliders (Premier) */}
          <div className="glass-panel p-6 rounded-2xl border border-white/[0.08] space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
                2. Calibrador de CS Rating Premier
              </span>
              <span className="text-xs font-mono text-amber-400 font-bold">
                +{ratingDiff.toLocaleString()} ELO
              </span>
            </div>

            {/* Current Rating */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-300 font-medium">Rating Premier Atual:</span>
                <span className={`px-2.5 py-0.5 rounded-lg border font-mono font-bold text-sm ${getRatingColor(currentRating)}`}>
                  {currentRating.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={1000}
                max={28000}
                step={500}
                value={currentRating}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCurrentRating(val);
                  if (val >= targetRating) setTargetRating(val + 1000);
                }}
                className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>1.000 (Cinza)</span>
                <span>10.000 (Azul)</span>
                <span>15.000 (Roxo)</span>
                <span>20.000 (Rosa)</span>
                <span>25.000+ (Dourado)</span>
              </div>
            </div>

            {/* Target Rating */}
            <div className="space-y-2 pt-4 border-t border-white/[0.06]">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-300 font-medium">Rating Premier Desejado:</span>
                <span className={`px-2.5 py-0.5 rounded-lg border font-mono font-bold text-sm ${getRatingColor(targetRating)}`}>
                  {targetRating.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={2000}
                max={30000}
                step={500}
                value={targetRating}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val > currentRating) setTargetRating(val);
                }}
                className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>
          </div>

          {/* Modular Tactical Add-ons */}
          <div className="glass-panel p-6 rounded-2xl border border-white/[0.08] space-y-4">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold block">
              3. Recursos Táticos & Proteções Opcionais
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: "stream",
                  active: streamMatch,
                  toggle: () => setStreamMatch(!streamMatch),
                  icon: Radio,
                  title: "Transmissão Privada ao Vivo",
                  desc: "Assista às partidas via Twitch / Discord privado",
                  cost: "+R$ 25",
                },
                {
                  id: "express",
                  active: expressDelivery,
                  toggle: () => setExpressDelivery(!expressDelivery),
                  icon: Flame,
                  title: "Fila Prioritária Express",
                  desc: "Booster inicia em até 15 minutos pós-pagamento",
                  cost: "+25%",
                },
                {
                  id: "offline",
                  active: offlineMode,
                  toggle: () => setOfflineMode(!offlineMode),
                  icon: EyeOff,
                  title: "Modo Fantasma / Offline",
                  desc: "Booster joga invisível na sua lista de amigos",
                  cost: "Grátis",
                },
                {
                  id: "roles",
                  active: specificRoles,
                  toggle: () => setSpecificRoles(!specificRoles),
                  icon: Sparkles,
                  title: "Funções e Armas Específicas",
                  desc: "AWP, Entry Fragger ou Rifle exclusivo",
                  cost: "+R$ 20",
                },
              ].map((addon) => {
                const Icon = addon.icon;
                return (
                  <button
                    key={addon.id}
                    onClick={addon.toggle}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                      addon.active
                        ? "border-amber-400/60 bg-amber-400/[0.06] text-white"
                        : "border-white/[0.06] bg-black/20 text-slate-400 hover:border-white/20"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${addon.active ? "bg-amber-400 text-black" : "bg-slate-800 text-slate-400"}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white truncate">{addon.title}</span>
                        <span className="font-mono text-[10px] text-amber-400 font-bold ml-1">{addon.cost}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{addon.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Summary Card (5 cols) */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/[0.1] shadow-2xl relative overflow-hidden">
            {/* Ambient Lighting Overlay */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.08]">
              <div>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block">RESUMO DO PEDIDO</span>
                <h3 className="text-xl font-bold text-white font-display uppercase mt-0.5">CS2 Boots Protocol</h3>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                100% GARANTIDO
              </span>
            </div>

            {/* Key Specs Breakdown */}
            <div className="space-y-3.5 text-xs font-mono mb-6">
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">Modalidade:</span>
                <span className="text-white font-bold uppercase">{boostMode === "duo" ? "Duo Boost (Com Você)" : "Solo Boost"}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">Objetivo Premier:</span>
                <span className="text-white font-bold">{currentRating.toLocaleString()} → {targetRating.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">Tempo Estimado:</span>
                <span className="text-cyan-400 font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  ~{estimatedHours} horas
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">Booster Designado:</span>
                <span className="text-white font-bold">Top 0.5% Premier (24k+)</span>
              </div>
            </div>

            {/* Price Display */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/[0.08] mb-6">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">VALOR TOTAL ESTIMADO</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-sm font-bold text-amber-400">R$</span>
                    <span className="text-4xl font-black text-white font-display tracking-tight">{totalPrice}</span>
                    <span className="text-xs text-slate-400 font-mono">,00</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold block mb-1">
                    PIX INSTANTÂNEO
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">ou 3x sem juros</span>
                </div>
              </div>
            </div>

            {/* Action Checkout Button */}
            <button
              onClick={() => alert(`Pedido CS2 Boots configurado para R$ ${totalPrice},00! Redirecionando para o gateway seguro...`)}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-sm sm:text-base tracking-wide uppercase font-display flex items-center justify-center gap-2 shadow-xl shadow-amber-400/25 transition-all transform hover:-translate-y-0.5 active:scale-98"
            >
              <span>Contratar Boost Imediato</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Security Badges */}
            <div className="mt-6 pt-5 border-t border-white/[0.08] grid grid-cols-2 gap-3 text-[11px] text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Ban / VAC Safe</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Criptografia SSL 256-bit</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
