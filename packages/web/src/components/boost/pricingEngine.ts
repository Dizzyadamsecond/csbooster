/**
 * Pricing Engine for CS2 Booster suite.
 * Implements realistic piecewise tiered Premier pricing, Competitive rank pricing,
 * Coaching hourly rates, tactical add-ons, and instant PIX cash discount calculation.
 */

export type ServiceType = "premier" | "competitive" | "coaching";
export type BoostMode = "solo" | "duo";

export interface PremierBracket {
  min: number;
  max: number;
  soloPerThousand: number;
  duoPerThousand: number;
  hoursPerThousand: number;
}

export const PREMIER_BRACKETS: PremierBracket[] = [
  { min: 1000, max: 10000, soloPerThousand: 22, duoPerThousand: 30, hoursPerThousand: 1.6 },
  { min: 10000, max: 15000, soloPerThousand: 32, duoPerThousand: 44, hoursPerThousand: 2.2 },
  { min: 15000, max: 20000, soloPerThousand: 48, duoPerThousand: 64, hoursPerThousand: 2.8 },
  { min: 20000, max: 25000, soloPerThousand: 75, duoPerThousand: 98, hoursPerThousand: 3.5 },
  { min: 25000, max: 30000, soloPerThousand: 120, duoPerThousand: 160, hoursPerThousand: 4.5 },
];

export interface CompetitiveRank {
  id: number; // 1 to 18
  name: string;
  shortName: string;
  tier: "silver" | "gold" | "guardian" | "elite";
  soloPricePerRank: number;
  duoPricePerRank: number;
}

export const COMPETITIVE_RANKS: CompetitiveRank[] = [
  { id: 1, name: "Prata I", shortName: "S1", tier: "silver", soloPricePerRank: 16, duoPricePerRank: 24 },
  { id: 2, name: "Prata II", shortName: "S2", tier: "silver", soloPricePerRank: 16, duoPricePerRank: 24 },
  { id: 3, name: "Prata III", shortName: "S3", tier: "silver", soloPricePerRank: 16, duoPricePerRank: 24 },
  { id: 4, name: "Prata IV", shortName: "S4", tier: "silver", soloPricePerRank: 18, duoPricePerRank: 26 },
  { id: 5, name: "Prata de Elite", shortName: "SE", tier: "silver", soloPricePerRank: 18, duoPricePerRank: 26 },
  { id: 6, name: "Prata de Elite Mestre", shortName: "SEM", tier: "silver", soloPricePerRank: 20, duoPricePerRank: 28 },
  { id: 7, name: "Ouro I", shortName: "GN1", tier: "gold", soloPricePerRank: 24, duoPricePerRank: 34 },
  { id: 8, name: "Ouro II", shortName: "GN2", tier: "gold", soloPricePerRank: 24, duoPricePerRank: 34 },
  { id: 9, name: "Ouro III", shortName: "GN3", tier: "gold", soloPricePerRank: 26, duoPricePerRank: 36 },
  { id: 10, name: "Ouro Mestre", shortName: "GNM", tier: "gold", soloPricePerRank: 28, duoPricePerRank: 38 },
  { id: 11, name: "Mestre Guardião I", shortName: "MG1", tier: "guardian", soloPricePerRank: 34, duoPricePerRank: 46 },
  { id: 12, name: "Mestre Guardião II", shortName: "MG2", tier: "guardian", soloPricePerRank: 36, duoPricePerRank: 50 },
  { id: 13, name: "Mestre Guardião Elite", shortName: "MGE", tier: "guardian", soloPricePerRank: 40, duoPricePerRank: 54 },
  { id: 14, name: "Xerife (DMG)", shortName: "DMG", tier: "guardian", soloPricePerRank: 46, duoPricePerRank: 62 },
  { id: 15, name: "Águia Lendária", shortName: "LE", tier: "elite", soloPricePerRank: 58, duoPricePerRank: 78 },
  { id: 16, name: "Águia Lendária Mestre", shortName: "LEM", tier: "elite", soloPricePerRank: 68, duoPricePerRank: 92 },
  { id: 17, name: "Mestre Supremo", shortName: "SMFC", tier: "elite", soloPricePerRank: 84, duoPricePerRank: 112 },
  { id: 18, name: "O Elite Global", shortName: "GE", tier: "elite", soloPricePerRank: 110, duoPricePerRank: 145 },
];

export const COACHING_HOURLY_RATE = 45; // R$ 45/hr

export interface AddOnConfig {
  id: "streamMatch" | "expressDelivery" | "offlineMode" | "specificRoles" | "antiDerank";
  label: string;
  badge?: string;
  desc: string;
  priceType: "fixed" | "percentage";
  priceValue: number; // e.g. 25 for R$ 25, 0.25 for 25%
}

export const ADD_ON_DEFINITIONS: AddOnConfig[] = [
  {
    id: "streamMatch",
    label: "Transmissão da Partida",
    badge: "Ao Vivo",
    desc: "Assista seu boost em stream privada 1080p 60fps (Twitch/YouTube não-listado).",
    priceType: "fixed",
    priceValue: 25,
  },
  {
    id: "expressDelivery",
    label: "Entrega Expressa (+25%)",
    badge: "Prioridade VIP",
    desc: "Fila prioritária com alocação instantânea de booster dedicado (+25% do valor base).",
    priceType: "percentage",
    priceValue: 0.25,
  },
  {
    id: "offlineMode",
    label: "Modo Fantasma (Ghost/Offline)",
    badge: "Grátis",
    desc: "Booster joga com status offline na Steam para ninguém ver suas partidas.",
    priceType: "fixed",
    priceValue: 0,
  },
  {
    id: "specificRoles",
    label: "Posições / Roles Específicas",
    badge: "Tático",
    desc: "Defina agentes, posições e funções táticas no mapa (Entry, AWP, Suporte ou IGL).",
    priceType: "fixed",
    priceValue: 20,
  },
  {
    id: "antiDerank",
    label: "Proteção Anti-Derank",
    badge: "Garantia 100%",
    desc: "Seguro total: caso haja qualquer derrota na sessão, os pontos perdidos são repostos sem custo.",
    priceType: "fixed",
    priceValue: 35,
  },
];

export interface AddOnState {
  streamMatch: boolean;
  expressDelivery: boolean;
  offlineMode: boolean;
  specificRoles: boolean;
  antiDerank: boolean;
}

export interface PricingBreakdownItem {
  label: string;
  amount: number;
  highlight?: boolean;
}

export interface PricingResult {
  serviceType: ServiceType;
  boostMode: BoostMode;
  currentRating: number;
  targetRating: number;
  basePrice: number;
  addOnsCost: number;
  totalPrice: number;
  pixDiscountAmount: number;
  pixTotalPrice: number;
  estimatedHours: number;
  breakdown: PricingBreakdownItem[];
}

/**
 * Calculates Premier rating boost price using exact piecewise tiered brackets.
 */
export function calculatePremierPrice(
  current: number,
  target: number,
  mode: BoostMode
): number {
  // Defensive input sanitization: guard against NaN
  if (Number.isNaN(current) || Number.isNaN(target)) return 0;
  if (target <= current) return 0;

  // Clamp within official Premier boundaries [1000, 30000]
  const startRating = Math.max(1000, Math.min(30000, current));
  const endRating = Math.max(1000, Math.min(30000, target));

  if (endRating <= startRating) return 0;

  let total = 0;
  for (const bracket of PREMIER_BRACKETS) {
    const start = Math.max(startRating, bracket.min);
    const end = Math.min(endRating, bracket.max);

    if (end > start) {
      const points = end - start;
      const rate = mode === "duo" ? bracket.duoPerThousand : bracket.soloPerThousand;
      total += (points / 1000) * rate;
    }
  }

  // Minimum order charge floor R$ 35 to cover matchmaking baseline overhead
  return Math.max(35, Math.round(total));
}

/**
 * Calculates Competitive ranks boost price across rank steps.
 */
export function calculateCompetitivePrice(
  currentRankId: number,
  targetRankId: number,
  mode: BoostMode
): number {
  // Defensive input sanitization: guard against NaN
  if (Number.isNaN(currentRankId) || Number.isNaN(targetRankId)) return 0;
  if (targetRankId <= currentRankId) return 0;

  const startId = Math.max(1, Math.min(18, currentRankId));
  const endId = Math.max(1, Math.min(18, targetRankId));

  if (endId <= startId) return 0;

  let total = 0;
  for (let rankId = startId; rankId < endId; rankId++) {
    const rankInfo = COMPETITIVE_RANKS.find((r) => r.id === rankId);
    if (rankInfo) {
      const stepCost = mode === "duo" ? rankInfo.duoPricePerRank : rankInfo.soloPricePerRank;
      total += stepCost;
    }
  }

  // Minimum order charge floor R$ 35
  return Math.max(35, Math.round(total));
}

/**
 * Calculates Coaching price based on selected hours.
 */
export function calculateCoachingPrice(hours: number): number {
  // Defensive input sanitization: guard against NaN / non-finite hours
  const safeHours = Number.isFinite(hours)
    ? Math.max(1, Math.min(20, Math.floor(hours)))
    : 1;
  return safeHours * COACHING_HOURLY_RATE;
}

/**
 * Calculates estimated delivery time in hours.
 */
export function calculateEstimatedHours(
  serviceType: ServiceType,
  current: number,
  target: number,
  expressDelivery: boolean
): number {
  if (serviceType === "coaching") {
    // For coaching, estimated time is the duration of coaching sessions
    const rawHours = Number.isFinite(target)
      ? target
      : (Number.isFinite(current) ? current : 1);
    return Math.max(1, Math.min(20, Math.floor(rawHours)));
  }

  // If 0 points/ranks are ordered or inputs are invalid, delivery time is 0 hours
  if (
    Number.isNaN(current) ||
    Number.isNaN(target) ||
    target <= current
  ) {
    return 0;
  }

  if (serviceType === "competitive") {
    const rankDiff = Math.max(0, target - current);
    const rawHours = rankDiff * 2.5;
    const adjusted = expressDelivery ? rawHours * 0.65 : rawHours;
    return Math.max(3, Math.round(adjusted));
  }

  // Premier hours based on piecewise brackets
  let rawHours = 0;
  const startRating = Math.max(1000, Math.min(30000, current));
  const endRating = Math.max(1000, Math.min(30000, target));

  if (endRating <= startRating) return 0;

  for (const bracket of PREMIER_BRACKETS) {
    const start = Math.max(startRating, bracket.min);
    const end = Math.min(endRating, bracket.max);
    if (end > start) {
      const points = end - start;
      rawHours += (points / 1000) * bracket.hoursPerThousand;
    }
  }

  const adjustedHours = expressDelivery ? rawHours * 0.65 : rawHours;
  return Math.max(3, Math.round(adjustedHours));
}

/**
 * Master price orchestrator. Computes base price, add-ons, 5% PIX discount, and itemized breakdown.
 */
export function calculateFullPricing(params: {
  serviceType: ServiceType;
  boostMode: BoostMode;
  currentRating: number;
  targetRating: number;
  addOns: AddOnState;
}): PricingResult {
  const { serviceType, boostMode, currentRating, targetRating, addOns } = params;

  let basePrice = 0;
  const breakdown: PricingBreakdownItem[] = [];

  if (serviceType === "premier") {
    const safeCurrent = Number.isFinite(currentRating) ? currentRating : 1000;
    const safeTarget = Number.isFinite(targetRating) ? targetRating : safeCurrent;
    basePrice = calculatePremierPrice(safeCurrent, safeTarget, boostMode);
    const pts = Math.max(0, safeTarget - safeCurrent);
    breakdown.push({
      label: `Boost Premier (${safeCurrent.toLocaleString()} → ${safeTarget.toLocaleString()} [${pts.toLocaleString()} pts] - ${boostMode === "duo" ? "Duo" : "Solo"})`,
      amount: basePrice,
    });
  } else if (serviceType === "competitive") {
    const safeCurrent = Number.isFinite(currentRating) ? currentRating : 1;
    const safeTarget = Number.isFinite(targetRating) ? targetRating : safeCurrent;
    basePrice = calculateCompetitivePrice(safeCurrent, safeTarget, boostMode);
    const currentName = COMPETITIVE_RANKS.find((r) => r.id === safeCurrent)?.name || `Rank ${safeCurrent}`;
    const targetName = COMPETITIVE_RANKS.find((r) => r.id === safeTarget)?.name || `Rank ${safeTarget}`;
    breakdown.push({
      label: `Rank Competitivo (${currentName} → ${targetName} - ${boostMode === "duo" ? "Duo" : "Solo"})`,
      amount: basePrice,
    });
  } else {
    const safeHours = Number.isFinite(targetRating)
      ? Math.max(1, Math.min(20, Math.floor(targetRating)))
      : (Number.isFinite(currentRating) ? Math.max(1, Math.min(20, Math.floor(currentRating))) : 1);
    basePrice = calculateCoachingPrice(safeHours);
    breakdown.push({
      label: `Sessão de Coaching Pro (${safeHours}h @ R$ ${COACHING_HOURLY_RATE}/h)`,
      amount: basePrice,
    });
  }

  // Calculate Add-ons
  let addOnsCost = 0;

  if (addOns.streamMatch) {
    addOnsCost += 25;
    breakdown.push({ label: "Transmissão da Partida (1080p 60fps)", amount: 25 });
  }

  if (addOns.expressDelivery) {
    const expressCost = Math.round(basePrice * 0.25);
    addOnsCost += expressCost;
    breakdown.push({ label: "Entrega Expressa VIP (+25%)", amount: expressCost });
  }

  if (addOns.offlineMode) {
    breakdown.push({ label: "Modo Fantasma / Offline (Steam)", amount: 0 });
  }

  if (addOns.specificRoles) {
    addOnsCost += 20;
    breakdown.push({ label: "Roles & Funções Específicas", amount: 20 });
  }

  if (addOns.antiDerank) {
    addOnsCost += 35;
    breakdown.push({ label: "Proteção Anti-Derank 100%", amount: 35 });
  }

  // Minimum order charge floor R$ 35 when order has any service or add-on selected
  const rawTotal = basePrice + addOnsCost;
  const totalPrice = (basePrice > 0 || addOnsCost > 0)
    ? Math.max(35, rawTotal)
    : 0;

  // 5% PIX discount
  const pixDiscountAmount = Math.round(totalPrice * 0.05);
  const pixTotalPrice = Math.max(0, totalPrice - pixDiscountAmount);

  const estimatedHours = calculateEstimatedHours(
    serviceType,
    currentRating,
    targetRating,
    addOns.expressDelivery
  );

  return {
    serviceType,
    boostMode,
    currentRating,
    targetRating,
    basePrice,
    addOnsCost,
    totalPrice,
    pixDiscountAmount,
    pixTotalPrice,
    estimatedHours,
    breakdown,
  };
}
