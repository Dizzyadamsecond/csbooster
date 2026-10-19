#pragma once

#include "cs2booster.h"
#include <windows.h>
#include <string>
#include <vector>

namespace cs2::booster {

class GPOptimizer {
public:
    GPOptimizer();
    ~GPOptimizer();

    // Apply GPU optimizations for CS2
    TweakResult apply();

    // Revert GPU optimizations
    TweakResult revert();

    // Get current state
    PerformanceState getState() const;

    // Enable/Disable V-Sync
    bool setVsync(bool enabled);

    // Set power mode to maximum performance
    bool setMaxPerformance();

    // Enable directX 12 features
    bool enableDirectX12Features();

    // Set texture filtering
    bool setTextureFiltering(const std::wstring& gpuKey, bool anisotropic);

    // Get GPU info
    std::wstring getGpuInfo() const;

    // Get current settings
    std::wstring getCurrentSettings() const;

private:
    PerformanceState state_ = PerformanceState::Idle;

    // GPU optimization operations
    bool applyPowerSettings();
    bool applyDirectXSettings();
    bool applyTextureSettings();

    // Registry helper
    HKEY openGpuRegistry() const;
};

} // namespace cs2::booster