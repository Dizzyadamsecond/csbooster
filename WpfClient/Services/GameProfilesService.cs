using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Cs2BoosterCore;
using Cs2BoosterCore.Game;
using Cs2BoosterDesktop.Models;

namespace Cs2BoosterDesktop.Services;

public class GameProfilesService
{
    private readonly GameProfiles _profiles;
    private string? _activeGameId;

    public event EventHandler<string>? OnGameDetected;

    public GameProfilesService()
    {
        _profiles = new GameProfiles();
        _profiles.OnGameDetected += OnGameDetectedEvent;
    }

    private void OnGameDetectedEvent(object? sender, string gameId)
    {
        _activeGameId = gameId;
        OnGameDetected?.Invoke(this, gameId);
    }

    public GameProfiles.GameProfile? GetProfile(string gameId)
    {
        return _profiles.TryGetProfile(gameId, out var profile) ? profile : null;
    }

    public Task<string?> DetectActiveGameAsync()
    {
        return Task.Run(() => _profiles.DetectActiveGame());
    }

    public List<GameProfile> GetProfiles()
    {
        var profiles = _profiles.GetAllProfiles();
        var result = new List<GameProfile>(profiles.Values.Count);
        foreach (var gp in profiles.Values)
        {
            result.Add(new GameProfile
            {
                GameId = gp.GameId,
                DisplayName = gp.DisplayName,
                ProcessName = gp.ProcessName,
                ExecutablePath = gp.ExecutablePath,
                IsRunning = gp.IsRunning,
                RegistrySettings = gp.RegistrySettings,
                Gpu = new GpuSettings
                {
                    TextureQuality = gp.Gpu.TextureQuality,
                    ShadowQuality = gp.Gpu.ShadowQuality,
                    ViewDistance = gp.Gpu.ViewDistance,
                    AnisotropicFiltering = gp.Gpu.AnisotropicFiltering,
                    VSync = gp.Gpu.VSync,
                    MaxPerformanceMode = gp.Gpu.MaxPerformanceMode
                },
                Memory = new MemorySettings
                {
                    LargePages = gp.Memory.LargePages,
                    WorkingSetTrim = gp.Memory.WorkingSetTrim,
                    PoolUsagePinnedLimit = gp.Memory.PoolUsagePinnedLimit
                },
                Network = new NetworkSettings
                {
                    OptimizeTcp = gp.Network.OptimizeTcp,
                    EnableQos = gp.Network.EnableQos,
                    DisableBackgroundNetwork = gp.Network.DisableBackgroundNetwork,
                    TcpAckFrequency = gp.Network.TcpAckFrequency
                },
                Priority = new ProcessPriority
                {
                    EnablePriority = gp.Priority.EnablePriority,
                    PriorityClass = (System.Diagnostics.ProcessPriorityClass)gp.Priority.PriorityClass
                }
            });
        }
        return result;
    }

    public async Task ApplyProfileAsync(string gameId)
    {
        var profile = _profiles.TryGetProfile(gameId, out var gp) ? gp : null;
        if (profile == null) return;

        // Apply registry settings
        foreach (var kvp in profile.RegistrySettings)
        {
            try
            {
                // Reg.Set("HKLM", "Key", "Value", value);
            }
            catch { }
        }

        // Apply priority
        if (profile.Priority?.EnablePriority == true)
        {
            await Task.Run(() =>
            {
                var processes = System.Diagnostics.Process.GetProcessesByName(profile.ProcessName);
                foreach (var p in processes)
                {
                    p.PriorityClass = (System.Diagnostics.ProcessPriorityClass)profile.Priority.PriorityClass;
                }
            });
        }
    }

    public bool IsGameRunning(string gameId)
    {
        return _profiles.TryGetProfile(gameId, out var profile) && profile.IsRunning;
    }
}
