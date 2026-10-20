#pragma once

#include <windows.h>
#include <stdint.h>

namespace cs2::booster {

// Timer resolution state and controls
// Windows default timer resolution: ~15.6ms (power saving)
// Target for CS2: 1ms or better to reduce frametime spikes

class TimerResolution {
public:
    TimerResolution();
    ~TimerResolution();

    // Initialize the timer resolution system
    // Returns true if timer resolution can be managed
    bool initialize();

    // Query current system timer resolution
    // Returns true if successful
    bool queryResolution();

    // Set timer resolution to maximum for CS2 performance
    // Target: 1ms resolution (significantly reduces 1% lows and frametime spikes)
    // Returns true if successfully set
    bool setMaximumResolution();

    // Clean up and restore original timer resolution
    // Must be called on shutdown (SIGINT, SIGTERM, close event)
    void cleanup();

    // Get current resolution in milliseconds
    double getResolutionMs() const;

    // Check if timer resolution management is enabled
    bool isEnabled() const;

    // Singleton access
    static TimerResolution& getInstance();

private:
    bool m_resolved = false;
    LONG m_currentResolution = 1;  // in milliseconds
    HANDLE m_shutdownEvent = NULL;
    BOOL m_shutdownFlag = FALSE;

    // Private helper: setup Ctrl+C handler
    void setupShutdownHandler();

    // Disable copy/move
    TimerResolution(const TimerResolution&) = delete;
    TimerResolution& operator=(const TimerResolution&) = delete;
};

// Public API functions (C-linkage for easy linking)
extern "C" {

// Initialize timer resolution system
// Must be called before any other timer functions
bool timer_resolution_init();

// Query current timer resolution status
bool timer_resolution_query();

// Set maximum timer resolution for CS2 performance
// Sets to 1ms resolution (from typical 15.6ms default)
// Returns true if successfully set
bool timer_resolution_set_max();

// Clean up timer resolution on exit
// Restores original resolution, releases resources
void timer_resolution_cleanup();

// Get current resolution in milliseconds
double timer_resolution_get_ms();

// Check if timer resolution is enabled/active
bool timer_resolution_is_enabled();

} // extern "C"

} // namespace cs2::booster