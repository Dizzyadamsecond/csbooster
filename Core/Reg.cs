using System.Diagnostics;
using System.Text;
using Microsoft.Win32;

namespace Cs2Booster.Core;

public static class Reg
{
    public const string LM = "HKLM";
    public const string CU = "HKCU";

    private static RegistryKey HiveOf(string hive) => hive.ToUpperInvariant() switch
    {
        "HKLM" or "HKEY_LOCAL_MACHINE" => Registry.LocalMachine,
        "HKCU" or "HKEY_CURRENT_USER" => Registry.CurrentUser,
        "HKCR" or "HKEY_CLASSES_ROOT" => Registry.ClassesRoot,
        "HKU" or "HKEY_USERS" => Registry.Users,
        _ => throw new ArgumentException($"Hive inválida: {hive}")
    };

    public static object? Get(string hive, string key, string name)
    {
        using var k = HiveOf(hive).OpenSubKey(key);
        return k?.GetValue(name);
    }

    public static int GetInt(string hive, string key, string name, int fallback = -1)
    {
        var v = Get(hive, key, name);
        return v switch
        {
            int i => i,
            long l => (int)l,
            _ => fallback
        };
    }

    public static string? GetString(string hive, string key, string name)
        => Get(hive, key, name) as string;

    public static void Set(string hive, string key, string name, object value)
    {
        using var k = HiveOf(hive).CreateSubKey(key, writable: true)
            ?? throw new InvalidOperationException($"Não foi possível abrir {hive}\\{key}");
        k.SetValue(name, value, KindOf(value));
    }

    public static void DeleteValue(string hive, string key, string name)
    {
        using var k = HiveOf(hive).OpenSubKey(key, writable: true);
        k?.DeleteValue(name, throwOnMissingValue: false);
    }

    private static RegistryValueKind KindOf(object value) => value switch
    {
        int => RegistryValueKind.DWord,
        long => RegistryValueKind.QWord,
        string[] => RegistryValueKind.MultiString,
        byte[] => RegistryValueKind.Binary,
        _ => RegistryValueKind.String
    };
}

public static class Shell
{
    public static (int Code, string Output) Run(string file, string args, int timeoutMs = 20000)
    {
        var psi = new ProcessStartInfo(file, args)
        {
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            UseShellExecute = false,
            CreateNoWindow = true
        };

        using var p = Process.Start(psi) ?? throw new InvalidOperationException($"Falha ao iniciar {file}");
        var stdout = p.StandardOutput.ReadToEndAsync();
        var stderr = p.StandardError.ReadToEndAsync();

        if (!p.WaitForExit(timeoutMs))
        {
            try { p.Kill(entireProcessTree: true); } catch { /* ignorado */ }
            return (-1, "Tempo esgotado");
        }

        return (p.ExitCode, stdout.Result + stderr.Result);
    }

    public static bool IsProcessRunning(string name)
    {
        return Process.GetProcessesByName(name).Length > 0;
    }
}

public static class PowerHelper
{
    private static readonly System.Text.RegularExpressions.Regex GuidRx =
        new("[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}");

    public const string UltimateScheme = "e9a42b02-d5df-448d-aa00-03f14749eb61";
    public const string HighPerformanceScheme = "8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c";

    public static string? GetActiveGuid()
    {
        var (code, output) = Shell.Run("powercfg", "-getactivescheme");
        if (code != 0) return null;
        var m = GuidRx.Match(output);
        return m.Success ? m.Value.ToLowerInvariant() : null;
    }

    public static List<(string Guid, string Name)> List()
    {
        var result = new List<(string, string)>();
        var (code, output) = Shell.Run("powercfg", "-list");
        if (code != 0) return result;

        foreach (var line in output.Split('\n'))
        {
            var m = GuidRx.Match(line);
            if (!m.Success) continue;
            var name = ExtractName(line);
            result.Add((m.Value.ToLowerInvariant(), name));
        }
        return result;
    }

    private static string ExtractName(string line)
    {
        int a = line.LastIndexOf('(');
        int b = line.LastIndexOf(')');
        if (a >= 0 && b > a) return line[(a + 1)..b].Trim();
        return line.Trim();
    }

    /// <summary>Garante que o esquema "Alto desempenho" (ou Ultimate) exista e retorna o GUID ativo.</summary>
    public static string EnsureHighPerformance()
    {
        var plans = List();

        // Prefere Ultimate Performance se existir
        var ultimate = plans.FirstOrDefault(p => p.Guid == UltimateScheme);
        if (ultimate.Guid is not null)
        {
            Shell.Run("powercfg", $"-setactive {ultimate.Guid}");
            return ultimate.Guid;
        }

        // Tenta duplicar o esquema Ultimate (disponível em Win10/11 Pro+, mas pode falhar)
        var (dupCode, dupOut) = Shell.Run("powercfg", $"-duplicatescheme {UltimateScheme}");
        if (dupCode == 0)
        {
            var m = GuidRx.Match(dupOut);
            if (m.Success)
            {
                var guid = m.Value.ToLowerInvariant();
                Shell.Run("powercfg", $"-setactive {guid}");
                return guid;
            }
        }

        // Fallback: Alto desempenho nativo
        var high = plans.FirstOrDefault(p => p.Guid == HighPerformanceScheme);
        if (high.Guid is not null)
        {
            Shell.Run("powercfg", $"-setactive {high.Guid}");
            return high.Guid;
        }

        throw new InvalidOperationException("Não foi possível ativar um esquema de alto desempenho.");
    }
}

public static class Svc
{
    // 2 = AUTO_START, 3 = DEMAND_START, 4 = DISABLED
    public static int? GetStartType(string name)
    {
        var (code, output) = Shell.Run("sc", $"qc \"{name}\"");
        if (code != 0) return null;
        var m = System.Text.RegularExpressions.Regex.Match(output, @"START_TYPE\s*:\s*(\d+)");
        return m.Success ? int.Parse(m.Groups[1].Value) : null;
    }

    public static void SetStartType(string name, int startType)
    {
        string keyword = startType switch
        {
            2 => "auto",
            3 => "demand",
            4 => "disabled",
            _ => "demand"
        };
        var (code, output) = Shell.Run("sc", $"config \"{name}\" start= {keyword}");
        if (code != 0 && !output.Contains("SUCCESS", StringComparison.OrdinalIgnoreCase))
            throw new InvalidOperationException($"sc config {name} falhou: {output.Trim()}");
    }
}
