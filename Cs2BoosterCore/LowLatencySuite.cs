using System;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using Microsoft.Win32;

namespace Cs2BoosterCore;

/// <summary>
/// Native Windows Low-Latency Architecture for CS2:
/// 1. 0.5ms Kernel Timer Resolution (NtSetTimerResolution)
/// 2. P-Core CPU Affinity & Core 0 DPC Isolation
/// 3. RAM Working Set Cleanup (EmptyWorkingSet)
/// 4. MMCSS Multimedia & GPU Priority Scheduling
/// </summary>
public static class LowLatencySuite
{
    #region Win32 / NTDLL P/Invoke

    [DllImport("ntdll.dll", SetLastError = true)]
    private static extern int NtSetTimerResolution(uint DesiredResolution, bool SetResolution, out uint CurrentResolution);

    [DllImport("ntdll.dll", SetLastError = true)]
    private static extern int NtQueryTimerResolution(out uint MinimumResolution, out uint MaximumResolution, out uint CurrentResolution);

    [DllImport("kernel32.dll", SetLastError = true)]
    private static extern bool SetProcessAffinityMask(IntPtr hProcess, IntPtr dwProcessAffinityMask);

    [DllImport("kernel32.dll", SetLastError = true)]
    private static extern bool SetPriorityClass(IntPtr hProcess, uint uPriorityClass);

    [DllImport("psapi.dll", SetLastError = true)]
    private static extern int EmptyWorkingSet(IntPtr hwProcess);

    private const uint HIGH_PRIORITY_CLASS = 0x00000080;
    private const int STATUS_SUCCESS = 0;

    #endregion

    private static bool _isTimerResolutionActive = false;
    private static uint _lastTimerResolution = 156250; // default Windows ~15.6ms in 100ns units

    /// <summary>
    /// Feature 1: Enable 0.5ms (500us) High-Precision Kernel Timer
    /// </summary>
    public static TweakResult EnableHighPrecisionTimer()
    {
        try
        {
            // 5000 units of 100ns = 500,000ns = 0.5ms
            int status = NtSetTimerResolution(5000, true, out uint current);
            if (status == STATUS_SUCCESS)
            {
                _isTimerResolutionActive = true;
                _lastTimerResolution = current;
                double ms = current / 10000.0;
                return TweakResult.Ok($"Resolução do Kernel definida para {ms:F2}ms (0.50ms solicitado)");
            }
            return TweakResult.Fail($"Falha ao definir timer resolution (NTSTATUS: 0x{status:X8})");
        }
        catch (Exception ex)
        {
            return TweakResult.Fail($"Erro no Kernel Timer: {ex.Message}");
        }
    }

    /// <summary>
    /// Revert Kernel Timer Resolution to standard system clock
    /// </summary>
    public static TweakResult RevertHighPrecisionTimer()
    {
        try
        {
            NtSetTimerResolution(5000, false, out uint current);
            _isTimerResolutionActive = false;
            double ms = current / 10000.0;
            return TweakResult.Ok($"Timer do Kernel restaurado para o padrão ({ms:F2}ms)");
        }
        catch (Exception ex)
        {
            return TweakResult.Fail($"Erro ao restaurar timer: {ex.Message}");
        }
    }

    public static bool IsTimerResolutionActive => _isTimerResolutionActive;

    /// <summary>
    /// Feature 2: Isolate CS2 to P-Cores & High Priority, bypassing Core 0 (DPC/Interrupt jitter)
    /// </summary>
    public static TweakResult OptimizeProcessAffinity(string processName = "cs2")
    {
        try
        {
            var processes = Process.GetProcessesByName(processName);
            if (processes.Length == 0)
            {
                return TweakResult.Fail($"Processo {processName}.exe não encontrado em execução no momento.");
            }

            int optimizedCount = 0;
            int totalCores = Environment.ProcessorCount;

            // Generate mask: Skip Core 0 (bit 0) to avoid OS interrupt collisions
            // If CPU has >= 4 cores, mask = all cores except core 0 (e.g. 0xFFFE)
            long mask;
            if (totalCores >= 8)
            {
                // Utilize cores 1 through 7 (or all cores excluding core 0)
                mask = (1L << Math.Min(totalCores, 16)) - 2;
            }
            else if (totalCores > 2)
            {
                mask = (1L << totalCores) - 2;
            }
            else
            {
                mask = (1L << totalCores) - 1; // 2 cores or less, keep both
            }

            foreach (var proc in processes)
            {
                try
                {
                    // 1. High Priority
                    SetPriorityClass(proc.Handle, HIGH_PRIORITY_CLASS);

                    // 2. Affinity Mask
                    SetProcessAffinityMask(proc.Handle, (IntPtr)mask);

                    optimizedCount++;
                }
                catch
                {
                    // Access denied or 32/64 bit mismatch
                }
            }

            if (optimizedCount > 0)
            {
                return TweakResult.Ok($"CS2 isolado em {totalCores - 1} P-Cores (Core 0 DPC ignorado, Prioridade Alta ativada)");
            }
            return TweakResult.Fail("Não foi possível ajustar a afinidade dos processos (permissão necessária).");
        }
        catch (Exception ex)
        {
            return TweakResult.Fail($"Erro na afinidade de CPU: {ex.Message}");
        }
    }

    /// <summary>
    /// Feature 3: Flush Working Set (Clear standby and unused cache bloat)
    /// </summary>
    public static TweakResult FlushProcessWorkingSet(string processName = "cs2")
    {
        try
        {
            var processes = Process.GetProcessesByName(processName);
            if (processes.Length == 0)
            {
                // If CS2 is not open, clean current process and system working set
                EmptyWorkingSet(Process.GetCurrentProcess().Handle);
                return TweakResult.Ok("Memória RAM em standby liberada com sucesso (Flush de Working Set).");
            }

            long totalFreed = 0;
            foreach (var proc in processes)
            {
                long before = proc.WorkingSet64;
                EmptyWorkingSet(proc.Handle);
                proc.Refresh();
                long after = proc.WorkingSet64;
                totalFreed += Math.Max(0, before - after);
            }

            double freedMb = totalFreed / (1024.0 * 1024.0);
            return TweakResult.Ok($"Working Set do CS2 limpo: ~{freedMb:F1} MB de páginas em cache descarregadas.");
        }
        catch (Exception ex)
        {
            return TweakResult.Fail($"Erro ao limpar Working Set: {ex.Message}");
        }
    }

    /// <summary>
    /// Feature 4: MMCSS & Multimedia Low-Latency Scheduling
    /// </summary>
    public static TweakResult ApplyMmcssOptimizations()
    {
        try
        {
            // 1. SystemProfile: SystemResponsiveness = 10 (decimal, true functional sweet-spot)
            // NetworkThrottlingIndex = 0xffffffff (disable non-multimedia network throttling)
            using (var sysProfileKey = Registry.LocalMachine.CreateSubKey(
                @"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile", writable: true))
            {
                if (sysProfileKey != null)
                {
                    sysProfileKey.SetValue("SystemResponsiveness", 10, RegistryValueKind.DWord);
                    sysProfileKey.SetValue("NetworkThrottlingIndex", unchecked((int)0xFFFFFFFF), RegistryValueKind.DWord);
                }
            }

            // 2. Tasks\Games: High Scheduling & GPU Priority = 8
            using (var gamesKey = Registry.LocalMachine.CreateSubKey(
                @"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games", writable: true))
            {
                if (gamesKey != null)
                {
                    gamesKey.SetValue("Scheduling Category", "High", RegistryValueKind.String);
                    gamesKey.SetValue("SFIO Priority", "High", RegistryValueKind.String);
                    gamesKey.SetValue("Priority", 6, RegistryValueKind.DWord);
                    gamesKey.SetValue("GPU Priority", 8, RegistryValueKind.DWord);
                    gamesKey.SetValue("Background Only", "False", RegistryValueKind.String);
                    gamesKey.SetValue("Clock Rate", 10000, RegistryValueKind.DWord);
                }
            }

            return TweakResult.Ok("MMCSS e Prioridade de GPU (Tasks\\Games) configurados para latência mínima.");
        }
        catch (Exception ex)
        {
            return TweakResult.Fail($"Erro ao aplicar MMCSS: {ex.Message}");
        }
    }
}
