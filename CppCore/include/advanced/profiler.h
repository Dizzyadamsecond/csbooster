#pragma once

#include <windows.h>
#include <string>
#include <vector>
#include <mutex>
#include <chrono>

namespace cs2::booster::advanced {

// FPS measurement structure
struct FpsMeasurement {
    std::chrono::steady_clock::time_point timestamp;
    double fps;
    double frameTimeMs;
    bool valid;
};

// FPS Profiler for tracking performance
class FpsProfiler {
public:
    FpsProfiler();
    ~FpsProfiler();

    // Update profiler with a new frame
    void updateFrame();

    // Get current FPS
    double getCurrentFps() const;

    // Get average FPS over last N frames
    double getAverageFps(int frameCount = 60) const;

    // Get minimum FPS over tracking period
    double getMinFps() const;

    // Get maximum FPS over tracking period
    double getMaxFps() const;

    // Get current frame time
    double getCurrentFrameTime() const;

    // Reset profiler
    void reset();

    // Check if we have enough data
    bool hasEnoughData(int frameCount = 60) const;

    // Get measurements vector (for UI display)
    const std::vector<FpsMeasurement>& getMeasurements() const;

private:
    std::vector<FpsMeasurement> measurements_;
    std::mutex mutex_;
    size_t maxMeasurements_ = 300; // 5 seconds at 60fps
    size_t measurementIndex_ = 0;
    bool initialized_ = false;
    std::chrono::steady_clock::time_point startTime_;
    double totalFrameTime_ = 0.0;
    int frameCount_ = 0;
    double minFps_ = 999.0;
    double maxFps_ = 0.0;
};

} // namespace cs2::booster::advanced