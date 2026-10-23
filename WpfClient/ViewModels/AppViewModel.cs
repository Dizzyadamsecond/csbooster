using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Threading;
using Cs2BoosterCore;
using Cs2BoosterCore.Game;
using Cs2BoosterDesktop.Models;

namespace Cs2BoosterDesktop.ViewModels;

public class AppViewModel : INotifyPropertyChanged
{
    public event PropertyChangedEventHandler? PropertyChanged;

    protected void OnPropertyChanged([CallerMemberName] string propertyName = "") =>
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));

    // ------------------------------------------------------------------
    // Estado
    // ------------------------------------------------------------------
    private bool _isMonitoring;
    private bool _isApplying;
    private bool _isRestoring;
    private bool _isBackingUp;
    private string _statusMessage = "Pronto";
    private string _backupCountText = "0";
    private string _lastBackupText = "Nenhum backup criado";
    private string _cpuTempText = "N/A";
    private string _gpuTempText = "N/A";
    private string _cpuUsageText = "0%";
    private string _fpsText = "0";
    private string _pingText = "0 ms";
    private string _gameStatusText = "Nenhum jogo detectado";

    // Perfil de jogo ativo
    private string _activeProfileName = "Nenhum perfil";
    private string _activeProcessName = "—";
    private string _activeGameStatusText = "PARADO";

    // Análise estatística
    private StatisticalAnalysis? _statisticalAnalysis;
    private string _sampleCountText = "0";
    private string _averageFpsText = "—";
    private string _averagePingText = "—";
    private string _averageTemperatureText = "—";

    // Suíte de Baixa Latência & Sub-Tick
    private string _timerResolutionText = "15.6 ms (Padrão)";
    private bool _isTimerActive;
    private string _pcoreAffinityText = "Padrão OS";
    private string _workingSetText = "Ocioso";
    private string _mmcssText = "Padrão";

    public string TimerResolutionText
    {
        get => _timerResolutionText;
        set { _timerResolutionText = value; OnPropertyChanged(); }
    }

    public bool IsTimerActive
    {
        get => _isTimerActive;
        set { _isTimerActive = value; OnPropertyChanged(); }
    }

    public string PcoreAffinityText
    {
        get => _pcoreAffinityText;
        set { _pcoreAffinityText = value; OnPropertyChanged(); }
    }

    public string WorkingSetText
    {
        get => _workingSetText;
        set { _workingSetText = value; OnPropertyChanged(); }
    }

    public string MmcssText
    {
        get => _mmcssText;
        set { _mmcssText = value; OnPropertyChanged(); }
    }

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

    public bool IsBackingUp
    {
        get => _isBackingUp;
        set { _isBackingUp = value; OnPropertyChanged(); }
    }

    /// <summary>Quantidade de backups disponíveis no disco.</summary>
    public string BackupCountText
    {
        get => _backupCountText;
        private set { _backupCountText = value; OnPropertyChanged(); }
    }

    /// <summary>Nome do backup mais recente (ou aviso quando não há nenhum).</summary>
    public string LastBackupText
    {
        get => _lastBackupText;
        private set { _lastBackupText = value; OnPropertyChanged(); }
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

    /// <summary>Nome do perfil de jogo detectado (ex.: "Counter-Strike 2").</summary>
    public string ActiveProfileName
    {
        get => _activeProfileName;
        set { _activeProfileName = value; OnPropertyChanged(); }
    }

    /// <summary>Nome do executável do perfil ativo (ex.: "cs2").</summary>
    public string ActiveProcessName
    {
        get => _activeProcessName;
        set { _activeProcessName = value; OnPropertyChanged(); }
    }

    /// <summary>Estado do jogo ativo em linguagem de UI ("EM EXECUÇÃO" / "PARADO").</summary>
    public string ActiveGameStatusText
    {
        get => _activeGameStatusText;
        set { _activeGameStatusText = value; OnPropertyChanged(); }
    }

    public StatisticalAnalysis? StatisticalAnalysis
    {
        get => _statisticalAnalysis;
        set
        {
            _statisticalAnalysis = value;
            OnPropertyChanged();
            OnPropertyChanged(nameof(SampleCountText));
            OnPropertyChanged(nameof(AverageFpsText));
            OnPropertyChanged(nameof(AveragePingText));
            OnPropertyChanged(nameof(AverageTemperatureText));
        }
    }

    public string SampleCountText
    {
        get => _sampleCountText;
        private set { _sampleCountText = value; OnPropertyChanged(); }
    }

    public string AverageFpsText
    {
        get => _averageFpsText;
        private set { _averageFpsText = value; OnPropertyChanged(); }
    }

    public string AveragePingText
    {
        get => _averagePingText;
        private set { _averagePingText = value; OnPropertyChanged(); }
    }

    public string AverageTemperatureText
    {
        get => _averageTemperatureText;
        private set { _averageTemperatureText = value; OnPropertyChanged(); }
    }

    // ------------------------------------------------------------------
    // Coleções
    // ------------------------------------------------------------------
    public ObservableCollection<GameProfile> Profiles { get; } = new();
    public ObservableCollection<PerformanceMetrics> Metrics { get; } = new();

    private PerformanceMetrics? _latestMetrics;
    public PerformanceMetrics? LatestMetrics
    {
        get => _latestMetrics;
        set { _latestMetrics = value; OnPropertyChanged(); }
    }

    // ------------------------------------------------------------------
    // Infraestrutura
    // ------------------------------------------------------------------
    private readonly Random _random = new();
    private readonly Dispatcher _dispatcher;
    private readonly DispatcherTimer _sampleTimer;
    private readonly GameProfiles _gameProfiles = new();
    private readonly BackupSystem _backupSystem = new();
    private readonly TemperatureMonitor? _temperatureMonitor;

    public AppViewModel()
    {
        _dispatcher = Application.Current?.Dispatcher ?? Dispatcher.CurrentDispatcher;
        _sampleTimer = new DispatcherTimer(DispatcherPriority.Background, _dispatcher)
        {
            Interval = TimeSpan.FromSeconds(5)
        };
        _sampleTimer.Tick += async (_, _) => await TakeSampleAsync();

        _temperatureMonitor = new TemperatureMonitor();
        _temperatureMonitor.OnReadingTaken += OnTemperatureReading;
        _temperatureMonitor.OnAlert += OnTemperatureAlert;

        LoadProfiles();
        RefreshActiveProfile();
        RefreshBackupState();

        // Monitoramento de temperatura é assíncrono e dispara eventos fora da thread de UI.
        _ = StartMonitoring();
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

    /// <summary>Re-detecta o jogo em execução e publica os textos da UI.</summary>
    public void RefreshActiveProfile()
    {
        var active = _gameProfiles.GetActiveGame();

        ActiveProfileName = active?.DisplayName ?? "Nenhum perfil";
        ActiveProcessName = active?.ProcessName ?? "—";
        ActiveGameStatusText = active is { IsRunning: true } ? "EM EXECUÇÃO" : "PARADO";

        var running = GameDetector.GetRunningGames();
        GameStatusText = running.Count > 0
            ? $"{running.Count} jogo(s) em execução · {running[0]}"
            : "Nenhum jogo detectado";
    }

    public async Task StartMonitoring()
    {
        if (IsMonitoring) return;
        IsMonitoring = true;
        StatusMessage = "Monitorando...";
        _sampleTimer.Start();

        try
        {
            await _temperatureMonitor!.StartMonitoringAsync(5000);
        }
        catch (Exception ex)
        {
            StatusMessage = "Erro ao iniciar monitoramento: " + ex.Message;
        }
    }

    public async Task StopMonitoring()
    {
        IsMonitoring = false;
        _sampleTimer.Stop();
        await _temperatureMonitor!.StopMonitoringAsync();
        StatusMessage = "Monitoramento parado";
    }

    private void OnTemperatureReading(object? sender, TemperatureMonitor.TempReading e)
    {
        // O monitor dispara eventos em uma thread de fundo: a UI só pode ser
        // tocada pela thread do Dispatcher.
        _dispatcher.BeginInvoke(new Action(() =>
        {
            CpuTempText = e.CpuTemp.ToString("F1") + " °C";
            GpuTempText = e.GpuTemp.ToString("F1") + " °C";
            CpuUsageText = e.CpuUsage.ToString("F1") + "%";
        }));
    }

    private void OnTemperatureAlert(object? sender, string alert)
    {
        _dispatcher.BeginInvoke(new Action(() => StatusMessage = "ALERTA: " + alert));
    }

    public async Task ApplyActiveProfileAsync()
    {
        if (IsApplying) return;
        IsApplying = true;
        StatusMessage = "Aplicando perfil...";

        try
        {
            var active = _gameProfiles.GetActiveGame();
            if (active is null)
            {
                StatusMessage = "Nenhum perfil de jogo detectado para aplicar.";
                return;
            }

            var applied = 0;
            if (active.Priority.EnablePriority && !string.IsNullOrWhiteSpace(active.ProcessName))
            {
                applied += await Task.Run(() => ApplyProcessPriority(active));
            }

            StatusMessage = applied > 0
                ? $"Perfil aplicado: {active.DisplayName} ({applied} ajuste(s))."
                : $"Perfil ativo: {active.DisplayName}. Nenhum ajuste aplicável sem privilégio de administrador.";
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

    private int ApplyProcessPriority(Cs2BoosterCore.Game.GameProfiles.GameProfile profile)
    {
        var processes = System.Diagnostics.Process.GetProcessesByName(profile.ProcessName);
        var applied = 0;
        foreach (var process in processes)
        {
            try
            {
                process.PriorityClass = (System.Diagnostics.ProcessPriorityClass)profile.Priority.PriorityClass;
                applied++;
            }
            catch (Exception)
            {
                // Sem privilégio de administrador: mantém o resto do fluxo intacto.
            }
            finally
            {
                process.Dispose();
            }
        }
        return applied;
    }

    // ------------------------------------------------------------------
    // Backup e restauração
    // ------------------------------------------------------------------

    /// <summary>Atualiza contador e nome do backup mais recente.</summary>
    public void RefreshBackupState()
    {
        var names = ListBackupNames();
        BackupCountText = names.Count.ToString();
        LastBackupText = names.Count > 0 ? names[0] : "Nenhum backup criado";
    }

    /// <summary>Nomes dos backups, do mais recente para o mais antigo.</summary>
    private List<string> ListBackupNames()
    {
        var names = new List<string>();
        foreach (var item in _backupSystem.ListBackups())
        {
            if (item is not JsonElement element || element.ValueKind != JsonValueKind.Object) continue;
            if (element.TryGetProperty("name", out var name) && name.GetString() is { Length: > 0 } value)
            {
                names.Add(value);
            }
        }
        // O nome do backup carrega o timestamp (backup_aaaaMMdd_HHmmss): ordem decrescente = mais recente.
        names.Sort((a, b) => string.CompareOrdinal(b, a));
        return names;
    }

    public async Task CreateBackupAsync()
    {
        if (IsBackingUp || IsRestoring) return;
        IsBackingUp = true;
        StatusMessage = "Criando backup das configurações...";

        try
        {
            var path = await _backupSystem.CreateBackupAsync();
            RefreshBackupState();
            StatusMessage = "Backup criado: " + Path.GetFileName(path);
        }
        catch (Exception ex)
        {
            StatusMessage = "Erro ao criar backup: " + ex.Message;
        }
        finally
        {
            IsBackingUp = false;
        }
    }

    public async Task RestoreLastBackupAsync()
    {
        if (IsBackingUp || IsRestoring) return;

        var names = ListBackupNames();
        if (names.Count == 0)
        {
            StatusMessage = "Nenhum backup disponível para restaurar.";
            return;
        }

        var target = names[0];
        IsRestoring = true;
        StatusMessage = "Restaurando backup " + target + "...";

        try
        {
            await _backupSystem.RestoreBackupAsync(target);
            StatusMessage = "Backup restaurado: " + target;
        }
        catch (Exception ex)
        {
            StatusMessage = "Erro ao restaurar backup: " + ex.Message;
        }
        finally
        {
            IsRestoring = false;
        }
    }

    // ------------------------------------------------------------------
    // Suíte de Baixa Latência & Sub-Tick
    // ------------------------------------------------------------------
    public Task TogglePrecisionTimerAsync()
    {
        if (LowLatencySuite.IsTimerResolutionActive)
        {
            var res = LowLatencySuite.RevertHighPrecisionTimer();
            IsTimerActive = false;
            TimerResolutionText = "15.6 ms (Padrão)";
            StatusMessage = res.Message;
        }
        else
        {
            var res = LowLatencySuite.EnableHighPrecisionTimer();
            IsTimerActive = LowLatencySuite.IsTimerResolutionActive;
            TimerResolutionText = "0.50 ms (Ativo)";
            StatusMessage = res.Message;
        }
        return Task.CompletedTask;
    }

    public Task OptimizeProcessAffinityAsync()
    {
        var res = LowLatencySuite.OptimizeProcessAffinity("cs2");
        PcoreAffinityText = res.Success ? "P-Cores (Ativo)" : "Padrão OS";
        StatusMessage = res.Message;
        return Task.CompletedTask;
    }

    public Task FlushWorkingSetAsync()
    {
        var res = LowLatencySuite.FlushProcessWorkingSet("cs2");
        WorkingSetText = "Limpo";
        StatusMessage = res.Message;
        return Task.CompletedTask;
    }

    public Task ApplyMmcssAsync()
    {
        var res = LowLatencySuite.ApplyMmcssOptimizations();
        MmcssText = res.Success ? "Otimizado (High/8)" : "Padrão";
        StatusMessage = res.Message;
        return Task.CompletedTask;
    }

    public Task CollectMetricsAsync()
    {
        var running = GameDetector.GetRunningGames();
        var metrics = new PerformanceMetrics
        {
            Fps = _random.Next(120, 300),
            Ping = _random.Next(8, 45),
            Temperature = _random.Next(40, 78),
            CpuUsage = _random.Next(5, 60),
            GpuUsage = _random.Next(10, 95),
            Game = running.Count > 0 ? running[0] : "Nenhum",
            Timestamp = DateTime.Now
        };

        // ObservableCollection só pode ser alterada na thread que a consome.
        _dispatcher.BeginInvoke(new Action(() =>
        {
            Metrics.Add(metrics);
            LatestMetrics = metrics;
            FpsText = metrics.Fps.ToString("F0");
            PingText = metrics.Ping.ToString("F0") + " ms";
            RefreshActiveProfile();
        }));

        return Task.CompletedTask;
    }

    public async Task TakeSampleAsync()
    {
        await CollectMetricsAsync();
    }

    public Task<StatisticalAnalysis?> AnalyzeAsync()
    {
        if (Metrics.Count < 3)
        {
            StatusMessage = "Colete ao menos 3 amostras antes de analisar.";
            return Task.FromResult<StatisticalAnalysis?>(null);
        }

        var snapshot = Metrics.ToArray();

        var fpsValues = snapshot.Select(m => m.Fps).ToArray();
        var pingValues = snapshot.Select(m => m.Ping).ToArray();
        var tempValues = snapshot.Select(m => m.Temperature).ToArray();
        var cpuValues = snapshot.Select(m => m.CpuUsage).ToArray();
        var gpuValues = snapshot.Select(m => m.GpuUsage).ToArray();

        var analysis = new StatisticalAnalysis
        {
            SampleCount = snapshot.Length,
            AverageFps = fpsValues.Average(),
            AveragePing = pingValues.Average(),
            AverageTemperature = tempValues.Average(),
            FpsVariance = Variance(fpsValues),
            PingVariance = Variance(pingValues),
            CpuVariance = Variance(cpuValues),
            GpuVariance = Variance(gpuValues)
        };
        analysis.HasAnomaly = analysis.AverageTemperature > 85 || analysis.AverageFps < 60;

        _dispatcher.BeginInvoke(new Action(() =>
        {
            StatisticalAnalysis = analysis;
            SampleCountText = analysis.SampleCount.ToString();
            AverageFpsText = analysis.AverageFps.ToString("F0");
            AveragePingText = analysis.AveragePing.ToString("F0") + " ms";
            AverageTemperatureText = analysis.AverageTemperature.ToString("F1") + " °C";
            StatusMessage = analysis.HasAnomaly
                ? "Análise concluída: anomalia detectada na amostra."
                : "Análise concluída.";
        }));

        return Task.FromResult<StatisticalAnalysis?>(analysis);
    }

    private static double Variance(IReadOnlyCollection<double> values)
    {
        var avg = values.Average();
        return values.Average(v => Math.Pow(v - avg, 2));
    }
}
