#pragma once

#include <windows.h>
#include <tlhelp32.h>
#include <string>
#include <vector>
#include <functional>
#include <atomic>
#include <thread>
#include <chrono>

namespace cs2::booster {

// Forward declaration
class ProcessManager;

// Callback type for CS2 status changes
// called when CS2 starts/stopps with the new PID
using OnCs2StatusChangedCallback = std::function<void(bool isRunning, DWORD cs2Pid)>;

// Process Manager - Handles CS2 process detection, priority management,
// and I/O priority configuration. Uses minimal rights to stay VAC-safe.
// All operations restrict to PROCESS_SET_INFORMATION | PROCESS_QUERY_LIMITED_INFORMATION
// to avoid triggering VAC anti-cheat hooks.

class ProcessManager {
public:
    ProcessManager();
    ~ProcessManager();

    // Start background monitoring thread
    // Polls for CS2 process every 2 seconds automatically
    // Returns true if monitoring started successfully
    bool startMonitoring();

    // Stop the background monitoring thread
    // Must be called on application shutdown
    void stopMonitoring();

    // Check if monitoring is active
    bool isMonitoring() const;

    // Poll once for CS2 process (call from timer or manual trigger)
    // Returns true if CS2 was found in this poll
    bool pollOnce();

    // Set priority for a specific process ID
    // processId: PID of target process (0 = no process)
    // elevate: true = HIGH_PRIORITY_CLASS, false = IDLE_PRIORITY_CLASS
    // Returns true if priority was set successfully
    bool setProcessPriority(DWORD processId, bool elevate);

    // Set I/O priority for a specific process ID
    // processId: PID of target process (0 = no process)
    // high: true = high I/O priority (helps texture/asset loading),
    //       false = low I/O priority for background
    // Returns true if I/O priority was set successfully
    bool setIoPriority(DWORD processId, bool high);

    // Set callback for CS2 status changes
    // Called when CS2 starts or stops running
    // isRunning: true = CS2 just started, false = CS2 just closed
    // cs2Pid: the process ID of CS2 (or 0 if not running)
    void setOnCs2StatusChanged(OnCs2StatusChangedCallback callback);

    // Get the last known CS2 process ID
    // Returns 0 if CS2 is not currently running
    DWORD getLastCs2Pid() const;

    // List all running processes (for diagnostics/debugging)
    // Returns vector of PROCESSENTRY32W structures
    std::vector<PROCESSENTRY32W> listProcesses() const;

private:
    // Internal monitoring loop function
    // Runs in a separate thread, polls every 2 seconds
    void monitoringThread();

    // Poll for CS2 process in the current snapshot
    // Updates m_lastCs2Pid and triggers callback if status changed
    void pollCs2Process();

    // Apply priority class to a process
    // processId: PID to apply to (0 = no process = reset all)
    // elevate: true = set HIGH_PRIORITY_CLASS, false = set IDLE_PRIORITY_CLASS
    // Returns true if successful
    bool applyProcessPriority(DWORD processId, bool elevate);

    // Apply I/O priority to a process
    // processId: PID to apply to (0 = no process = reset all)
    // high: true = high I/O priority, false = low I/O priority
    // Returns true if successful
    bool applyIoPriority(DWORD processId, bool high);

    // Internal state
    bool m_isMonitoring = false;          // Is monitoring thread active?
    DWORD m_lastCs2Pid = 0;              // Last known CS2 PID
    OnCs2StatusChangedCallback m_onStatusChanged;  // Status change callback

    // Disable copy and assignment
    ProcessManager(const ProcessManager&) = delete;
    ProcessManager& operator=(const ProcessManager&) = delete;
};

// Public API functions (C-linkage for compatibility)
// These are the external entry points that can be called from any C/C++ code

extern "C" {

// Initialize process manager
// Must be called before any other process management functions
// Returns true if initialization succeeded
bool process_manager_init();

// Start CS2 process monitoring
// Begins background polling every 2 seconds
// Automatically applies HIGH_PRIORITY_CLASS when CS2 is detected
// Returns true if monitoring started successfully
bool process_manager_start_monitoring();

// Stop CS2 process monitoring
// Restores normal priorities, cleans up threads
// Must be called on application shutdown
void process_manager_stop_monitoring();

// Poll for CS2 process once
// Check if CS2 is running and apply appropriate priorities
// Returns true if CS2 was found in this poll cycle
bool process_manager_poll_cs2();

// Set process priority class
// processId: PID of the target process
// elevate: true = set to HIGH_PRIORITY_CLASS, false = set to IDLE_PRIORITY_CLASS
// Returns true if priority was set successfully
bool process_manager_set_priority(DWORD processId, bool elevate);

// Set I/O priority for a process
// processId: PID of the target process
// high: true = set high I/O priority (helps with texture/asset loading),
//       false = set low I/O priority for background processes
// Returns true if I/O priority was set successfully
bool process_manager_set_io_priority(DWORD processId, bool high);

// Get last known CS2 process ID
// Returns 0 if CS2 is not currently running
DWORD process_manager_get_last_cs2_pid();

} // extern "C"

} // namespace cs2::booster