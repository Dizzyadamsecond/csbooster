"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { DURATION, EASE, SPRING } from "@/lib/motion";

const DOWNLOAD_URL = "/downloads/Cs2Booster.exe";
const HERO_IMAGE = "https://framerusercontent.com/images/TxULqdOGSSWm9d52hIQlkZHmKs.png?width=2048&height=1280";
const CAPABILITY_IMAGES = [
  "https://framerusercontent.com/images/2X40x5rilpmiXVcvQ6lWIIDggo.png?width=896&height=504",
  "https://framerusercontent.com/images/iVEHkRBx9IvFK8SCRdGzm0igdQ.png?width=896&height=504",
  "https://framerusercontent.com/images/00tWFiRlSU6OdQh127wsTlO54s.png?width=896&height=504",
];

const capabilities = [
  { label: "Optimization", title: "Optimization automation", copy: "Apply verified timer, CPU affinity, DPC, memory, GPU and network optimizations from one controlled flow.", image: CAPABILITY_IMAGES[0] },
  { label: "Telemetry", title: "Real telemetry", copy: "Collect FPS, 1% low, frametime, ping, CPU/GPU load and DPC latency from the running system.", image: CAPABILITY_IMAGES[1] },
  { label: "Safety", title: "Backup and restore", copy: "Snapshot changes before optimization, verify the result, and restore the previous state when needed.", image: CAPABILITY_IMAGES[2] },
  { label: "Desktop control", title: "Team collaboration", copy: "Move from a browser handoff to the native Windows engine without replacing the real desktop workflow.", image: null },
];

const faqs = [
  ["What is CS2 Booster and who is it for?", "CS2 Booster is a native Windows optimization companion for players who want measurable, reversible system tuning before launching Counter-Strike 2."],
  ["Does it change game files or inject into CS2?", "The public flow is designed around Ring-3 system configuration and verification. It does not claim to inject code into the game or bypass VAC."],
  ["Are the performance numbers real?", "Yes. The product surface is prepared for measurements collected by the desktop engine. It does not present hardcoded FPS gains as live results."],
  ["Can I restore the previous state?", "The intended flow is Detect → Snapshot → Optimize → Verify → Restore. The restore action is available after a snapshot exists."],
  ["How do I get support?", "Use the contact action below and include your Windows version, CPU/GPU, CS2 build and the verification result shown by the desktop client."],
];

function Arrow() { return <span aria-hidden="true">↗</span>; }
function Eyebrow({ children }: { children: React.ReactNode }) { return <div className="giga-eyebrow"><span aria-hidden="true">⌁</span>{children}</div>; }
function Action({ children, href = "#download", variant = "dark" }: { children: React.ReactNode; href?: string; variant?: "dark" | "light" }) { return <motion.a className={`giga-action giga-action-${variant}`} href={href} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} transition={SPRING.tactile}>{children} <Arrow /></motion.a>; }
function Reveal({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) {
  const reduced = useReducedMotion();
  return <motion.section id={id} className={className} initial={reduced ? false : { opacity: 0, y: 20 }} whileInView={reduced ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: DURATION.slower, ease: EASE.entrance }}>{children}</motion.section>;
}

export default function App() {
  const [capability, setCapability] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="giga-site">
      <nav className="giga-nav" aria-label="Primary navigation">
        <a className="giga-brand" href="#top"><span className="giga-brand-mark">✺</span>CS2 Booster</a>
        <div className="giga-nav-links">
          <a href="#why-booster">Why CS2</a><a href="#capabilities">Capabilities</a><a href="#features">Features</a><a href="#workflow">Workflow</a><a href="#pricing">Plans</a>
        </div>
        <Action href="#download" variant="light">Download</Action>
        <button className="giga-menu" type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
      </nav>
      <AnimatePresence>{menuOpen && <motion.div className="giga-mobile-nav" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .22, ease: "easeOut" }}><a href="#why-booster" onClick={() => setMenuOpen(false)}>Why CS2</a><a href="#capabilities" onClick={() => setMenuOpen(false)}>Capabilities</a><a href="#features" onClick={() => setMenuOpen(false)}>Features</a><a href="#workflow" onClick={() => setMenuOpen(false)}>Workflow</a><a href="#pricing" onClick={() => setMenuOpen(false)}>Plans</a><a href={DOWNLOAD_URL} download="Cs2Booster.exe" onClick={() => setMenuOpen(false)}>Download CS2 Booster <Arrow /></a></motion.div>}</AnimatePresence>

      <motion.section id="top" className="giga-hero giga-frame giga-dark-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: DURATION.slower, ease: EASE.entrance }}>
        <motion.div className="giga-hero-copy" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08, duration: DURATION.slower, ease: EASE.entrance }}>
          <Eyebrow>Native Windows Performance Engine</Eyebrow>
          <h1>Run CS2 at peak performance.<br />Without the guesswork.</h1>
          <p>CS2 Booster gives competitive players a controlled path from system detection to verified FPS, frametime and latency improvements.</p>
          <div className="giga-actions"><Action href="#download" variant="light">Download CS2 Booster</Action><Action href="#workflow">See the workflow</Action></div>
        </motion.div>
        <motion.div className="giga-hero-art" style={{ backgroundImage: `url(${HERO_IMAGE})` }} aria-label="Abstract performance telemetry visual" role="img" animate={{ scale: [1, 1.035, 1], x: [0, 8, 0] }} transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }} />
        <div className="giga-trust-row"><span>Built for real Windows hardware</span><b>Timer</b><b>P-Core</b><b>DPC</b><b>MMCSS</b><b>VAC-safe Ring-3</b></div>
      </motion.section>

      <Reveal id="why-booster" className="giga-frame giga-split giga-spacious giga-border-top">
        <div><Eyebrow>Why CS2 Booster</Eyebrow><h2>Built to run CS2<br />reliably at scale.</h2></div>
        <div className="giga-section-aside"><p>Turn system tuning into a repeatable, observable flow. Every change is designed to be inspected, snapshotted and reversed.</p><Action href="#features">Features</Action></div>
      </Reveal>

      <Reveal id="capabilities" className="giga-frame giga-capabilities giga-border-top">
        <Eyebrow>Capabilities</Eyebrow><h2>Everything you need to stabilize FPS.</h2><p className="giga-intro">CS2 Booster brings optimization, telemetry and rollback together so you can prepare a machine with confidence.</p>
        <div className="giga-capability-layout">
          <div className="giga-capability-tabs" role="tablist" aria-label="CS2 Booster capabilities">{capabilities.map((item, i) => <motion.button key={item.label} className={i === capability ? "active" : ""} onClick={() => setCapability(i)} role="tab" aria-selected={i === capability} whileHover={{ x: 3 }} whileTap={{ scale: .98 }} transition={SPRING.tactile}><span>{i === capability ? "●" : "○"}</span>{item.label}</motion.button>)}</div>
          <AnimatePresence mode="wait"><motion.div key={capabilities[capability].label} className="giga-capability-card" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: .28 }}><div className="giga-capability-image" style={capabilities[capability].image ? { backgroundImage: `url(${capabilities[capability].image})` } : undefined} /><div className="giga-card-copy"><h3>{capabilities[capability].title}</h3><p>{capabilities[capability].copy}</p></div></motion.div></AnimatePresence>
        </div>
      </Reveal>

      <Reveal id="features" className="giga-frame giga-split giga-spacious giga-border-top"><div><Eyebrow>Features</Eyebrow><h2>FPS capabilities built<br />for competitive play.</h2></div><div className="giga-section-aside"><p>Timer resolution, P-Core affinity, DPC mitigation, TCP/sub-tick tuning, memory cleanup and GPU/MMCSS priority in one coherent surface.</p><Action href="#download">Download</Action></div></Reveal>

      <Reveal id="workflow" className="giga-frame giga-workflow giga-spacious giga-border-top"><Eyebrow>Workflow</Eyebrow><h2>End-to-end optimization flow.</h2><p className="giga-intro">CS2 Booster streamlines the entire path from detection to verification without hiding what changed on the machine.</p><Action href="#download">Open the desktop flow</Action><div className="giga-workflow-steps">{["Detect hardware", "Snapshot state", "Optimize safely", "Verify telemetry"].map((step, i) => <motion.div key={step} whileHover={{ y: -5 }} transition={{ duration: .2 }}><span>0{i + 1}</span><h3>{step}</h3><p>{["Read CPU, GPU, OS, timer and network conditions.", "Create a restorable record before applying changes.", "Apply only the selected Ring-3 optimization actions.", "Compare collected metrics and keep or restore the change."][i]}</p></motion.div>)}</div></Reveal>

      <Reveal id="milestones" className="giga-frame giga-split giga-spacious giga-border-top"><div><Eyebrow>Milestones</Eyebrow><h2>Built on measurement.<br />Proven by data.</h2></div><div className="giga-section-aside"><p>Every benchmark is a measurement surface, not a decorative promise. Results depend on the machine, game build and selected profile.</p><Action href="#benchmarks">View benchmark model</Action></div></Reveal>

      <Reveal id="benchmarks" className="giga-frame giga-testimonials giga-spacious giga-border-top"><Eyebrow>Benchmarks</Eyebrow><h2>Trusted by the telemetry<br />you can inspect.</h2><p className="giga-intro">FPS average, 1% low, frametime, ping RTT, DPC latency, CPU/GPU usage and sample count are the signals the desktop client is built to expose.</p><div className="giga-metrics">{[["FPS","Average and 1% low"],["ms","Frametime and DPC latency"],["RTT","Network round trip"]].map(([value, label]) => <motion.div key={value} whileHover={{ y: -6, scale: 1.01 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}><strong>{value}</strong><span>{label}</span></motion.div>)}</div></Reveal>

      <Reveal id="integration" className="giga-frame giga-split giga-spacious giga-border-top"><div><Eyebrow>Integration</Eyebrow><h2>Integrates with the<br />tools you already use.</h2></div><div className="giga-section-aside"><p>Keep the landing page, executable, benchmark evidence and restore path in one connected product flow.</p><Action href="#download">Workflow</Action></div></Reveal>

      <Reveal id="pricing" className="giga-frame giga-pricing giga-spacious giga-border-top"><Eyebrow>Plans</Eyebrow><h2>Simple, transparent access.</h2><p className="giga-intro">Start with the native client and use the verification surface before deciding which operational support your setup needs.</p><div className="giga-pricing-grid">{[["Starter","Free","Download, detect and inspect the optimization flow.","#download","Start now"],["Pro","Desktop","Full optimization, telemetry, snapshot and restore path.","#download","Download"],["Support","Custom","Hardware-specific guidance and deployment support.","mailto:support@csbooster.vercel.app","Contact sales"]].map(([name, price, copy, href, label], i) => <motion.article key={name} className={i === 1 ? "featured" : ""} whileHover={{ y: -7 }} transition={{ type: "spring", stiffness: 280, damping: 20 }}><span>{name}</span><h3>{price}</h3><p>{copy}</p><Action href={href} variant={i === 1 ? "light" : "dark"}>{label}</Action></motion.article>)}</div></Reveal>

      <Reveal id="faq" className="giga-frame giga-faq giga-spacious giga-border-top"><Eyebrow>FAQ</Eyebrow><h2>Your questions,<br />clearly answered.</h2><p className="giga-intro">Find quick answers about the CS2 Booster workflow and what the product does on Windows.</p><div className="giga-faq-list">{faqs.map(([question, answer], i) => <div className={`giga-faq-item ${openFaq === i ? "open" : ""}`} key={question}><button onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}><span>{question}</span><b>{openFaq === i ? "−" : "+"}</b></button><AnimatePresence initial={false}>{openFaq === i && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: .24 }}>{answer}</motion.p>}</AnimatePresence></div>)}</div></Reveal>

      <Reveal id="download" className="giga-cta giga-frame"><span className="giga-brand-mark">✺</span><h2>Powering the future<br />of competitive CS2.</h2><p>Download the native client and move from guesswork to a measured optimization flow.</p><motion.a className="giga-action giga-action-light giga-cta-button" href={DOWNLOAD_URL} download="Cs2Booster.exe" whileHover={{ scale: 1.04 }} whileTap={{ scale: .97 }}>Download CS2 Booster <Arrow /></motion.a></Reveal>

      <footer className="giga-footer"><a className="giga-brand" href="#top"><span className="giga-brand-mark">✺</span>CS2 Booster</a><div className="giga-footer-links"><a href="#why-booster">Why CS2</a><a href="#capabilities">Capabilities</a><a href="#features">Features</a><a href="#workflow">Workflow</a><a href="#faq">FAQ</a></div><div className="giga-footer-bottom"><span>Native Windows performance tooling</span><span>© CS2 Booster</span></div></footer>
    </main>
  );
}