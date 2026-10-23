using System;
using System.Collections.Generic;

namespace Cs2BoosterDesktop.Models;

public class GameProfile
{
    public string GameId { get; set; } = "";
    public string DisplayName { get; set; } = "";
    public string ProcessName { get; set; } = "";
    public string ExecutablePath { get; set; } = "";
    public bool IsRunning { get; set; } = false;

    /// <summary>Estado do jogo em linguagem de UI ("EM EXECUÇÃO" / "PARADO").</summary>
    public string StatusText => IsRunning ? "EM EXECUÇÃO" : "PARADO";
    public Dictionary<string, object> RegistrySettings { get; set; } = new();
    public Models.GpuSettings? Gpu { get; set; }
    public Models.MemorySettings? Memory { get; set; }
    public Models.NetworkSettings? Network { get; set; }
    public Models.ProcessPriority? Priority { get; set; }
}
