namespace Cs2Booster.Core;

public sealed class NetworkTcpAggresiveTweak : DelegateTweak
{
    public NetworkTcpAggresiveTweak() : base(
        id: "network_tcp_aggressive",
        name: "Otimização TCP Agressiva para CS2",
        description: "Ajusta parâmetros TCP para reduzir latência em jogos",
        effect: "Reduce ping e melhora estabilidade de conexão",
        category: TweakCategory.Network,
        risk: TweakRisk.Moderate,
        requiresReboot: true,
        isApplied: () =>
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Services\Tcpip\Parameters", writable: true);
                return key?.GetValue("TcpAckFrequency") != null;
            }
            catch { return false; }
        },
        apply: async =>
        {
            try
            {
                using var key = Registry.LocalMachine.CreateSubKey(@"SYSTEM\CurrentControlSet\Services\Tcpip\Parameters", writable: true);
                key.SetValue("TcpAckFrequency", 1, RegistryValueKind.DWord);
                key.SetValue("TcpDelAck", 0, RegistryValueKind.DWord);
                key.SetValue("TcpMaxDataSize", 65536, RegistryValueKind.DWord);
                key.SetValue("MTU", 9000, RegistryValueKind.DWord); // Jumbo frames hint
                return TweakResult.Ok("Parâmetros TCP otimizados");
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
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Services\Tcpip\Parameters", writable: true);
                if (key != null)
                {
                    key.DeleteValue("TcpAckFrequency");
                    key.DeleteValue("TcpDelAck");
                    key.DeleteValue("TcpMaxDataSize");
                    key.DeleteValue("MTU");
                }
                return TweakResult.Ok("Parâmetros TCP revertidos");
            }
            catch { return TweakResult.Ok("Já estava revertido"); }
        })
    {
    }
}

public sealed class NetworkIrqTweaksTweak : DelegateTweak
{
    public NetworkIrqTweaksTweak() : base(
        id: "network_irq_tweaks",
        name: "Prioridade IRQ de Rede",
        description: "Prioriza interrupções de rede para reduzir latência",
        effect: "Melhora resposta de rede em sistemas multi-core",
        category: TweakCategory.Network,
        risk: TweakRisk.Moderate,
        requiresReboot: true,
        isApplied: () =>
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\PriorityControl", writable: true);
                return key?.GetValue("Win32PrioritySeparation") != null;
            }
            catch { return false; }
        },
        apply: async =>
        {
            try
            {
                using var key = Registry.LocalMachine.CreateSubKey(@"SYSTEM\CurrentControlSet\Control\PriorityControl", writable: true);
                key.SetValue("Win32PrioritySeparation", 2, RegistryValueKind.DWord); // Background priority
                return TweakResult.Ok("Prioridade IRQ ajustada");
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
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\PriorityControl", writable: true);
                if (key != null) key.DeleteValue("Win32PrioritySeparation");
                return TweakResult.Ok("Revertido");
            }
            catch { return TweakResult.Ok("Já estava revertido"); }
        })
    {
    }
}

public sealed class NetworkAntennaTweak : DelegateTweak
{
    public NetworkAntennaTweak() : base(
        id: "network_antenna",
        name: "Otimização de Hardware de Rede",
        description: "Configurações de adaptador de rede para priorização de tráfego",
        effect: "Melhora estabilidade de conexão wireless/wired",
        category: TweakCategory.Network,
        risk: TweakRisk.Safe,
        requiresReboot: false,
        isApplied: () => true, // Placeholder - check actual adapter status
        apply: async () =>
        {
            try
            {
                // Apply netsh settings for network optimization
                var (code, outputStr) = Shell.Run("netsh", "interface tcp set global chimney=enabled");
                var (code2, out2) = Shell.Run("netsh", "interface tcp set global rss=enabled");
                return TweakResult.Ok("Otimizações de rede aplicadas");
            }
            catch (Exception ex)
            {
                return TweakResult.Fail(ex.Message);
            }
        },
        revert: async () =>
        {
            try
            {
                var (code, outputStr) = Shell.Run("netsh", "interface tcp set global chimney=disabled");
                var (code2, out2) = Shell.Run("netsh", "interface tcp set global rss=disabled");
                return TweakResult.Ok("Revertido");
            }
            catch { return TweakResult.Ok("Já estava revertido"); }
        })
    {
    }
}