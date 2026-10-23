using System;
using System.Windows;

namespace Cs2BoosterDesktop.Services;

/// <summary>
/// Runtime theme switch for the WPF client.
///
/// The generated token dictionaries (Tokens.generated.xaml / Tokens.Dark.generated.xaml)
/// are plain ResourceDictionaries. Swapping the merged dictionary re-paints every
/// element that references the brushes through <c>DynamicResource</c> — which is why
/// Controls.xaml and MainWindow.xaml must never use StaticResource for Brush.* keys.
/// </summary>
public static class ThemeManager
{
    public const string LightUri = "pack://application:,,,/Themes/Tokens.generated.xaml";
    public const string DarkUri = "pack://application:,,,/Themes/Tokens.Dark.generated.xaml";

    private const string PersistKey = "Cs2Booster.Theme";

    public static bool IsDark { get; private set; }

    /// <summary>Loads the persisted preference (dark first) and applies it.</summary>
    public static void Initialize()
    {
        var dark = true; // Dark default for pro gamer / CS2 aesthetic
        try
        {
            var saved = Environment.GetEnvironmentVariable(PersistKey);
            if (string.IsNullOrEmpty(saved))
            {
                var key = Microsoft.Win32.Registry.CurrentUser.OpenSubKey(@"Software\Cs2Booster");
                saved = key?.GetValue("Theme") as string;
            }
            if (!string.IsNullOrEmpty(saved))
            {
                dark = string.Equals(saved, "dark", StringComparison.OrdinalIgnoreCase);
            }
        }
        catch
        {
            // Preference is best-effort: a locked-down registry must not block startup.
            dark = true;
        }
        Apply(dark);
    }

    public static void Toggle() => Apply(!IsDark);

    public static void Apply(bool dark)
    {
        var app = Application.Current;
        if (app is null) return;

        var merged = app.Resources.MergedDictionaries;
        var index = -1;

        for (int i = 0; i < merged.Count; i++)
        {
            var source = merged[i].Source?.OriginalString ?? string.Empty;
            if (source.Contains("Tokens.generated.xaml") || source.Contains("Tokens.Dark.generated.xaml"))
            {
                index = i;
                break;
            }
        }

        if (index < 0)
        {
            index = 0;
            merged.Insert(index, new ResourceDictionary());
        }
        else
        {
            merged.RemoveAt(index);
        }

        merged.Insert(index, new ResourceDictionary
        {
            Source = new Uri(dark ? DarkUri : LightUri, UriKind.Absolute)
        });

        IsDark = dark;
        Persist(dark);
    }

    private static void Persist(bool dark)
    {
        try
        {
            using var key = Microsoft.Win32.Registry.CurrentUser.CreateSubKey(@"Software\Cs2Booster");
            key?.SetValue("Theme", dark ? "dark" : "light");
        }
        catch
        {
            // Ignore: theme preference is a convenience, never a hard requirement.
        }
    }
}
