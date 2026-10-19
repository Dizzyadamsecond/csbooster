# CS2 Booster UI Redesign & Engine Distribution Spec
**Date:** 2026-10-18  
**Design Standard:** Anti-Slop / Taste Skill v2 (`design-taste-frontend`)  
**Product:** Cs2Booster - Counter-Strike 2 Sub-Tick, OS & Latency Engine

---

## 1. Design Direction & Taste Skill Parameters
- **Aesthetic:** High-End Tactical Cockpit / Hardened Technical UI (`VISUAL_DENSITY: 8`, `DESIGN_VARIANCE: 6`, `MOTION_INTENSITY: 4`).
- **Color Palette:** Off-black zinc base (`#090a0f`, `#0e121b`), single calibrated amber accent (`#f59e0b`, saturation controlled), crisp borders (`border-white/10`, `border-zinc-800`), zero purple/neon slop.
- **Typography:** Technical Grotesk / Sans + JetBrains Mono for metrics, PID values, and registers.
- **Anti-Slop Prohibitions:**
  - Banned: 3 generic symmetrical icon cards.
  - Banned: Pure black `#000` and generic neon glow blur.
  - Banned: Generic fake numbers (99.9%, 100%).
  - Required: Asymmetric technical split layout (Left Hero Specs / Right Interactive Live Terminal & Realtime Telemetry).
  - Required: Liquid glass edge refraction (`shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]`).

---

## 2. Page Architecture & Sections
1. **Nav:** Minimal technical header with live version (`v1.0.0-prod`), GitHub link, SHA-256 integrity hash badge, and direct download pill.
2. **Hero (Asymmetric 60/40 Split):**
   - Left: Precise technical headline, kernel tweak breakdown, direct download button with file details (`Cs2Booster-v1.0.0.zip • 83 KB • win-x64`).
   - Right: Interactive Live Simulation Cockpit / Engine Preview (displays mock or real CS2 PID detection, active registry hooks, IRQ balancing, and toggle simulation).
3. **Interactive Subsystems (Cockpit Tabs):**
   - **Tab 1: Engine Architecture & Registry Tweaks** (Deep dive into MMSS, DWM, TCP ACK heuristics).
   - **Tab 2: Installation & Deployment Hub** (Direct `.zip` / `.exe` download, 1-line PowerShell installer with instant copy button, and CLI flags documentation `--apply`, `--revert`, `--monitor`).
   - **Tab 3: Sub-Tick & Latency Telemetry** (Frame-time variance histograms, 1% low frame-time graphs with organic delta values).
   - **Tab 4: Autoexec & Launch Options Generator** (Interactive generator for `-threads`, `-high`, `+fps_max`, `rate 786432` with copy-to-clipboard).
4. **Hardware Verification Matrix:** Tested hardware profiles (Intel 12-14th Gen P/E-core scheduling, AMD Ryzen 3D V-Cache affinity, NVIDIA Reflex / Ultra Low Latency).
5. **Footer:** VAC Safe compliance notice, open-source repository link, and release checksums.

---

## 3. Deployment & Release Strategy
- Local build validation with Next.js 15.3.9.
- Push to GitHub `Dizzyadamsecond/csbooster`.
- Automated deploy via Vercel CLI to production alias `https://csbooster.vercel.app`.
