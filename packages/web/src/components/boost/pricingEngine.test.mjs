import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  calculatePremierPrice,
  calculateCompetitivePrice,
  calculateCoachingPrice,
  calculateEstimatedHours,
  calculateFullPricing,
  COACHING_HOURLY_RATE,
} from "./pricingEngine.ts";

describe("CS2 Booster Pricing Engine", () => {
  describe("Premier Piecewise Tiered Pricing", () => {
    it("should calculate Bracket 1 (1k to 10k) rates: Solo R$ 22 / Duo R$ 30 per 1,000 pts", () => {
      // 1000 to 5000 = 4k points
      const solo4k = calculatePremierPrice(1000, 5000, "solo");
      const duo4k = calculatePremierPrice(1000, 5000, "duo");
      assert.equal(solo4k, 4 * 22); // 88
      assert.equal(duo4k, 4 * 30); // 120

      // Full Bracket 1: 1000 to 10000 = 9k points
      const solo9k = calculatePremierPrice(1000, 10000, "solo");
      const duo9k = calculatePremierPrice(1000, 10000, "duo");
      assert.equal(solo9k, 9 * 22); // 198
      assert.equal(duo9k, 9 * 30); // 270
    });

    it("should calculate Bracket 2 (10k to 15k) rates: Solo R$ 32 / Duo R$ 44 per 1,000 pts", () => {
      const solo = calculatePremierPrice(10000, 15000, "solo");
      const duo = calculatePremierPrice(10000, 15000, "duo");
      assert.equal(solo, 5 * 32); // 160
      assert.equal(duo, 5 * 44); // 220
    });

    it("should calculate Bracket 3 (15k to 20k) rates: Solo R$ 48 / Duo R$ 64 per 1,000 pts", () => {
      const solo = calculatePremierPrice(15000, 20000, "solo");
      const duo = calculatePremierPrice(15000, 20000, "duo");
      assert.equal(solo, 5 * 48); // 240
      assert.equal(duo, 5 * 64); // 320
    });

    it("should calculate Bracket 4 (20k to 25k) rates: Solo R$ 75 / Duo R$ 98 per 1,000 pts", () => {
      const solo = calculatePremierPrice(20000, 25000, "solo");
      const duo = calculatePremierPrice(20000, 25000, "duo");
      assert.equal(solo, 5 * 75); // 375
      assert.equal(duo, 5 * 98); // 490
    });

    it("should calculate Bracket 5 (25k to 30k) rates: Solo R$ 120 / Duo R$ 160 per 1,000 pts", () => {
      const solo = calculatePremierPrice(25000, 30000, "solo");
      const duo = calculatePremierPrice(25000, 30000, "duo");
      assert.equal(solo, 5 * 120); // 600
      assert.equal(duo, 5 * 160); // 800
    });

    it("should calculate multi-bracket transitions accurately (8,500 to 16,000)", () => {
      // 8500 to 10000: 1500 pts @ 22 = 33
      // 10000 to 15000: 5000 pts @ 32 = 160
      // 15000 to 16000: 1000 pts @ 48 = 48
      // Total solo = 33 + 160 + 48 = 241
      const solo = calculatePremierPrice(8500, 16000, "solo");
      assert.equal(solo, 241);

      // Duo:
      // 8500 to 10000: 1500 pts @ 30 = 45
      // 10000 to 15000: 5000 pts @ 44 = 220
      // 15000 to 16000: 1000 pts @ 64 = 64
      // Total duo = 45 + 220 + 64 = 329
      const duo = calculatePremierPrice(8500, 16000, "duo");
      assert.equal(duo, 329);
    });

    it("should return 0 when target <= current rating", () => {
      assert.equal(calculatePremierPrice(15000, 15000, "solo"), 0);
      assert.equal(calculatePremierPrice(16000, 12000, "duo"), 0);
    });

    it("should apply floor minimum of R$ 35 on small point increments", () => {
      const price = calculatePremierPrice(1000, 1500, "solo");
      // 0.5 * 22 = 11 -> floored at 35
      assert.equal(price, 35);
    });

    it("should sanitize NaN inputs defensively", () => {
      assert.equal(calculatePremierPrice(NaN, NaN, "solo"), 0);
      assert.equal(calculateCoachingPrice(NaN), 45);
    });

    it("should return 0 estimated hours when target <= current rating", () => {
      assert.equal(calculateEstimatedHours("premier", 15000, 15000, false), 0);
      assert.equal(calculateEstimatedHours("competitive", 10, 10, false), 0);
    });

    it("should enforce R$ 35 floor on standalone add-ons when basePrice is 0", () => {
      const result = calculateFullPricing({
        serviceType: "premier",
        boostMode: "solo",
        currentRating: 5000,
        targetRating: 5000,
        addOns: {
          streamMatch: false,
          expressDelivery: false,
          offlineMode: false,
          specificRoles: true, // R$ 20
          antiDerank: false,
        },
      });
      assert.equal(result.basePrice, 0);
      assert.equal(result.addOnsCost, 20);
      assert.equal(result.totalPrice, 35); // Floored to R$ 35
      assert.equal(result.pixTotalPrice, 33); // 35 - 2 (5%)
    });
  });

  describe("Competitive Ranks Pricing", () => {
    it("should calculate step price from Prata I (1) to Prata IV (4)", () => {
      // Step 1->2: 16, Step 2->3: 16, Step 3->4: 16 -> Total Solo = 48
      const solo = calculateCompetitivePrice(1, 4, "solo");
      assert.equal(solo, 48);

      // Duo: 24 + 24 + 24 = 72
      const duo = calculateCompetitivePrice(1, 4, "duo");
      assert.equal(duo, 72);
    });

    it("should return 0 when target rank <= current rank", () => {
      assert.equal(calculateCompetitivePrice(10, 10, "solo"), 0);
      assert.equal(calculateCompetitivePrice(15, 8, "duo"), 0);
    });
  });

  describe("Coaching Pricing", () => {
    it("should charge exactly R$ 45 per hour", () => {
      assert.equal(COACHING_HOURLY_RATE, 45);
      assert.equal(calculateCoachingPrice(1), 45);
      assert.equal(calculateCoachingPrice(4), 180);
      assert.equal(calculateCoachingPrice(10), 450);
    });
  });

  describe("Master calculateFullPricing Orchestrator & Add-Ons", () => {
    it("should compute base price, add-ons, and 5% PIX discount correctly", () => {
      const result = calculateFullPricing({
        serviceType: "premier",
        boostMode: "solo",
        currentRating: 8500,
        targetRating: 16000,
        addOns: {
          streamMatch: true, // +25
          expressDelivery: true, // +25% of 241 = 60
          offlineMode: true, // +0
          specificRoles: true, // +20
          antiDerank: true, // +35
        },
      });

      assert.equal(result.basePrice, 241);
      // addOns: 25 + 60 + 0 + 20 + 35 = 140
      assert.equal(result.addOnsCost, 140);
      assert.equal(result.totalPrice, 381);

      // PIX discount: 5% of 381 = 19
      assert.equal(result.pixDiscountAmount, Math.round(381 * 0.05));
      assert.equal(result.pixTotalPrice, 381 - result.pixDiscountAmount);

      // Breakdown verification
      assert.ok(result.breakdown.length >= 5);
      assert.ok(result.estimatedHours >= 3);
    });
  });
});
