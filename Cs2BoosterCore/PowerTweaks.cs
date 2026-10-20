using System.Diagnostics;

namespace Cs2BoosterCore;

public static class PowerTweaks
{
    public static TweakResult SetUltimatePerformance()
    {
        try
        {
            var proc = new ProcessStartInfo
            {
                FileName = "powercfg",
                Arguments = "-setactive e9a42b02-d5df-448d-aa00-03f14749eb61",
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };
            
            using var p = Process.Start(proc)!;
            p.WaitForExit();
            
            if (p.ExitCode == 0)
            {
                return TweakResult.Ok("Esquema Ultimate Performance ativado");
            }
            return TweakResult.Fail("powercfg nao encontrado ou falhou");
        }
        catch (Exception ex)
        {
            return TweakResult.Fail(ex.Message);
        }
    }

    public static TweakResult SetHighPerformance()
    {
        try
        {
            var proc = new ProcessStartInfo
            {
                FileName = "powercfg",
                Arguments = "/setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c",
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };
            
            using var p = Process.Start(proc)!;
            p.WaitForExit();
            
            if (p.ExitCode == 0)
            {
                return TweakResult.Ok("Plano de High Performance ativado");
            }
            return TweakResult.Fail("powercfg nao encontrado ou falhou");
        }
        catch (Exception ex)
        {
            return TweakResult.Fail(ex.Message);
        }
    }

    public static TweakResult EnsureHighPerformance()
    {
        // Ensure High Performance is active (re-apply to maintain state)
        return SetHighPerformance();
    }
}
