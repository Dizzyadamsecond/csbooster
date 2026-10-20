using System;
using System.Diagnostics;

namespace Cs2BoosterDesktop.Models;

public class SystemStatus
{
    public string Os { get; set; } = "";
    public int CpuCount { get; set; }
    public double CpuUsage { get; set; }
    public double CpuTemperature { get; set; }
    public double GpuTemperature { get; set; }
    public double GpuUsage { get; set; }
    public bool Cs2Running { get; set; }
    public bool ValorantRunning { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.Now;
}
