"use client";

import React, { useState, useCallback } from "react";
import { cn } from "@/lib/cn";
import {
  ServiceType,
  BoostMode,
  AddOnState,
  calculateFullPricing,
  PricingResult,
} from "./pricingEngine";
import { ServiceSwitcher } from "./ServiceSwitcher";
import { BoostModeToggle } from "./BoostModeToggle";
import { RatingSliders } from "./RatingSliders";
import { AddOnsPanel } from "./AddOnsPanel";
import { PriceSummary } from "./PriceSummary";
import { CheckoutDrawer, OrderPayload } from "./CheckoutDrawer";

export interface BoostCalculatorProps {
  className?: string;
  onCheckoutComplete?: (order: OrderPayload) => void;
}

export function BoostCalculator({
  className,
  onCheckoutComplete,
}: BoostCalculatorProps) {
  const [serviceType, setServiceType] = useState<ServiceType>("premier");
  const [boostMode, setBoostMode] = useState<BoostMode>("duo");

  const [premierCurrent, setPremierCurrent] = useState<number>(8500);
  const [premierTarget, setPremierTarget] = useState<number>(16000);

  const [competitiveCurrent, setCompetitiveCurrent] = useState<number>(1);
  const [competitiveTarget, setCompetitiveTarget] = useState<number>(10);

  const [coachingHours, setCoachingHours] = useState<number>(4);

  const [addOns, setAddOns] = useState<AddOnState>({
    streamMatch: true,
    expressDelivery: false,
    offlineMode: true,
    specificRoles: false,
    antiDerank: false,
  });

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const currentRating =
    serviceType === "premier"
      ? premierCurrent
      : serviceType === "competitive"
      ? competitiveCurrent
      : coachingHours;

  const targetRating =
    serviceType === "premier"
      ? premierTarget
      : serviceType === "competitive"
      ? competitiveTarget
      : coachingHours;

  const handleCurrentChange = useCallback(
    (val: number) => {
      if (serviceType === "premier") {
        setPremierCurrent(val);
      } else if (serviceType === "competitive") {
        setCompetitiveCurrent(val);
      } else {
        setCoachingHours(val);
      }
    },
    [serviceType]
  );

  const handleTargetChange = useCallback(
    (val: number) => {
      if (serviceType === "premier") {
        setPremierTarget(val);
      } else if (serviceType === "competitive") {
        setCompetitiveTarget(val);
      } else {
        setCoachingHours(val);
      }
    },
    [serviceType]
  );

  const handleAddOnToggle = useCallback(
    (key: keyof AddOnState, value: boolean) => {
      setAddOns((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const pricing: PricingResult = calculateFullPricing({
    serviceType,
    boostMode,
    currentRating,
    targetRating,
    addOns,
  });

  const handleOrderCreated = useCallback(
    (order: OrderPayload) => {
      onCheckoutComplete?.(order);
    },
    [onCheckoutComplete]
  );

  return (
    <div className={cn("w-full max-w-6xl mx-auto py-2", className)}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <ServiceSwitcher value={serviceType} onChange={setServiceType} />

          {serviceType !== "coaching" && (
            <BoostModeToggle value={boostMode} onChange={setBoostMode} />
          )}

          <RatingSliders
            serviceType={serviceType}
            currentRating={currentRating}
            targetRating={targetRating}
            onCurrentChange={handleCurrentChange}
            onTargetChange={handleTargetChange}
          />

          <AddOnsPanel
            addOns={addOns}
            onChange={handleAddOnToggle}
            basePrice={pricing.basePrice}
          />
        </div>

        {/* Right Column: Sticky Summary (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <PriceSummary
            pricing={pricing}
            onCheckout={() => setIsCheckoutOpen(true)}
          />
        </div>
      </div>

      <CheckoutDrawer
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        pricing={pricing}
        onOrderCreated={handleOrderCreated}
      />
    </div>
  );
}
