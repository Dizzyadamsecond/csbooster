#!/usr/bin/env python3
"""
Color-token sweep for Cs2Booster web app — red monochromatic design system refactor.
Runs from the monorepo root (Cs2Booster/).
Scope: packages/web/src/app/** and packages/web/src/components/** excluding components/ui/

Red monochromatic mapping:
- amber/cyan/emerald/rose multi-colors -> red monochromatic
- bg-[#xxxx] hex -> semantic surface token
- border-white/[alpha] -> line token
- text-white -> text-text
- text-slate-* -> text-muted / text-faint
"""

import os
import re

# Path to the web app src
SRC = os.path.join(os.getcwd(), "packages", "web", "src")
TARGETS = []

# Collect target files (app + components, excluding ui)
for d in ["app", "components"]:
    base = os.path.join(SRC, d)
    if os.path.isdir(base):
        for root, dirs, files in os.walk(base):
            # Skip ui dir
            rel = os.path.relpath(root, SRC)
            if rel.split(os.sep)[0] == "ui":
                continue
            for f in files:
                if f.endswith((".tsx", ".ts")):
                    TARGETS.append(os.path.join(root, f))

print(f"Targets: {len(TARGETS)}")
for t in TARGETS:
    print(" ", t)

# Mapping: regex patterns -> replacement tokens
mapping = [
    # Amper/decoration colors -> red
    (r'\bbg-amber-500\b', 'bg-red-600'),
    (r'\bbg-amber-400\b', 'bg-red-500'),
    (r'\bfrom-amber-400\b', 'from-red-500'),
    (r'\bto-amber-500\b', 'to-red-600'),
    (r'\bfrom-amber-500\b', 'from-red-500'),
    (r'\bt-amber-400\b', 'text-red-400'),
    (r'\btext-amber-400\b', 'text-red-400'),
    (r'\bvia-amber-400\b', 'via-red-500'),
    (r'\bbg-gradient-to-r from-amber-400 to-amber-500\b', 'bg-red-600'),
    (r'\bfrom-amber-500 to-amber-600\b', 'bg-red-600'),
    (r'\bfrom-amber-300\b', 'bg-red-400'),
    (r'\bfrom-amber-300 to-amber-400\b', 'bg-red-500'),
    (r'\btext-amber-300\b', 'text-red-400'),
    (r'\btext-amber-500\b', 'text-red-500'),
    (r'\btext-amber-300\b', 'text-red-400'),
    (r'\btext-amber-400\b', 'text-red-400'),
    (r'\bborder-amber-400\b', 'border-red-500'),
    (r'\bbg-emerald-500/10\b', 'bg-red-500/10'),
    (r'\bbg-emerald-400\b', 'text-red-400'),
    (r'\bbg-emerald-400/10\b', 'bg-red-500/10'),
    (r'\btext-emerald-400\b', 'text-red-400'),
    (r'\btext-cyan-400\b', 'text-red-400'),
    (r'\bbg-cyan-500\b', 'bg-red-500'),
    (r'\bbg-cyan-500/10\b', 'bg-red-500/10'),
    (r'\bborder-cyan-500\b', 'border-red-500'),
    (r'\bbg-amber-500/10\b', 'bg-red-500/10'),
    (r'\bbg-amber-400/10\b', 'bg-red-500/10'),
    (r'\bbg-amber-400/20\b', 'bg-red-500/10'),
    (r'\bbg-amber-400/25\b', 'bg-red-500/10'),
    (r'\bborder-amber-500/25\b', 'border-red-500/10'),
    (r'\bborder-amber-400/60\b', 'border-red-500/10'),
    (r'\bborder-amber-400/80\b', 'border-red-500/10'),
    (r'\bbg-amber-400/[0.08]\b', 'bg-red-500/10'),
    (r'\bbg-amber-400/[0.06]\b', 'bg-red-500/10'),
    (r'\bbg-amber-400/20\b', 'bg-red-500/10'),
    (r'\bbg-gradient-to-r from-amber-400 to-amber-500\b', 'bg-red-600'),
    (r'\bfrom-amber-400 via-orange-400 to-amber-500\b', 'bg-red-600'),
    # Surface colors -> semantic tokens
    (r'\bbg-\[#121722\]\b', 'bg-surface'),
    (r'\bbg-\[#0B0E14\]\b', 'bg-bg'),
    (r'\bbg-\[#1E222D\]\b', 'bg-surface-2'),
    (r'\bbg-\[\#121722\]\/80\b', 'bg-surface/80'),
    (r'\bbg-black/40\b', 'bg-surface-2'),
    (r'\bbg-black/60\b', 'bg-surface'),
    (r'\bbg-slate-800\b', 'bg-surface-2'),
    (r'\bbg-slate-900\b', 'bg-surface'),
    (r'\bbg-black\b', 'bg-black'),
    (r'\bbg-\[#121722\]\/90\b', 'bg-surface/90'),
    # Line colors -> tokens
    (r'\bborder-white/5\b', 'border-line'),
    (r'\bborder-white/10\b', 'border-line'),
    (r'\bborder-white/15\b', 'border-line-strong'),
    (r'\bborder-white/20\b', 'border-line-strong'),
    (r'\bborder-white/25\b', 'border-line-strong'),
    (r'\bborder-white/30\b', 'border-line-strong'),
    (r'\bborder-white/50\b', 'border-line'),
    (r'\bborder-white/60\b', 'border-line-strong'),
    (r'\bborder-white/80\b', 'border-line-strong'),
    (r'\bborder-white/100\b', 'border-line'),
    (r'\bborder-white/\[0\.06\]\b', 'border-line-soft'),
    (r'\bborder-white/\[0\.08\]\b', 'border-line'),
    (r'\bborder-white/\[0\.1\]\b', 'border-line-strong'),
    (r'\bborder-white/\\[0\\.08\\]\b', 'border-line'),
    (r'\bborder-white/\\[0\\.1\\]\b', 'border-line-strong'),
    (r'\bborder-white/\\[0\\.06\\]\b', 'border-line-soft'),
    (r'\bborder-white/\\[0\\.15\\]\b', 'border-line-strong'),
    # Text colors -> tokens
    (r'\btext-slate-400\b', 'text-muted'),
    (r'\btext-slate-300\b', 'text-muted'),
    (r'\btext-slate-500\b', 'text-faint'),
    (r'\btext-slate-600\b', 'text-faint'),
    (r'\btext-slate-200\b', 'text-text'),
    (r'\btext-slate-100\b', 'text-text'),
    (r'\btext-slate-50\b', 'text-text'),
    (r'\btext-white\b', 'text-text'),
    (r'\btext-black\b', 'text-black'),
    # Selection
    (r'\bselection:bg-\[#F59E0B\]\b', 'selection:bg-red-600'),
    (r'\bselection:text-black\b', 'selection:text-white'),
    (r'\bselection:text-slate-400\b', 'selection:text-white'),
    # Focus rings
    (r'\bfocus:ring-amber-400\b', 'focus:ring-red-600'),
    (r'\bfocus:ring-\[#F59E0B\]\b', 'focus:ring-red-600'),
    (r'\bfocus:ring-\[#38BDF8\]\b', 'focus:ring-red-600'),
    # Glow effects -> removed (replaced with shadows in components)
    (r'\bglow-amber\b', 'shadow-sm'),
    (r'\bglow-cyan\b', 'shadow-sm'),
    (r'\bshadow-amber-400/20\b', 'shadow-red-600/10'),
    (r'\bshadow-amber-500/20\b', 'shadow-red-600/10'),
    (r'\bshadow-amber-400/25\b', 'shadow-red-600/10'),
    (r'\bsm\:shadow-amber-400/25\b', 'sm:shadow-red-600/10'),
    (r'\bsm\:shadow-amber-400/20\b', 'sm:shadow-red-600/10'),
    (r'\bfrom-amber-400 to-amber-500\b', 'from-red-600 to-red-600'),
]

# Compile regex
comp = [(re.compile(p, re.IGNORECASE), r) for p, r in mapping]

# Process files
changed = 0
for f in TARGETS:
    with open(f, 'r', encoding='utf-8') as fh:
        s = fh.read()
    o = s
    for rx, rep in comp:
        s = rx.sub(rep, s)
    if s != o:
        with open(f, 'w', encoding='utf-8') as fh:
            fh.write(s)
        changed += 1
        print(f"  CHANGED: {f}")
    else:
        print(f"  same: {f}")

print(f"\nTotal changed files: {changed}")
