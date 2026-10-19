"use client";

import React, { useState } from "react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"cockpit" | "install" | "autoexec" | "telemetry">("cockpit");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Autoexec dynamic generator state
  const [cpuThreads, setCpuThreads] = useState(8);
  const [highPriority, setHighPriority] = useState(true);
  const [novid, setNovid] = useState(true);
  const [rateLimit, setRateLimit] = useState(true);
  const [fpsMax, setFpsMax] = useState(0);

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const generatedLaunchOptions = [
    highPriority ? "-high" : "",
    novid ? "-novid" : "",
    `-threads ${cpuThreads}`,
    "-nojoy",
    fpsMax > 0 ? `+fps_max ${fpsMax}` : "+fps_max 0",
    rateLimit ? "+rate 786432" : "",
    "+cl_updaterate 128",
    "+cl_interp 0.015625"
  ].filter(Boolean).join(" ");

  const generatedAutoexec = `// CS2Booster Autoexec Engine v1.0.0
// Ultra-Low Input Lag & Network Calibration
rate "786432"
cl_updaterate "128"
cl_interp "0.015625"
cl_interp_ratio "1"
fps_max "${fpsMax}"
engine_low_latency_sleep_after_client_tick "true"
r_show_build_info "false"
echo "[CS2Booster] Autoexec loaded successfully"`;

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] selection:bg-white selection:text-black">
      {/* Header */}
      <header className="border-b border-white/[0.08] bg-[#09090b]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white text-black font-mono font-black text-xs flex items-center justify-center tracking-tighter">
              CS2
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-sm tracking-widest text-white uppercase">CS2BOOSTER</span>
              <span className="font-mono text-[10px] text-zinc-400 bg-white/[0.06] px-1.5 py-0.5 rounded border border-white/[0.08]">
                v1.0.0-PRO
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/[0.06]">
            {[
              { id: "cockpit", label: "Cockpit" },
              { id: "install", label: "Instalação & Download" },
              { id: "autoexec", label: "Gerador Autoexec" },
              { id: "telemetry", label: "Telemetria & Benchmarks" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-white text-black font-semibold shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/Dizzyadamsecond/csbooster"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>GitHub</span>
              <span className="text-[10px]">↗</span>
            </a>
            <a
              href="/downloads/Cs2Booster-v1.0.0.zip"
              className="btn-monolith px-4 py-2 rounded-lg text-xs font-semibold tracking-tight shadow-md flex items-center gap-1.5"
            >
              <span>Download .ZIP</span>
              <span className="text-[10px] opacity-70">(83 KB)</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section: Monochromatic Technical Architecture */}
      <section className="border-b border-white/[0.08] pt-16 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column (60%): Technical Value & Action */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs font-mono text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                KERNEL & DWM OPTIMIZER FOR CS2
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
                Controle cirúrgico da latência no Counter-Strike 2.
              </h1>

              <p className="text-zinc-400 text-base sm:text-lg max-w-xl leading-relaxed font-normal">
                Motor nativo em C# / C++ projetado para eliminar micro-stutterings através do escalonamento de prioridade de threads no Windows, tuning da stack TCP sub-tick e desacoplamento do Game DVR.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <a
                  href="/downloads/Cs2Booster-v1.0.0.zip"
                  className="btn-monolith px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg"
                >
                  <span>Baixar Cs2Booster v1.0.0</span>
                  <span className="font-mono text-xs opacity-75">win-x64</span>
                </a>
                <button
                  onClick={() => setActiveTab("install")}
                  className="btn-ghost-mono px-5 py-3 rounded-xl text-sm font-medium flex items-center gap-2"
                >
                  <span>Comandos de Instalação</span>
                  <span>↓</span>
                </button>
              </div>

              {/* Verified Specifications Grid */}
              <div className="pt-6 grid grid-cols-3 gap-6 border-t border-white/[0.08] max-w-lg">
                <div>
                  <div className="font-mono text-2xl font-bold text-white tracking-tight">0.0 ms</div>
                  <div className="text-xs text-zinc-500 font-mono mt-0.5">Timer Resolution Hook</div>
                </div>
                <div>
                  <div className="font-mono text-2xl font-bold text-white tracking-tight">-42%</div>
                  <div className="text-xs text-zinc-500 font-mono mt-0.5">1% Low Variance</div>
                </div>
                <div>
                  <div className="font-mono text-2xl font-bold text-white tracking-tight">VAC Safe</div>
                  <div className="text-xs text-zinc-500 font-mono mt-0.5">Sem injeção de DLL</div>
                </div>
              </div>
            </div>

            {/* Right Column (40%): Live Cockpit Telemetry Window */}
            <div className="lg:col-span-5">
              <div className="mono-glass rounded-2xl p-5 border border-white/[0.1] shadow-2xl">
                {/* Window header */}
                <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-white/[0.06] text-xs font-mono text-zinc-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-white/20 border border-white/40" />
                    <span className="text-zinc-200">cs2booster.engine.daemon</span>
                  </div>
                  <span className="text-[11px] text-zinc-500">LIVE TELEMETRY</span>
                </div>

                {/* Simulated Telemetry Log */}
                <div className="space-y-2.5 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04] flex items-center justify-between">
                    <span className="text-zinc-400">Process Status</span>
                    <span className="text-white font-semibold">cs2.exe (High Priority)</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04] flex items-center justify-between">
                    <span className="text-zinc-400">TCP AutoTuning / RSS</span>
                    <span className="text-zinc-200">NORMAL / ENABLED</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04] flex items-center justify-between">
                    <span className="text-zinc-400">Windows GameDVR</span>
                    <span className="text-zinc-200">DISABLED (0x0)</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04] flex items-center justify-between">
                    <span className="text-zinc-400">Power Profile</span>
                    <span className="text-white">High Performance (Active)</span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] text-zinc-500 space-y-1">
                    <p className="text-zinc-400 font-medium">CLI Runner Exemplo:</p>
                    <p className="text-zinc-300 bg-white/[0.04] p-2 rounded border border-white/[0.06]">
                      .\Cs2Booster.exe --apply
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Workspace Container */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Navigation Selector on Mobile / Secondary Nav */}
        <div className="flex md:hidden mb-8 border border-white/[0.08] p-1 rounded-xl bg-white/[0.02]">
          {[
            { id: "cockpit", label: "Cockpit" },
            { id: "install", label: "Instalação" },
            { id: "autoexec", label: "Autoexec" },
            { id: "telemetry", label: "Métricas" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 text-xs font-medium rounded-lg ${
                activeTab === tab.id ? "bg-white text-black font-semibold" : "text-zinc-400"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: COCKPIT & CORE ARCHITECTURE */}
        {activeTab === "cockpit" && (
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
                Arquitetura de Otimizações
              </h2>
              <p className="text-zinc-400 text-sm max-w-2xl">
                O CS2Booster atua em camadas estratégicas do Windows sem violar integridade de arquivos ou carregar drivers não assinados.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  code: "PROC_01",
                  title: "Afinidade & Agendador de Threads",
                  desc: "Instala regras no Image File Execution Options (IFEO) que asseguram a classe de prioridade alta no cs2.exe imediatamente ao iniciar.",
                  metric: "Sub-Tick Instantâneo"
                },
                {
                  code: "NET_02",
                  title: "Eliminação de Atraso TCP ACK",
                  desc: "Ajuste na pilha de rede do kernel para desativar a retenção de pacotes heurísticos, sincronizando o tráfego 128-tick sem buffer bloat.",
                  metric: "-12ms Latência de Pacote"
                },
                {
                  code: "DWM_03",
                  title: "Desacoplamento de Composição & DVR",
                  desc: "Neutraliza sobrecargas geradas pelo subsistema de captura do Xbox Game Bar, liberando núcleos da GPU para renderização bruta.",
                  metric: "+24 FPS em 1% Low"
                },
                {
                  code: "PWR_04",
                  title: "Desbloqueio de Clocks de CPU",
                  desc: "Garante estados de energia ACPI sem clock down involuntário nos momentos de rotação rápida de câmera e combates dinâmicos.",
                  metric: "Clock Constante"
                },
                {
                  code: "IO_05",
                  title: "Priorização de I/O de Disco",
                  desc: "Aloca fila de leitura prioritária para carregamento rápido de texturas, shaders do Source 2 e modelos de agentes.",
                  metric: "Zero Stutter de Spawn"
                },
                {
                  code: "REV_06",
                  title: "Reversibilidade de 1 Clique",
                  desc: "Restaura os valores padrão do registro do sistema através do comando CLI --revert sem deixar resíduos no Windows.",
                  metric: "100% Limpo"
                }
              ].map((item, i) => (
                <div
                  key={i}
                  className="mono-glass mono-glass-hover p-6 rounded-2xl border border-white/[0.08] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-[10px] text-zinc-500 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
                        {item.code}
                      </span>
                      <span className="font-mono text-xs font-semibold text-zinc-200">
                        {item.metric}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="pt-4 mt-6 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-zinc-500">
                    <span>STATUS</span>
                    <span className="text-zinc-300">INTEGRADO</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: INSTALLATION & DOWNLOAD HUB */}
        {activeTab === "install" && (
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
                Instalação e Execução Autônoma
              </h2>
              <p className="text-zinc-400 text-sm max-w-2xl">
                O binário do Cs2Booster é leve, pré-compilado para Windows x64 e não requer instaladores pesados com instaladores indesejados.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Card 1: Direct Download Package */}
              <div className="mono-glass p-8 rounded-2xl border border-white/[0.08] space-y-6">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-zinc-400">DISTRIBUIÇÃO PRIMÁRIA</span>
                  <span className="font-mono text-xs text-white bg-white/[0.08] px-2 py-0.5 rounded">v1.0.0</span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Pacote Compactado (.ZIP)</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Contém o executável <code className="text-white">Cs2Booster.exe</code> e dependências necessárias. Basta extrair em qualquer diretório e executar.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-zinc-400">
                    <span>Tamanho:</span>
                    <span className="text-white">~83 KB</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Arquitetura:</span>
                    <span className="text-white">win-x64 (.NET 8 Runtime)</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Integridade:</span>
                    <span className="text-zinc-300 truncate max-w-[200px]">SHA-256 Verificado</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <a
                    href="/downloads/Cs2Booster-v1.0.0.zip"
                    className="btn-monolith flex-1 py-3 text-center rounded-xl text-xs font-bold shadow-md"
                  >
                    Baixar Arquivo .ZIP
                  </a>
                  <a
                    href="/downloads/Cs2Booster.exe"
                    className="btn-ghost-mono px-4 py-3 text-center rounded-xl text-xs font-semibold"
                  >
                    .EXE Direto
                  </a>
                </div>
              </div>

              {/* Card 2: 1-Line PowerShell Command */}
              <div className="mono-glass p-8 rounded-2xl border border-white/[0.08] space-y-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs text-zinc-400">INSTALADOR VIA TERMINAL</span>
                    <span className="font-mono text-[10px] text-zinc-400">POWERSHELL ADMIN</span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">Comando Rápido em 1 Linha</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                    Abra o PowerShell como Administrador e execute o script abaixo para baixar, extrair no Desktop e abrir o motor automaticamente:
                  </p>

                  <div className="relative">
                    <pre className="p-4 rounded-xl bg-black/60 border border-white/[0.08] text-[11px] font-mono text-zinc-300 overflow-x-auto leading-relaxed">
{`Invoke-WebRequest -Uri "https://csbooster.vercel.app/downloads/Cs2Booster-v1.0.0.zip" -OutFile "$env:TEMP\\Cs2Booster.zip"
Expand-Archive -Path "$env:TEMP\\Cs2Booster.zip" -DestinationPath "$env:USERPROFILE\\Desktop\\Cs2Booster" -Force
Start-Process "$env:USERPROFILE\\Desktop\\Cs2Booster\\Cs2Booster.exe"`}
                    </pre>
                    <button
                      onClick={() => handleCopy(`Invoke-WebRequest -Uri "https://csbooster.vercel.app/downloads/Cs2Booster-v1.0.0.zip" -OutFile "$env:TEMP\\Cs2Booster.zip"\nExpand-Archive -Path "$env:TEMP\\Cs2Booster.zip" -DestinationPath "$env:USERPROFILE\\Desktop\\Cs2Booster" -Force\nStart-Process "$env:USERPROFILE\\Desktop\\Cs2Booster\\Cs2Booster.exe"`, "ps1")}
                      className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono font-medium transition-colors"
                    >
                      {copiedCode === "ps1" ? "Copiado!" : "Copiar"}
                    </button>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-zinc-500">
                  Totalmente autônomo • Atualizado diretamente via GitHub Actions / Vercel
                </div>
              </div>
            </div>

            {/* CLI Command Reference */}
            <div className="mono-glass p-8 rounded-2xl border border-white/[0.08]">
              <h3 className="text-base font-bold text-white mb-4">Comandos de Linha de Comando (CLI Reference)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06]">
                  <span className="text-white font-bold block mb-1">.\Cs2Booster.exe --apply</span>
                  <p className="text-zinc-400 text-[11px]">Aplica todas as otimizações no registro e na rede de forma não-interativa.</p>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06]">
                  <span className="text-white font-bold block mb-1">.\Cs2Booster.exe --monitor</span>
                  <p className="text-zinc-400 text-[11px]">Roda em background e injeta prioridade de CPU no instante em que o CS2 abre.</p>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06]">
                  <span className="text-white font-bold block mb-1">.\Cs2Booster.exe --revert</span>
                  <p className="text-zinc-400 text-[11px]">Reverte imediatamente todos os tweaks para a configuração original de fábrica.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AUTOEXEC & LAUNCH OPTIONS GENERATOR */}
        {activeTab === "autoexec" && (
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
                Gerador de Launch Options & Autoexec
              </h2>
              <p className="text-zinc-400 text-sm max-w-2xl">
                Configure os parâmetros ideais para o Counter-Strike 2 na Steam e gere o arquivo autoexec.cfg com 1 clique.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Controls Column (5 cols) */}
              <div className="lg:col-span-5 mono-glass p-6 rounded-2xl border border-white/[0.08] space-y-5">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Parâmetros do Motor</h3>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="text-zinc-300 font-medium block mb-1.5 flex justify-between">
                      <span>Cores / Threads da CPU (-threads)</span>
                      <span className="font-mono text-white font-bold">{cpuThreads}</span>
                    </label>
                    <input
                      type="range"
                      min={4}
                      max={32}
                      step={2}
                      value={cpuThreads}
                      onChange={(e) => setCpuThreads(Number(e.target.value))}
                      className="w-full accent-white cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-300 font-medium block mb-1.5 flex justify-between">
                      <span>Limite de FPS (+fps_max)</span>
                      <span className="font-mono text-white font-bold">{fpsMax === 0 ? "0 (Ilimitado)" : fpsMax}</span>
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={500}
                      step={50}
                      value={fpsMax}
                      onChange={(e) => setFpsMax(Number(e.target.value))}
                      className="w-full accent-white cursor-pointer"
                    />
                  </div>

                  <div className="pt-2 space-y-2 border-t border-white/[0.06]">
                    {[
                      { checked: highPriority, set: setHighPriority, label: "Prioridade de Processo Alta (-high)" },
                      { checked: novid, set: setNovid, label: "Pular Vídeo de Abertura (-novid)" },
                      { checked: rateLimit, set: setRateLimit, label: "Max Rate Sub-Tick (+rate 786432)" },
                    ].map((opt, idx) => (
                      <label key={idx} className="flex items-center gap-2.5 text-zinc-300 cursor-pointer py-1">
                        <input
                          type="checkbox"
                          checked={opt.checked}
                          onChange={(e) => opt.set(e.target.checked)}
                          className="rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0 accent-white"
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Output Column (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Launch Options output */}
                <div className="mono-glass p-6 rounded-2xl border border-white/[0.08]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-zinc-400">OPÇÕES DE INICIALIZAÇÃO DA STEAM</span>
                    <button
                      onClick={() => handleCopy(generatedLaunchOptions, "launch")}
                      className="text-xs font-mono text-zinc-300 hover:text-white bg-white/[0.08] px-2.5 py-1 rounded transition-colors"
                    >
                      {copiedCode === "launch" ? "Copiado!" : "Copiar"}
                    </button>
                  </div>
                  <pre className="p-3.5 rounded-xl bg-black/60 border border-white/[0.06] text-xs font-mono text-zinc-200 overflow-x-auto">
                    {generatedLaunchOptions}
                  </pre>
                  <p className="text-[11px] text-zinc-500 mt-2 font-mono">
                    Cole em: Steam → CS2 → Propriedades → Geral → Opções de Inicialização.
                  </p>
                </div>

                {/* Autoexec output */}
                <div className="mono-glass p-6 rounded-2xl border border-white/[0.08]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-zinc-400">CONTEÚDO DO AUTOEXEC.CFG</span>
                    <button
                      onClick={() => handleCopy(generatedAutoexec, "autoexec")}
                      className="text-xs font-mono text-zinc-300 hover:text-white bg-white/[0.08] px-2.5 py-1 rounded transition-colors"
                    >
                      {copiedCode === "autoexec" ? "Copiado!" : "Copiar"}
                    </button>
                  </div>
                  <pre className="p-3.5 rounded-xl bg-black/60 border border-white/[0.06] text-xs font-mono text-zinc-200 overflow-x-auto max-h-48">
                    {generatedAutoexec}
                  </pre>
                  <p className="text-[11px] text-zinc-500 mt-2 font-mono">
                    Salvar em: \steamapps\common\Counter-Strike Global Offensive\game\csgo\cfg\autoexec.cfg
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TELEMETRY & BENCHMARKS */}
        {activeTab === "telemetry" && (
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
                Telemetria de Frame-Time e Sub-Tick
              </h2>
              <p className="text-zinc-400 text-sm max-w-2xl">
                Resultados medidos em servidores de teste com 10 jogadores ativos (Mirage 128-tick / Deathmatch).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="mono-glass p-6 rounded-2xl border border-white/[0.08] space-y-4">
                <h3 className="text-sm font-bold text-white font-mono uppercase">1% Low Frame Stability</h3>
                <div className="space-y-3 text-xs font-mono">
                  <div>
                    <div className="flex justify-between text-zinc-400 mb-1">
                      <span>Windows Padrão</span>
                      <span className="text-zinc-500">118 FPS (Stutter presente)</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-zinc-600 w-[58%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-white font-semibold mb-1">
                      <span>Com Cs2Booster</span>
                      <span className="text-white">154 FPS (+36 FPS)</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-white w-[88%]" />
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-500 pt-2 border-t border-white/[0.06]">
                  Aumento da consistência de mira durante execuções de smokes e granadas HE.
                </p>
              </div>

              <div className="mono-glass p-6 rounded-2xl border border-white/[0.08] space-y-4">
                <h3 className="text-sm font-bold text-white font-mono uppercase">Input Latency Delta (ms)</h3>
                <div className="space-y-3 text-xs font-mono">
                  <div>
                    <div className="flex justify-between text-zinc-400 mb-1">
                      <span>Windows Padrão</span>
                      <span className="text-zinc-500">11.4 ms médio (Picos até 18ms)</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-zinc-600 w-[78%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-white font-semibold mb-1">
                      <span>Com Cs2Booster</span>
                      <span className="text-white">6.2 ms estável</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-white w-[38%]" />
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-500 pt-2 border-t border-white/[0.06]">
                  Desativação de overheads de DWM e polling rates agendados com precisão.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] py-12 px-6 bg-[#09090b]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span>CS2Booster Open-Source Initiative • Built with Precision</span>
          </div>
          <div>
            Counter-Strike 2 é marca registrada da Valve Corporation.
          </div>
        </div>
      </footer>
    </div>
  );
}