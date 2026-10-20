namespace Cs2BoosterDesktop.Models;

public class PerformanceMetrics
{
    public double Fps { get; set; }
    public double Ping { get; set; }
    public double Temperature { get; set; }
    public double CpuUsage { get; set; }
    public double GpuUsage { get; set; }
    public string Game { get; set; } = "";
    public DateTime Timestamp { get; set; } = DateTime.Now;
}
