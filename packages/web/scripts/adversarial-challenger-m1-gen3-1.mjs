import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";

console.log("=== EMPIRICAL ADVERSARIAL TEST HARNESS: CHALLENGER M1-1 ===");

const webRoot = path.resolve(".");
let totalTests = 0;
let passedTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  FAIL: ${name}`);
    console.error(`    ${err.message}`);
    throw err;
  }
}

// 1. Inspect Cs2MapGallery.tsx
runTest("Cs2MapGallery.tsx: Verify removal of description and prose", () => {
  const filePath = path.join(webRoot, "src/components/features/Cs2MapGallery.tsx");
  assert.ok(fs.existsSync(filePath), "Cs2MapGallery.tsx must exist");
  const content = fs.readFileSync(filePath, "utf-8");

  // Check no 'description' field in interface or objects
  assert.ok(!content.includes("description:"), "Must not have description field in Cs2MapData");
  assert.ok(!content.includes(".description"), "Must not access .description property");

  // Check that old prose strings are completely eradicated
  const forbiddenPhrases = [
    "Nossos jogadores dominam os alinhamentos",
    "Partidas rápidas no lobby",
    "Smokes 100% decoradas",
    "O mapa mais tradicional do cenário",
    "Controle de banana e retakes",
    "Verticalidade extrema",
    "Duelos de longa distância",
    "Rotações rápidas pelos canais",
    "Trocas intensas e suporte de utilitárias",
    "Disputas agressivas pela rampa"
  ];

  for (const phrase of forbiddenPhrases) {
    assert.ok(!content.includes(phrase), `Found forbidden prose phrase: "${phrase}"`);
  }

  // Check presence of telemetry chips
  assert.ok(content.includes("CALLOUTS:"), "Must have CALLOUTS telemetry label");
  assert.ok(content.includes("POOL:"), "Must have POOL telemetry label");
  assert.ok(content.includes("BIAS:"), "Must have BIAS telemetry label");
  assert.ok(content.includes("WINRATE:"), "Must have WINRATE telemetry label");
  assert.ok(content.includes("Pool Ativo Competitivo · Telemetria Sub-Tick"), "Must have telemetry subtitle");
});

// 2. Validate Map Assets & Metrics in Cs2MapGallery.tsx
runTest("Cs2MapGallery: Validate 7 official maps, assets and percentages", () => {
  const filePath = path.join(webRoot, "src/components/features/Cs2MapGallery.tsx");
  const content = fs.readFileSync(filePath, "utf-8");

  const expectedMaps = ["mirage", "inferno", "nuke", "dust2", "anubis", "ancient", "vertigo"];
  for (const id of expectedMaps) {
    assert.ok(content.includes(`id: "${id}"`), `Missing active duty map ${id}`);

    // Verify image on disk
    const imagePath = path.join(webRoot, `public/images/maps/${id}.jpg`);
    assert.ok(fs.existsSync(imagePath), `Image file missing: ${imagePath}`);

    // Verify icon on disk
    const iconPath = path.join(webRoot, `public/images/maps/${id}-icon.png`);
    assert.ok(fs.existsSync(iconPath), `Icon file missing: ${iconPath}`);
  }
});

// 3. Inspect page.tsx (FAQ and Maps CTA)
runTest("page.tsx: Verify FAQ and Maps CTA telemetry minimalism", () => {
  const filePath = path.join(webRoot, "src/app/page.tsx");
  assert.ok(fs.existsSync(filePath), "page.tsx must exist");
  const content = fs.readFileSync(filePath, "utf-8");

  // Check that old verbose FAQ paragraphs are purged
  const forbiddenFaqPhrases = [
    "Você joga na sua própria conta com o booster",
    "Usamos VPN residencial conectada na mesma região",
    "Não. Opera 100% em Ring-3 User Mode",
    "Imediato. Assim que o QR Code PIX é liquidado",
    "Pronto para subir de rating no seu mapa favorito?"
  ];

  for (const phrase of forbiddenFaqPhrases) {
    assert.ok(!content.includes(phrase), `Found forbidden verbose FAQ/CTA phrase: "${phrase}"`);
  }

  // Verify minimal structured FAQ
  assert.ok(content.includes("100% SEGURO"), "FAQ must contain badge '100% SEGURO'");
  assert.ok(content.includes("INVENTÁRIO BLINDADO"), "FAQ must contain badge 'INVENTÁRIO BLINDADO'");
  assert.ok(content.includes("VAC COMPLIANT"), "FAQ must contain badge 'VAC COMPLIANT'");
  assert.ok(content.includes("INSTANTÂNEO"), "FAQ must contain badge 'INSTANTÂNEO'");

  // Verify maps tab action bar
  assert.ok(content.includes("FILA TÁTICA CS2:"), "Maps tab must have tactical action bar");
  assert.ok(content.includes("SOLO / DUO"), "Maps tab must display SOLO / DUO badge");
  assert.ok(content.includes("PIX INSTANTÂNEO"), "Maps tab must display PIX INSTANTÂNEO badge");
});

// 4. Inspect SoloDuoModal.tsx
runTest("SoloDuoModal.tsx: Verify removal of dense prose and presence of telemetry matrix", () => {
  const filePath = path.join(webRoot, "src/components/boost/SoloDuoModal.tsx");
  assert.ok(fs.existsSync(filePath), "SoloDuoModal.tsx must exist");
  const content = fs.readFileSync(filePath, "utf-8");

  // Check that old verbose paragraphs are gone
  const forbiddenModalPhrases = [
    "Entenda como blindamos sua conta contra banimentos VAC",
    "O booster conecta utilizando VPN residencial",
    "Sua conta permanece trancada pelo Steam Family PIN",
    "Sessão isolada em máquina dedicada",
    "Você joga na sua própria máquina",
    "Comunicação direta em call privativa",
    "100% em conformidade com as diretrizes da Valve"
  ];

  for (const phrase of forbiddenModalPhrases) {
    assert.ok(!content.includes(phrase), `Found forbidden modal prose phrase: "${phrase}"`);
  }

  // Check presence of telemetry badges and matrix specs
  assert.ok(content.includes("VPN: RESIDENCIAL"), "Must have 'VPN: RESIDENCIAL'");
  assert.ok(content.includes("PIN: 4-DÍGITOS"), "Must have 'PIN: 4-DÍGITOS'");
  assert.ok(content.includes("HARDWARE DEDICADO"), "Must have 'HARDWARE DEDICADO'");
  assert.ok(content.includes("ZERO COMPARTILHAMENTO DE SENHA"), "Must have 'ZERO COMPARTILHAMENTO DE SENHA'");
  assert.ok(content.includes("CALL: DISCORD PRO"), "Must have 'CALL: DISCORD PRO'");
  assert.ok(content.includes("LOBBY ORGÂNICO"), "Must have 'LOBBY ORGÂNICO'");

  // Check 3-stage family view telemetry guide
  assert.ok(content.includes("ETAPA 01 · RESTRIÇÃO"), "Must have 'ETAPA 01 · RESTRIÇÃO'");
  assert.ok(content.includes("ETAPA 02 · PIN 4 DÍGITOS"), "Must have 'ETAPA 02 · PIN 4 DÍGITOS'");
  assert.ok(content.includes("ETAPA 03 · REVOGAÇÃO"), "Must have 'ETAPA 03 · REVOGAÇÃO'");
});

// 5. Raw Tailwind Colors & Token Compliance
runTest("Modified Files: Verify ZERO raw Tailwind color classes", () => {
  const targetFiles = [
    "src/components/features/Cs2MapGallery.tsx",
    "src/app/page.tsx",
    "src/components/boost/SoloDuoModal.tsx"
  ];

  const rawColorRegex = /\b(bg|text|border|ring|from|to|via)-(red|blue|gray|green|yellow|amber|emerald|indigo|purple|pink|rose|orange|slate|zinc|neutral|stone|cyan|sky|teal|violet|fuchsia)-[0-9]{2,3}\b/g;

  for (const relFile of targetFiles) {
    const filePath = path.join(webRoot, relFile);
    const content = fs.readFileSync(filePath, "utf-8");
    const matches = content.match(rawColorRegex);
    assert.strictEqual(matches, null, `Found raw color classes in ${relFile}: ${matches ? matches.join(", ") : ""}`);
  }
});

// 6. Global Search for dangling map description references
runTest("Codebase Search: Verify NO dangling map description references exist", () => {
  const srcDir = path.join(webRoot, "src");
  function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx"))) {
        const text = fs.readFileSync(fullPath, "utf-8");
        if (text.includes("map.description") || text.includes("activeMap.description")) {
          throw new Error(`Found dangling map description reference in ${fullPath}`);
        }
      }
    }
  }
  scanDir(srcDir);
});

console.log(`\nAdversarial test harness completed: ${passedTests}/${totalTests} tests passed.`);
