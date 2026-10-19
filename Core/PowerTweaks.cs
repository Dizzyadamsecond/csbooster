namespace Cs2Booster.Core;

public sealed class PowerUltimateTweak : DelegateTweak
{
    public PowerUltimateTweak() : base(
        id: "power_ultimate",
        name: "Esquema de Energia Ultimate Performance",
        description: "Ativa o esquema Ultimate Performance do Windows para maximizar FPS em jogos",
        effect: "Define o plano de energia Ultimate Performance (requer Windows 10/11 Pro ou Enterprise)",
        category: TweakCategory.Power,
        risk: TweakRisk.Safe,
        requiresReboot: false,
        isApplied: () => PowerHelper.EnsureHighPerformance().Contains("e9a42b02-d5df-448d-aa00-03f14749eb61"),
        apply: () => PowerHelper.EnsureHighPerformance(),
        revert: () => PowerHelper.EnsureHighPerformance()) // Re-ensure maintains state
    {
    }
}

public sealed class PowerHighPerformanceTweak : DelegateTweak
{
    public PowerHighPerformanceTweak() : base(
        id: "power_highperf",
        name: "Esquema de Energia High Performance",
        description: "Ativa o esquema High Performance do Windows para jogos",
        effect: "Define o plano de energia High Performance",
        category: TweakCategory.Power,
        risk: TweakRisk.Safe,
        requiresReboot: false,
        isApplied: () => PowerHelper.EnsureHighPerformance().Contains("8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c"),
        apply: () => PowerHelper.EnsureHighPerformance(),
        revert: () => PowerHelper.EnsureHighPerformance())
    {
    }
}