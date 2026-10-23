/**
 * smoke-tailwind.mjs — verifies the PostCSS + Tailwind pipeline actually
 * generates utilities from the generated token config.
 *
 * Usage: node scripts/smoke-tailwind.mjs
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import postcss from "postcss";
import postcssLoadConfig from "postcss-load-config";

// CJS interop: the module itself is the loadConfig function
const loadConfig = postcssLoadConfig.loadConfig ?? postcssLoadConfig;

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(ROOT); // tailwind resolves content globs from cwd

const cfg = await loadConfig({}, ROOT);

const pluginNames = (Array.isArray(cfg.plugins)
  ? cfg.plugins.map((p) => p?.postcssPlugin ?? p?.name ?? typeof p)
  : Object.entries(cfg.plugins).map(([k, v]) => v?.postcssPlugin ?? k)
);
console.log(`postcss plugins (${cfg.plugins.length}):`, pluginNames.join(", "));

const input = "@tailwind utilities;";
const result = await postcss(cfg.plugins).process(input, {
  from: path.join(ROOT, "src", "styles", "smoke-input.css"),
});

const expected = [
  ".bg-primary",
  ".bg-primary-soft",
  ".text-primary-text",
  ".text-muted",
  ".flex",
  ".border-line",
  ".font-display",
  // hover variants are generated only when used in source (button.tsx uses hover:bg-surface-2)
  ".hover\\:bg-surface-2",
];
const missing = expected.filter((cls) => !result.css.includes(cls));
if (missing.length) {
  console.error("❌ Tailwind smoke test FAILED. Missing:", missing.join(", "));
  process.exit(1);
}

// Token-pure contract: raw palette utilities must NOT be generated, because no
// source file is allowed to reference them (semantic tokens only).
const forbidden = [
  ".bg-red-",
  ".text-red-",
  ".border-red-",
  ".bg-blue-",
  ".text-blue-",
  ".border-blue-",
];
const leaked = forbidden.filter((cls) => result.css.includes(cls));
if (leaked.length) {
  console.error(
    "❌ Tailwind smoke test FAILED. Raw palette utilities generated (source is not token-pure):",
    leaked.join(", ")
  );
  process.exit(1);
}

console.log(
  `✅ Tailwind smoke test OK — ${result.css.length} bytes of utilities generated, 0 raw palette utilities.`
);
