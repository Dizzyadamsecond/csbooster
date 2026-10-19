#include "pch.h"
#include "performance_manager.h"
#include <winbase.h>
#include <tlhelp32.h>
#include <winternl.h>
#include <algorithm>
#include <iostream>

namespace cs2::booster {

PerformanceManager::PerformanceManager() 
    : state_(PerformanceState::Idle) 
{
}

PerformanceManager::~PerformanceManager() {
    revertAll();
}

bool PerformanceManager::initialize() {
    state_ = PerformanceState::Idle;
    // Initialize subsystems
    return true;
}

bool PerformanceManager::applyAll() {
    state_ = PerformanceState::Optimizing;
    
    // Apply all optimizations in parallel where possible
    TweakResult powerResult = applyPowerPlan();
    if (!powerResult.success) {
        state_ = PerformanceState::Error;
        return false;
    }

    TweakResult priorityResult = applyProcessPriority();
    if (!priorityResult.success) {
        // Non-fatal, continue
    }

    TweakResult memoryResult = applyMemoryOptimization();
    if (!memoryResult.success) {
        // Non-fatal, continue
    }

    TweakResult networkResult = applyNetworkOptimization();
    if (!networkResult.success) {
        // Non-fatal, continue
    }

    TweakResult gpuResult = applyGPOptimization();
    if (!gpuResult.success) {
        // Non-fatal, continue
    }

    state_ = PerformanceState::Applied;
    return true;
}

bool PerformanceManager::revertAll() {
    state_ = PerformanceState::Idle;
    
    // Revert in reverse order
    applyTcpIpRevert(); // network
    applyGpuRevert();   // GPU
    applyMemoryRevert(); // memory
    applyPriorityRevert(); // process priority
    applyPowerRevert();  // power plan
    
    return true;
}

PerformanceState PerformanceManager::getState() const {
    return state_;
}

bool PerformanceManager::isCs2Running() const {
    std::lock_guard<std::mutex> lock(cs2Mutex_);
    return isCs2Running_.load();
}

bool PerformanceManager::setCs2Priority(DWORD priority) {
    if (!isCs2Running()) return false;
    
    // Set the CS2 process priority
    HANDLE hProcess = OpenProcess(PROCESS_SET_INFORMATION, FALSE, cs2Info_.processId);
    if (!hProcess) return false;
    
    BOOL result = SetPriorityClass(hProcess, priority);
    CloseHandle(hProcess);
    return result != FALSE;
}

Cs2ProcessInfo PerformanceManager::getCs2Info() const {
    std::lock_guard<std::mutex> lock(cs2Mutex_);
    return cs2Info_;
}

TweakResult PerformanceManager::applyTweak(const std::string& tweakName) {
    TweakResult result;
    result.state = PerformanceState::Idle;
    
    if (tweakName == "power_plan") {
        result = applyPowerPlan();
    } else if (tweakName == "process_priority") {
        result = applyProcessPriority();
    } else if (tweakName == "memory_optimization") {
        result = applyMemoryOptimization();
    } else if (tweakName == "network_optimization") {
        result = applyNetworkOptimization();
    } else if (tweakName == "gpu_optimization") {
        result = applyGPOptimization();
    }
    
    return result;
}

std::vector<std::string> PerformanceManager::getAvailableTweaks() const {
    return {
        "power_plan",
        "process_priority",
        "memory_optimization",
        "network_optimization",
        "gpu_optimization"
    };
}

bool PerformanceManager::saveConfig(const std::string& path) const {
    // Save configuration to file
    std::ofstream file(path);
    if (!file.is_open()) return false;
    
    file << "enableHighPerformancePowerPlan=" << config_.enableHighPerformancePowerPlan << "\n";
    file << "enableMemoryOptimization=" << config_.enableMemoryOptimization << "\n";
    file << "enableNetworkOptimization=" << config_.enableNetworkOptimization << "\n";
    file << "enableGPUOptimization=" << config_.enableGPUOptimization << "\n";
    file << "cs2ProcessPriority=" << config_.cs2ProcessPriority << "\n";
    file << "targetProcessPriority=" << config_.targetProcessPriority << "\n";
    
    return true;
}

bool PerformanceManager::loadConfig(const std::string& path) {
    std::ifstream file(path);
    if (!file.is_open()) return false;
    
    std::string line;
    while (std::getline(file, line)) {
        if (line.find("enableHighPerformancePowerPlan=") == 0) {
            config_.enableHighPerformancePowerPlan = (line.substr(31) == "true");
        } else if (line.find("enableMemoryOptimization=") == 0) {
            config_.enableMemoryOptimization = (line.substr(25) == "true");
        } else if (line.find("enableNetworkOptimization=") == 0) {
            config_.enableNetworkOptimization = (line.substr(26) == "true");
        } else if (line.find("enableGPUOptimization=") == 0) {
            config_.enableGPUOptimization = (line.substr(24) == "true");
        } else if (line.find("cs2ProcessPriority=") == 0) {
            config_.cs2ProcessPriority = (line.substr(19) == "true");
        } else if (line.find("targetProcessPriority=") == 0) {
            try {
                config_.targetProcessPriority = std::stoi(line.substr(23));
            } catch (...) {}
        }
    }
    
    return true;
}

void PerformanceManager::setProgressCallback(OptimizeCallback cb) {
    progressCallback_ = cb;
}

void PerformanceManager::setCompleteCallback(OptimizeCallback cb) {
    completeCallback_ = cb;
}

bool PerformanceManager::applyPowerPlan() {
    if (!config_.enableHighPerformancePowerPlan) {
        result.state = PerformanceState::Skipped;
        return true;
    }
    
    // Set high performance power plan
    // Using powercfg command
    std::string command = "powercfg -setactive " + std::string(UltimateScheme);
    int code = system(command.c_str());
    
    if (code != 0) {
        // Try Ultimate Performance scheme
        // Fallback to high performance
        command = "powercfg -setactive " + std::string(HighPerformanceScheme);
        code = system(command.c_str());
    }
    
    return code == 0;
}

TweakResult PerformanceManager::applyProcessPriority() {
    TweakResult result;
    
    if (!config_.cs2ProcessPriority && !isCs2Running()) {
        result.state = PerformanceState::Skipped;
        return result;
    }
    
    if (isCs2Running()) {
        // Set process priority
        BOOL success = SetPriorityClass(
            OpenProcess(PROCESS_SET_INFORMATION, FALSE, cs2Info_.processId),
            config_.targetProcessPriority
        );
        result.success = success != FALSE;
        result.state = success ? PerformanceState::Applied : PerformanceState::Error;
    } else {
        result.success = true;
        result.state = PerformanceState::Skipped;
    }
    
    return result;
}

TweakResult PerformanceManager::applyMemoryOptimization() {
    TweakResult result;
    
    if (!config_.enableMemoryOptimization) {
        result.state = PerformanceState::Skipped;
        return result;
    }
    
    // Apply memory optimizations
    // Enable large pages, trim working set, etc.
    MemoryOptimizer memOpt;
    result = memOpt.apply();
    
    return result;
}

TweakResult PerformanceManager::applyNetworkOptimization() {
    TweakResult result;
    
    if (!config_.enableNetworkOptimization) {
        result.state = PerformanceState::Skipped;
        return result;
    }
    
    // Apply network optimizations
    NetworkTweaker netTweaker;
    result = netTweaker.apply();
    
    return result;
}

TweakResult PerformanceManager::applyGPOptimization() {
    TweakResult result;
    
    if (!config_.enableGPUOptimization) {
        result.state = PerformanceState::Skipped;
        return result;
    }
    
    // Apply GPU optimizations
    GPOptimizer gpuOpt;
    result = gpuOpt.apply();
    
    return result;
}

bool PerformanceManager::findCs2Process() {
    // Take snapshot of all processes
    HANDLE hSnapshot = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
    if (hSnapshot == INVALID_HANDLE_VALUE) return false;
    
    PROCESSENTRY32W pe32;
    pe32.dwSize = sizeof(PROCESSENTRY32W);
    
    bool found = false;
    
    if (Process32FirstW(hSnapshot, &pe32)) {
        do {
            // Check for cs2 processes
            if (wcscmp(pe32.szExeFile, L"cs2.exe") == 0 || 
                wcscmp(pe32.szExeFile, L"cs2_r5.exe") == 0) {
                cs2Info_.processId = pe32.th32ProcessID;
                cs2Info_.processName = pe32.szExeFile;
                cs2Info_.isRunning = true;
                isCs2Running_.store(true);
                found = true;
                break;
            }
        } while (Process32NextW(hSnapshot, &pe32));
    }
    
    CloseHandle(hSnapshot);
    return found;
}

std::wstring PerformanceManager::getLastErrorMessage(DWORD errorCode) const {
    LPWSTR messageBuffer = nullptr;
    size_t size = FormatMessageW(
        FORMAT_MESSAGE_ALLOCATE_BUFFER | FORMAT_MESSAGE_FROM_SYSTEM | FORMAT_MESSAGE_MAX_WIDTH_MASK,
        nullptr,
        errorCode,
        0,
        (LPWSTR)&messageBuffer,
        0,
        nullptr
    );
    
    std::wstring message;
    if (size > 0) {
        message = std::wstring(messageBuffer, size);
        LocalFree(messageBuffer);
    }
    
    return message;
}

} // namespace cs2::booster