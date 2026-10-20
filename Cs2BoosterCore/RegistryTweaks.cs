using Microsoft.Win32;

namespace Cs2BoosterCore;

public static class RegistryTweaks
{
    public static TweakResult SetCs2ExePath()
    {
        try
        {
            var path = Environment.GetEnvironmentVariable("CS2_PATH");
            if (string.IsNullOrEmpty(path))
            {
                return TweakResult.Fail("CS2_PATH nao definido no ambiente");
            }
            return TweakResult.Ok("Caminho do CS2 verificado: " + path);
        }
        catch (Exception ex)
        {
            return TweakResult.Fail(ex.Message);
        }
    }

    public static TweakResult SetGamePriority()
    {
        try
        {
            using var key = Registry.CurrentUser.CreateSubKey(
                "Software\\Microsoft\\Windows NT\\CurrentVersion\\IniFileMapping\\cs2_priority", writable: true);
            key.SetValue("", "high", RegistryValueKind.String);
            return TweakResult.Ok("Prioridade alta definida no registry");
        }
        catch (Exception ex)
        {
            return TweakResult.Fail(ex.Message);
        }
    }

    public static TweakResult SetGraphicsSettings()
    {
        try
        {
            using var key = Registry.CurrentUser.CreateSubKey(
                "Software\\Valve\\Counter-Strike 2", writable: true);
            key.SetValue("fps_max", 0, RegistryValueKind.DWord);
            key.SetValue("high_priority", 1, RegistryValueKind.DWord);
            return TweakResult.Ok("Configuracoes graficas CS2 definidas no registry");
        }
        catch (Exception ex)
        {
            return TweakResult.Fail(ex.Message);
        }
    }

    public static TweakResult SetGameDvrDisabled()
    {
        try
        {
            using var key = Registry.CurrentUser.CreateSubKey(
                "Software\\Microsoft\\Windows\\CurrentVersion\\GameConfigStore", writable: true);
            key.SetValue("GameDVR_Enabled", 0, RegistryValueKind.DWord);
            return TweakResult.Ok("Game DVR desativado no registry");
        }
        catch (Exception ex)
        {
            return TweakResult.Fail(ex.Message);
        }
    }

    public static TweakResult SetAutoGameMode()
    {
        try
        {
            using var key = Registry.CurrentUser.CreateSubKey(
                "Software\\Microsoft\\Windows\\CurrentVersion\\GameConfigStore", writable: true);
            key.SetValue("AutoGameMode", 1, RegistryValueKind.DWord);
            return TweakResult.Ok("Auto Game Mode ativado no registry");
        }
        catch (Exception ex)
        {
            return TweakResult.Fail(ex.Message);
        }
    }
}
