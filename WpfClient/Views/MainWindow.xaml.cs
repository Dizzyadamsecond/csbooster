using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media.Animation;
using Cs2BoosterDesktop.Services;
using Cs2BoosterDesktop.ViewModels;

namespace Cs2BoosterDesktop.Views;

public partial class MainWindow : Window
{
    public MainWindow()
    {
        InitializeComponent();

        // O XAML marca o primeiro item como IsChecked="True", e isso dispara o
        // evento Checked durante o InitializeComponent — antes de os painéis de
        // conteúdo existirem. Aplicamos o estado inicial aqui, com a árvore
        // visual já completa.
        ApplyNav("dashboard");

        StartStatusPulse();
        UpdateThemeState();
    }

    /// <summary>
    /// Pulso do ponto de status do cabeçalho — equivalente ao <c>.ticker-dot</c>
    /// animado da versão web.
    /// </summary>
    private void StartStatusPulse()
    {
        var pulse = new DoubleAnimation
        {
            From = 1.0,
            To = 0.35,
            Duration = new Duration(TimeSpan.FromSeconds(0.9)),
            AutoReverse = true,
            RepeatBehavior = RepeatBehavior.Forever
        };

        StatusDot.BeginAnimation(OpacityProperty, pulse);
    }

    private void UpdateThemeState()
    {
        ThemeStateText.Text = ThemeManager.IsDark ? "TEMA: ESCURO" : "TEMA: CLARO";
    }

    private void Nav_Checked(object sender, RoutedEventArgs e)
    {
        if (sender is not RadioButton rb) return;
        if (rb.Tag is not string tag) return;

        ApplyNav(tag);
    }

    /// <summary>
    /// Alterna a visibilidade dos painéis conforme o item de menu selecionado.
    /// </summary>
    private void ApplyNav(string tag)
    {
        // Durante o InitializeComponent os painéis ainda não foram instanciados
        // (o XAML os declara depois da barra lateral). Nesse ponto o estado
        // inicial já vem correto do próprio XAML.
        if (DashboardPanel is null || OptimizePanel is null ||
            ProfilesPanel is null || MonitorPanel is null)
        {
            return;
        }

        DashboardPanel.Visibility = tag == "dashboard" ? Visibility.Visible : Visibility.Collapsed;
        OptimizePanel.Visibility = tag == "optimize" ? Visibility.Visible : Visibility.Collapsed;
        ProfilesPanel.Visibility = tag == "profiles" ? Visibility.Visible : Visibility.Collapsed;
        MonitorPanel.Visibility = tag == "monitor" ? Visibility.Visible : Visibility.Collapsed;
    }

    private async void OnCollectSample(object sender, RoutedEventArgs e)
    {
        if (DataContext is AppViewModel vm) await vm.TakeSampleAsync();
    }

    private async void OnAnalyze(object sender, RoutedEventArgs e)
    {
        if (DataContext is AppViewModel vm) await vm.AnalyzeAsync();
    }

    private async void OnApplyProfile(object sender, RoutedEventArgs e)
    {
        if (DataContext is AppViewModel vm) await vm.ApplyActiveProfileAsync();
    }

    private async void OnStartMonitoring(object sender, RoutedEventArgs e)
    {
        if (DataContext is AppViewModel vm) await vm.StartMonitoring();
    }

    private async void OnStopMonitoring(object sender, RoutedEventArgs e)
    {
        if (DataContext is AppViewModel vm) await vm.StopMonitoring();
    }

    private async void OnCreateBackup(object sender, RoutedEventArgs e)
    {
        if (DataContext is AppViewModel vm) await vm.CreateBackupAsync();
    }

    private async void OnRestoreBackup(object sender, RoutedEventArgs e)
    {
        if (DataContext is AppViewModel vm) await vm.RestoreLastBackupAsync();
    }

    private async void OnToggleTimerResolution(object sender, RoutedEventArgs e)
    {
        if (DataContext is AppViewModel vm) await vm.TogglePrecisionTimerAsync();
    }

    private async void OnOptimizeAffinity(object sender, RoutedEventArgs e)
    {
        if (DataContext is AppViewModel vm) await vm.OptimizeProcessAffinityAsync();
    }

    private async void OnFlushWorkingSet(object sender, RoutedEventArgs e)
    {
        if (DataContext is AppViewModel vm) await vm.FlushWorkingSetAsync();
    }

    private async void OnApplyMmcss(object sender, RoutedEventArgs e)
    {
        if (DataContext is AppViewModel vm) await vm.ApplyMmcssAsync();
    }

    private void OnToggleTheme(object sender, RoutedEventArgs e)
    {
        ThemeManager.Toggle();
        ThemeToggleButton.Content = ThemeManager.IsDark ? "Claro" : "Escuro";
        UpdateThemeState();
    }
}

