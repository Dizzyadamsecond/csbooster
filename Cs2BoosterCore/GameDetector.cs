using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;

namespace Cs2BoosterCore;

/// <summary>
/// Game detection and process management
/// </summary>
public static class GameDetector
{
    private static readonly Dictionary<string, System.Diagnostics.ProcessPriorityClass> _gamePriorities = new()
    {
        { "cs2", System.Diagnostics.ProcessPriorityClass.High },
        { "dota2", System.Diagnostics.ProcessPriorityClass.High },
        { "csgo", System.Diagnostics.ProcessPriorityClass.High },
        { "valorant", System.Diagnostics.ProcessPriorityClass.AboveNormal },
        { "rust", System.Diagnostics.ProcessPriorityClass.High },
        { "minecraft", System.Diagnostics.ProcessPriorityClass.AboveNormal },
        { "lgs", System.Diagnostics.ProcessPriorityClass.High },
        { "ark", System.Diagnostics.ProcessPriorityClass.High }
    };
    
    public static string? DetectActiveGame()
    {
        var processes = Process.GetProcesses();
        foreach (var proc in processes)
        {
            var name = proc.ProcessName.ToLowerInvariant();
            if (_gamePriorities.ContainsKey(name))
            {
                return name;
            }
        }
        return null;
    }
    
    public static System.Diagnostics.ProcessPriorityClass GetPriorityForGame(string gameName)
    {
        return _gamePriorities.TryGetValue(gameName.ToLowerInvariant(), out var prio)
            ? prio
            : System.Diagnostics.ProcessPriorityClass.Normal;
    }
    
    public static List<string> GetRunningGames()
    {
        var running = new List<string>();
        var processes = Process.GetProcesses();
        foreach (var proc in processes)
        {
            var name = proc.ProcessName.ToLowerInvariant();
            if (_gamePriorities.ContainsKey(name))
            {
                running.Add(name);
            }
        }
        return running;
    }
}
