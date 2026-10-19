#pragma once

#include "cs2booster.h"
#include <windows.h>
#include <string>
#include <vector>
#include <atomic>

namespace cs2::booster {

class MemoryOptimizer {
public:
    MemoryOptimizer();
    ~MemoryOptimizer();

    // Apply memory optimizations for CS2
    TweakResult apply();

    // Revert memory optimizations
    TweakResult revert();

    // Get current state
    PerformanceState getState() const;

    // Physical memory optimization
    bool optimizeWorkingSet(DWORD processId);

    // Trim working set
    bool trimWorkingSet(DWORD processId);

    // Enable large pages
    bool enableLargePages();

    // Disable large pages
    bool disableLargePages();

    // Set process memory priority
    bool setMemoryPriority(DWORD processId);

    // Get memory info
    std::wstring getMemoryInfo(DWORD processId) const;

private:
    PerformanceState state_ = PerformanceState::Idle;

    // Memory optimization operations
    bool applyWorkingSetOptimization(DWORD processId);
    bool applyLargePageOptimization();
    bool applyMemoryPriority(DWORD processId);

    // Helper functions
    std::wstring getSystemInfo() const;
};

} // namespace cs2::booster