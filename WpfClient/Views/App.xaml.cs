using System;
using System.Windows;
using System.Windows.Threading;
using Cs2BoosterDesktop.ViewModels;
using Cs2BoosterDesktop.Views;

namespace Cs2BoosterDesktop;

public partial class App : Application
{
    protected override void OnStartup(StartupEventArgs e)
    {
        base.OnStartup(e);

        try
        {
            var viewModel = new AppViewModel();
            var mainWindow = new Views.MainWindow
            {
                DataContext = viewModel
            };
            mainWindow.Show();
        }
        catch (Exception ex)
        {
            MessageBox.Show("Erro ao iniciar: " + ex.Message, "CS2 Booster", MessageBoxButton.OK, MessageBoxImage.Error);
        }
    }
}
