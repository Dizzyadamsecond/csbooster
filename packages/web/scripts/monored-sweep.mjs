/**
 * monored-sweep.mjs — enforces the monochromatic rule (BLACK + WHITE only).
 *
 * 1) Applies known replacements migrating legacy hues to MonoRed tokens.
 * 2) Scans src/ for any leftover non-red hue (yellow, emerald, blue, ...) and
 *    fails (exit 1) so regressions never reach a build.
 *
 * Usage: node scripts/monored-sweep.mjs          (check + fix)
 *        node scripts/monored-sweep.mjs --check  (check only, no writes)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "src");
const CHECK_ONLY = process.argv.includes("--check");

/** ordered: specific patterns first */
const REPLACEMENTS = [
  ["surface line-strong", "bg-surface"],
  [
    "border-line bg-black/20 text-muted hover:border-line-strong",
    "border-line bg-surface-2 text-muted hover:border-line-strong hover:bg-surface-3",
  ],
  [
    "border-line-soft bg-black/20 text-muted hover:border-line-strong",
    "border-line bg-surface-2 text-muted hover:border-line-strong hover:bg-surface-3",
  ],
  ["bg-cyan-400/20 text-cyan-300", "bg-primary/10 text-primary-text"],
  [
    "bg-emerald-500/15 border border-emerald-500/30 text-red-400",
    "bg-primary-soft border border-primary/30 text-primary-soft-text",
  ],
  ["border border-emerald-500/20", "border border-primary/30"],
  ["border border-emerald-500/30", "border border-primary/30"],
  [
    "bg-gradient-to-r from-red-500 to-red-600 hover:bg-red-400 hover:to-amber-400 text-black",
    "bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary-active text-primary-foreground",
  ],
  ["shadow-xl shadow-red-600/10", "shadow-xl shadow-primary/20"],
  ["active:scale-98", "active:scale-95"],
  ["bg-red-500 text-black", "bg-red-500 text-mono-950"],
  ["fill-yellow-400 text-yellow-400", "fill-primary text-primary"],
  ["text-yellow-400", "text-primary"],
  ["to-primary-700", "to-primary-hover"],
  // rating tier ladder → monochromatic intensity ladder
  [
    'if (rating >= 25000) return "text-red-400 border-red-500/40 bg-red-500/10";',
    'if (rating >= 25000) return "text-primary-text border-primary/40 bg-primary/10";',
  ],
  [
    'if (rating >= 20000) return "text-red-400 border-rose-400/40 bg-rose-400/10";',
    'if (rating >= 20000) return "text-text border-primary/40 bg-primary/5";',
  ],
  [
    'if (rating >= 15000) return "text-red-400 border-fuchsia-400/40 bg-fuchsia-400/10";',
    'if (rating >= 15000) return "text-text border-primary/30 bg-primary/5";',
  ],
  [
    'if (rating >= 10000) return "text-red-400 border-blue-400/40 bg-blue-400/10";',
    'if (rating >= 10000) return "text-text border-line-strong bg-primary/5";',
  ],
  [
    'if (rating >= 5000) return "text-red-400 border-cyan-400/40 bg-cyan-400/10";',
    'if (rating >= 5000) return "text-text border-line bg-surface-3";',
  ],
];

const FORBIDDEN_HUE =
  /\b(?:blue|yellow|emerald|amber|fuchsia|rose|green|orange|purple|violet|indigo|lime|pink)-\d{2,3}\b/;

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.(tsx|ts)$/.test(entry.name)) yield full;
  }
}

let changed = 0;
let violations = 0;

for (const file of walk(SRC)) {
  const rel = path.relative(ROOT, file);
  let content = fs.readFileSync(file, "utf8");
  const before = content;

  for (const [from, to] of REPLACEMENTS) {
    content = content.split(from).join(to);
  }

  if (content !== before && !CHECK_ONLY) {
    fs.writeFileSync(file, content, "utf8");
    changed++;
    console.log(`  fixed: ${rel}`);
  }

  const lines = content.split("\n");
  lines.forEach((line, i) => {
    const m = line.match(FORBIDDEN_HUE);
    if (m) {
      violations++;
      console.error(`  ❌ ${rel}:${i + 1} non-monochrome class "${m[0]}"`);
    }
  });
}

if (violations > 0) {
  console.error(`\n❌ Monochromatic Noir sweep FAILED — ${violations} violation(s).`);
  process.exit(1);
}
console.log(
  `\n✅ Monochromatic Noir sweep OK — ${changed} file(s) updated${CHECK_ONLY ? " (check-only)" : ""}.`
);
