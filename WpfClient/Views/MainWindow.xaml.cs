using System.Windows;
using System.Windows.Controls;
using Cs2BoosterDesktop.ViewModels;

namespace Cs2BoosterDesktop.Views;

public partial class MainWindow : Window
{
    public MainWindow()
    {
        InitializeComponent();
    }

    private void Nav_Checked(object sender, RoutedEventArgs e)
    {
        if (sender is not RadioButton rb) return;
        var tag = rb.Tag as string;
        if (tag is null) return;

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
}

