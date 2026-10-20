using System;
using System.Diagnostics;
using System.Threading.Tasks;
using Microsoft.Win32;

namespace Cs2BoosterCore;

/// <summary>
/// Feature 13: Network Latency Optimization - Redução de ping e latência
/// </summary>
public static class NetworkLatencyOptimizer
{
    public static async Task<TweakResult> OptimizeAsync()
    {
        try
        {
            // 1. TCP Auto-Tuning: Normal
            await RunNetshAsync("interface tcp set global autotuninglevel=normal");
            
            // 2. Disable TCP Chimney (offload can cause latency)
            await RunNetshAsync("interface tcp set global chimney=disabled");
            
            // 3. Enable RSS (Receive Side Scaling)
            await RunNetshAsync("interface tcp set global rss=enabled");
            
            // 4. Disable TCP Window Heuristics
            await RunNetshAsync("interface tcp set heuristics disabled");
            
            // 5. Set TcpAckFrequency to 1 (ACK every segment)
            SetRegistryDword(
                @"HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters",
                "TcpAckFrequency", 1, "TCP ACK Frequency: 1 (aggressive)");
            
            // 6. Set TcpDelAck to 0 (disable delayed ACK)
            SetRegistryDword(
                @"HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters",
                "TcpDelAck", 0, "TCP Delayed ACK: Disabled");
            
            // 7. Set TcpMaxDataSize to 65536 (larger buffer)
            SetRegistryDword(
                @"HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters",
                "TcpMaxDataSize", 65536, "TCP Max Data Size: 65536");
            
            // 8. Enable Game Mode in Windows
            SetRegistryDword(
                @"HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\GameConfigStore",
                "GameDVR_Enabled", 0, "Game DVR Disabled");
            
            SetRegistryDword(
                @"HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\GameConfigStore",
                "AutoGameMode", 1, "Auto Game Mode Enabled");
            
            return TweakResult.Ok("Otimização de rede aplicada - ping reduzido");
        }
        catch (Exception ex)
        {
            return TweakResult.Fail(ex.Message);
        }
    }
    
    private static void SetRegistryDword(string path, string name, int value, string desc)
    {
        try
        {
            using var key = Registry.LocalMachine.CreateSubKey(path, writable: true);
            if (key != null)
            {
                key.SetValue(name, value, RegistryValueKind.DWord);
            }
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Failed to set registry: {desc} - {ex.Message}", ex);
        }
    }
    
    private static async Task RunNetshAsync(string args)
    {
        var proc = new ProcessStartInfo
        {
            FileName = "netsh",
            Arguments = args,
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            UseShellExecute = false,
            CreateNoWindow = true
        };
        
        using var p = Process.Start(proc)!;
        await p.WaitForExitAsync();
        
        if (p.ExitCode != 0)
        {
            throw new InvalidOperationException($"netsh failed: {p.StandardError.ReadToEnd()}");
        }
    }
}
