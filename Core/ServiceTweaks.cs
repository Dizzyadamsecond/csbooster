namespace Cs2Booster.Core;

public sealed class ServiceGameDVRTweak : DelegateTweak
{
    public ServiceGameDVRTweak() : base(
        id: "service_gamedvr",
        name: "Desativar Game DVR / Xbox Game Bar",
        description: "Desativa o serviço Game DVR que pode consumir recursos em jogos",
        effect: "Libera CPU e memória para o CS2",
        category: TweakCategory.Services,
        risk: TweakRisk.Safe,
        requiresReboot: false,
        isApplied: () => !Svc.GetStartType("GameDVR")?.Equals(4) ?? false,
        apply: async =>
        {
            try
            {
                Svc.SetStartType("GameDVR", 4); // Disable
                return TweakResult.Ok("Game DVR desativado");
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
                Svc.SetStartType("GameDVR", 3); // Demand start
                return TweakResult.Ok("Game DVR revertido");
            }
            catch { return TweakResult.Ok("Já estava revertido"); }
        })
    {
    }
}

public sealed class ServiceTiWorkerTweak : DelegateTweak
{
    public ServiceTiWorkerTweak() : base(
        id: "service_tiworker",
        name: "Desativar TiWorker (Indexação de Arquivos)",
        description: "Desativa o serviço de indexação que pode causar picos de uso de disco",
        effect: "Reduz I/O inesperado durante o jogo",
        category: TweakCategory.Services,
        risk: TweakRisk.Safe,
        requiresReboot: false,
        isApplied: () => !Svc.GetStartType("TiWorker")?.Equals(4) ?? false,
        apply: async =>
        {
            try
            {
                Svc.SetStartType("TiWorker", 4); // Disable
                return TweakResult.Ok("TiWorker desativado");
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
                Svc.SetStartType("TiWorker", 3); // Demand start
                return TweakResult.Ok("TiWorker revertido");
            }
            catch { return TweakResult.Ok("Já estava revertido"); }
        })
    {
    }
}

public sealed class ServiceSuperfetchTweak : DelegateTweak
{
    public ServiceSuperfetchTweak() : base(
        id: "service_superfetch",
        name: "Ajustar SuperFetch/Gamemode",
        description: "Configura SuperFetch para modo de jogo (GameMode) ou desabilita",
        effect: "Melhora loading e reduz stutter em jogos",
        category: TweakCategory.Services,
        risk: TweakRisk.Moderate,
        requiresReboot: false,
        isApplied: () =>
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\GameBar", writable: true);
                return key?.GetValue("GameMode") != null;
            }
            catch { return false; }
        },
        apply: async =>
        {
            try
            {
                using var key = Registry.CurrentUser.CreateSubKey(@"Software\Microsoft\GameBar", writable: true);
                key.SetValue("GameMode", 1, RegistryValueKind.DWord);
                // Also disable SuperFetch
                Svc.SetStartType("Superfetch", 4);
                return TweakResult.Ok("Game Mode ativado e SuperFetch desativado");
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
                using var key = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\GameBar", writable: true);
                if (key != null) key.DeleteValue("GameMode");
                Svc.SetStartType("Superfetch", 3);
                return TweakResult.Ok("Revertido");
            }
            catch { return TweakResult.Ok("Já estava revertido"); }
        })
    {
    }
}