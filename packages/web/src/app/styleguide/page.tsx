"use client";

/**
 * Noir Pro Styleguide — living catalog of the monochromatic Black & White design system.
 * Route: /styleguide
 * Everything here reads from generated tokens (design/tokens.json).
 */
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Button,
  ButtonLink,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Input,
  Select,
  Badge,
} from "@/components/ui";

const MONO_RAMP: [string, string][] = [
  ["0", "#ffffff"],
  ["50", "#fafafa"],
  ["100", "#f4f4f5"],
  ["200", "#e4e4e7"],
  ["300", "#d4d4d8"],
  ["400", "#a1a1aa"],
  ["500", "#71717a"],
  ["600", "#52525b"],
  ["700", "#3f3f46"],
  ["800", "#27272a"],
  ["900", "#141416"],
  ["950", "#080808"],
];

const SEMANTICS = [
  "bg", "surface", "surface-2", "surface-3", "surface-4", "line", "line-strong",
  "text", "text-secondary", "text-tertiary", "muted", "faint",
  "primary", "primary-hover", "primary-active", "primary-text",
  "primary-soft", "primary-soft-text", "focus-ring",
  "success", "warning", "error", "info",
];

function Heading({ children, eyebrow }: { children: React.ReactNode; eyebrow?: string }) {
  return (
    <div className="mb-6">
      {eyebrow && (
        <p className="text-primary-text text-xs font-mono font-bold uppercase tracking-widest mb-2">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl font-bold text-text font-display tracking-tight">{children}</h2>
    </div>
  );
}

function Swatch({ name, hex }: { name: string; hex?: string }) {
  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      <div
        className="h-12 rounded-md border border-line shadow-sm"
        style={{ backgroundColor: hex ?? `var(--color-${name})` }}
      />
      <span className="text-[10px] font-mono text-muted truncate">{name}</span>
      {hex && <span className="truncate text-[10px] font-mono text-muted">{hex}</span>}
    </div>
  );
}

const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.4, ease: [0, 0, 0.2, 1] as const },
};

export default function StyleguidePage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-12 space-y-16">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-primary-text text-xs font-mono font-bold uppercase tracking-widest mb-2">
            Design System v3.0.0
          </p>
          <h1 className="text-4xl font-black text-text font-display tracking-tight uppercase">
            Noir Pro <span className="text-primary-text">Styleguide</span>
          </h1>
          <p className="text-muted text-sm mt-2 max-w-2xl">
            Monocromático de luxo: Preto profundo (Noir / Obsidian) alternando estritamente com Branco puro (Pure White). Fonte única: <code className="font-mono text-primary-text">design/tokens.json</code>{" "}
            → Tailwind (web) e XAML (WPF). Contraste validado em{" "}
            <code className="font-mono text-primary-text">docs/design/CONTRAST.md</code>.
          </p>
        </div>
        <Link href="/" className="text-sm text-primary-text font-semibold hover:underline whitespace-nowrap">
          ← Voltar ao site
        </Link>
      </header>

      <motion.section {...reveal}>
        <Heading eyebrow="01 — Color">Rampa Monocromática (Obsidian Noir ao Branco Puro)</Heading>
        <div className="space-y-6">
          <div>
            <p className="text-xs font-mono text-muted mb-2">mono (escala de luminosidade neutra / alto contraste)</p>
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
              {MONO_RAMP.map(([step, hex]) => (
                <Swatch key={step} name={`mono-${step}`} hex={hex} />
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section {...reveal}>
        <Heading eyebrow="02 — Color">Semânticos (reagem ao tema light/dark)</Heading>
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
          {SEMANTICS.map((name) => (
            <Swatch key={name} name={name} />
          ))}
        </div>
      </motion.section>

      <motion.section {...reveal}>
        <Heading eyebrow="03 — Typography">Tipografia</Heading>
        <div className="space-y-4">
          <p className="text-4xl font-black text-text font-display uppercase tracking-tight">Chakra Petch — Display</p>
          <p className="text-xl text-text">Space Grotesk — corpo de texto e interface</p>
          <p className="text-sm text-muted font-mono">JetBrains Mono — dados, preços, labels técnicos</p>
        </div>
      </motion.section>

      <motion.section {...reveal}>
        <Heading eyebrow="04 — Components">Botões</Heading>
        <div className="space-y-4">
          {(["primary", "secondary", "ghost", "outline", "soft", "glass", "danger"] as const).map(
            (variant) => (
              <div key={variant} className="flex flex-wrap items-center gap-3">
                <span className="w-24 text-xs font-mono text-muted">{variant}</span>
                <Button variant={variant} size="sm">sm</Button>
                <Button variant={variant} size="md">md</Button>
                <Button variant={variant} size="lg">lg</Button>
                <Button variant={variant} size="md" disabled>disabled</Button>
                <ButtonLink href="#" variant={variant} size="md">link</ButtonLink>
              </div>
            )
          )}
        </div>
      </motion.section>

      <motion.section {...reveal}>
        <Heading eyebrow="05 — Components">Badges</Heading>
        <div className="flex flex-wrap gap-3">
          <Badge tone="accent">ACCENT</Badge>
          <Badge tone="neutral">NEUTRAL</Badge>
          <Badge tone="success">✓ SUCCESS</Badge>
          <Badge tone="accent" size="sm">sm</Badge>
        </div>
      </motion.section>

      <motion.section {...reveal}>
        <Heading eyebrow="06 — Components">Forms</Heading>
        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
          <label className="block">
            <span className="mb-1.5 block font-mono text-xs font-bold uppercase tracking-wider text-muted">
              Nickname
            </span>
            <Input placeholder="ex.: s1mple" />
          </label>
          <label className="block">
            <span className="mb-1.5 block font-mono text-xs font-bold uppercase tracking-wider text-muted">
              Modalidade
            </span>
            <Select defaultValue="premier">
              <option value="premier">Premier</option>
              <option value="competitive">Competitive</option>
              <option value="coaching">Coaching</option>
            </Select>
          </label>
        </div>
      </motion.section>

      <motion.section {...reveal}>
        <Heading eyebrow="07 — Components">Cards</Heading>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(["default", "elevated", "glass", "outline"] as const).map((variant) => (
            <Card key={variant} variant={variant}>
              <CardHeader>
                <CardTitle>{variant}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted">
                  Superfície monochromática com tokens semânticos.
                </p>
              </CardContent>
              <CardFooter>
                <Badge tone="neutral">v3.0.0</Badge>
              </CardFooter>
            </Card>
          ))}
        </div>
      </motion.section>

      <motion.section {...reveal}>
        <Heading eyebrow="08 — Motion">Motion ownership</Heading>
        <div className="grid sm:grid-cols-2 gap-4 max-w-3xl">
          <Card className="p-5">
            <p className="text-xs font-mono text-primary-text font-bold uppercase mb-1">
              framer-motion
            </p>
            <p className="text-sm text-muted">
              Estados React: entradas/saídas, <code>AnimatePresence</code>,{" "}
              <code>layoutId</code>. Ex.: este card (whileInView reveal).
            </p>
          </Card>
          <Card className="p-5">
            <p className="text-xs font-mono text-primary-text font-bold uppercase mb-1">gsap + useGSAP</p>
            <p className="text-sm text-muted">
              Timelines, scroll e ticker — fora do ciclo React. Nunca animar o mesmo
              elemento nos dois sistemas.
            </p>
          </Card>
        </div>
      </motion.section>

    </main>
  );
}
