using Microsoft.Win32;
using System.Diagnostics;

namespace Cs2BoosterCore;

public static class ServiceTweaks
{
    public static TweakResult DisableGameDvr()
    {
        try
        {
            using var key = Registry.CurrentUser.CreateSubKey(
                "Software\\Microsoft\\Windows\\CurrentVersion\\GameConfigStore", writable: true);
            key.SetValue("GameDVR_Enabled", 0, RegistryValueKind.DWord);
            return TweakResult.Ok("Game DVR desativado");
        }
        catch (Exception ex)
        {
            return TweakResult.Fail(ex.Message);
        }
    }

    public static TweakResult DisableSuperfetch()
    {
        try
        {
            using var key = Registry.CurrentUser.CreateSubKey(
                "Software\\Microsoft\\Windows\\CurrentVersion\\GameConfigStore", writable: true);
            key.SetValue("GameMode", 1, RegistryValueKind.DWord);
            return TweakResult.Ok("GameMode ativado no registry");
        }
        catch (Exception ex)
        {
            return TweakResult.Fail(ex.Message);
        }
    }
}
