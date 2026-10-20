using System.Diagnostics;

namespace Cs2BoosterDesktop.Models;

public class ProcessPriority
{
    public bool EnablePriority { get; set; } = true;
    public ProcessPriorityClass PriorityClass { get; set; } = ProcessPriorityClass.High;
}
