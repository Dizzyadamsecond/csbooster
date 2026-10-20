using System;
using System.Collections.Generic;
using System.Diagnostics;
using Microsoft.Win32;

namespace Cs2BoosterCore.Game;

/// <summary>
/// Feature 9: Game Profiles - Personalizados para cada jogo
/// </summary>
public class GameProfiles
{
    public class GameProfile
    {
        public string GameId { get; set; } = "";
        public string DisplayName { get; set; } = "";
        public string ProcessName { get; set; } = "";
        public string ExecutablePath { get; set; } = "";
        public bool IsRunning { get; set; } = false;
        
        public Dictionary<string, object> RegistrySettings { get; set; } = new();
        
        public GpuSettings Gpu { get; set; } = new();
        public MemorySettings Memory { get; set; } = new();
        public NetworkSettings Network { get; set; } = new();
        public ProcessPriority Priority { get; set; } = new();
    }
    
    public class GpuSettings
    {
        public int TextureQuality { get; set; } = 8;
        public int ShadowQuality { get; set; } = 4;
        public int ViewDistance { get; set; } = 4;
        public int AnisotropicFiltering { get; set; } = 16;
        public bool VSync { get; set; } = false;
        public bool MaxPerformanceMode { get; set; } = true;
    }
    
    public class MemorySettings
    {
        public bool LargePages { get; set; } = true;
        public bool WorkingSetTrim { get; set; } = true;
        public int PoolUsagePinnedLimit { get; set; } = 0;
    }
    
    public class NetworkSettings
    {
        public bool OptimizeTcp { get; set; } = true;
        public bool EnableQos { get; set; } = true;
        public bool DisableBackgroundNetwork { get; set; } = true;
        public int TcpAckFrequency { get; set; } = 1;
    }
    
    public class ProcessPriority
    {
        public bool EnablePriority { get; set; } = true;
        public int PriorityClass { get; set; } = 2;
    }
    
    private Dictionary<string, GameProfile> _profiles = new();
    private string? _activeGameId;
    
    public event EventHandler<string>? OnGameDetected;
    
    public GameProfiles()
    {
        LoadProfiles();
    }
    
    public void LoadProfiles()
    {
        _profiles["cs2"] = new GameProfile
        {
            GameId = "cs2",
            DisplayName = "Counter-Strike 2",
            ProcessName = "cs2.exe",
            ExecutablePath = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Counter-Strike 2\\cs2.exe",
            RegistrySettings = new Dictionary<string, object>
            {
                ["cs2_fps_max"] = 0,
                ["cs2_high_priority"] = 1
            },
            Gpu = new GpuSettings
            {
                TextureQuality = 8,
                ShadowQuality = 4,
                ViewDistance = 4,
                AnisotropicFiltering = 16,
                VSync = false,
                MaxPerformanceMode = true
            },
            Memory = new MemorySettings
            {
                LargePages = true,
                WorkingSetTrim = true,
                PoolUsagePinnedLimit = 0
            },
            Network = new NetworkSettings
            {
                OptimizeTcp = true,
                EnableQos = true,
                DisableBackgroundNetwork = true,
                TcpAckFrequency = 1
            },
            Priority = new ProcessPriority
            {
                EnablePriority = true,
                PriorityClass = 3
            }
        };
        
        _profiles["dota2"] = new GameProfile
        {
            GameId = "dota2",
            DisplayName = "Dota 2",
            ProcessName = "dota2.exe",
            ExecutablePath = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Dota 2\\dota2.exe",
            RegistrySettings = new Dictionary<string, object>
            {
                ["dota2_fps_max"] = 300,
                ["dota2_high_priority"] = 1
            },
            Gpu = new GpuSettings
            {
                TextureQuality = 8,
                ShadowQuality = 6,
                ViewDistance = 6,
                AnisotropicFiltering = 16,
                VSync = false,
                MaxPerformanceMode = true
            },
            Memory = new MemorySettings
            {
                LargePages = true,
                WorkingSetTrim = true,
                PoolUsagePinnedLimit = 0
            },
            Network = new NetworkSettings
            {
                OptimizeTcp = true,
                EnableQos = true,
                DisableBackgroundNetwork = true,
                TcpAckFrequency = 1
            },
            Priority = new ProcessPriority
            {
                EnablePriority = true,
                PriorityClass = 3
            }
        };
        
        _profiles["csgo"] = new GameProfile
        {
            GameId = "csgo",
            DisplayName = "Counter-Strike: Global Offensive",
            ProcessName = "csgo.exe",
            ExecutablePath = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Counter-Strike Global Offensive\\csgo.exe",
            RegistrySettings = new Dictionary<string, object>
            {
                ["csgo_fps_max"] = 0,
                ["csgo_high_priority"] = 1
            },
            Gpu = new GpuSettings
            {
                TextureQuality = 8,
                ShadowQuality = 4,
                ViewDistance = 4,
                AnisotropicFiltering = 16,
                VSync = false,
                MaxPerformanceMode = true
            },
            Memory = new MemorySettings
            {
                LargePages = true,
                WorkingSetTrim = true,
                PoolUsagePinnedLimit = 0
            },
            Network = new NetworkSettings
            {
                OptimizeTcp = true,
                EnableQos = true,
                DisableBackgroundNetwork = true,
                TcpAckFrequency = 1
            },
            Priority = new ProcessPriority
            {
                EnablePriority = true,
                PriorityClass = 3
            }
        };
    }
    
    public string? DetectActiveGame()
    {
        var processes = Process.GetProcesses();
        foreach (var process in processes)
        {
            foreach (var profile in _profiles.Values)
            {
                if (process.ProcessName.Equals(profile.ProcessName, StringComparison.OrdinalIgnoreCase))
                {
                    profile.IsRunning = true;
                    _activeGameId = profile.GameId;
                    OnGameDetected?.Invoke(this, profile.GameId);
                    return profile.GameId;
                }
            }
        }
        
        foreach (var profile in _profiles.Values)
        {
            profile.IsRunning = false;
        }
        
        _activeGameId = null;
        return null;
    }
    
    public GameProfile? GetActiveGame()
    {
        if (_activeGameId == null) return null;
        return _profiles.TryGetValue(_activeGameId, out var profile) ? profile : null;
    }
    
    public bool TryGetProfile(string gameId, out GameProfile profile)
    {
        return _profiles.TryGetValue(gameId, out profile);
    }
    
    public Dictionary<string, GameProfile> GetAllProfiles()
    {
        return _profiles;
    }
}
