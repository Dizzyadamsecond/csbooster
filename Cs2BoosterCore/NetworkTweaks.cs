using Microsoft.Win32;
using System.Diagnostics;

namespace Cs2BoosterCore;

public static class NetworkTweaks
{
    public static TweakResult SetTcpAckFrequency()
    {
        try
        {
            using var key = Registry.LocalMachine.CreateSubKey(
                "SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters", writable: true);
            key.SetValue("TcpAckFrequency", 1, RegistryValueKind.DWord);
            key.SetValue("TcpDelAck", 0, RegistryValueKind.DWord);
            key.SetValue("TcpMaxDataSize", 65536, RegistryValueKind.DWord);
            return TweakResult.Ok("Parametros TCP otimizados");
        }
        catch (Exception ex)
        {
            return TweakResult.Fail(ex.Message);
        }
    }

    public static TweakResult SetTcpAutotuningNormal()
    {
        try
        {
            var proc = new ProcessStartInfo
            {
                FileName = "netsh",
                Arguments = "interface tcp set global autotuninglevel=normal",
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };
            
            using var p = Process.Start(proc)!;
            p.WaitForExit();
            
            if (p.ExitCode == 0)
            {
                return TweakResult.Ok("TCP Auto-Tuning: Normal");
            }
            return TweakResult.Fail("netsh failed");
        }
        catch (Exception ex)
        {
            return TweakResult.Fail(ex.Message);
        }
    }

    public static TweakResult SetTcpChimneyDisabled()
    {
        try
        {
            var proc = new ProcessStartInfo
            {
                FileName = "netsh",
                Arguments = "interface tcp set global chimney=disabled",
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };
            
            using var p = Process.Start(proc)!;
            p.WaitForExit();
            
            if (p.ExitCode == 0)
            {
                return TweakResult.Ok("TCP Chimney: Disabled");
            }
            return TweakResult.Fail("netsh failed");
        }
        catch (Exception ex)
        {
            return TweakResult.Fail(ex.Message);
        }
    }

    public static TweakResult SetTcpRssEnabled()
    {
        try
        {
            var proc = new ProcessStartInfo
            {
                FileName = "netsh",
                Arguments = "interface tcp set global rss=enabled",
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };
            
            using var p = Process.Start(proc)!;
            p.WaitForExit();
            
            if (p.ExitCode == 0)
            {
                return TweakResult.Ok("RSS: Enabled");
            }
            return TweakResult.Fail("netsh failed");
        }
        catch (Exception ex)
        {
            return TweakResult.Fail(ex.Message);
        }
    }
}
