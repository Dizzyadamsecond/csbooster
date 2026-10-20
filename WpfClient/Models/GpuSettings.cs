namespace Cs2BoosterDesktop.Models;

public class GpuSettings
{
    public int TextureQuality { get; set; } = 8;
    public int ShadowQuality { get; set; } = 4;
    public int ViewDistance { get; set; } = 4;
    public int AnisotropicFiltering { get; set; } = 16;
    public bool VSync { get; set; } = false;
    public bool MaxPerformanceMode { get; set; } = true;
}
