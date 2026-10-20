using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;
using Cs2BoosterCore;
using Microsoft.Win32;

namespace Cs2BoosterCore;

class Program
{
    static async Task Main(string[] args)
    {
        Console.OutputEncoding = System.Text.Encoding.UTF8;
        Console.Title = "CS2 Booster Pro Core";
        Console.ForegroundColor = ConsoleColor.Cyan;
        Console.WriteLine(@"
 ╔════════════════════════════════════════════════════════════════╗
 ║        CS2 BOOSTER CORE - OPTIMIZATION ENGINE v2.0.0          ║
 ║   Games | Audio | Backup | Temperature | Network | Profiles  ║
 ╚════════════════════════════════════════════════════════════════╝");
        Console.ResetColor();
        
        await RunCommandAsync(args);
    }
    
    static async Task RunCommandAsync(string[] args)
    {
        if (args.Length == 0 || args[0] == "--help")
        {
            PrintHelp();
            return;
        }
        
        try
        {
            switch (args[0].ToLowerInvariant())
            {
                case "--apply":
                    await ApplyAllAsync();
                    break;
                case "--revert":
                    await RevertAllAsync();
                    break;
                case "--detect":
                    await DetectGamesAsync();
                    break;
                case "--monitor":
                    await StartMonitoringAsync();
                    break;
                case "--backup":
                    await CreateBackupAsync(args);
                    break;
                case "--status":
                    await ShowStatusAsync();
                    break;
                default:
                    PrintHelp();
                    break;
            }
        }
        catch (Exception ex)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine("[ERRO] " + ex.Message);
            Console.ResetColor();
        }
    }
    
    static async Task ApplyAllAsync()
    {
        Console.WriteLine(">> Aplicando todas as otimizacoes...");
        
        var tasks = new List<Task>
        {
            AudioOptimizer.OptimizeForGamingAsync(),
            NetworkLatencyOptimizer.OptimizeAsync()
        };
        tasks.Add(Task.Run(() => GameDetector.DetectActiveGame()));
        
        await Task.WhenAll(tasks.ToArray());
        
        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine("[SUCESSO] Aplicacao completa concluida.");
        Console.ResetColor();
    }
    
    static async Task RevertAllAsync()
    {
        Console.WriteLine(">> Restaurando configuracoes...");
        
        var results = new List<Task<TweakResult>>
        {
            Task.FromResult(ServiceTweaks.DisableGameDvr()),
            Task.FromResult(ServiceTweaks.DisableSuperfetch()),
            Task.FromResult(NetworkTweaks.SetTcpAutotuningNormal()),
            Task.FromResult(RegistryTweaks.SetGameDvrDisabled())
        };
        
        var resultsArray = results.ToArray();
        await Task.WhenAll(resultsArray);
        
        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine("[SUCESSO] Configuracoes restauradas.");
        Console.ResetColor();
    }
    
    static async Task DetectGamesAsync()
    {
        Console.WriteLine(">> Detectando jogos em execucao...");
        var games = GameDetector.GetRunningGames();
        if (games.Count > 0)
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("[ATIVO] Jogos detectados: " + string.Join(", ", games));
            Console.ResetColor();
        }
        else
        {
            Console.WriteLine("[INFO] Nenhum jogo detectado no momento.");
        }
    }
    
    static async Task StartMonitoringAsync()
    {
        Console.WriteLine(">> Iniciando monitoramento de temperatura (3s intervalo)...");
        var monitor = new TemperatureMonitor();
        monitor.OnReadingTaken += (s, r) =>
        {
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("[TEMP] CPU: " + r.CpuTemp + " C | GPU: " + r.GpuTemp + " C | CPU Usage: " + r.CpuUsage + "%");
            Console.ResetColor();
        };
        monitor.OnAlert += (s, a) =>
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine("[ALERTA] " + a);
            Console.ResetColor();
        };
        
        await monitor.StartMonitoringAsync(3000);
        Console.WriteLine(">> Pressione Ctrl+C para parar.");
        while (true) { await Task.Delay(1000); }
    }
    
    static async Task CreateBackupAsync(string[] args)
    {
        var name = args.Length > 1 ? args[1] : null;
        var backup = new BackupSystem();
        var path = await backup.CreateBackupAsync(name);
        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine("[SUCESSO] Backup criado em: " + path);
        Console.ResetColor();
    }
    
    static async Task ShowStatusAsync()
    {
        Console.WriteLine("=== DIAGNOSTICO CS2 BOOSTER CORE ===");
        Console.WriteLine("OS: " + Environment.OSVersion);
        Console.WriteLine("CPUs Logicas: " + Environment.ProcessorCount);
        Console.WriteLine("CS2 Rodando: " + (Process.GetProcessesByName("cs2").Length > 0));
        var games = GameDetector.GetRunningGames();
        Console.WriteLine("Jogos Ativos: " + (games.Count > 0 ? string.Join(", ", games) : "Nenhum"));
        Console.WriteLine("===================================");
    }
    
    static void PrintHelp()
    {
        Console.WriteLine(@"
Comandos:
  --apply    Aplicar todas as otimizacoes (FPS, Rede, Audio, Prioridade)
  --revert   Restaurar configuracoes padrao do Windows
  --detect   Detectar jogos em execucao e aplicar prioridade
  --monitor  Monitorar temperatura em tempo real
  --backup   Criar backup de configuracoes
  --status   Mostrar status do sistema
  --help     Esta ajuda");
    }
}
