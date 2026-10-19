#pragma once

#include "cs2booster.h"
#include <windows.h>
#include <string>
#include <vector>
#include <atomic>
#include <thread>
#include <mutex>
#include <chrono>

namespace cs2::booster {

class PerformanceManager {
public:
    PerformanceManager();
    ~PerformanceManager();

    // Initialize the manager
    bool initialize();

    // Apply all optimizations
    bool applyAll();

    // Revert all optimizations
    bool revertAll();

    // Get current state
    PerformanceState getState() const;

    // Check if CS2 is running
    bool isCs2Running() const;

    // Set CS2 process priority
    bool setCs2Priority(DWORD priority);

    // Get CS2 process info
    Cs2ProcessInfo getCs2Info() const;

    // Single optimization applier
    TweakResult applyTweak(const std::string& tweakName);

    // Get all available tweaks
    std::vector<std::string> getAvailableTweaks() const;

    // Save current config
    bool saveConfig(const std::string& path) const;

    // Load config
    bool loadConfig(const std::string& path);

    // Event callback type
    using OptimizeCallback = std::function<void(PerformanceState, const std::string&)>;
    void setProgressCallback(OptimizeCallback cb);
    void setCompleteCallback(OptimizeCallback cb);

private:
    // Individual tweak appliers
    TweakResult applyPowerPlan();
    TweakResult applyProcessPriority();
    TweakResult applyMemoryOptimization();
    TweakResult applyNetworkOptimization();
    TweakResult applyGPOptimization();

    PerformanceState state_ = PerformanceState::Idle;
    Cs2ProcessInfo cs2Info_;
    std::atomic<bool> isCs2Running_{false};
    std::mutex cs2Mutex_;

    // Callbacks
    OptimizeCallback progressCallback_;
    OptimizeCallback completeCallback_;

    // Configuration
    PerformanceConfig config_;

    // Helper methods
    bool findCs2Process();
    std::wstring getLastErrorMessage(DWORD errorCode) const;
};

} // namespace cs2::booster