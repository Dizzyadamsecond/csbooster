"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { 
  X, 
  Check, 
  Copy, 
  QrCode, 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  ArrowLeft, 
  Trophy, 
  Sparkles, 
  MessageSquare, 
  AlertCircle,
  Clock,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/cn";
import { PricingResult } from "./pricingEngine";

export interface OrderPayload {
  orderId: string;
  createdAt: string;
  serviceType: string;
  boostMode: string;
  currentRating: number;
  targetRating: number;
  steamId: string;
  discordTag: string;
  paymentMethod: "pix" | "card";
  totalPrice: number;
  finalPrice: number;
  estimatedHours: number;
  status: "queued" | "in_progress" | "completed";
}

export interface CheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pricing: PricingResult;
  onOrderCreated?: (order: OrderPayload) => void;
}

export function CheckoutDrawer({
  isOpen,
  onClose,
  pricing,
  onOrderCreated,
}: CheckoutDrawerProps) {
  const shouldReduceMotion = useReducedMotion();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form states (Step 2)
  const [steamId, setSteamId] = useState("");
  const [discordTag, setDiscordTag] = useState("");
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Payment states (Step 3)
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card">("pix");
  const [orderId, setOrderId] = useState<string>("");
  const [hasCopiedPix, setHasCopiedPix] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);

  // Reset or initialize on open
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setValidationError(null);
      setOrderCompleted(false);
      setIsFinalizing(false);
      setHasCopiedPix(false);
      const generatedId = `CS2-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Date.now().toString().slice(-4)}`;
      setOrderId(generatedId);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle escape key
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
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  // Step 2 validation
  const handleProceedToPayment = () => {
    if (!steamId.trim() || steamId.trim().length < 3) {
      setValidationError("Por favor, informe seu Perfil Steam, SteamID ou Código de Amigo.");
      return;
    }
    if (!discordTag.trim() || discordTag.trim().length < 2) {
      setValidationError("Por favor, informe seu usuário do Discord para comunicação.");
      return;
    }
    if (!agreedTerms) {
      setValidationError("Você precisa aceitar os termos de serviço e a garantia anti-ban.");
      return;
    }
    setValidationError(null);
    setStep(3);
  };

  // Simulated copy-paste PIX BR Code payload
  const pixPayload = `00020126580014BR.GOV.BCB.PIX0136cs2booster-gateway-pagamentos@cs2booster.com520400005303986540${pricing.pixTotalPrice}.005802BR5916CS2 BOOSTER LTDA6009SAO PAULO62070503***6304${orderId.slice(-4)}`;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixPayload);
    setHasCopiedPix(true);
    setTimeout(() => setHasCopiedPix(false), 3000);
  };

  // Finalize order submission
  const handleFinalizeOrder = () => {
    setIsFinalizing(true);

    const finalAmount = paymentMethod === "pix" ? pricing.pixTotalPrice : pricing.totalPrice;

    const payload: OrderPayload = {
      orderId,
      createdAt: new Date().toISOString(),
      serviceType: pricing.serviceType,
      boostMode: pricing.boostMode,
      currentRating: pricing.currentRating,
      targetRating: pricing.targetRating,
      steamId: steamId.trim(),
      discordTag: discordTag.trim(),
      paymentMethod,
      totalPrice: pricing.totalPrice,
      finalPrice: finalAmount,
      estimatedHours: pricing.estimatedHours,
      status: "queued",
    };

    // Persist to localStorage for tracker access
    try {
      const existing = localStorage.getItem("cs2booster_orders");
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(payload);
      localStorage.setItem("cs2booster_orders", JSON.stringify(list));
      localStorage.setItem("cs2booster_active_order", JSON.stringify(payload));
    } catch {
      // fallback in case of storage quota or private mode
    }

    setTimeout(() => {
      setIsFinalizing(false);
      setOrderCompleted(true);
      onOrderCreated?.(payload);
    }, 600);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
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

          {/* Drawer Container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="checkout-drawer-title"
              initial={{ x: shouldReduceMotion ? 0 : "100%", opacity: shouldReduceMotion ? 0 : 1 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: shouldReduceMotion ? 0 : "100%", opacity: shouldReduceMotion ? 0 : 1 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="relative w-screen max-w-lg bg-surface border-l border-line flex flex-col justify-between shadow-2xl"
            >
              {/* Header */}
              <div className="p-5 sm:p-6 border-b border-line flex items-center justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-primary-text mb-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Checkout Seguro SSL 256-bit</span>
                  </div>
                  <h2 id="checkout-drawer-title" className="text-lg sm:text-xl font-bold font-display uppercase text-text">
                    {orderCompleted ? "Pedido Confirmado!" : "Contratar Boost CS2"}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Fechar checkout"
                  className="rounded-lg p-2 text-muted hover:bg-surface-2 hover:text-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Step Bar (if not completed) */}
              {!orderCompleted && (
                <div className="px-6 py-3 bg-surface-2 border-b border-line">
                  <div className="flex items-center justify-between text-xs font-mono">
                    {[
                      { num: 1, label: "Revisão" },
                      { num: 2, label: "Contato & Steam" },
                      { num: 3, label: "Pagamento" },
                    ].map((s) => (
                      <div
                        key={s.num}
                        className={cn(
                          "flex items-center gap-1.5",
                          step === s.num
                            ? "text-primary-text font-bold"
                            : step > s.num
                            ? "text-text"
                            : "text-muted"
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                            step === s.num
                              ? "bg-primary text-primary-foreground"
                              : step > s.num
                              ? "bg-primary/20 text-primary-text"
                              : "bg-surface-3 text-muted"
                          )}
                        >
                          {step > s.num ? "✓" : s.num}
                        </span>
                        <span>{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Drawer Scrollable Body */}
              <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6 space-y-6">
                {/* ----------------------------------------------------------- */}
                {/* ORDER SUCCESS SCREEN */}
                {/* ----------------------------------------------------------- */}
                {orderCompleted ? (
                  <div className="space-y-6 text-center py-6">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
                      <Check className="h-8 w-8 stroke-[3]" />
                    </div>

                    <div>
                      <span className="font-mono text-xs uppercase tracking-wider text-primary-text font-bold">
                        ID: {orderId}
                      </span>
                      <h3 className="text-2xl font-black uppercase tracking-tight text-text font-display mt-1">
                        Pedido Criado com Sucesso!
                      </h3>
                      <p className="text-xs text-muted mt-2 max-w-sm mx-auto leading-relaxed">
                        Seu pedido foi registrado em nossa fila de boosters. Nosso coordenador entrará em contato via Discord (<strong>{discordTag}</strong>) em instantes.
                      </p>
                    </div>

                    <div className="rounded-xl border border-line bg-surface-2 p-4 text-left text-xs space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted">Serviço:</span>
                        <span className="font-bold text-text uppercase font-mono">{pricing.serviceType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Modalidade:</span>
                        <span className="font-bold text-text uppercase font-mono">{pricing.boostMode} Boost</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Total Pago:</span>
                        <span className="font-bold text-primary-text font-mono">
                          R$ {paymentMethod === "pix" ? pricing.pixTotalPrice : pricing.totalPrice},00
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Steam ID:</span>
                        <span className="font-mono text-text">{steamId}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-display font-extrabold uppercase tracking-wider shadow-lg shadow-primary/20 hover:brightness-110 transition-all"
                    >
                      Acompanhar no Tracker de Pedidos
                    </button>
                  </div>
                ) : (
                  <>
                    {/* --------------------------------------------------------- */}
                    {/* STEP 1: CONFIG & PRICE REVIEW */}
                    {/* --------------------------------------------------------- */}
                    {step === 1 && (
                      <div className="space-y-5">
                        <div className="rounded-xl border border-line bg-surface-2 p-4 space-y-3">
                          <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-muted">
                            Resumo da Configuração
                          </h4>

                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="rounded-lg bg-surface p-2.5 border border-line">
                              <span className="text-muted block text-[10px] uppercase font-mono">Serviço</span>
                              <span className="font-bold text-text uppercase font-mono">{pricing.serviceType}</span>
                            </div>
                            <div className="rounded-lg bg-surface p-2.5 border border-line">
                              <span className="text-muted block text-[10px] uppercase font-mono">Modalidade</span>
                              <span className="font-bold text-text uppercase font-mono">{pricing.boostMode} Boost</span>
                            </div>
                            <div className="rounded-lg bg-surface p-2.5 border border-line">
                              <span className="text-muted block text-[10px] uppercase font-mono">Atual</span>
                              <span className="font-bold text-text font-mono">{pricing.currentRating.toLocaleString("pt-BR")}</span>
                            </div>
                            <div className="rounded-lg bg-surface p-2.5 border border-line">
                              <span className="text-muted block text-[10px] uppercase font-mono">Alvo</span>
                              <span className="font-bold text-primary-text font-mono">{pricing.targetRating.toLocaleString("pt-BR")}</span>
                            </div>
                          </div>
                        </div>

                        {/* Breakdown */}
                        <div className="rounded-xl border border-line bg-surface p-4 space-y-3">
                          <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-muted">
                            Itens do Pedido
                          </h4>
                          <div className="space-y-2 text-xs">
                            {pricing.breakdown.map((item, i) => (
                              <div key={i} className="flex justify-between gap-2">
                                <span className="text-muted">{item.label}</span>
                                <span className="font-mono font-bold text-text shrink-0">
                                  {item.amount > 0 ? `R$ ${item.amount},00` : "Grátis"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Total Highlight */}
                        <div className="rounded-xl bg-primary/10 border border-primary/30 p-4 flex items-center justify-between">
                          <div>
                            <span className="text-xs text-muted block">Total com 5% OFF no PIX:</span>
                            <span className="font-display font-black text-2xl text-primary-text">
                              R$ {pricing.pixTotalPrice},00
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-muted block">Cartão em até 12x:</span>
                            <span className="font-mono font-bold text-sm text-text">
                              R$ {pricing.totalPrice},00
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* --------------------------------------------------------- */}
                    {/* STEP 2: PLAYER CONTACT & STEAM DETAILS */}
                    {/* --------------------------------------------------------- */}
                    {step === 2 && (
                      <div className="space-y-5">
                        <div className="space-y-1">
                          <h3 className="text-sm font-bold uppercase tracking-wider text-text font-display">
                            Dados de Conexão do Jogador
                          </h3>
                          <p className="text-xs text-muted">
                            Usamos estas informações exclusivamente para coordenar seu lobby ou sessão de boost.
                          </p>
                        </div>

                        {validationError && (
                          <div className="rounded-xl border border-primary/40 bg-primary/10 p-3 text-xs text-primary-text flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                            <span>{validationError}</span>
                          </div>
                        )}

                        <div className="space-y-4 text-xs">
                          {/* Steam ID input */}
                          <div className="space-y-1.5">
                            <label htmlFor="checkout-steam-id" className="font-bold text-text block">
                              Perfil Steam (Link, SteamID ou Código de Amigo) <span className="text-primary-text">*</span>
                            </label>
                            <input
                              id="checkout-steam-id"
                              type="text"
                              value={steamId}
                              onChange={(e) => setSteamId(e.target.value)}
                              placeholder="Ex: https://steamcommunity.com/id/seu_perfil ou 123456789"
                              className="w-full rounded-xl border border-line bg-surface-2 px-3.5 py-3 text-text placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                            />
                            <p className="text-[11px] text-muted">
                              {pricing.boostMode === "solo"
                                ? "Para Solo Boost, você ativará o PIN Family View após a confirmação."
                                : "Usado para o booster enviar o convite de lobby direto no jogo."}
                            </p>
                          </div>

                          {/* Discord Tag */}
                          <div className="space-y-1.5">
                            <label htmlFor="checkout-discord-tag" className="font-bold text-text block">
                              Usuário / Tag do Discord <span className="text-primary-text">*</span>
                            </label>
                            <input
                              id="checkout-discord-tag"
                              type="text"
                              value={discordTag}
                              onChange={(e) => setDiscordTag(e.target.value)}
                              placeholder="Ex: seu_usuario ou seu_usuario#1234"
                              className="w-full rounded-xl border border-line bg-surface-2 px-3.5 py-3 text-text placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                            />
                            <p className="text-[11px] text-muted">
                              Nosso coordenador criará um canal de texto/voz privado para você acompanhar o booster.
                            </p>
                          </div>

                          {/* Terms checkbox */}
                          <label className="flex items-start gap-2.5 p-3 rounded-xl border border-line bg-surface-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={agreedTerms}
                              onChange={(e) => setAgreedTerms(e.target.checked)}
                              className="mt-0.5 rounded border-line text-primary focus:ring-primary"
                            />
                            <span className="text-[11px] text-muted leading-relaxed">
                              Concordo com os Termos de Serviço, confirmo que li o protocolo anti-theft (Family View) e compreendo a garantia anti-ban da CS2 Booster.
                            </span>
                          </label>
                        </div>
                      </div>
                    )}

                    {/* --------------------------------------------------------- */}
                    {/* STEP 3: PAYMENT METHOD (PIX QR & CARD) */}
                    {/* --------------------------------------------------------- */}
                    {step === 3 && (
                      <div className="space-y-5">
                        {/* Order identifier header */}
                        <div className="flex items-center justify-between rounded-xl bg-surface-2 border border-line p-3 font-mono text-xs">
                          <span className="text-muted">Identificador do Pedido:</span>
                          <span className="font-bold text-primary-text">{orderId}</span>
                        </div>

                        {/* Payment Method Selector */}
                        <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Forma de Pagamento">
                          <button
                            type="button"
                            role="radio"
                            aria-checked={paymentMethod === "pix"}
                            onClick={() => setPaymentMethod("pix")}
                            className={cn(
                              "p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all",
                              paymentMethod === "pix"
                                ? "border-primary bg-primary/10 shadow-sm shadow-primary/10"
                                : "border-line bg-surface hover:bg-surface-2"
                            )}
                          >
                            <QrCode className="h-5 w-5 text-primary-text" />
                            <span className="font-bold text-xs text-text">PIX Instantâneo</span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-primary/20 text-primary-text font-bold">
                              5% OFF
                            </span>
                          </button>

                          <button
                            type="button"
                            role="radio"
                            aria-checked={paymentMethod === "card"}
                            onClick={() => setPaymentMethod("card")}
                            className={cn(
                              "p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all",
                              paymentMethod === "card"
                                ? "border-primary bg-primary/10 shadow-sm shadow-primary/10"
                                : "border-line bg-surface hover:bg-surface-2"
                            )}
                          >
                            <CreditCard className="h-5 w-5 text-primary-text" />
                            <span className="font-bold text-xs text-text">Cartão de Crédito</span>
                            <span className="text-[10px] font-mono text-muted">Até 12x</span>
                          </button>
                        </div>

                        {/* PIX Details */}
                        {paymentMethod === "pix" ? (
                          <div className="rounded-xl border border-line bg-surface p-4 space-y-4 text-center">
                            <div className="space-y-1">
                              <span className="text-xs text-muted font-mono uppercase">Valor a pagar via PIX:</span>
                              <div className="font-display font-black text-3xl text-primary-text">
                                R$ {pricing.pixTotalPrice},00
                              </div>
                              <span className="text-[11px] text-muted">Aprovação imediata em até 30 segundos</span>
                            </div>

                            {/* SVG QR Code Simulation */}
                            <div className="mx-auto flex justify-center p-3 rounded-xl bg-white border border-line w-44 h-44 shadow-inner">
                              <svg
                                viewBox="0 0 100 100"
                                className="w-full h-full text-black"
                                fill="currentColor"
                                aria-label="QR Code para pagamento PIX"
                              >
                                {/* Distinct QR-like patterns */}
                                <rect x="0" y="0" width="30" height="30" rx="3" />
                                <rect x="5" y="5" width="20" height="20" fill="white" />
                                <rect x="10" y="10" width="10" height="10" />

                                <rect x="70" y="0" width="30" height="30" rx="3" />
                                <rect x="75" y="5" width="20" height="20" fill="white" />
                                <rect x="80" y="10" width="10" height="10" />

                                <rect x="0" y="70" width="30" height="30" rx="3" />
                                <rect x="5" y="75" width="20" height="20" fill="white" />
                                <rect x="10" y="80" width="10" height="10" />

                                {/* Internal data matrix dots */}
                                <rect x="36" y="8" width="6" height="6" />
                                <rect x="48" y="14" width="6" height="6" />
                                <rect x="40" y="24" width="12" height="6" />
                                <rect x="12" y="38" width="6" height="12" />
                                <rect x="24" y="44" width="8" height="8" />
                                <rect x="40" y="40" width="20" height="20" />
                                <rect x="66" y="36" width="8" height="6" />
                                <rect x="80" y="44" width="10" height="10" />
                                <rect x="40" y="72" width="8" height="14" />
                                <rect x="54" y="66" width="14" height="6" />
                                <rect x="74" y="74" width="16" height="16" />
                              </svg>
                            </div>

                            {/* Copy PIX Code */}
                            <div className="space-y-2">
                              <button
                                type="button"
                                onClick={handleCopyPix}
                                className="w-full py-2.5 px-4 rounded-xl border border-primary/40 bg-primary/10 hover:bg-primary/20 text-primary-text font-mono text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                              >
                                {hasCopiedPix ? (
                                  <>
                                    <Check className="h-4 w-4" />
                                    <span>Código PIX Copiado!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-4 w-4" />
                                    <span>Copiar Código PIX (Copia e Cola)</span>
                                  </>
                                )}
                              </button>
                              <p className="text-[10px] font-mono text-muted">
                                Expira em 15 minutos · Mercado Pago API
                              </p>
                            </div>
                          </div>
                        ) : (
                          /* Credit Card Details */
                          <div className="rounded-xl border border-line bg-surface p-4 space-y-3 text-xs">
                            <div className="flex justify-between items-center pb-2 border-b border-line">
                              <span className="text-muted">Valor no Cartão:</span>
                              <span className="font-display font-black text-xl text-text">
                                R$ {pricing.totalPrice},00
                              </span>
                            </div>

                            <div className="space-y-2">
                              <label className="text-muted block font-mono text-[11px]">Parcelamento Sem Juros:</label>
                              <select className="w-full rounded-lg border border-line bg-surface-2 p-2.5 text-text font-mono text-xs focus:border-primary focus:outline-none">
                                <option value="1">1x de R$ {pricing.totalPrice},00 à vista (sem juros)</option>
                                <option value="2">2x de R$ {(pricing.totalPrice / 2).toFixed(2)} (sem juros)</option>
                                <option value="3">3x de R$ {(pricing.totalPrice / 3).toFixed(2)} (sem juros)</option>
                                <option value="6">6x de R$ {((pricing.totalPrice * 1.05) / 6).toFixed(2)}</option>
                                <option value="12">12x de R$ {((pricing.totalPrice * 1.1) / 12).toFixed(2)}</option>
                              </select>
                            </div>

                            <div className="rounded-lg bg-surface-2 p-3 text-[11px] text-muted space-y-1">
                              <div className="flex items-center gap-1.5 font-bold text-text">
                                <Lock className="h-3.5 w-3.5 text-primary-text" />
                                <span>Ambiente Seguro Criptografado</span>
                              </div>
                              <p>
                                O link do gateway para inserção do cartão será aberto com segurança após clicar em finalizar pedido.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Drawer Footer Actions */}
              {!orderCompleted && (
                <div className="p-5 sm:p-6 border-t border-line bg-surface flex items-center justify-between gap-3">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={() => setStep((s) => (s - 1) as 1 | 2)}
                      className="px-4 py-3 rounded-xl border border-line hover:bg-surface-2 text-xs font-bold uppercase tracking-wider text-muted hover:text-text flex items-center gap-1.5 transition-colors"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Voltar</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  {step === 1 && (
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 py-3.5 px-5 rounded-xl bg-primary text-primary-foreground font-display font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-primary/20 hover:brightness-110 enabled:active:scale-[0.96] transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-out flex items-center justify-center gap-2 pl-6 pr-5"
                    >
                      <span>Avançar para Identificação</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}

                  {step === 2 && (
                    <button
                      type="button"
                      onClick={handleProceedToPayment}
                      className="flex-1 py-3.5 px-5 rounded-xl bg-primary text-primary-foreground font-display font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-primary/20 hover:brightness-110 enabled:active:scale-[0.96] transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-out flex items-center justify-center gap-2 pl-6 pr-5"
                    >
                      <span>Avançar para Pagamento</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}

                  {step === 3 && (
                    <button
                      type="button"
                      onClick={handleFinalizeOrder}
                      disabled={isFinalizing}
                      className="flex-1 py-3.5 px-5 rounded-xl bg-primary text-primary-foreground font-display font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-primary/20 hover:brightness-110 enabled:active:scale-[0.96] transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-out flex items-center justify-center gap-2 pl-6 pr-5"
                    >
                      {isFinalizing ? (
                        <>
                          <span className="animate-spin h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent" />
                          <span>Finalizando...</span>
                        </>
                      ) : (
                        <>
                          <span>Finalizar & Iniciar Boost</span>
                          <Check className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
