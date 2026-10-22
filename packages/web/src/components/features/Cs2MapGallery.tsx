"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Shield, Clock, Crosshair, Trophy, ChevronRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

export interface Cs2MapData {
  id: string;
  name: string;
  codename: string;
  location: string;
  tag: string;
  image: string;
  icon: string;
  winRate: string;
  avgDuration: string;
  ctAdvantage: number; // percentage, e.g. 52
  trAdvantage: number; // percentage, e.g. 48
  keyCallout: string;
}

export const ACTIVE_DUTY_MAPS: Cs2MapData[] = [
  {
    id: "mirage",
    name: "Mirage",
    codename: "de_mirage",
    location: "Marrocos",
    tag: "POPULAR #1",
    image: "/images/maps/mirage.jpg",
    icon: "/images/maps/mirage-icon.png",
    winRate: "98.4%",
    avgDuration: "14 min",
    ctAdvantage: 51,
    trAdvantage: 49,
    keyCallout: "Meio · Jungle · Janelão",
  },
  {
    id: "inferno",
    name: "Inferno",
    codename: "de_inferno",
    location: "Itália",
    tag: "TÁTICO",
    image: "/images/maps/inferno.jpg",
    icon: "/images/maps/inferno-icon.png",
    winRate: "97.9%",
    avgDuration: "16 min",
    ctAdvantage: 53,
    trAdvantage: 47,
    keyCallout: "Banana · Meio · Ruínas",
  },
  {
    id: "nuke",
    name: "Nuke",
    codename: "de_nuke",
    location: "EUA",
    tag: "FAVORITO PRO",
    image: "/images/maps/nuke.jpg",
    icon: "/images/maps/nuke-icon.png",
    winRate: "99.1%",
    avgDuration: "13 min",
    ctAdvantage: 54,
    trAdvantage: 46,
    keyCallout: "Fora · Duto · Rampa",
  },
  {
    id: "dust2",
    name: "Dust II",
    codename: "de_dust2",
    location: "Marrocos",
    tag: "MIRA PURA",
    image: "/images/maps/dust2.jpg",
    icon: "/images/maps/dust2-icon.png",
    winRate: "98.8%",
    avgDuration: "12 min",
    ctAdvantage: 49,
    trAdvantage: 51,
    keyCallout: "Fundo A · Meio · Varanda",
  },
  {
    id: "anubis",
    name: "Anubis",
    codename: "de_anubis",
    location: "Egito",
    tag: "DINÂMICO",
    image: "/images/maps/anubis.jpg",
    icon: "/images/maps/anubis-icon.png",
    winRate: "97.5%",
    avgDuration: "15 min",
    ctAdvantage: 47,
    trAdvantage: 53,
    keyCallout: "Canal · Ponte · Meio",
  },
  {
    id: "ancient",
    name: "Ancient",
    codename: "de_ancient",
    location: "América Central",
    tag: "FLORESTA",
    image: "/images/maps/ancient.jpg",
    icon: "/images/maps/ancient-icon.png",
    winRate: "98.2%",
    avgDuration: "14 min",
    ctAdvantage: 54,
    trAdvantage: 46,
    keyCallout: "Donut · Caverna · Meio",
  },
  {
    id: "vertigo",
    name: "Vertigo",
    codename: "de_vertigo",
    location: "EUA (Topo)",
    tag: "COMBATE CURTO",
    image: "/images/maps/vertigo.jpg",
    icon: "/images/maps/vertigo-icon.png",
    winRate: "99.0%",
    avgDuration: "12 min",
    ctAdvantage: 52,
    trAdvantage: 48,
    keyCallout: "Rampa A · Passarela · Meio",
  },
];

interface Cs2MapGalleryProps {
  onSelectMap?: (map: Cs2MapData) => void;
  selectedMapId?: string;
}

export function Cs2MapGallery({ onSelectMap, selectedMapId }: Cs2MapGalleryProps) {
  const [activeId, setActiveId] = useState<string>(selectedMapId || "mirage");
  const shouldReduceMotion = useReducedMotion();

  const activeMap = ACTIVE_DUTY_MAPS.find((m) => m.id === activeId) || ACTIVE_DUTY_MAPS[0];

  const handleMapClick = (map: Cs2MapData) => {
    setActiveId(map.id);
    onSelectMap?.(map);
  };

  return (
    <div className="space-y-4">
      {/* Header bar with Active Duty context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display text-base font-black uppercase tracking-wider text-text">
              Active Duty Pool · Premier CS2
            </span>
            <Badge tone="accent" size="sm">
              7 MAPAS OFICIAIS
            </Badge>
          </div>
          <span className="font-mono text-[11px] text-muted uppercase tracking-wider">
            Pool Ativo Competitivo · Telemetria Sub-Tick
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted">
          <Crosshair className="h-3.5 w-3.5 text-primary-text" />
          <span>SUB-TICK VERIFIED</span>
        </div>
      </div>

      {/* Horizontal Map Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
        {ACTIVE_DUTY_MAPS.map((map) => {
          const isSelected = map.id === activeMap.id;
          return (
            <button
              key={map.id}
              type="button"
              onClick={() => handleMapClick(map)}
              className={cn(
                "group relative flex items-center gap-2 rounded-xl border px-3 py-2 text-left transition-[background-color,border-color,box-shadow,color] duration-150 ease-out shrink-0",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
                isSelected
                  ? "border-primary bg-primary-soft/90 shadow-sm shadow-primary/20"
                  : "border-line bg-surface/80 hover:border-primary/40 hover:bg-surface-2"
              )}
            >
              <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded">
                <img
                  src={map.icon}
                  alt={map.name}
                  className="h-full w-full object-contain filter drop-shadow"
                  loading="lazy"
                />
              </div>

              <div className="min-w-0 pr-1">
                <span
                  className={cn(
                    "block text-xs font-bold leading-tight",
                    isSelected ? "text-primary-text font-black" : "text-text"
                  )}
                >
                  {map.name}
                </span>
                <span className="block font-mono text-[10px] text-muted uppercase">
                  {map.winRate}
                </span>
              </div>

              {isSelected && (
                <motion.div
                  layoutId="activeMapIndicator"
                  className="absolute inset-0 rounded-xl border-2 border-primary pointer-events-none"
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 450, damping: 30 }
                  }
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Feature Cinematic Card with Framer Motion AnimatePresence */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-surface/85 backdrop-blur-md shadow-2xl shadow-primary/10">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeMap.id}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.99, transition: { duration: 0.15, ease: "easeOut" } }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative min-h-[340px] sm:min-h-[380px] flex flex-col justify-between"
          >
            {/* Cinematic Background Image with Dark Obsidian MonoRed Gradient */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={activeMap.image}
                alt={activeMap.name}
                className="h-full w-full object-cover object-center transform scale-105 transition-transform duration-700 ease-out outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10"
                loading="eager"
              />
              {/* MonoRed Multi-Layer Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-surface/30" />
              <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/70 to-transparent" />
              <div className="absolute inset-0 bg-surface/20 backdrop-blur-[1px]" />
            </div>

            {/* Top Badges and Meta Bar */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-line-strong bg-surface/90 p-1 backdrop-blur-md">
                  <img
                    src={activeMap.icon}
                    alt=""
                    aria-hidden="true"
                    className="h-7 w-7 object-contain"
                  />
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-primary-text block">
                    {activeMap.codename} · {activeMap.location}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-xl sm:text-2xl font-black uppercase text-text tracking-tight">
                      {activeMap.name}
                    </span>
                    <span className="rounded border border-primary/30 bg-primary-soft px-1.5 py-0.5 font-mono text-[10px] font-bold text-primary-soft-text">
                      {activeMap.tag}
                    </span>
                  </div>
                </div>
              </div>

              {/* Live telemetry badge */}
              <div className="flex items-center gap-2 rounded-xl border border-line bg-surface/90 px-3 py-1.5 backdrop-blur-md font-mono text-xs">
                <Trophy className="h-4 w-4 text-primary-text shrink-0" />
                <span className="text-muted">Winrate Boosters:</span>
                <span className="font-bold text-text">{activeMap.winRate}</span>
              </div>
            </div>

            {/* Bottom Content Area: Tactical Telemetry Chips + Split Telemetry */}
            <div className="relative z-10 p-5 sm:p-6 space-y-4">
              {/* High-density Tactical Telemetry Strip */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface/90 px-2.5 py-1 text-[11px] font-mono backdrop-blur-md">
                  <Crosshair className="h-3.5 w-3.5 text-primary-text" />
                  <span className="text-muted">CALLOUTS:</span>
                  <span className="font-bold text-text">{activeMap.keyCallout}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface/90 px-2.5 py-1 text-[11px] font-mono backdrop-blur-md">
                  <span className="text-muted">POOL:</span>
                  <span className="font-bold text-primary-text">PREMIER SUB-TICK</span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface/90 px-2.5 py-1 text-[11px] font-mono backdrop-blur-md">
                  <span className="text-muted">BIAS:</span>
                  <span className="font-bold text-text">
                    {activeMap.ctAdvantage >= activeMap.trAdvantage
                      ? `CT +${activeMap.ctAdvantage - activeMap.trAdvantage}%`
                      : `TR +${activeMap.trAdvantage - activeMap.ctAdvantage}%`}
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface/90 px-2.5 py-1 text-[11px] font-mono backdrop-blur-md">
                  <span className="text-muted">WINRATE:</span>
                  <span className="font-bold text-primary-text">{activeMap.winRate}</span>
                </div>
              </div>

              {/* 3 Telemetry Metrics + CT/TR Advantage Split */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Metric 1: Tempo Médio de Vitória */}
                <div className="rounded-xl border border-line bg-surface/90 p-3 backdrop-blur-md">
                  <div className="flex items-center gap-1.5 text-muted font-mono text-[10px] uppercase">
                    <Clock className="h-3 w-3 text-primary-text" />
                    <span>DURAÇÃO MÉDIA</span>
                  </div>
                  <div className="mt-1 font-display text-lg font-black text-text">
                    {activeMap.avgDuration}
                  </div>
                  <span className="text-[10px] text-muted font-mono uppercase">TEMPO ESTIMADO</span>
                </div>

                {/* Metric 2: Zonas de Controle */}
                <div className="rounded-xl border border-line bg-surface/90 p-3 backdrop-blur-md">
                  <div className="flex items-center gap-1.5 text-muted font-mono text-[10px] uppercase">
                    <Sparkles className="h-3 w-3 text-primary-text" />
                    <span>CALLOUTS CHAVE</span>
                  </div>
                  <div className="mt-1 font-display text-sm font-bold text-text truncate">
                    {activeMap.keyCallout}
                  </div>
                  <span className="text-[10px] text-muted font-mono uppercase">UTILITÁRIAS MAPEADAS</span>
                </div>

                {/* Metric 3: CT vs TR Split Bar */}
                <div className="rounded-xl border border-line bg-surface/90 p-3 backdrop-blur-md">
                  <div className="flex items-center justify-between text-muted font-mono text-[10px] uppercase">
                    <span>LADO CT ({activeMap.ctAdvantage}%)</span>
                    <span>LADO TR ({activeMap.trAdvantage}%)</span>
                  </div>
                  {/* Split bar */}
                  <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-surface-3 flex">
                    <div
                      style={{ width: `${activeMap.ctAdvantage}%` }}
                      className="bg-primary h-full transition-all duration-500"
                      title={`CT: ${activeMap.ctAdvantage}%`}
                    />
                    <div
                      style={{ width: `${activeMap.trAdvantage}%` }}
                      className="bg-line-strong h-full transition-all duration-500"
                      title={`TR: ${activeMap.trAdvantage}%`}
                    />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-muted font-mono">
                    <span className="text-primary-text font-bold">Defesa</span>
                    <span>Ataque</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
