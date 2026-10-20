namespace Cs2BoosterDesktop.Models;

public class TweakResult
{
    public bool Success { get; set; }
    public string Message { get; set; } = "";
    public static TweakResult Ok(string message = "Aplicado com sucesso") => new() { Success = true, Message = message };
    public static TweakResult Fail(string message) => new() { Success = false, Message = message };
}
