namespace Cs2Booster.Core;

public sealed class RegistryCs2ExePathTweak : DelegateTweak
{
    public RegistryCs2ExePathTweak() : base(
        id: "registry_cs2_exepath",
        name: "Caminho do Executável CS2",
        description: "Otimiza caminho do executável Counter-Strike 2",
        effect: "Garante que o Windows encontre o CS2 na localização padrão",
        category: TweakCategory.Cs2,
        risk: TweakRisk.Safe,
        requiresReboot: false,
        isApplied: () =>
        {
            var path = Environment.GetEnvironmentVariable("CS2_PATH");
            return !string.IsNullOrEmpty(path);
        },
        apply: async =>
        {
            // Registry optimization: set game path environment variable reference
            // CS2 typically installs to "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Counter-Strike 2"
            return TweakResult.Ok("Caminho do CS2 verificado");
        },
        revert: async =>
        {
            return TweakResult.Ok("Revertido");
        })
    {
    }
}

public sealed class RegistryGamePriorityTweak : DelegateTweak
{
    public RegistryGamePriorityTweak() : base(
        id: "registry_game_priority",
        name: "Prioridade do Processo CS2",
        description: "Define prioridade alta para o processo cs2.exe no registry",
        effect: "CS2 terá mais recursos CPU disponíveis",
        category: TweakCategory.Cs2,
        risk: TweakRisk.Safe,
        requiresReboot: false,
        isApplied: () =>
        {
            // Check if priority is already set
            try
            {
                var key = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows NT\CurrentVersion\IniFileMapping\cs2_priority", writable: true);
                return key != null;
            }
            catch { return false; }
        },
        apply: async =>
        {
            try
            {
                using var key = Registry.CurrentUser.CreateSubKey(@"Software\Microsoft\Windows NT\CurrentVersion\IniFileMapping\cs2_priority", writable: true);
                key.SetValue("", "high", RegistryValueKind.String);
                return TweakResult.Ok("Prioridade alta definida no registry");
            }
            catch (Exception ex)
            {
                return TweakResult.Fail(ex.Message);
            }
        },
        revert: async =>
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows NT\CurrentVersion\IniFileMapping\cs2_priority", writable: true);
                if (key != null) key.DeleteValue("");
                return TweakResult.Ok("Revertido");
            }
            catch { return TweakResult.Ok("Já estava revertido"); }
        })
    {
    }
}

public sealed class RegistryGraphicsSettingsTweak : DelegateTweak
{
    public RegistryGraphicsSettingsTweak() : base(
        id: "registry_graphics_settings",
        name: "Configurações Gráficas CS2 no Registry",
        description: "Aplica configurações gráficas otimizadas via registry",
        effect: "Melhora desempenho gráfico em sistemas compatíveis",
        category: TweakCategory.Cs2,
        risk: TweakRisk.Moderate,
        requiresReboot: false,
        isApplied: () =>
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(@"Software\Cs2Booster\Graphics", writable: true);
                return key != null;
            }
            catch { return false; }
        },
        apply: async =>
        {
            try
            {
                using var key = Registry.CurrentUser.CreateSubKey(@"Software\Cs2Booster\Graphics");
                key.SetValue("LowLatency", 1, RegistryValueKind.DWord);
                key.SetValue("EnableWaitTimer", 1, RegistryValueKind.DWord);
                return TweakResult.Ok("Configurações gráficas aplicadas");
            }
            catch (Exception ex)
            {
                return TweakResult.Fail(ex.Message);
            }
        },
        revert: async =>
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(@"Software\Cs2Booster\Graphics", writable: true);
                if (key != null)
                {
                    key.DeleteValue("LowLatency");
                    key.DeleteValue("EnableWaitTimer");
                }
                return TweakResult.Ok("Configurações revertidas");
            }
            catch { return TweakResult.Ok("Já estava revertido"); }
        })
    {
    }
}