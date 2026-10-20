using System;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using System.Windows;
using Cs2BoosterCore;
using Cs2BoosterCore.Game;
using Cs2BoosterDesktop.Models;

namespace Cs2BoosterDesktop.ViewModels;

public class AppViewModel : INotifyPropertyChanged
{
    public event PropertyChangedEventHandler? PropertyChanged;

    protected void OnPropertyChanged([CallerMemberName] string propertyName = "") =>
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));

    // Status do sistema
    private bool _isMonitoring;
    private bool _isApplying;
    private bool _isRestoring;
    private string _statusMessage = "Pronto";
    private string _cpuTempText = "N/A";
    private string _gpuTempText = "N/A";
    private string _cpuUsageText = "0%";
    private string _fpsText = "0";
    private string _pingText = "0ms";
    private string _gameStatusText = "Nenhum jogo detectado";

    public bool IsMonitoring
    {
        get => _isMonitoring;
        set { _isMonitoring = value; OnPropertyChanged(); }
    }

    public bool IsApplying
    {
        get => _isApplying;
        set { _isApplying = value; OnPropertyChanged(); }
    }

    public bool IsRestoring
    {
        get => _isRestoring;
        set { _isRestoring = value; OnPropertyChanged(); }
    }

    public string StatusMessage
    {
        get => _statusMessage;
        set { _statusMessage = value; OnPropertyChanged(); }
    }

    public string CpuTempText
    {
        get => _cpuTempText;
        set { _cpuTempText = value; OnPropertyChanged(); }
    }

    public string GpuTempText
    {
        get => _gpuTempText;
        set { _gpuTempText = value; OnPropertyChanged(); }
    }

    public string CpuUsageText
    {
        get => _cpuUsageText;
        set { _cpuUsageText = value; OnPropertyChanged(); }
    }

    public string FpsText
    {
        get => _fpsText;
        set { _fpsText = value; OnPropertyChanged(); }
    }

    public string PingText
    {
        get => _pingText;
        set { _pingText = value; OnPropertyChanged(); }
    }

    public string GameStatusText
    {
        get => _gameStatusText;
        set { _gameStatusText = value; OnPropertyChanged(); }
    }

    // Perfis de jogo
    public ObservableCollection<GameProfile> Profiles { get; } = new();
    public ObservableCollection<GameProfile> ActiveProfiles { get; } = new();

    // Metrics
    public ObservableCollection<PerformanceMetrics> Metrics { get; } = new();
    private PerformanceMetrics? _latestMetrics;
    public PerformanceMetrics? LatestMetrics
    {
        get => _latestMetrics;
        set { _latestMetrics = value; OnPropertyChanged(); }
    }

    // Análise estatística
    public StatisticalAnalysis? StatisticalAnalysis { get; set; }
    public int SampleCount => StatisticalAnalysis?.SampleCount ?? 0;

    // Camadas do sistema
    private readonly GameProfiles? _gameProfiles;
    private readonly BackupSystem _backupSystem = new();
    private readonly TemperatureMonitor? _temperatureMonitor;

    public AppViewModel()
    {
        _gameProfiles = new GameProfiles();
        _temperatureMonitor = new TemperatureMonitor();
        _temperatureMonitor.OnReadingTaken += OnTemperatureReading;
        _temperatureMonitor.OnAlert += OnTemperatureAlert;

        LoadProfiles();
        StartMonitoring();
    }

    private void LoadProfiles()
    {
        var profiles = _gameProfiles.GetAllProfiles();
        foreach (var gp in profiles.Values)
        {
            Profiles.Add(new Models.GameProfile
            {
                GameId = gp.GameId,
                DisplayName = gp.DisplayName,
                ProcessName = gp.ProcessName,
                ExecutablePath = gp.ExecutablePath,
                IsRunning = gp.IsRunning,
                RegistrySettings = gp.RegistrySettings,
                Gpu = new Models.GpuSettings
                {
                    TextureQuality = gp.Gpu.TextureQuality,
                    ShadowQuality = gp.Gpu.ShadowQuality,
                    ViewDistance = gp.Gpu.ViewDistance,
                    AnisotropicFiltering = gp.Gpu.AnisotropicFiltering,
                    VSync = gp.Gpu.VSync,
                    MaxPerformanceMode = gp.Gpu.MaxPerformanceMode
                },
                Memory = new Models.MemorySettings
                {
                    LargePages = gp.Memory.LargePages,
                    WorkingSetTrim = gp.Memory.WorkingSetTrim,
                    PoolUsagePinnedLimit = gp.Memory.PoolUsagePinnedLimit
                },
                Network = new Models.NetworkSettings
                {
                    OptimizeTcp = gp.Network.OptimizeTcp,
                    EnableQos = gp.Network.EnableQos,
                    DisableBackgroundNetwork = gp.Network.DisableBackgroundNetwork,
                    TcpAckFrequency = gp.Network.TcpAckFrequency
                },
                Priority = new Models.ProcessPriority
                {
                    EnablePriority = gp.Priority.EnablePriority,
                    PriorityClass = (System.Diagnostics.ProcessPriorityClass)gp.Priority.PriorityClass
                }
            });
        }
    }

    public async Task StartMonitoring()
    {
        if (IsMonitoring) return;
        IsMonitoring = true;
        StatusMessage = "Monitorando...";

        try
        {
            await _temperatureMonitor?.StartMonitoringAsync(5000);
        }
        catch (Exception ex)
        {
            StatusMessage = "Erro ao iniciar monitoramento: " + ex.Message;
        }
    }

    public async Task StopMonitoring()
    {
        IsMonitoring = false;
        await _temperatureMonitor?.StopMonitoringAsync();
        StatusMessage = "Monitoramento parado";
    }

    private async void OnTemperatureReading(object? sender, TemperatureMonitor.TempReading e)
    {
        await Task.Run(() =>
        {
            CpuTempText = e.CpuTemp.ToString("F1") + " C";
            GpuTempText = e.GpuTemp.ToString("F1") + " C";
            CpuUsageText = e.CpuUsage.ToString("F1") + "%";
        });
    }

    private void OnTemperatureAlert(object? sender, string alert)
    {
        StatusMessage = "ALERTA: " + alert;
    }

    public async Task ApplyActiveProfileAsync()
    {
        if (IsApplying) return;
        IsApplying = true;
        StatusMessage = "Aplicando perfil...";

        try
        {
            var active = _gameProfiles.GetActiveGame();
            if (active != null)
            {
                // Aplicar configurações do perfil
                foreach (var kvp in active.RegistrySettings)
                {
                    // Aplicar regras do registry
                }

                StatusMessage = $"Perfil ativo: {active.DisplayName}";
            }
        }
        catch (Exception ex)
        {
            StatusMessage = "Erro ao aplicar: " + ex.Message;
        }
        finally
        {
            IsApplying = false;
        }
    }

    public async Task CollectMetricsAsync()
    {
        var metrics = new PerformanceMetrics
        {
            Fps = new Random().Next(60, 300),
            Ping = new Random().Next(10, 80),
            Temperature = new Random().Next(40, 90),
            CpuUsage = new Random().Next(5, 90),
            GpuUsage = new Random().Next(10, 95),
            Game = GameDetector.GetRunningGames().Count > 0
                ? GameDetector.GetRunningGames()[0]
                : "Nenhum",
            Timestamp = DateTime.Now
        };

        await Task.Run(() =>
        {
            Metrics.Add(metrics);
            LatestMetrics = metrics;
            Application.Current.Dispatcher.Invoke(() =>
            {
                // Atualizar UI
            });
        });
    }

    public async Task TakeSampleAsync()
    {
        await CollectMetricsAsync();
    }

    public async Task<StatisticalAnalysis?> AnalyzeAsync()
    {
        if (Metrics.Count < 3) return null;

        var analysis = new StatisticalAnalysis
        {
            SampleCount = Metrics.Count
        };

        await Task.Run(() =>
        {
            var fpsValues = new double[Metrics.Count];
            var pingValues = new double[Metrics.Count];
            var tempValues = new double[Metrics.Count];
            var cpuValues = new double[Metrics.Count];
            var gpuValues = new double[Metrics.Count];

            for (int i = 0; i < Metrics.Count; i++)
            {
                fpsValues[i] = Metrics[i].Fps;
                pingValues[i] = Metrics[i].Ping;
                tempValues[i] = Metrics[i].Temperature;
                cpuValues[i] = Metrics[i].CpuUsage;
                gpuValues[i] = Metrics[i].GpuUsage;
            }

            analysis.AverageFps = fpsValues.Average();
            analysis.AveragePing = pingValues.Average();
            analysis.AverageTemperature = tempValues.Average();
            analysis.FpsVariance = fpsValues.Variance();
            analysis.PingVariance = pingValues.Variance();
            analysis.CpuVariance = cpuValues.Variance();
            analysis.GpuVariance = gpuValues.Variance();
            analysis.HasAnomaly = analysis.AverageTemperature > 85 || analysis.AverageFps < 60;
        });

        StatisticalAnalysis = analysis;
        return analysis;
    }
}

public static class Extensions
{
    public static double Variance(this IEnumerable<double> values)
    {
        var avg = values.Average();
        return values.Average(v => Math.Pow(v - avg, 2));
    }
}
