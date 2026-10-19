#include "pch.h"
#include "monitoring/system_monitor.h"
#include <windows.h>
#include <psapi.h>
#include <string>
#include <chrono>
#include <sstream>
#include <iomanip>

namespace cs2::booster::monitoring {

SystemMonitor::SystemMonitor() 
    : updateInterval_(1000) {
}

SystemMonitor::~SystemMonitor() {
}

void SystemMonitor::update() {
    std::lock_guard<std::mutex> lock(mutex_);
    
    // Update CPU info
    cpuInfo_ = retrieveCpuInfo();
    
    // Update memory info
    memoryInfo_ = retrieveMemoryInfo();
    
    // Update GPU info
    gpuInfo_ = retrieveGpuInfo();
    
    // Update timestamp
    lastUpdateTime_ = getCurrentTimestamp();
}

CpuInfo SystemMonitor::getCpuInfo() const {
    std::lock_guard<std::mutex> lock(const_cast<std::mutex&>(mutex_));
    return cpuInfo_;
}

MemoryInfo SystemMonitor::getMemoryInfo() const {
    std::lock_guard<std::mutex> lock(const_cast<std::mutex&>(mutex_));
    return memoryInfo_;
}

GpuInfo SystemMonitor::getGpuInfo() const {
    std::lock_guard<std::mutex> lock(const_cast<std::mutex&>(mutex_));
    return gpuInfo_;
}

std::map<std::string, std::string> SystemMonitor::getAllData() const {
    std::lock_guard<std::mutex> lock(const_cast<std::mutex&>(mutex_));
    
    std::map<std::string, std::string> data;
    
    // CPU data
    std::wstringstream cpuSs;
    cpuSs << L"CPU: " << cpuInfo_.logicalProcessors << L" threads, "
          << std::fixed << std::setprecision(1) << cpuInfo_.currentUsagePercent << L"% usage";
    data["cpu"] = std::string(cpuSs.str().begin(), cpuSs.str().end());
    
    // Memory data
    std::wstringstream memSs;
    memSs << L"Memory: " << (cpuInfo_.availablePhysicalMemory / 1024 / 1024) << L"MB available";
    data["memory"] = std::string(memSs.str().begin(), memSs.str().end());
    
    // GPU data
    std::wstringstream gpuSs;
    gpuSs << L"GPU: " << gpuInfo_.name.substr(0, 50) << L", "
          << std::fixed << std::setprecision(1) << gpuInfo_.gpuUsagePercent << L"% usage, "
          << gpuInfo_.temperatureC << L"°C";
    data["gpu"] = std::string(gpuSs.str().begin(), gpuSs.str().end());
    
    // Timestamp
    data["timestamp"] = std::string(lastUpdateTime_.begin(), lastUpdateTime_.end());
    
    return data;
}

bool SystemMonitor::isActive() const {
    return active_;
}

void SystemMonitor::setUpdateInterval(unsigned int milliseconds) {
    std::lock_guard<std::mutex> lock(mutex_);
    updateInterval_ = milliseconds;
}

std::wstring SystemMonitor::getLastUpdateTime() const {
    return lastUpdateTime_;
}

// CPU information retrieval
CpuInfo SystemMonitor::retrieveCpuInfo() const {
    CpuInfo info;
    
    // Get logical processor count
    info.logicalProcessors = std::thread::hardware_concurrency;
    if (info.logicalProcessors == 0) {
        SYSTEM_INFO sysInfo;
        GetNativeSystemInfo(&sysInfo);
        info.logicalProcessors = sysInfo.dwNumberOfProcessors;
    }
    
    // Get frequency information using registry or CPUID
    // For now, use GetSystemTimes for basic info
    FILETIME idleTime, kernelTime, userTime;
    if (GetSystemTimes(&idleTime, &kernelTime, &userTime)) {
        // Calculate CPU usage would require sampling over time
        // For now just set basic info
        info.currentFrequencyMHz = 0; // Would need CPUID for actual MHz
    }
    
    return info;
}

// Memory information retrieval
MemoryInfo SystemMonitor::retrieveMemoryInfo() const {
    MemoryInfo info;
    
    // Use GlobalMemoryStatusEx for memory info
    MEMORYSTATUSEX memStatus;
    memStatus.dwLength = sizeof(MEMORYSTATUSEX);
    if (GlobalMemoryStatusEx(&memStatus)) {
        info.totalPhysicalMemory = memStatus.ullTotalPhysical;
        info.availablePhysicalMemory = memStatus.ullAvailablePhysical;
        info.totalPageFile = memStatus.ullTotalPageFile;
        info.availablePageFile = memStatus.ullAvailablePageFile;
        info.totalVirtualMemory = memStatus.ullTotalVirtual;
        info.availableVirtualMemory = memStatus.ullAvailableVirtual;
    }
    
    return info;
}

// GPU information retrieval (basic)
GpuInfo SystemMonitor::retrieveGpuInfo() const {
    GpuInfo info;
    
    // Try to get basic GPU info from system
    // Full GPU info would require WMI, DXGI, or vendor-specific APIs
    
    // Get system info for at least some baseline
    SYSINFO si;
    ZeroMemory(&si, sizeof(si));
    si.dwOSVersionInfoSize = sizeof(si);
    
    // Try to get processor name as fallback
    // For GPU, we'll return basic info
    info.name = L"Unknown GPU";
    info.memoryMb = 0;
    info.coreClockMHz = 0;
    info.memoryClockMHz = 0;
    info.gpuUsagePercent = 0.0;
    info.temperatureC = 0.0;
    
    // Attempt to get more info via QueryDosDevice or other methods
    // This is a placeholder - full GPU monitoring requires directX or WMI
    
    return info;
}

std::wstring SystemMonitor::getCurrentTimestamp() const {
    auto now = std::chrono::system_clock::now();
    auto time_t_now = std::chrono::system_clock::to_time_t(now);
    std::wstringstream ss;
    ss << std::put_time(std::localtime(&time_t_now), L"%H:%M:%S");
    return ss.str();
}

} // namespace cs2::booster::monitoring