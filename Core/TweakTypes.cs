namespace Cs2Booster.Core;

public enum TweakCategory
{
    Windows,
    Gpu,
    Power,
    Network,
    Services,
    Cs2
}

public enum TweakRisk
{
    Safe,      // totalmente reversível, sem efeito colateral prático
    Moderate,  // reversível, pode alterar comportamento perceptível
    Advanced   // requer reboot ou atenção
}

public sealed class TweakResult
{
    public bool Success { get; init; }
    public string Message { get; init; } = string.Empty;

    public static TweakResult Ok(string message = "Aplicado com sucesso") => new() { Success = true, Message = message };
    public static TweakResult Fail(string message) => new() { Success = false, Message = message };
}

public interface ITweak
{
    string Id { get; }
    string Name { get; }
    string Description { get; }
    string Effect { get; }
    TweakCategory Category { get; }
    TweakRisk Risk { get; }
    bool RequiresReboot { get; }
    bool IsApplied { get; }

    Task<TweakResult> ApplyAsync();
    Task<TweakResult> RevertAsync();
    void Refresh();
}

public class DelegateTweak : ITweak, System.ComponentModel.INotifyPropertyChanged
{
    private readonly Func<bool> _isApplied;
    private readonly Func<TweakResult> _apply;
    private readonly Func<TweakResult> _revert;
    private bool _applied;

    public DelegateTweak(
        string id,
        string name,
        string description,
        string effect,
        TweakCategory category,
        TweakRisk risk,
        bool requiresReboot,
        Func<bool> isApplied,
        Func<TweakResult> apply,
        Func<TweakResult> revert)
    {
        Id = id; Name = name; Description = description; Effect = effect;
        Category = category; Risk = risk; RequiresReboot = requiresReboot;
        _isApplied = isApplied; _apply = apply; _revert = revert;
        _applied = SafeProbe();
    }

    public string Id { get; }
    public string Name { get; }
    public string Description { get; }
    public string Effect { get; }
    public TweakCategory Category { get; }
    public TweakRisk Risk { get; }
    public bool RequiresReboot { get; }

    public event System.ComponentModel.PropertyChangedEventHandler? PropertyChanged;

    public bool IsApplied => _applied;

    public void Refresh()
    {
        bool v = SafeProbe();
        if (v != _applied)
        {
            _applied = v;
            PropertyChanged?.Invoke(this, new System.ComponentModel.PropertyChangedEventArgs(nameof(IsApplied)));
        }
    }

    private bool SafeProbe()
    {
        try { return _isApplied(); }
        catch { return false; }
    }

    public Task<TweakResult> ApplyAsync() => Task.Run(() => Guard(_apply));
    public Task<TweakResult> RevertAsync() => Task.Run(() => Guard(_revert));

    private TweakResult Guard(Func<TweakResult> op)
    {
        try { var r = op(); Refresh(); return r; }
        catch (Exception ex) { Refresh(); return TweakResult.Fail(ex.Message); }
    }
}
