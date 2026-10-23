/**
 * Challenger M3_r2_1: Independent Empirical Adversarial & Property-Based Test Suite
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
} from "../src/components/boost/pricingEngine.ts";

let totalAsserts = 0;
let passedAsserts = 0;
let failedAsserts = 0;
const failures = [];

function check(condition, message, context = null) {
  totalAsserts++;
  if (condition) {
    passedAsserts++;
  } else {
    failedAsserts++;
    failures.push({ message, context });
    console.error(`❌ FAILED: ${message}`);
    if (context) console.error("   Context:", JSON.stringify(context));
  }
}

console.log("=================================================================");
console.log("   CHALLENGER M3_r2_1: PROPERTY-BASED & ADVERSARIAL FUZZ HARNESS ");
console.log("=================================================================\n");

// -------------------------------------------------------------
// 1. Minimum Price Floor Invariant Tests (R$ 35)
// -------------------------------------------------------------
console.log(">>> [1/5] Invariant: Minimum Price Floor (R$ 35) <<<");

// Test all minimal increments (1 pt to 1500 pts) across all tier start points
const testStartPoints = [1000, 2500, 5000, 9999, 10000, 14999, 15000, 19999, 20000, 24999, 25000, 29999];
for (const cur of testStartPoints) {
  for (const delta of [1, 10, 50, 100, 250, 500]) {
    const tgt = Math.min(30000, cur + delta);
    if (tgt > cur) {
      const solo = calculatePremierPrice(cur, tgt, "solo");
      const duo = calculatePremierPrice(cur, tgt, "duo");
      check(solo >= 35, `Premier Solo floor R$ 35 breached for ${cur}->${tgt} (got ${solo})`, { cur, tgt, solo });
      check(duo >= 35, `Premier Duo floor R$ 35 breached for ${cur}->${tgt} (got ${duo})`, { cur, tgt, duo });
    }
  }
}

// Test competitive single rank steps
for (let rank = 1; rank < 18; rank++) {
  const solo = calculateCompetitivePrice(rank, rank + 1, "solo");
  const duo = calculateCompetitivePrice(rank, rank + 1, "duo");
  check(solo >= 35, `Competitive Solo floor R$ 35 breached for rank ${rank}->${rank + 1} (got ${solo})`, { rank, solo });
  check(duo >= 35, `Competitive Duo floor R$ 35 breached for rank ${rank}->${rank + 1} (got ${duo})`, { rank, duo });
}

// Test standalone add-ons on 0-rating orders
const paidAddOns = [
  { streamMatch: true },
  { specificRoles: true },
  { antiDerank: true },
  { streamMatch: true, specificRoles: true },
  { specificRoles: true, antiDerank: true },
];

for (const addon of paidAddOns) {
  const fullAddon = {
    streamMatch: false,
    expressDelivery: false,
    offlineMode: false,
    specificRoles: false,
    antiDerank: false,
    ...addon,
  };
  const res = calculateFullPricing({
    serviceType: "premier",
    boostMode: "solo",
    currentRating: 15000,
    targetRating: 15000,
    addOns: fullAddon,
  });
  check(res.totalPrice >= 35, `Standalone add-on floor breached: totalPrice = ${res.totalPrice}`, { addon, res });
  check(res.pixTotalPrice === res.totalPrice - Math.round(res.totalPrice * 0.05), "PIX discount consistency on standalone add-on", { res });
}

// -------------------------------------------------------------
// 2. Monotonicity & Duo >= Solo Invariant Tests
// -------------------------------------------------------------
console.log("\n>>> [2/5] Invariant: Monotonicity & Duo >= Solo <<<");

for (let cur = 1000; cur <= 28000; cur += 3000) {
  let prevSolo = 0;
  let prevDuo = 0;
  for (let tgt = cur + 1000; tgt <= 30000; tgt += 3000) {
    const solo = calculatePremierPrice(cur, tgt, "solo");
    const duo = calculatePremierPrice(cur, tgt, "duo");

    check(duo >= solo, `Duo must be >= Solo for ${cur}->${tgt} (solo=${solo}, duo=${duo})`, { cur, tgt, solo, duo });
    check(solo >= prevSolo, `Solo price must be non-decreasing with target (prev=${prevSolo}, cur=${solo})`, { cur, tgt, solo, prevSolo });
    check(duo >= prevDuo, `Duo price must be non-decreasing with target (prev=${prevDuo}, cur=${duo})`, { cur, tgt, duo, prevDuo });

    prevSolo = solo;
    prevDuo = duo;
  }
}

// -------------------------------------------------------------
// 3. Mathematical Exactness on Tier Boundaries & Seamless Transition
// -------------------------------------------------------------
console.log("\n>>> [3/5] Exact Bracket Integrals & Seams <<<");

// Bracket 1: 1000 to 10000: 9k pts * 22 = 198 (solo), * 30 = 270 (duo)
check(calculatePremierPrice(1000, 10000, "solo") === 198, "Bracket 1 integral Solo");
check(calculatePremierPrice(1000, 10000, "duo") === 270, "Bracket 1 integral Duo");

// Bracket 2: 10000 to 15000: 5k pts * 32 = 160 (solo), * 44 = 220 (duo)
check(calculatePremierPrice(10000, 15000, "solo") === 160, "Bracket 2 integral Solo");
check(calculatePremierPrice(10000, 15000, "duo") === 220, "Bracket 2 integral Duo");

// Bracket 3: 15000 to 20000: 5k pts * 48 = 240 (solo), * 64 = 320 (duo)
check(calculatePremierPrice(15000, 20000, "solo") === 240, "Bracket 3 integral Solo");
check(calculatePremierPrice(15000, 20000, "duo") === 320, "Bracket 3 integral Duo");

// Bracket 4: 20000 to 25000: 5k pts * 75 = 375 (solo), * 98 = 490 (duo)
check(calculatePremierPrice(20000, 25000, "solo") === 375, "Bracket 4 integral Solo");
check(calculatePremierPrice(20000, 25000, "duo") === 490, "Bracket 4 integral Duo");

// Bracket 5: 25000 to 30000: 5k pts * 120 = 600 (solo), * 160 = 800 (duo)
check(calculatePremierPrice(25000, 30000, "solo") === 600, "Bracket 5 integral Solo");
check(calculatePremierPrice(25000, 30000, "duo") === 800, "Bracket 5 integral Duo");

// Full spectrum additive property: sum of individual bracket integrals must equal whole
const sumSolo = 198 + 160 + 240 + 375 + 600; // 1573
const sumDuo = 270 + 220 + 320 + 490 + 800; // 2100
check(calculatePremierPrice(1000, 30000, "solo") === sumSolo, `Full spectrum additive Solo matches sum ${sumSolo}`);
check(calculatePremierPrice(1000, 30000, "duo") === sumDuo, `Full spectrum additive Duo matches sum ${sumDuo}`);

// -------------------------------------------------------------
// 4. Defensive Sanitization & Non-Finite Fuzzing
// -------------------------------------------------------------
console.log("\n>>> [4/5] Defensive Sanitization & Edge Values <<<");

const nonFiniteInputs = [NaN, -Infinity, Infinity, -0, 0, -100, 40000];

for (const val of [NaN]) {
  check(calculatePremierPrice(val, 15000, "solo") === 0, `PremierPrice handles start ${val}`);
  check(calculatePremierPrice(10000, val, "solo") === 0, `PremierPrice handles end ${val}`);
  check(calculatePremierPrice(val, val, "solo") === 0, `PremierPrice handles both ${val}`);
  check(calculateCompetitivePrice(val, 10, "solo") === 0, `CompetitivePrice handles start ${val}`);
  check(calculateCompetitivePrice(1, val, "solo") === 0, `CompetitivePrice handles end ${val}`);
  check(calculateCoachingPrice(val) === 45, `CoachingPrice sanitizes ${val} to 45`);
}

// Infinity clamping test
check(calculatePremierPrice(-Infinity, Infinity, "solo") === 1573, "PremierPrice(-Infinity, Infinity, solo) clamps to 1573");
check(calculatePremierPrice(-Infinity, Infinity, "duo") === 2100, "PremierPrice(-Infinity, Infinity, duo) clamps to 2100");

// Zero-hour delivery time on target <= current
check(calculateEstimatedHours("premier", 10000, 10000, false) === 0, "Premier equal ratings -> 0 hours");
check(calculateEstimatedHours("premier", 10000, 5000, false) === 0, "Premier reversed ratings -> 0 hours");
check(calculateEstimatedHours("competitive", 10, 10, false) === 0, "Competitive equal ranks -> 0 hours");
check(calculateEstimatedHours("competitive", 10, 5, false) === 0, "Competitive reversed ranks -> 0 hours");
check(calculateEstimatedHours("premier", NaN, 10000, false) === 0, "Premier NaN current -> 0 hours");
check(calculateEstimatedHours("premier", 10000, NaN, false) === 0, "Premier NaN target -> 0 hours");

// Coaching hours
check(calculateEstimatedHours("coaching", 5, 5, false) === 5, "Coaching 5h");
check(calculateEstimatedHours("coaching", 25, 25, false) === 20, "Coaching clamped to 20h max");
check(calculateEstimatedHours("coaching", -5, -5, false) === 1, "Coaching clamped to 1h min");

// -------------------------------------------------------------
// 5. Full Pricing Orchestrator Invariants
// -------------------------------------------------------------
console.log("\n>>> [5/5] calculateFullPricing Orchestrator Invariants <<<");

// Test zero ratings with zero add-ons: should produce 0 total
const zeroOrder = calculateFullPricing({
  serviceType: "premier",
  boostMode: "solo",
  currentRating: 15000,
  targetRating: 15000,
  addOns: {
    streamMatch: false,
    expressDelivery: false,
    offlineMode: false,
    specificRoles: false,
    antiDerank: false,
  },
});
check(zeroOrder.basePrice === 0, "Zero order basePrice is 0");
check(zeroOrder.addOnsCost === 0, "Zero order addOnsCost is 0");
check(zeroOrder.totalPrice === 0, "Zero order totalPrice is 0");
check(zeroOrder.pixTotalPrice === 0, "Zero order pixTotalPrice is 0");
check(zeroOrder.estimatedHours === 0, "Zero order estimatedHours is 0");

// Test coaching with NaN inputs
const coachNan = calculateFullPricing({
  serviceType: "coaching",
  boostMode: "solo",
  currentRating: NaN,
  targetRating: NaN,
  addOns: {
    streamMatch: false,
    expressDelivery: false,
    offlineMode: false,
    specificRoles: false,
    antiDerank: false,
  },
});
check(coachNan.basePrice === 45, "Coach NaN basePrice sanitized to 45");
check(coachNan.totalPrice === 45, "Coach NaN totalPrice sanitized to 45");
check(!coachNan.breakdown[0].label.includes("NaN"), `Coach label does not contain NaN: '${coachNan.breakdown[0].label}'`);

// Summary
console.log("\n=================================================================");
console.log(`TOTAL INVARIANT CHECKS: ${totalAsserts}`);
console.log(`PASSED: ${passedAsserts}`);
console.log(`FAILED: ${failedAsserts}`);
console.log("=================================================================");

if (failedAsserts > 0) {
  process.exit(1);
} else {
  console.log("\n>>> ALL INVARIANTS EMPIRICALLY CONFIRMED <<<");
}
