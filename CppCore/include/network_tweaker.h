#pragma once

#include "cs2booster.h"
#include <windows.h>
#include <string>
#include <vector>

namespace cs2::booster {

class NetworkTweaker {
public:
    NetworkTweaker();
    ~NetworkTweaker();

    // Apply network optimizations for CS2
    TweakResult apply();

    // Revert network optimizations
    TweakResult revert();

    // Get current state
    PerformanceState getState() const;

    // Optimize TCP/IP settings
    bool optimizeTcpIp();

    // Set network adapter priority
    bool setAdapterPriority(const std::wstring& adapterName);

    // Enable QoS for gaming
    bool enableGamingQoS();

    // Disable background network tasks
    bool disableBackgroundNetwork();

    // Get network adapter info
    std::vector<std::wstring> getNetworkAdapters() const;

private:
    PerformanceState state_ = PerformanceState::Idle;

    // Network optimization operations
    bool applyTcpOptimization();
    bool applyQoSConfiguration();
    bool applyAdapterSettings();

    // Helper functions
    std::wstring getCurrentSettings() const;
};

} // namespace cs2::booster