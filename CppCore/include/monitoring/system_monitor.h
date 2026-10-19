#pragma once

#include <windows.h>
#include <string>
#include <vector>
#include <mutex>
#include <map>
#include <memory>

namespace cs2::booster::monitoring {

// System resource information
struct CpuInfo {
    unsigned int logicalProcessors = 0;
    unsigned int currentFrequencyMHz = 0;
    unsigned int maxFrequencyMHz = 0;
    double currentUsagePercent = 0.0;
    double totalUsagePercent = 0.0;
};

struct MemoryInfo {
    uint64_t totalPhysicalMemory = 0;
    uint64_t availablePhysicalMemory = 0;
    uint64_t totalPageFile = 0;
    uint64_t availablePageFile = 0;
    uint64_t totalVirtualMemory = 0;
    uint64_t availableVirtualMemory = 0;
};

struct GpuInfo {
    std::wstring name;
    std::wstring driverVersion;
    unsigned int memoryMb = 0;
    unsigned int coreClockMHz = 0;
    unsigned int memoryClockMHz = 0;
    double gpuUsagePercent = 0.0;
    double temperatureC = 0.0;
};

// System monitor for real-time tracking
class SystemMonitor {
public:
    SystemMonitor();
    ~SystemMonitor();

    // Update system information
    void update();

    // Get CPU information
    CpuInfo getCpuInfo() const;

    // Get memory information
    MemoryInfo getMemoryInfo() const;

    // Get GPU information
    GpuInfo getGpuInfo() const;

    // Get all collected data
    std::map<std::string, std::string> getAllData() const;

    // Check if monitor is active
    bool isActive() const;

    // Set update interval (milliseconds)
    void setUpdateInterval(unsigned int milliseconds);

    // Get last update timestamp
    std::wstring getLastUpdateTime() const;

private:
    // CPU info retrieval
    CpuInfo retrieveCpuInfo() const;

    // Memory info retrieval
    MemoryInfo retrieveMemoryInfo() const;

    // GPU info retrieval (basic, may need WMI/DXGI for full info)
    GpuInfo retrieveGpuInfo() const;

    // Update timestamp
    std::wstring getCurrentTimestamp() const;

    // State
    std::mutex mutex_;
    CpuInfo cpuInfo_;
    MemoryInfo memoryInfo_;
    GpuInfo gpuInfo_;
    bool active_ = true;
    unsigned int updateInterval_ = 1000; // Default 1 second
    std::wstring lastUpdateTime_;
};

} // namespace cs2::booster::monitoring