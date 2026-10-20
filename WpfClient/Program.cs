using Cs2BoosterDesktop;
using Cs2BoosterCore.Game;

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
