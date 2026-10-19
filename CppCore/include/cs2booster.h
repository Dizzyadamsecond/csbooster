#pragma once

#include <windows.h>
#include <string>
#include <vector>
#include <map>
#include <atomic>
#include <thread>
#include <mutex>

namespace cs2::booster {

// Performance configuration structure
struct PerformanceConfig {
    bool enableHighPerformancePowerPlan = true;
    bool enableMemoryOptimization = true;
    bool enableNetworkOptimization = true;
    bool enableGPUOptimization = true;
    bool cs2ProcessPriority = true;
    DWORD targetProcessPriority = THREAD_PRIORITY_TIME_CRITICAL;
    bool autoApplyOnLaunch = true;
};

// CS2 process information
struct Cs2ProcessInfo {
    DWORD processId = 0;
    HWND windowHandle = NULL;
    std::wstring processName;
    bool isRunning = false;
};

// Performance state
enum class PerformanceState {
    Idle,
    Optimizing,
    Applied,
    Error
};

// Forward declarations
class PerformanceManager;
class MemoryOptimizer;
class NetworkTweaker;
class GPOptimizer;

// Abstract base for all tweaks
class ITweak {
public:
    virtual ~ITweak() = default;
    virtual bool apply() = 0;
    virtual bool revert() = 0;
    virtual PerformanceState getState() const = 0;
    virtual std::string getName() const = 0;
    virtual std::string getDescription() const = 0;
};

// Result of a tweak operation
struct TweakResult {
    bool success = false;
    std::string message;
    PerformanceState state = PerformanceState::Idle;
};

} // namespace cs2::booster