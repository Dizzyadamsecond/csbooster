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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-black uppercase tracking-wider text-white">
              ACTIVE DUTY MAP POOL // CS2
            </span>
            <span className="rounded-full bg-white px-2.5 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider text-black">
              7 MAPAS OFICIAIS
            </span>
          </div>
          <span className="font-mono text-[11px] text-neutral-400 uppercase tracking-widest font-medium">
            TELEMETRIA SUB-TICK VERIFICADA · TEMPORADA 2026
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-neutral-300">
          <Crosshair className="h-4 w-4 text-white" />
          <span className="font-bold">SUB-TICK 128-TICK SYNC</span>
        </div>
      </div>

      {/* Horizontal Map Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {ACTIVE_DUTY_MAPS.map((map) => {
          const isSelected = map.id === activeMap.id;
          return (
            <button
              key={map.id}
              type="button"
              onClick={() => handleMapClick(map)}
              className={cn(
                "group relative flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left transition-all duration-150 ease-out shrink-0",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                isSelected
                  ? "border-white bg-white text-black shadow-lg shadow-white/10"
                  : "border-white/10 bg-[#121214] text-neutral-400 hover:border-white/30 hover:text-white hover:bg-white/[0.04]"
              )}
            >
              <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded">
                <img
                  src={map.icon}
                  alt={map.name}
                  className={cn(
                    "h-full w-full object-contain filter drop-shadow",
                    isSelected ? "brightness-0" : ""
                  )}
                  loading="lazy"
                />
              </div>

              <div className="min-w-0 pr-1">
                <span
                  className={cn(
                    "block text-xs uppercase tracking-wide",
                    isSelected ? "font-black text-black" : "font-bold text-white"
                  )}
                >
                  {map.name}
                </span>
                <span
                  className={cn(
                    "block font-mono text-[10px] uppercase font-bold",
                    isSelected ? "text-neutral-800" : "text-neutral-500"
                  )}
                >
                  {map.winRate}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Feature Cinematic Card with Framer Motion AnimatePresence */}
      <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#080808] backdrop-blur-md shadow-2xl">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeMap.id}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.99, transition: { duration: 0.15, ease: "easeOut" } }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative min-h-[360px] sm:min-h-[400px] flex flex-col justify-between"
          >
            {/* Cinematic Background Image with Dark Obsidian Noir Gradient */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={activeMap.image}
                alt={activeMap.name}
                className="h-full w-full object-cover object-center transform scale-105 transition-transform duration-700 ease-out"
                loading="eager"
              />
              {/* Noir Monochromatic Multi-Layer Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/85 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/70 to-transparent" />
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px]" />
            </div>

            {/* Top Badges and Meta Bar */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-black/80 p-1.5 backdrop-blur-md shadow-lg">
                  <img
                    src={activeMap.icon}
                    alt=""
                    aria-hidden="true"
                    className="h-8 w-8 object-contain"
                  />
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-neutral-400 block">
                    {activeMap.codename} · {activeMap.location}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-display text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
                      {activeMap.name}
                    </span>
                    <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 font-mono text-[10px] font-bold text-white uppercase tracking-wider">
                      {activeMap.tag}
                    </span>
                  </div>
                </div>
              </div>

              {/* Live telemetry badge */}
              <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-black/80 px-3.5 py-2 backdrop-blur-md font-mono text-xs shadow-md">
                <Trophy className="h-4 w-4 text-white shrink-0" />
                <span className="text-neutral-400 font-medium">Winrate Booster:</span>
                <span className="font-black text-white">{activeMap.winRate}</span>
              </div>
            </div>

            {/* Bottom Content Area: Tactical Telemetry Chips + Split Telemetry */}
            <div className="relative z-10 p-6 space-y-4">
              {/* High-density Tactical Telemetry Strip */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-black/80 px-3 py-1.5 text-xs font-mono backdrop-blur-md">
                  <Crosshair className="h-3.5 w-3.5 text-white" />
                  <span className="text-neutral-400">CALLOUTS:</span>
                  <span className="font-bold text-white">{activeMap.keyCallout}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-black/80 px-3 py-1.5 text-xs font-mono backdrop-blur-md">
                  <span className="text-neutral-400">POOL:</span>
                  <span className="font-bold text-white">PREMIER SUB-TICK</span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-black/80 px-3 py-1.5 text-xs font-mono backdrop-blur-md">
                  <span className="text-neutral-400">LADO FORTE:</span>
                  <span className="font-bold text-white">
                    {activeMap.ctAdvantage >= activeMap.trAdvantage
                      ? `DEFESA CT +${activeMap.ctAdvantage - activeMap.trAdvantage}%`
                      : `ATAQUE TR +${activeMap.trAdvantage - activeMap.ctAdvantage}%`}
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-black/80 px-3 py-1.5 text-xs font-mono backdrop-blur-md">
                  <span className="text-neutral-400">WINRATE:</span>
                  <span className="font-bold text-white">{activeMap.winRate}</span>
                </div>
              </div>

              {/* 3 Telemetry Metrics + CT/TR Advantage Split */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Metric 1: Tempo Médio de Vitória */}
                <div className="rounded-xl border border-white/10 bg-[#121214]/90 p-4 backdrop-blur-md">
                  <div className="flex items-center gap-1.5 text-neutral-400 font-mono text-[10px] uppercase font-bold tracking-wider">
                    <Clock className="h-3.5 w-3.5 text-white" />
                    <span>DURAÇÃO MÉDIA DE PARTIDA</span>
                  </div>
                  <div className="mt-1 font-display text-xl font-black text-white">
                    {activeMap.avgDuration}
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono uppercase">TEMPO POR VITÓRIA</span>
                </div>

                {/* Metric 2: Zonas de Controle */}
                <div className="rounded-xl border border-white/10 bg-[#121214]/90 p-4 backdrop-blur-md">
                  <div className="flex items-center gap-1.5 text-neutral-400 font-mono text-[10px] uppercase font-bold tracking-wider">
                    <Sparkles className="h-3.5 w-3.5 text-white" />
                    <span>CALLOUTS CHAVE</span>
                  </div>
                  <div className="mt-1 font-display text-sm font-bold text-white truncate">
                    {activeMap.keyCallout}
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono uppercase">UTILITÁRIAS MAPEADAS</span>
                </div>

                {/* Metric 3: CT vs TR Split Bar */}
                <div className="rounded-xl border border-white/10 bg-[#121214]/90 p-4 backdrop-blur-md">
                  <div className="flex items-center justify-between text-neutral-400 font-mono text-[10px] uppercase font-bold tracking-wider">
                    <span className="text-white">LADO CT ({activeMap.ctAdvantage}%)</span>
                    <span>LADO TR ({activeMap.trAdvantage}%)</span>
                  </div>
                  {/* Split bar */}
                  <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-white/10 flex">
                    <div
                      style={{ width: `${activeMap.ctAdvantage}%` }}
                      className="bg-white h-full transition-all duration-500 shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                      title={`CT: ${activeMap.ctAdvantage}%`}
                    />
                    <div
                      style={{ width: `${activeMap.trAdvantage}%` }}
                      className="bg-white/20 h-full transition-all duration-500"
                      title={`TR: ${activeMap.trAdvantage}%`}
                    />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-white font-bold">Defesa</span>
                    <span className="text-neutral-400">Ataque</span>
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
