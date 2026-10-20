namespace Cs2BoosterDesktop.Models;

public class NetworkSettings
{
    public bool OptimizeTcp { get; set; } = true;
    public bool EnableQos { get; set; } = true;
    public bool DisableBackgroundNetwork { get; set; } = true;
    public int TcpAckFrequency { get; set; } = 1;
}
