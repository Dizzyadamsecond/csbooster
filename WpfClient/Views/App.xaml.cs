using System;
using System.IO;
using System.Windows;
using System.Windows.Threading;
using Cs2BoosterDesktop.Services;
using Cs2BoosterDesktop.ViewModels;
using Cs2BoosterDesktop.Views;

namespace Cs2BoosterDesktop;

public partial class App : Application
{
    protected override void OnStartup(StartupEventArgs e)
    {
        base.OnStartup(e);

        ThemeManager.Initialize();

        try
        {
            var viewModel = new AppViewModel();
            var mainWindow = new Views.MainWindow
            {
                DataContext = viewModel
            };
            mainWindow.ThemeToggleButton.Content = ThemeManager.IsDark ? "Claro" : "Escuro";
            mainWindow.Show();
        }
        catch (Exception ex)
        {
            WriteStartupError(ex);
            MessageBox.Show("Erro ao iniciar: " + ex.Message, "CS2 Booster", MessageBoxButton.OK, MessageBoxImage.Error);
        }
    }

    /// <summary>
    /// Grava a exceção completa em disco: o MessageBox só mostra a mensagem curta
    /// e esconde o stack trace, que é justamente o que interessa no diagnóstico.
    /// </summary>
    private static void WriteStartupError(Exception ex)
    {
        try
        {
            var dir = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "Cs2Booster");
            Directory.CreateDirectory(dir);
            File.WriteAllText(Path.Combine(dir, "startup-error.log"), ex.ToString());
        }
        catch
        {
            // Diagnóstico é opcional: nunca deve mascarar o erro original.
        }
    }
}
