namespace Cs2BoosterDesktop.Models;

public class StatisticalAnalysis
{
    public double AverageFps { get; set; }
    public double AveragePing { get; set; }
    public double AverageTemperature { get; set; }
    public double FpsVariance { get; set; }
    public double PingVariance { get; set; }
    public double CpuVariance { get; set; }
    public double GpuVariance { get; set; }
    public int SampleCount { get; set; }
    public bool HasAnomaly { get; set; }
}
