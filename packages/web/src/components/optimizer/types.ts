/**
 * Types and definitions for the CS2 Booster Optimizer Interactive Suite.
 * Adheres strictly to the MonoRed design system and authentic Win32 optimizer specs.
 */

export type OptimizerProfileId = "competitive" | "streaming" | "lowend";

export type SimulatorStatus = "idle" | "optimizing" | "optimized" | "restoring";

export interface OptimizerTweak {
  id: string;
  name: string;
  target: string;
  description: string;
  registryKey?: string;
  appliedValue?: string;
  defaultValue?: string;
}

export interface OptimizerProfile {
  id: OptimizerProfileId;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  recommendedFor: string;
  // Metrics targets
  targetLatency: number;    // in ms
  baseLatency: number;      // in ms
  targetFpsLow: number;     // in FPS
  baseFpsLow: number;       // in FPS
  targetInputLag: number;   // in ms
  baseInputLag: number;     // in ms
  targetFpsAvg: number;     // in FPS
  baseFpsAvg: number;       // in FPS
  // Tweaks summary
  tweaks: OptimizerTweak[];
}

export interface TerminalLogEntry {
  id: string;
  timestamp: string;
  level: "info" | "tweak" | "success" | "warn" | "restore";
  prefix: string;
  message: string;
}

export const OPTIMIZER_PROFILES: Record<OptimizerProfileId, OptimizerProfile> = {
  competitive: {
    id: "competitive",
    name: "Competitivo Pro",
    badge: "MÁXIMA PERFORMANCE",
    tagline: "Prioridade máxima de CPU e resposta sub-tick instantânea para Premier e Faceit",
    description:
      "Configuração agressiva para jogadores competitivos: define prioridade High no scheduler da CPU, elimina atrasos do buffer TCP (TcpAckFrequency=1) e desativa recursos de segundo plano do Windows.",
    recommendedFor: "Jogadores focados em Premier, Faceit e Gamers Club que exigem latência mínima absoluta.",
    targetLatency: 18,
    baseLatency: 42,
    targetFpsLow: 214,
    baseFpsLow: 138,
    targetInputLag: 4.2,
    baseInputLag: 11.4,
    targetFpsAvg: 385,
    baseFpsAvg: 280,
    tweaks: [
      {
        id: "ifeo-cpu",
        name: "IFEO CpuPriorityClass",
        target: "cs2.exe",
        description: "Prioridade Alta de CPU garantida pelo scheduler do Windows NT",
        registryKey: "HKLM\\...\\Image File Execution Options\\cs2.exe\\PerfOptions",
        appliedValue: "CpuPriorityClass = 3 (High)",
        defaultValue: "CpuPriorityClass = 2 (Normal)",
      },
      {
        id: "ifeo-io",
        name: "IFEO IoPriority",
        target: "cs2.exe",
        description: "Prioridade máxima de leitura/escrita de disco e assets",
        registryKey: "HKLM\\...\\Image File Execution Options\\cs2.exe\\PerfOptions",
        appliedValue: "IoPriority = 3 (High)",
        defaultValue: "IoPriority = 2 (Normal)",
      },
      {
        id: "tcp-ack",
        name: "TcpAckFrequency & TcpDelAck",
        target: "Rede / TCP Stack",
        description: "Desativa o algoritmo de atraso TCP ACK; envia confirmação a cada pacote sub-tick",
        registryKey: "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces",
        appliedValue: "TcpAckFrequency = 1, TcpDelAck = 0",
        defaultValue: "TcpAckFrequency = 2, TcpDelAck = 1",
      },
      {
        id: "gamedvr",
        name: "Desativação GameDVR / DWM",
        target: "Sistema Windows",
        description: "Elimina captura em segundo plano e sobreposição de composição de janelas",
        registryKey: "HKCU\\System\\GameConfigStore",
        appliedValue: "GameDVR_Enabled = 0, AppCaptureEnabled = 0",
        defaultValue: "GameDVR_Enabled = 1, AppCaptureEnabled = 1",
      },
      {
        id: "power-plan",
        name: "Plano Desempenho Máximo",
        target: "Gerenciador de Energia",
        description: "Desativa core parking da CPU e mantém frequências de clock no pico",
        registryKey: "powercfg /setactive",
        appliedValue: "8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c (Ultimate)",
        defaultValue: "381b4222-f694-41f0-9685-ff5bb260df2e (Equilibrado)",
      },
    ],
  },
  streaming: {
    id: "streaming",
    name: "Streaming / Discord",
    badge: "STREAM & CALLS",
    tagline: "FPS competitivo estável protegendo threads do OBS Studio e chamadas Discord",
    description:
      "Distribuição inteligente de prioridades: mantém o CS2 em alta prioridade sem estrangular a codificação de vídeo do OBS Studio ou gerar cortes no áudio do Discord.",
    recommendedFor: "Streamers da Twitch/YouTube e jogadores que jogam em calls com Discord aberto.",
    targetLatency: 22,
    baseLatency: 42,
    targetFpsLow: 198,
    baseFpsLow: 138,
    targetInputLag: 5.1,
    baseInputLag: 11.4,
    targetFpsAvg: 350,
    baseFpsAvg: 280,
    tweaks: [
      {
        id: "ifeo-cpu-stream",
        name: "IFEO CpuPriorityClass",
        target: "cs2.exe + obs64.exe",
        description: "Prioridade Above Normal para CS2 com reserva de núcleos para encoder",
        registryKey: "HKLM\\...\\Image File Execution Options\\cs2.exe\\PerfOptions",
        appliedValue: "CpuPriorityClass = 3 (High com Affinity Balanceado)",
        defaultValue: "CpuPriorityClass = 2 (Normal)",
      },
      {
        id: "tcp-qos",
        name: "QoS de Rede & TcpAckFrequency",
        target: "Rede / TCP Stack",
        description: "Prioriza pacotes UDP/TCP do CS2 na placa de rede acima do tráfego web",
        registryKey: "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\QoS",
        appliedValue: "TcpAckFrequency = 1, NetworkThrottlingIndex = FFFFFFFF",
        defaultValue: "TcpAckFrequency = 2, NetworkThrottlingIndex = 10",
      },
      {
        id: "gamedvr-stream",
        name: "GameDVR Desativado",
        target: "Sistema Windows",
        description: "Desativa gravação nativa do Windows para evitar conflito com hooks do OBS",
        registryKey: "HKCU\\System\\GameConfigStore",
        appliedValue: "GameDVR_Enabled = 0",
        defaultValue: "GameDVR_Enabled = 1",
      },
      {
        id: "power-plan-stream",
        name: "Plano Alto Desempenho",
        target: "Gerenciador de Energia",
        description: "Garante resposta rápida de GPU/CPU para encoders NVENC e QuickSync",
        registryKey: "powercfg /setactive",
        appliedValue: "8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c",
        defaultValue: "381b4222-f694-41f0-9685-ff5bb260df2e",
      },
    ],
  },
  lowend: {
    id: "lowend",
    name: "Low-End / Anti-Stutter",
    badge: "ANTI-ENGASGO & RAM",
    tagline: "Limpeza agressiva de memória cache e estabilidade máxima para máquinas modestas",
    description:
      "Focado em máquinas com 8GB/16GB de RAM e CPUs de 4 a 6 núcleos: purga lista de espera de memória, otimiza Working Set e elimina micro-travamentos em smokes pesadas.",
    recommendedFor: "PCs de entrada, notebooks gamer e setups que sofrem com quedas bruscas de 1% low FPS.",
    targetLatency: 24,
    baseLatency: 42,
    targetFpsLow: 185,
    baseFpsLow: 112,
    targetInputLag: 5.8,
    baseInputLag: 14.2,
    targetFpsAvg: 295,
    baseFpsAvg: 210,
    tweaks: [
      {
        id: "ram-purge",
        name: "Purga de Standby List & Cache",
        target: "Memória RAM",
        description: "Limpa páginas de memória em espera antes de abrir partidas do CS2",
        registryKey: "NtSetSystemInformation(SystemMemoryListInformation)",
        appliedValue: "Purged Standby List (Liberado ~1.8 GB de RAM)",
        defaultValue: "Automático pelo Windows (Lento sob pressão de memória)",
      },
      {
        id: "ifeo-lowend",
        name: "IFEO CpuPriorityClass",
        target: "cs2.exe",
        description: "Impede que antivírus ou navegadores roubem ciclos de CPU do CS2",
        registryKey: "HKLM\\...\\Image File Execution Options\\cs2.exe\\PerfOptions",
        appliedValue: "CpuPriorityClass = 3 (High Priority)",
        defaultValue: "CpuPriorityClass = 2 (Normal)",
      },
      {
        id: "tcp-ack-lowend",
        name: "TcpAckFrequency = 1",
        target: "Rede / TCP Stack",
        description: "Reduz fila de pacotes na placa de rede integrada da placa-mãe",
        registryKey: "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters",
        appliedValue: "TcpAckFrequency = 1, TcpDelAck = 0",
        defaultValue: "TcpAckFrequency = 2",
      },
      {
        id: "gamedvr-lowend",
        name: "GameDVR & Telemetria Off",
        target: "Sistema Windows",
        description: "Poupa recursos escassos de CPU e GPU em máquinas modestas",
        registryKey: "HKCU\\System\\GameConfigStore",
        appliedValue: "GameDVR_Enabled = 0, AllowAutoGameMode = 1",
        defaultValue: "GameDVR_Enabled = 1",
      },
    ],
  },
};
