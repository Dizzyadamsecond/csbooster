using System;
using Cs2BoosterCore.Game;

namespace Cs2BoosterDesktop;

/// <summary>
/// Entry point do cliente WPF.
///
/// O atributo [STAThread] é obrigatório: componentes WPF (Dispatcher, Window,
/// Dialog) exigem um apartment state single-threaded. Com top-level statements
/// o compilador gera um Main sem esse atributo e a UI falha ao iniciar.
/// </summary>
internal static class Program
{
    [STAThread]
    public static void Main()
    {
        AppDomain.CurrentDomain.AssemblyResolve += (sender, args) =>
        {
            var assemblyName = new System.Reflection.AssemblyName(args.Name);
            if (assemblyName.Name == "Cs2BoosterCore")
            {
                return typeof(GameProfiles).Assembly;
            }
            return null;
        };

        var app = new App();
        app.InitializeComponent();
        app.Run();
    }
}
