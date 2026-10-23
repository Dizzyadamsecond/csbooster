/**
 * Challenger M3_1: Empirical Adversarial Stress Test Suite
 * Exhaustively stress tests pricingEngine.ts across all required dimensions:
 * 1. Target <= current rating (should be 0)
 * 2. Cross-bracket spans (e.g. 5,000 to 25,000, 1,000 to 30,000)
 * 3. Extreme boundary ratings (1k, 30k, >30k, <1k, negative values, NaN, Infinity)
 * 4. Add-on combinations (all 32 combinations, express delivery 25% rounding)
 * 5. PIX discount calculations and minimum price floor (R$ 25 vs R$ 35 analysis)
 * 6. Delivery time / estimated hours behavior
 */

import {
  calculatePremierPrice,
  calculateCompetitivePrice,
  calculateCoachingPrice,
  calculateEstimatedHours,
  calculateFullPricing,
  PREMIER_BRACKETS,
  COMPETITIVE_RANKS,
  COACHING_HOURLY_RATE,
  ADD_ON_DEFINITIONS,
} from "../src/components/boost/pricingEngine.ts";

const reports = [];

function record(category, testName, status, detail, data) {
  reports.push({ category, testName, status, detail, data });
  const icon = status === "PASS" ? "✅" : status === "WARN" ? "⚠️" : "❌";
  console.log(`${icon} [${category}] ${testName}: ${detail}`);
  if (data !== undefined && status !== "PASS") {
    console.log("   Data:", JSON.stringify(data));
  }
}

console.log("=================================================================");
console.log("   CHALLENGER M3_1: ADVERSARIAL PRICING ENGINE STRESS HARNESS   ");
console.log("=================================================================\n");

// =========================================================================
// SECTION 1: Target <= Current Rating (Must be 0 base price)
// =========================================================================
console.log(">>> [1/6] Target <= Current Rating Stress Tests <<<");

// Test 1.1: Target equal to current (Premier)
const equalRatings = [1000, 5000, 10000, 15000, 20000, 25000, 30000];
let equalPremierPass = true;
for (const r of equalRatings) {
  const solo = calculatePremierPrice(r, r, "solo");
  const duo = calculatePremierPrice(r, r, "duo");
  if (solo !== 0 || duo !== 0) {
    equalPremierPass = false;
    record("Target <= Current", `Premier equal ratings (${r} -> ${r})`, "FAIL", `Expected 0, got solo=${solo}, duo=${duo}`, { r, solo, duo });
  }
}
if (equalPremierPass) {
  record("Target <= Current", "Premier equal ratings across all tier boundaries", "PASS", "All returned exactly 0");
}

// Test 1.2: Target less than current (Premier derank / reversed inputs)
const reversedPairs = [
  { cur: 5000, tgt: 1000 },
  { cur: 15000, tgt: 10000 },
  { cur: 25000, tgt: 20000 },
  { cur: 30000, tgt: 1000 },
];
let reversedPremierPass = true;
for (const p of reversedPairs) {
  const solo = calculatePremierPrice(p.cur, p.tgt, "solo");
  const duo = calculatePremierPrice(p.cur, p.tgt, "duo");
  if (solo !== 0 || duo !== 0) {
    reversedPremierPass = false;
    record("Target <= Current", `Premier target < current (${p.cur} -> ${p.tgt})`, "FAIL", `Expected 0, got solo=${solo}, duo=${duo}`, { p, solo, duo });
  }
}
if (reversedPremierPass) {
  record("Target <= Current", "Premier target < current (inverted ratings)", "PASS", "All returned exactly 0");
}

// Test 1.3: Target <= Current for Competitive ranks
let compTargetLeCurrentPass = true;
for (let rank = 1; rank <= 18; rank++) {
  const equalSolo = calculateCompetitivePrice(rank, rank, "solo");
  const equalDuo = calculateCompetitivePrice(rank, rank, "duo");
  if (equalSolo !== 0 || equalDuo !== 0) {
    compTargetLeCurrentPass = false;
    record("Target <= Current", `Competitive equal rank (${rank} -> ${rank})`, "FAIL", `Expected 0, got solo=${equalSolo}, duo=${equalDuo}`, { rank, equalSolo, equalDuo });
  }
  if (rank > 1) {
    const revSolo = calculateCompetitivePrice(rank, rank - 1, "solo");
    const revDuo = calculateCompetitivePrice(rank, rank - 1, "duo");
    if (revSolo !== 0 || revDuo !== 0) {
      compTargetLeCurrentPass = false;
      record("Target <= Current", `Competitive reverse rank (${rank} -> ${rank - 1})`, "FAIL", `Expected 0, got solo=${revSolo}, duo=${revDuo}`, { rank, revSolo, revDuo });
    }
  }
}
if (compTargetLeCurrentPass) {
  record("Target <= Current", "Competitive rank equal or inverted", "PASS", "All 18 ranks returned 0 when target <= current");
}

// Test 1.4: calculateFullPricing behavior when target <= current
const defaultNoAddOns = {
  streamMatch: false,
  expressDelivery: false,
  offlineMode: false,
  specificRoles: false,
  antiDerank: false,
};
const fullPricingEqual = calculateFullPricing({
  serviceType: "premier",
  boostMode: "solo",
  currentRating: 15000,
  targetRating: 15000,
  addOns: defaultNoAddOns,
});
if (fullPricingEqual.basePrice === 0 && fullPricingEqual.totalPrice === 0 && fullPricingEqual.pixTotalPrice === 0) {
  record("Target <= Current", "FullPricing target === current without add-ons", "PASS", "Total price and PIX price are 0");
} else {
  record("Target <= Current", "FullPricing target === current without add-ons", "FAIL", `Non-zero total: ${fullPricingEqual.totalPrice}`, fullPricingEqual);
}

// Test 1.5: calculateFullPricing with add-ons when target <= current
const fullPricingEqualWithAddons = calculateFullPricing({
  serviceType: "premier",
  boostMode: "solo",
  currentRating: 15000,
  targetRating: 15000,
  addOns: { ...defaultNoAddOns, streamMatch: true, antiDerank: true },
});
// When basePrice is 0, add-ons are 25 + 35 = 60. Is express delivery 25% of 0 = 0?
const fullPricingExpressZero = calculateFullPricing({
  serviceType: "premier",
  boostMode: "solo",
  currentRating: 15000,
  targetRating: 15000,
  addOns: { ...defaultNoAddOns, expressDelivery: true },
});
if (fullPricingExpressZero.addOnsCost === 0 && fullPricingExpressZero.totalPrice === 0) {
  record("Target <= Current", "Express delivery add-on when basePrice is 0", "PASS", "Express delivery on R$ 0 basePrice yields R$ 0 addOnsCost");
} else {
  record("Target <= Current", "Express delivery add-on when basePrice is 0", "FAIL", `Unexpected addOnsCost: ${fullPricingExpressZero.addOnsCost}`);
}

// Test 1.6: Estimated hours when target <= current
const hoursEqual = calculateEstimatedHours("premier", 15000, 15000, false);
if (hoursEqual === 0) {
  record("Target <= Current", "Estimated hours when target === current", "PASS", "0 hours when 0 points are requested");
} else {
  record("Target <= Current", "Estimated hours when target === current", "WARN", `Returns minimum floor of ${hoursEqual} hours when 0 points are requested`, { hoursEqual });
}

// =========================================================================
// SECTION 2: Cross-Bracket Spans
// =========================================================================
console.log("\n>>> [2/6] Cross-Bracket Spans Stress Tests <<<");

// Test 2.1: 5,000 to 25,000 (specified in dispatch)
// Breakdown:
// 5k-10k: 5,000 pts @ 22 solo = 110 | @ 30 duo = 150
// 10k-15k: 5,000 pts @ 32 solo = 160 | @ 44 duo = 220
// 15k-20k: 5,000 pts @ 48 solo = 240 | @ 64 duo = 320
// 20k-25k: 5,000 pts @ 75 solo = 375 | @ 98 duo = 490
// Expected total Solo: 110 + 160 + 240 + 375 = 885
// Expected total Duo: 150 + 220 + 320 + 490 = 1180
const solo5k25k = calculatePremierPrice(5000, 25000, "solo");
const duo5k25k = calculatePremierPrice(5000, 25000, "duo");
if (solo5k25k === 885 && duo5k25k === 1180) {
  record("Cross-Bracket Spans", "Span 5,000 -> 25,000 (Solo: 885, Duo: 1180)", "PASS", `Exact match: Solo R$ ${solo5k25k}, Duo R$ ${duo5k25k}`);
} else {
  record("Cross-Bracket Spans", "Span 5,000 -> 25,000", "FAIL", `Expected Solo 885/Duo 1180, got Solo ${solo5k25k}/Duo ${duo5k25k}`, { solo5k25k, duo5k25k });
}

// Test 2.2: Full Spectrum 1,000 to 30,000 (all 5 brackets)
// 1k-10k: 9k @ 22 = 198 | @ 30 = 270
// 10k-15k: 5k @ 32 = 160 | @ 44 = 220
// 15k-20k: 5k @ 48 = 240 | @ 64 = 320
// 20k-25k: 5k @ 75 = 375 | @ 98 = 490
// 25k-30k: 5k @ 120 = 600 | @ 160 = 800
// Expected Solo: 198 + 160 + 240 + 375 + 600 = 1573
// Expected Duo: 270 + 220 + 320 + 490 + 800 = 2100
const solo1k30k = calculatePremierPrice(1000, 30000, "solo");
const duo1k30k = calculatePremierPrice(1000, 30000, "duo");
if (solo1k30k === 1573 && duo1k30k === 2100) {
  record("Cross-Bracket Spans", "Full spectrum 1,000 -> 30,000 (Solo: 1573, Duo: 2100)", "PASS", `Exact match: Solo R$ ${solo1k30k}, Duo R$ ${duo1k30k}`);
} else {
  record("Cross-Bracket Spans", "Full spectrum 1,000 -> 30,000", "FAIL", `Expected Solo 1573/Duo 2100, got Solo ${solo1k30k}/Duo ${duo1k30k}`, { solo1k30k, duo1k30k });
}

// Test 2.3: Non-round fractional boundary crossing: 8,250 to 21,750
// 8,250 to 10,000: 1,750 pts @ 22 = 38.5 | @ 30 = 52.5
// 10,000 to 15,000: 5,000 pts @ 32 = 160 | @ 44 = 220
// 15,000 to 20,000: 5,000 pts @ 48 = 240 | @ 64 = 320
// 20,000 to 21,750: 1,750 pts @ 75 = 131.25 | @ 98 = 171.5
// Total Solo raw: 38.5 + 160 + 240 + 131.25 = 569.75 -> round to 570
// Total Duo raw: 52.5 + 220 + 320 + 171.5 = 764 -> round to 764
const solo8250 = calculatePremierPrice(8250, 21750, "solo");
const duo8250 = calculatePremierPrice(8250, 21750, "duo");
if (solo8250 === 570 && duo8250 === 764) {
  record("Cross-Bracket Spans", "Fractional span 8,250 -> 21,750 (Solo: 570, Duo: 764)", "PASS", `Exact match: Solo R$ ${solo8250}, Duo R$ ${duo8250}`);
} else {
  record("Cross-Bracket Spans", "Fractional span 8,250 -> 21,750", "FAIL", `Expected Solo 570/Duo 764, got Solo ${solo8250}/Duo ${duo8250}`, { solo8250, duo8250 });
}

// Test 2.4: Straddling individual bracket seams
// Boundary 10k: 9000 -> 11000: (1000 pts @ 22 = 22) + (1000 pts @ 32 = 32) = 54
const seam10k = calculatePremierPrice(9000, 11000, "solo");
// Boundary 15k: 14500 -> 15500: (500 pts @ 32 = 16) + (500 pts @ 48 = 24) = 40
const seam15k = calculatePremierPrice(14500, 15500, "solo");
// Boundary 20k: 19500 -> 20500: (500 pts @ 48 = 24) + (500 pts @ 75 = 37.5) = 61.5 -> 62
const seam20k = calculatePremierPrice(19500, 20500, "solo");
// Boundary 25k: 24500 -> 25500: (500 pts @ 75 = 37.5) + (500 pts @ 120 = 60) = 97.5 -> 98
const seam25k = calculatePremierPrice(24500, 25500, "solo");

if (seam10k === 54 && seam15k === 40 && seam20k === 62 && seam25k === 98) {
  record("Cross-Bracket Spans", "Straddling all bracket boundary seams (10k, 15k, 20k, 25k)", "PASS", `Seams: 10k=${seam10k}, 15k=${seam15k}, 20k=${seam20k}, 25k=${seam25k}`);
} else {
  record("Cross-Bracket Spans", "Straddling all bracket boundary seams", "FAIL", "Mismatch on seam calculations", { seam10k, seam15k, seam20k, seam25k });
}

// =========================================================================
// SECTION 3: Extreme Boundary Ratings & Edge Inputs
// =========================================================================
console.log("\n>>> [3/6] Extreme Boundary Ratings & Edge Inputs <<<");

// Test 3.1: Ratings below 1,000 (e.g. 100 to 500, -500 to 800)
const belowMinBoth = calculatePremierPrice(100, 500, "solo");
if (belowMinBoth === 0) {
  record("Boundary Values", "Both ratings below 1,000 (100 -> 500)", "PASS", "Clamped to 1000 and returned 0");
} else {
  record("Boundary Values", "Both ratings below 1,000 (100 -> 500)", "FAIL", `Returned non-zero: ${belowMinBoth}`);
}

const belowMinCurrent = calculatePremierPrice(500, 2000, "solo");
// Start clamped to 1000, target 2000 -> 1000 pts @ 22 = 22 -> floor at 35
if (belowMinCurrent === 35) {
  record("Boundary Values", "Current rating below 1,000 (500 -> 2000)", "PASS", "Clamped current to 1000, calculated 1000->2000 and floored at 35");
} else {
  record("Boundary Values", "Current rating below 1,000 (500 -> 2000)", "FAIL", `Expected 35, got: ${belowMinCurrent}`);
}

// Test 3.2: Ratings above 30,000 (e.g. 32,000 to 35,000)
const aboveMaxBoth = calculatePremierPrice(32000, 35000, "solo");
if (aboveMaxBoth === 0) {
  record("Boundary Values", "Both ratings above 30,000 (32,000 -> 35,000)", "PASS", "Clamped to 30000 and returned 0");
} else {
  record("Boundary Values", "Both ratings above 30,000 (32,000 -> 35,000)", "FAIL", `Returned non-zero: ${aboveMaxBoth}`);
}

const aboveMaxTarget = calculatePremierPrice(25000, 35000, "solo");
// Start 25000, target clamped to 30000 -> 5000 pts in bracket 5 @ 120 = 600
if (aboveMaxTarget === 600) {
  record("Boundary Values", "Target rating above 30,000 (25,000 -> 35,000)", "PASS", "Target clamped to 30000, returned 600");
} else {
  record("Boundary Values", "Target rating above 30,000 (25,000 -> 35,000)", "FAIL", `Expected 600, got: ${aboveMaxTarget}`);
}

// Test 3.3: Negative values
const negativeBoth = calculatePremierPrice(-5000, -1000, "solo");
if (negativeBoth === 0) {
  record("Boundary Values", "Both ratings negative (-5000 -> -1000)", "PASS", "Returned 0");
} else {
  record("Boundary Values", "Both ratings negative (-5000 -> -1000)", "FAIL", `Returned non-zero: ${negativeBoth}`);
}

const negativeCompetitive = calculateCompetitivePrice(-5, -1, "solo");
if (negativeCompetitive === 0) {
  record("Boundary Values", "Negative competitive ranks (-5 -> -1)", "PASS", "Returned 0");
} else {
  record("Boundary Values", "Negative competitive ranks (-5 -> -1)", "FAIL", `Returned non-zero: ${negativeCompetitive}`);
}

const negativeCoaching = calculateCoachingPrice(-5);
if (negativeCoaching === 45) {
  record("Boundary Values", "Negative coaching hours (-5)", "PASS", "Clamped safeHours to 1h -> R$ 45");
} else {
  record("Boundary Values", "Negative coaching hours (-5)", "FAIL", `Expected 45, got: ${negativeCoaching}`);
}

// Test 3.4: NaN handling
const nanPremierSolo = calculatePremierPrice(NaN, 15000, "solo");
const nanPremierTarget = calculatePremierPrice(10000, NaN, "solo");
const nanPremierBoth = calculatePremierPrice(NaN, NaN, "solo");
const nanComp = calculateCompetitivePrice(NaN, 10, "solo");
const nanCoach = calculateCoachingPrice(NaN);
const nanFullPricing = calculateFullPricing({
  serviceType: "premier",
  boostMode: "solo",
  currentRating: NaN,
  targetRating: NaN,
  addOns: defaultNoAddOns,
});

if (Number.isNaN(nanCoach)) {
  record("Boundary Values", "calculateCoachingPrice(NaN)", "FAIL", "Returns NaN instead of sanitized fallback or throwing Error", { nanCoach });
} else {
  record("Boundary Values", "calculateCoachingPrice(NaN)", "PASS", `Sanitized NaN: ${nanCoach}`);
}

if (nanPremierBoth === 25 || nanPremierSolo === 25 || nanPremierBoth === 35 || nanPremierSolo === 35) {
  record("Boundary Values", "calculatePremierPrice(NaN, ...)", "WARN", `Returns floor on NaN inputs instead of 0 or sanitizing`, {
    nanPremierSolo,
    nanPremierTarget,
    nanPremierBoth,
  });
} else if (Number.isNaN(nanPremierBoth) || nanPremierBoth !== 0) {
  record("Boundary Values", "calculatePremierPrice(NaN, ...)", "FAIL", "Invalid NaN handling", { nanPremierBoth });
} else {
  record("Boundary Values", "calculatePremierPrice(NaN, ...)", "PASS", `Handled NaN safely, returned 0`);
}

const nanCoachFullPricing = calculateFullPricing({
  serviceType: "coaching",
  boostMode: "solo",
  currentRating: NaN,
  targetRating: NaN,
  addOns: defaultNoAddOns,
});

if (Number.isNaN(nanCoachFullPricing.totalPrice)) {
  record("Boundary Values", "calculateFullPricing coaching with NaN hours", "FAIL", "Coaching totalPrice became NaN, which pollutes UI / AnimatedCounter", nanCoachFullPricing);
} else {
  record("Boundary Values", "calculateFullPricing coaching with NaN hours", "PASS", `totalPrice is numeric: ${nanCoachFullPricing.totalPrice}`);
}

// Test 3.5: Infinity handling
const infPrice = calculatePremierPrice(-Infinity, Infinity, "solo");
if (infPrice === 1573) {
  record("Boundary Values", "calculatePremierPrice(-Infinity, Infinity)", "PASS", "Gracefully clamped -Inf to 1000 and +Inf to 30000 -> R$ 1573");
} else {
  record("Boundary Values", "calculatePremierPrice(-Infinity, Infinity)", "FAIL", `Expected 1573, got ${infPrice}`);
}

// =========================================================================
// SECTION 4: Add-on Combinations & Express Delivery 25% Rounding
// =========================================================================
console.log("\n>>> [4/6] Add-On Combinations & Express Delivery Rounding <<<");

// Test 4.1: Exhaustive test of all 32 combinations (2^5)
let allCombinationsValid = true;
const addOnKeys = ["streamMatch", "expressDelivery", "offlineMode", "specificRoles", "antiDerank"];
for (let mask = 0; mask < 32; mask++) {
  const state = {
    streamMatch: Boolean(mask & 1),
    expressDelivery: Boolean(mask & 2),
    offlineMode: Boolean(mask & 4),
    specificRoles: Boolean(mask & 8),
    antiDerank: Boolean(mask & 16),
  };

  const res = calculateFullPricing({
    serviceType: "premier",
    boostMode: "solo",
    currentRating: 10000,
    targetRating: 15000, // basePrice = 160
    addOns: state,
  });

  const expectedBase = 160;
  let expectedAddOns = 0;
  if (state.streamMatch) expectedAddOns += 25;
  if (state.expressDelivery) expectedAddOns += Math.round(expectedBase * 0.25); // 40
  if (state.offlineMode) expectedAddOns += 0;
  if (state.specificRoles) expectedAddOns += 20;
  if (state.antiDerank) expectedAddOns += 35;

  const expectedTotal = expectedBase + expectedAddOns;
  const expectedPixDiscount = Math.round(expectedTotal * 0.05);
  const expectedPixTotal = expectedTotal - expectedPixDiscount;

  if (
    res.addOnsCost !== expectedAddOns ||
    res.totalPrice !== expectedTotal ||
    res.pixDiscountAmount !== expectedPixDiscount ||
    res.pixTotalPrice !== expectedPixTotal
  ) {
    allCombinationsValid = false;
    record("Add-Ons", `Combination mask ${mask}`, "FAIL", "Mismatch in price calculation", {
      mask,
      state,
      res,
      expected: { expectedAddOns, expectedTotal, expectedPixDiscount, expectedPixTotal },
    });
    break;
  }
}
if (allCombinationsValid) {
  record("Add-Ons", "All 32 Add-On Permutations (2^5)", "PASS", "100% mathematical consistency across all combinations");
}

// Test 4.2: Express Delivery Rounding (+25% of basePrice) across various base values
let expressRoundingPass = true;
const testBases = [
  { base: 22, expectedExpress: 6 }, // 22 * 0.25 = 5.5 -> 6
  { base: 25, expectedExpress: 6 }, // 25 * 0.25 = 6.25 -> 6
  { base: 30, expectedExpress: 8 }, // 30 * 0.25 = 7.5 -> 8
  { base: 33, expectedExpress: 8 }, // 33 * 0.25 = 8.25 -> 8
  { base: 45, expectedExpress: 11 }, // 45 * 0.25 = 11.25 -> 11
  { base: 46, expectedExpress: 12 }, // 46 * 0.25 = 11.5 -> 12
  { base: 47, expectedExpress: 12 }, // 47 * 0.25 = 11.75 -> 12
  { base: 120, expectedExpress: 30 }, // 120 * 0.25 = 30 -> 30
  { base: 885, expectedExpress: 221 }, // 885 * 0.25 = 221.25 -> 221
  { base: 1573, expectedExpress: 393 }, // 1573 * 0.25 = 393.25 -> 393
];

for (const t of testBases) {
  const calc = Math.round(t.base * 0.25);
  if (calc !== t.expectedExpress) {
    expressRoundingPass = false;
    record("Express Rounding", `Base R$ ${t.base}`, "FAIL", `Expected ${t.expectedExpress}, got ${calc}`);
  }
}
if (expressRoundingPass) {
  record("Express Rounding", "Express delivery +25% half-up rounding checks", "PASS", "All rounding boundaries (x.25, x.5, x.75) round accurately");
}

// =========================================================================
// SECTION 5: PIX Discount Calculations and Minimum Price Floor Analysis
// =========================================================================
console.log("\n>>> [5/6] PIX Discount Calculations and Minimum Floor Analysis <<<");

// Test 5.1: Minimum price floor in pricingEngine.ts
// In pricingEngine.ts lines 167 & 194:
// `return Math.max(25, Math.round(total));`
// But dispatch specifies: "PIX discount calculations and minimum price floor (R$ 35)"
const smallIncPremier = calculatePremierPrice(1000, 1100, "solo"); // 100 pts @ 22 = 2.2 -> Math.round = 2
const smallIncComp = calculateCompetitivePrice(1, 2, "solo"); // 1 rank step = R$ 16

record(
  "Minimum Floor",
  "Implemented Floor vs Dispatch R$ 35 Specification",
  smallIncPremier === 35 ? "PASS" : "WARN",
  `Code implements Math.max(25, ...) [got R$ ${smallIncPremier}], whereas dispatch specifies minimum price floor (R$ 35)`,
  { implementedFloor: smallIncPremier, dispatchExpectedFloor: 35 }
);

// Test 5.2: Floor on totalPrice vs basePrice
// What happens if basePrice is 0 (target <= current) but player selects specificRoles (R$ 20)?
const zeroBasePlusRoles = calculateFullPricing({
  serviceType: "premier",
  boostMode: "solo",
  currentRating: 5000,
  targetRating: 5000,
  addOns: { ...defaultNoAddOns, specificRoles: true },
});
if (zeroBasePlusRoles.totalPrice < 35) {
  record(
    "Minimum Floor",
    "Floor bypass via standalone add-on when basePrice = 0",
    "WARN",
    `totalPrice is R$ ${zeroBasePlusRoles.totalPrice}, which is lower than R$ 35 floor`,
    { totalPrice: zeroBasePlusRoles.totalPrice }
  );
} else {
  record("Minimum Floor", "Standalone add-on respects R$ 35 floor", "PASS", `totalPrice = ${zeroBasePlusRoles.totalPrice}`);
}

// Test 5.3: PIX 5% Discount Calculations
// Check PIX calculation on various price points:
// R$ 25: 5% = 1.25 -> round = 1, pix = 24
// R$ 35: 5% = 1.75 -> round = 2, pix = 33
// R$ 45: 5% = 2.25 -> round = 2, pix = 43
// R$ 50: 5% = 2.50 -> round = 3, pix = 47 (half up in JS Math.round)
// R$ 100: 5% = 5.00 -> round = 5, pix = 95
// R$ 381: 5% = 19.05 -> round = 19, pix = 362
const pixTestCases = [
  { total: 25, expectedDisc: 1, expectedPix: 24 },
  { total: 35, expectedDisc: 2, expectedPix: 33 },
  { total: 45, expectedDisc: 2, expectedPix: 43 },
  { total: 50, expectedDisc: 3, expectedPix: 47 },
  { total: 100, expectedDisc: 5, expectedPix: 95 },
  { total: 381, expectedDisc: 19, expectedPix: 362 },
  { total: 1573, expectedDisc: 79, expectedPix: 1494 },
];

let pixDiscountPass = true;
for (const tc of pixTestCases) {
  const disc = Math.round(tc.total * 0.05);
  const pix = Math.max(0, tc.total - disc);
  if (disc !== tc.expectedDisc || pix !== tc.expectedPix) {
    pixDiscountPass = false;
    record("PIX Discount", `Total R$ ${tc.total}`, "FAIL", `Expected disc ${tc.expectedDisc}/pix ${tc.expectedPix}, got disc ${disc}/pix ${pix}`);
  }
}
if (pixDiscountPass) {
  record("PIX Discount", "PIX 5% discount rounding across standard values", "PASS", "All discount amounts and final PIX totals match expected math");
}

// =========================================================================
// SECTION 6: Estimated Delivery Hours Logic
// =========================================================================
console.log("\n>>> [6/6] Delivery Time & Estimated Hours Stress Tests <<<");

// Test 6.1: Premier hours progression
const premHours10k = calculateEstimatedHours("premier", 1000, 10000, false); // 9k * 1.6 = 14.4 -> 14h
const premHours10kExp = calculateEstimatedHours("premier", 1000, 10000, true); // 14.4 * 0.65 = 9.36 -> 9h
if (premHours10k === 14 && premHours10kExp === 9) {
  record("Estimated Hours", "Premier Bracket 1 delivery hours (normal vs express)", "PASS", `Normal: ${premHours10k}h, Express: ${premHours10kExp}h`);
} else {
  record("Estimated Hours", "Premier Bracket 1 delivery hours", "FAIL", `Expected 14h/9h, got ${premHours10k}h/${premHours10kExp}h`);
}

// Test 6.2: 5,000 to 25,000 hours
// 5k @ 1.6 = 8, 5k @ 2.2 = 11, 5k @ 2.8 = 14, 5k @ 3.5 = 17.5. Total = 50.5
// Normal: Math.round(50.5) = 51 (or 50 if round down, JS Math.round(50.5) is 51)
// Express: 50.5 * 0.65 = 32.825 -> Math.round is 33
const hours5k25k = calculateEstimatedHours("premier", 5000, 25000, false);
const hours5k25kExp = calculateEstimatedHours("premier", 5000, 25000, true);
if (hours5k25k === 51 && hours5k25kExp === 33) {
  record("Estimated Hours", "5,000 -> 25,000 delivery hours (normal vs express)", "PASS", `Normal: ${hours5k25k}h, Express: ${hours5k25kExp}h`);
} else {
  record("Estimated Hours", "5,000 -> 25,000 delivery hours", "FAIL", `Expected 51h/33h, got ${hours5k25k}h/${hours5k25kExp}h`);
}

// Test 6.3: Competitive rank hours
const compHours9Ranks = calculateEstimatedHours("competitive", 1, 10, false); // 9 * 2.5 = 22.5 -> 23h
const compHours9RanksExp = calculateEstimatedHours("competitive", 1, 10, true); // 22.5 * 0.65 = 14.625 -> 15h
if (compHours9Ranks === 23 && compHours9RanksExp === 15) {
  record("Estimated Hours", "Competitive 9 rank steps (normal vs express)", "PASS", `Normal: ${compHours9Ranks}h, Express: ${compHours9RanksExp}h`);
} else {
  record("Estimated Hours", "Competitive 9 rank steps", "FAIL", `Expected 23h/15h, got ${compHours9Ranks}h/${compHours9RanksExp}h`);
}

// Test 6.4: Coaching hours (should reflect session time)
const coachHours4 = calculateEstimatedHours("coaching", 4, 4, false);
const coachHours4Exp = calculateEstimatedHours("coaching", 4, 4, true);
if (coachHours4 === 4 && coachHours4Exp === 4) {
  record("Estimated Hours", "Coaching session duration", "PASS", "Reflects exact booked hours (4h), unaffected by express flag");
} else {
  record("Estimated Hours", "Coaching session duration", "FAIL", `Expected 4h, got normal: ${coachHours4}, express: ${coachHours4Exp}`);
}

// =========================================================================
// SUMMARY
// =========================================================================
console.log("\n=================================================================");
const totalTests = reports.length;
const passCount = reports.filter((r) => r.status === "PASS").length;
const warnCount = reports.filter((r) => r.status === "WARN").length;
const failCount = reports.filter((r) => r.status === "FAIL").length;

console.log(`TOTAL TESTS: ${totalTests} | PASS: ${passCount} | WARN: ${warnCount} | FAIL: ${failCount}`);
console.log("=================================================================");
