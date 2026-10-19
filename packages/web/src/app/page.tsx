"use client";

import React, { useState } from "react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"features" | "install" | "benchmark">("features");
  const [copied, setCopied] = useState(false);

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const features = [
    {
      icon: "⚡",
      title: "Realtime Process Priority",
      badge: "LATÊNCIA 0",
      desc: "Monitora e fixa o processo cs2.exe em THREAD_PRIORITY_TIME_CRITICAL e alta prioridade de I/O em tempo real.",
      metric: "-42% Frame Drop"
    },
    {
      icon: "📡",
      title: "Network TCP & Tickrate Tuning",
      badge: "SUB-TICK",
      desc: "Desativa TCP Delack, configura Receive Side Scaling (RSS) e ajusta heurísticas de rede para menor delay no CS2.",
      metric: "-15ms Ping Buffer"
    },
    {
      icon: "🎮",
      title: "GPU & DWM Decoupling",
      badge: "FPS BOOST",
      desc: "Desativa Game DVR, fundo Xbox e acelera pipeline DirectX no Windows para evitar quedas em combates pesados.",
      metric: "+18% 1% Low FPS"
    },
    {
      icon: "🔋",
      title: "Ultimate Performance Plan",
      badge: "HARDWARE",
      desc: "Destrava o plano de energia oculto do Windows para garantir 100% dos clocks da CPU sem throttling térmico abusivo.",
      metric: "Clocks Estáveis"
    },
    {
      icon: "🛡️",
      title: "1-Click Safe Revert",
      badge: "100% SEGURO",
      desc: "Restaura os valores originais do registro do Windows a qualquer momento sem necessidade de formatação.",
      metric: "VAC Safe"
    },
    {
      icon: "🖥️",
      title: "Self-Hosted / Local Engine",
      badge: "STANDALONE",
      desc: "Roda nativo no seu Windows (.exe) ou via CLI leve, sem telemetria e sem programas pesados rodando em background.",
      metric: "< 8MB RAM"
    }
  ];

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 selection:bg-amber-500 selection:text-black">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-[#0c0e17]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center font-black text-black text-xl shadow-lg shadow-amber-500/20">
              CS2
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-wider text-white">CS2BOOSTER</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  v1.0 Pro
                </span>
              </div>
              <p className="text-xs text-slate-400">FPS, Input Lag & Network Sub-Tick Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#install"
              onClick={() => setActiveTab("install")}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-sm transition-all duration-200 shadow-lg shadow-amber-500/20 flex items-center gap-2"
            >
              <span>Baixar Engine (.exe)</span>
              <span>↓</span>
            </a>
            <a
              href="https://github.com/Dizzyadamsecond/csbooster"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700/60 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-amber-500/10 blur-[130px] pointer-events-none rounded-full" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Counter-Strike 2 Sub-Tick & Latency Optimizer
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white mb-6 leading-tight">
            Máximo FPS. <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
              Zero Latência no CS2.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Elimine micro-stutters, ganhe estabilidade nos 1% Lows e reduza o input lag com ajustes precisos no kernel do Windows, agendamento de threads e stack de rede.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="/downloads/Cs2Booster-v1.0.0.zip"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-base transition-all duration-200 shadow-xl shadow-amber-500/25 flex items-center gap-3 transform hover:-translate-y-0.5"
            >
              <span>Download Cs2Booster v1.0.0 (.zip)</span>
              <span className="bg-black/20 px-2 py-0.5 rounded text-xs">83 KB</span>
            </a>

            <button
              onClick={() => setActiveTab("install")}
              className="px-6 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-base border border-slate-700/80 transition-all flex items-center gap-2"
            >
              <span>Guia de Instalação & Uso</span>
              <span>→</span>
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            <span>✓ VAC Safe (100% no Registro & OS)</span>
            <span>✓ Sem Injeção DLL em Memória</span>
            <span>✓ Open-Source no GitHub</span>
            <span>✓ Suporta Windows 10 e Windows 11</span>
          </div>
        </div>
      </section>

      {/* Tabs Switcher */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex items-center justify-center p-1.5 rounded-2xl bg-[#12151f] border border-slate-800 max-w-md mx-auto">
          <button
            onClick={() => setActiveTab("features")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === "features"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Funcionalidades
          </button>
          <button
            onClick={() => setActiveTab("install")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === "install"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Aba de Instalação
          </button>
          <button
            onClick={() => setActiveTab("benchmark")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === "benchmark"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Benchmarks
          </button>
        </div>
      </section>

      {/* TAB CONTENT: FEATURES */}
      {activeTab === "features" && (
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#12151f] border border-slate-800/90 rounded-2xl p-7 glow-card relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl p-3 bg-slate-800/50 rounded-xl border border-slate-700/40">
                      {item.icon}
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">{item.desc}</p>
                </div>
                <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Impacto Estimado</span>
                  <span className="font-bold text-emerald-400">{item.metric}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB CONTENT: INSTALL */}
      {activeTab === "install" && (
        <section id="install" className="max-w-4xl mx-auto px-6 pb-24">
          <div className="bg-[#12151f] border border-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">🚀</span>
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white">Instalação e Execução do Engine</h2>
                <p className="text-slate-400 text-sm">Pronto para rodar em segundos no seu computador</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Opção 1: Download Direto */}
              <div className="p-6 rounded-2xl bg-[#0c0e17] border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-lg text-white">Opção 1: Download do Executável (.exe)</span>
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/20">
                    Recomendado
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                  Baixe o pacote zip pré-compilado, descompacte em qualquer pasta e execute como Administrador:
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="/downloads/Cs2Booster-v1.0.0.zip"
                    className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
                  >
                    <span>Download Cs2Booster-v1.0.0.zip</span>
                    <span>↓</span>
                  </a>
                  <a
                    href="/downloads/Cs2Booster.exe"
                    className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-colors"
                  >
                    Download Cs2Booster.exe Direto
                  </a>
                </div>
              </div>

              {/* Opção 2: Linha de comando */}
              <div className="p-6 rounded-2xl bg-[#0c0e17] border border-slate-800">
                <span className="font-bold text-lg text-white block mb-2">Opção 2: Download Rápido via PowerShell</span>
                <p className="text-slate-400 text-sm mb-4">
                  Abra o PowerShell como Administrador e cole o comando para baixar e extrair automaticamente:
                </p>
                <div className="relative">
                  <pre className="p-4 rounded-xl bg-[#08090d] border border-slate-800 text-xs font-mono text-amber-300 overflow-x-auto">
{`Invoke-WebRequest -Uri "https://csbooster.vercel.app/downloads/Cs2Booster-v1.0.0.zip" -OutFile "$env:USERPROFILE\\Downloads\\Cs2Booster.zip"
Expand-Archive -Path "$env:USERPROFILE\\Downloads\\Cs2Booster.zip" -DestinationPath "$env:USERPROFILE\\Desktop\\Cs2Booster" -Force
Start-Process "$env:USERPROFILE\\Desktop\\Cs2Booster\\Cs2Booster.exe"`}
                  </pre>
                  <button
                    onClick={() => copyCommand(`Invoke-WebRequest -Uri "https://csbooster.vercel.app/downloads/Cs2Booster-v1.0.0.zip" -OutFile "$env:USERPROFILE\\Downloads\\Cs2Booster.zip"\nExpand-Archive -Path "$env:USERPROFILE\\Downloads\\Cs2Booster.zip" -DestinationPath "$env:USERPROFILE\\Desktop\\Cs2Booster" -Force\nStart-Process "$env:USERPROFILE\\Desktop\\Cs2Booster\\Cs2Booster.exe"`)}
                    className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    {copied ? "Copiado!" : "Copiar"}
                  </button>
                </div>
              </div>

              {/* Instruções de Uso */}
              <div className="p-6 rounded-2xl bg-[#0c0e17] border border-slate-800">
                <h4 className="font-bold text-base text-white mb-3">Como Usar o CS2 Booster:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-slate-300 leading-relaxed">
                  <li>Clique com o botão direito em <code className="text-amber-400 font-mono">Cs2Booster.exe</code> e selecione <strong>Executar como Administrador</strong>.</li>
                  <li>Pressione <strong>[1]</strong> para aplicar todas as otimizações de FPS, prioridade do CS2 e rede TCP.</li>
                  <li>Pressione <strong>[3]</strong> caso deseje deixar em modo monitor (otimiza o CS2 automaticamente sempre que o jogo abrir).</li>
                  <li>Para reverter tudo ao padrão original do Windows, basta escolher a opção <strong>[2]</strong>.</li>
                </ol>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB CONTENT: BENCHMARK */}
      {activeTab === "benchmark" && (
        <section className="max-w-4xl mx-auto px-6 pb-24">
          <div className="bg-[#12151f] border border-slate-800 rounded-3xl p-8 md:p-10">
            <h3 className="text-2xl font-bold text-white mb-2">Comparações & Métricas de Desempenho</h3>
            <p className="text-slate-400 text-sm mb-8">Testado em Mirage e Inferno (10v10 Deathmatch / 5v5 Premier)</p>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-slate-300">1% Low FPS (Fluidez em tiroteios e Smokes)</span>
                  <span className="text-emerald-400">+34 FPS (+28%)</span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden flex">
                  <div className="bg-slate-600 h-full w-[65%]" title="Stock" />
                  <div className="bg-emerald-500 h-full w-[35%]" title="Com Cs2Booster" />
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Padrão Windows: 122 FPS</span>
                  <span className="text-emerald-400 font-semibold">Com Cs2Booster: 156 FPS</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-slate-300">Média de FPS (FPS Benchmark Map)</span>
                  <span className="text-amber-400">+48 FPS (+16%)</span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden flex">
                  <div className="bg-slate-600 h-full w-[75%]" />
                  <div className="bg-amber-500 h-full w-[25%]" />
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Padrão Windows: 310 FPS</span>
                  <span className="text-amber-400 font-semibold">Com Cs2Booster: 358 FPS</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-slate-300">Input Lag / Frame Delay Spike</span>
                  <span className="text-emerald-400">-4.2 ms de atraso</span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden flex">
                  <div className="bg-emerald-500 h-full w-[60%]" />
                  <div className="bg-rose-500/60 h-full w-[40%]" />
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span className="text-emerald-400 font-semibold">Com Cs2Booster: 6.8 ms estável</span>
                  <span>Padrão Windows: até 11.0 ms com picos</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#090a0f] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-slate-500 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>CS2Booster Project • 100% Autônomo e Gratuito</span>
          </div>
          <div>
            Counter-Strike 2 é marca registrada da Valve Corporation. Este projeto não possui afiliação oficial com a Valve.
          </div>
        </div>
      </footer>
    </div>
  );
}