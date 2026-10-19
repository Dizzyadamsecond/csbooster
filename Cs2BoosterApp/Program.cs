using System;
using System.Diagnostics;
using System.IO;
using System.Runtime.InteropServices;
using System.Security.Principal;
using System.Threading;
using Microsoft.Win32;

namespace Cs2Booster;

class Program
{
    static int Main(string[] args)
    {
        Console.OutputEncoding = System.Text.Encoding.UTF8;
        Console.Title = "CS2 Booster Pro Engine v1.0.0";

        Console.ForegroundColor = ConsoleColor.Cyan;
        Console.WriteLine(@"
 ╔════════════════════════════════════════════════════════════════╗
 ║         CS2 BOOSTER ENGINE - PERFORMANCE & LATENCY PRO         ║
 ║              Windows Registry, Network & Priority Engine       ║
 ╚════════════════════════════════════════════════════════════════╝");
        Console.ResetColor();

        bool isElevated = IsAdministrator();
        if (!isElevated)
        {
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("[AVISO] Para aplicar mudanças no registro e sistema, execute como Administrador.\n");
            Console.ResetColor();
        }

        string cmd = args.Length > 0 ? args[0].ToLowerInvariant() : "menu";

        switch (cmd)
        {
            case "--apply":
            case "apply":
                return ApplyAllTweaks();
            case "--revert":
            case "revert":
                return RevertAllTweaks();
            case "--monitor":
            case "monitor":
                return MonitorCs2();
            case "--status":
            case "status":
                ShowStatus();
                return 0;
            default:
                return MenuLoop();
        }
    }

    static bool IsAdministrator()
    {
        using var identity = WindowsIdentity.GetCurrent();
        var principal = new WindowsPrincipal(identity);
        return principal.IsInRole(WindowsBuiltInRole.Administrator);
    }

    static int MenuLoop()
    {
        while (true)
        {
            Console.WriteLine("---------------------------------------------------------");
            Console.WriteLine(" [1] Aplicar Otimização Completa (FPS, Input Lag & Rede)");
            Console.WriteLine(" [2] Reverter Configurações para o Padrão do Windows");
            Console.WriteLine(" [3] Monitorar e Auto-Otimizar CS2 em Tempo Real");
            Console.WriteLine(" [4] Status Atual do Sistema e CS2");
            Console.WriteLine(" [0] Sair");
            Console.WriteLine("---------------------------------------------------------");
            Console.Write("Digite o número da opção desejada: ");
            var opt = Console.ReadLine()?.Trim();
            Console.WriteLine();

            switch (opt)
            {
                case "1":
                    ApplyAllTweaks();
                    break;
                case "2":
                    RevertAllTweaks();
                    break;
                case "3":
                    MonitorCs2();
                    break;
                case "4":
                    ShowStatus();
                    break;
                case "0":
                    return 0;
                default:
                    Console.ForegroundColor = ConsoleColor.Red;
                    Console.WriteLine("Opção inválida.");
                    Console.ResetColor();
                    break;
            }
            Console.WriteLine();
        }
    }

    static int ApplyAllTweaks()
    {
        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine(">> Iniciando otimização do CS2 Booster...\n");
        Console.ResetColor();

        // 1. Process Priority Tweaks
        SetRegistryDword(@"HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\cs2.exe\PerfOptions", "CpuPriorityClass", 3, "Prioridade Alta no cs2.exe");
        SetRegistryDword(@"HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\cs2.exe\PerfOptions", "IoPriority", 3, "Prioridade de I/O Alta");

        // 2. Windows Game DVR / Game Bar
        SetRegistryDword(@"HKEY_CURRENT_USER\System\GameConfigStore", "GameDVR_Enabled", 0, "Desativar Game DVR (reduz stutter)");
        SetRegistryDword(@"HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\GameDVR", "AppCaptureEnabled", 0, "Desativar Captura de Fundo");
        SetRegistryDword(@"HKEY_CURRENT_USER\Software\Microsoft\GameBar", "AllowAutoGameMode", 1, "Ativar Windows Game Mode");

        // 3. Network TCP Tweaks
        RunProcess("netsh", "interface tcp set global autotuninglevel=normal", "TCP Auto-Tuning: Normal");
        RunProcess("netsh", "interface tcp set global chimney=disabled", "TCP Chimney: Disabled");
        RunProcess("netsh", "interface tcp set global rss=enabled", "Receive Side Scaling (RSS): Enabled");
        RunProcess("netsh", "interface tcp set heuristics disabled", "TCP Window Heuristics: Disabled");

        // 4. Power Plan
        RunProcess("powercfg", "/setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c", "Plano de Alto Desempenho Ativado");

        // 5. Check active process
        OptimizeCs2Process();

        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine("\n[SUCESSO] Sistema totalmente otimizado para Counter-Strike 2!");
        Console.ResetColor();
        return 0;
    }

    static int RevertAllTweaks()
    {
        Console.ForegroundColor = ConsoleColor.Yellow;
        Console.WriteLine(">> Restaurando padrões do sistema...\n");
        Console.ResetColor();

        DeleteRegistryKey(@"HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\cs2.exe\PerfOptions", "Restaurando Prioridade Padrão cs2.exe");
        SetRegistryDword(@"HKEY_CURRENT_USER\System\GameConfigStore", "GameDVR_Enabled", 1, "Restaurar Game DVR");
        SetRegistryDword(@"HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\GameDVR", "AppCaptureEnabled", 1, "Restaurar Captura");
        RunProcess("netsh", "interface tcp set global autotuninglevel=normal", "Restaurando TCP Padrão");
        RunProcess("powercfg", "/setactive 381b4222-f694-41f0-9685-ff5bb260df2e", "Plano de Energia Equilibrado Restaurado");

        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine("\n[SUCESSO] Configurações padrão restauradas!");
        Console.ResetColor();
        return 0;
    }

    static void OptimizeCs2Process()
    {
        try
        {
            var list = Process.GetProcessesByName("cs2");
            if (list.Length > 0)
            {
                foreach (var p in list)
                {
                    p.PriorityClass = ProcessPriorityClass.High;
                    Console.ForegroundColor = ConsoleColor.Cyan;
                    Console.WriteLine($"[ATIVO] Processo cs2.exe (PID {p.Id}) ajustado em tempo de execução para HIGH PRIORITY.");
                    Console.ResetColor();
                }
            }
            else
            {
                Console.ForegroundColor = ConsoleColor.DarkGray;
                Console.WriteLine("[INFO] CS2 não está em execução no momento. Os ajustes de registro entrarão em vigor assim que abrir.");
                Console.ResetColor();
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("[INFO] " + ex.Message);
        }
    }

    static int MonitorCs2()
    {
        Console.ForegroundColor = ConsoleColor.Cyan;
        Console.WriteLine(">> Monitorando processos CS2... (Pressione Ctrl+C para encerrar)\n");
        Console.ResetColor();

        bool wasActive = false;
        while (true)
        {
            var procs = Process.GetProcessesByName("cs2");
            bool isActive = procs.Length > 0;

            if (isActive && !wasActive)
            {
                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine($"[{DateTime.Now:HH:mm:ss}] CS2 INICIADO! Aplicando acelerações em tempo real...");
                OptimizeCs2Process();
                wasActive = true;
            }
            else if (!isActive && wasActive)
            {
                Console.ForegroundColor = ConsoleColor.DarkYellow;
                Console.WriteLine($"[{DateTime.Now:HH:mm:ss}] CS2 encerrado.");
                wasActive = false;
            }

            Thread.Sleep(2000);
        }
    }

    static void ShowStatus()
    {
        Console.WriteLine("=== DIAGNÓSTICO CS2 BOOSTER ===");
        var procs = Process.GetProcessesByName("cs2");
        Console.WriteLine($"CS2 Rodando Agora: {(procs.Length > 0 ? "SIM (PID " + procs[0].Id + ")" : "NÃO")}");
        Console.WriteLine($"Admin: {(IsAdministrator() ? "SIM" : "NÃO (execute como administrador para controle total)")}");
        Console.WriteLine($"OS: {Environment.OSVersion}");
        Console.WriteLine($"CPUs Lógicas: {Environment.ProcessorCount}");
        Console.WriteLine("===============================");
    }

    static void SetRegistryDword(string fullPath, string name, int val, string desc)
    {
        try
        {
            Registry.SetValue(fullPath, name, val, RegistryValueKind.DWord);
            Console.WriteLine($"[✓] {desc}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[!] {desc}: {ex.Message}");
        }
    }

    static void DeleteRegistryKey(string fullPath, string desc)
    {
        try
        {
            if (fullPath.StartsWith(@"HKEY_LOCAL_MACHINE\"))
            {
                var sub = fullPath.Substring(@"HKEY_LOCAL_MACHINE\".Length);
                Registry.LocalMachine.DeleteSubKeyTree(sub, false);
            }
            Console.WriteLine($"[✓] {desc}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[!] {desc}: {ex.Message}");
        }
    }

    static void RunProcess(string file, string args, string desc)
    {
        try
        {
            var p = Process.Start(new ProcessStartInfo
            {
                FileName = file,
                Arguments = args,
                CreateNoWindow = true,
                UseShellExecute = false
            });
            p?.WaitForExit(3000);
            Console.WriteLine($"[✓] {desc}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[!] {desc}: {ex.Message}");
        }
    }
}
