#include "pch.h"
#include "advanced/profiler.h"
#include <windows.h>
#include <chrono>
#include <algorithm>

namespace cs2::booster::advanced {

FpsProfiler::FpsProfiler() 
    : startTime_(std::chrono::steady_clock::now()) {
    // Initialize measurements vector
    measurements_.reserve(maxMeasurements_);
}

FpsProfiler::~FpsProfiler() {
}

void FpsProfiler::updateFrame() {
    std::lock_guard<std::mutex> lock(mutex_);
    
    auto now = std::chrono::steady_clock::now();
    
    if (!initialized_) {
        startTime_ = now;
        initialized_ = true;
        measurements_.clear();
        measurementIndex_ = 0;
        frameCount_ = 0;
        totalFrameTime_ = 0.0;
        minFps_ = 999.0;
        maxFps_ = 0.0;
    }
    
    // Calculate frame time since last frame
    static auto lastFrameTime = now;
    auto frameDuration = std::chrono::duration<double, std::milli>(now - lastFrameTime).count();
    lastFrameTime = now;
    
    // Update FPS calculation
    frameCount_++;
    totalFrameTime_ += frameDuration;
    
    // Store measurement
    FpsMeasurement meas;
    meas.timestamp = now;
    
    if (frameDuration > 0) {
        meas.fps = 1000.0 / frameDuration;
    } else {
        meas.fps = 0.0;
    }
    meas.frameTimeMs = frameDuration;
    meas.valid = true;
    
    // Manage circular buffer
    if (measurementIndex_ < measurements_.size()) {
        measurements_[measurementIndex_] = meas;
    } else {
        if (measurements_.size() < maxMeasurements_) {
            measurements_.push_back(meas);
        } else {
            // Circular buffer - overwrite oldest
            measurements_[measurementIndex_ % maxMeasurements_] = meas;
        }
    }
    measurementIndex_++;
    
    // Update min/max FPS
    if (meas.fps > 0) {
        if (meas.fps < minFps_) minFps_ = meas.fps;
        if (meas.fps > maxFps_) maxFps_ = meas.fps;
    }
    
    // Keep measurements vector from growing unbounded
    if (measurements_.size() > maxMeasurements_) {
        // Shift out oldest or trim
        if (measurements_.size() > 3) {
            measurements_.erase(measurements_.begin());
        }
    }
}

double FpsProfiler::getCurrentFps() const {
    std::lock_guard<std::mutex> lock(const_cast<std::mutex&>(mutex_));
    // Return the most recent FPS measurement
    if (!measurements_.empty()) {
        return measurements_.back().fps;
    }
    return 0.0;
}

double FpsProfiler::getAverageFps(int frameCount) const {
    std::lock_guard<std::mutex> lock(const_cast<std::mutex&>(mutex_));
    
    if (measurements_.empty()) return 0.0;
    
    // Use the specified number of most recent frames
    int count = std::min(frameCount, (int)measurements_.size());
    if (count <= 0) return 0.0;
    
    double sum = 0.0;
    int validCount = 0;
    
    // Sum last 'count' measurements
    for (int i = (int)measurements_.size() - count; i < (int)measurements_.size(); i++) {
        if (measurements_[i].valid && measurements_[i].fps > 0) {
            sum += measurements_[i].fps;
            validCount++;
        }
    }
    
    if (validCount > 0) {
        return sum / validCount;
    }
    return 0.0;
}

double FpsProfiler::getMinFps() const {
    std::lock_guard<std::mutex> lock(const_cast<std::mutex&>(mutex_));
    return minFps_;
}

double FpsProfiler::getMaxFps() const {
    std::lock_guard<std::mutex> lock(const_cast<std::mutex&>(mutex_));
    return maxFps_;
}

double FpsProfiler::getCurrentFrameTime() const {
    std::lock_guard<std::mutex> lock(const_cast<std::mutex&>(mutex_));
    if (!measurements_.empty()) {
        return measurements_.back().frameTimeMs;
    }
    return 0.0;
}

void FpsProfiler::reset() {
    std::lock_guard<std::mutex> lock(mutex_);
    measurements_.clear();
    measurementIndex_ = 0;
    frameCount_ = 0;
    totalFrameTime_ = 0.0;
    minFps_ = 999.0;
    maxFps_ = 0.0;
    initialized_ = false;
}

bool FpsProfiler::hasEnoughData(int frameCount) const {
    std::lock_guard<std::mutex> lock(const_cast<std::mutex&>(mutex_));
    return (int)measurements_.size() >= frameCount;
}

const std::vector<FpsMeasurement>& FpsProfiler::getMeasurements() const {
    return measurements_;
}

} // namespace cs2::booster::advanced