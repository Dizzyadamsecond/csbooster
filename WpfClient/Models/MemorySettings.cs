namespace Cs2BoosterDesktop.Models;

public class MemorySettings
{
    public bool LargePages { get; set; } = true;
    public bool WorkingSetTrim { get; set; } = true;
    public int PoolUsagePinnedLimit { get; set; } = 0;
}
