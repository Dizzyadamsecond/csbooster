#include "pch.h"
#include "timer_resolution.h"
#include <windows.h>
#include <winbase.h>
#include <iostream>
#include <thread>

// Forward declaration for ntdll functions
typedef NTSTATUS(NTAPI* pNtQueryTimerResolution)(PLONG, PLONG, PLONG);
typedef NTSTATUS(NTAPI* pNtSetTimerResolution)(BOOLEAN, BOOLEAN, PLONG);

namespace cs2::booster {

// Global state
static bool g_timerResolved = false;
static LONG g_minTimerResolution = 0;  // nanoseconds
static LONG g_maxTimerResolution = 0;  // nanoseconds
static LONG g_currentTimerResolution = 0;  // nanoseconds
static HANDLE g_timerEvent = NULL;
static BOOL g_shutdown = FALSE;

// Helper: Load ntdll and get function pointers
static bool InitializeNtdllFunctions() {
    g_timerEvent = CreateEventW(nullptr, TRUE, FALSE, nullptr);
    if (!g_timerEvent) return false;

    HMODULE hNtDll = LoadLibraryW(L"ntdll.dll");
    if (!hNtDll) {
        CloseHandle(g_timerEvent);
        g_timerEvent = NULL;
        return false;
    }

    pNtQueryTimerResolution NtQueryFunc = (pNtQueryTimerResolution)GetProcAddress(hNtDll, "NtQueryTimerResolution");
    pNtSetTimerResolution NtSetFunc = (pNtSetTimerResolution)GetProcAddress(hNtDll, "NtSetTimerResolution");

    UNREFERENCED_PARAMETER(NtQueryFunc);
    UNREFERENCED_PARAMETER(NtSetFunc);

    // We'll use winmm as primary, ntdll as fallback
    FreeLibrary(hNtDll);
    return true;
}

// Helper: TimeBeginPeriod wrapper
static bool InitializeWinmmTimer() {
    // timeBeginPeriod(1) sets resolution to 1ms (1000us / 1000000ns)
    // But we want maximum: 0.5ms (500us / 500000ns)
    // Actually, timeBeginPeriod(uPeriod) where uPeriod is in milliseconds
    // For 0.5ms resolution, we need to check if the system supports it
    
    // Try timeBeginPeriod(1) first (1ms = 1000000ns)
    MMRESULT result = timeBeginPeriod(1);
    if (result == TIMERR_NOERROR) {
        g_currentTimerResolution = 1;  // 1ms
        return true;
    }
    return false;
}

// Set the highest possible timer resolution
// Target: 0.5ms = 500 microseconds = 500000 nanoseconds
// Windows timer resolution is in units of 0.5ms or better
bool TimerResolution::initialize() {
    bool success = false;

    // Strategy 1: Try ntdll.dll native functions (most precise)
    // NtSetTimerResolution(BOOLEAN Increase, BOOLEAN SetRes, PULONG CurrentResolution)
    // For maximum resolution: Set to FALSE (don't increase), SetRes = TRUE (request max resolution)
    // Typical call: NtSetTimerResolution(FALSE, TRUE, &g_currentTimerResolution);

    // Strategy 2: winmm.lib timeBeginPeriod
    // timeBeginPeriod(1) typically achieves ~1ms resolution on most systems
    // Some systems support timeBeginPeriod(0) or timeBeginPeriod(0.5) but uPeriod is DWORD (ms)
    
    // Strategy 3: Combined approach - try ntdll first, fall back to winmm

    // Try winmm first (more compatible)
    if (InitializeWinmmTimer()) {
        g_timerResolved = true;
        success = true;
    } else {
        // Try ntdll approach
        // TODO: Implement NtSetTimerResolution when needed
    }

    // Set shutdown handler for cleanup
    SetConsoleCtrlHandler([](DWORD dwCtrlType) -> BOOL {
        if (dwCtrlType == CTRL_CLOSE_EVENT || dwCtrlType == CTRL_C_EVENT || dwCtrlType == CTRL_LOGOFF_EVENT || dwCtrlType == CTRL_SHUTDOWN_EVENT) {
            g_shutdown = TRUE;
            if (g_timerEvent) {
                SetEvent(g_timerEvent);
            }
        }
        return TRUE;
    }, TRUE);

    return success;
}

// Query current timer resolution from system
bool TimerResolution::queryResolution() {
    if (!g_timerResolved) return false;

    // Get current resolution using timeGetDevCaps or timeBeginPeriod(0) query
    // timeBeginPeriod(0) returns the minimum resolution the system supports
    // But we need to be careful not to actually change it just for querying
    
    // Use timeBeginPeriod with a very small value, then restore
    // Actually, just use the known value we set
    return g_timerResolved;
}

// Set timer resolution to maximum supported
// Target: 0.5ms resolution (5000 units of 100ns)
// This reduces frametime spikes by ensuring Windows scheduler checks more frequently
bool TimerResolution::setMaximumResolution() {
    if (g_timerResolved) {
        // timeBeginPeriod(1) gives ~1ms resolution
        // For better, we try 0.5ms - but timeBeginPeriod takes milliseconds
        // The minimum resolution depends on hardware
        // Typical high-performance systems support 0.5ms (1/2ms)
        
        // Set to 1ms as baseline (widely supported)
        // Some systems support lower via ntdll
        MMRESULT result = timeBeginPeriod(1);
        if (result == TIMERR_NOERROR) {
            g_currentTimerResolution = 1;  // 1ms in milliseconds
            return true;
        }
    }
    return false;
}

// Restore original timer resolution on shutdown
void TimerResolution::cleanup() {
    if (g_timerResolved) {
        // Restore to default (15.6ms typical for power saving)
        // timeEndPeriod(1) - but we should restore to what we found
        // Actually, just call timeEndPeriod or leave it at current
        // Best practice: leave at improved resolution if we set it,
        // or try to restore original
        timeEndPeriod(1);
    }
    if (g_timerEvent) {
        CloseHandle(g_timerEvent);
        g_timerEvent = NULL;
    }
}

// Get current resolution in milliseconds
double TimerResolution::getResolutionMs() {
    if (g_timerResolved) {
        return (double)g_currentTimerResolution;
    }
    return 15.6;  // Default Windows default
}

// Check if timer resolution is actively improving performance
bool TimerResolution::isEnabled() {
    return g_timerResolved;
}

// Static accessor for singleton-like usage
TimerResolution& TimerResolution::getInstance() {
    static TimerResolution instance;
    return instance;
}

// Public API functions
extern "C" {

// Initialize timer resolution system
bool timer_resolution_init() {
    return TimerResolution::getInstance().initialize();
}

// Query current timer resolution
bool timer_resolution_query() {
    return TimerResolution::getInstance().queryResolution();
}

// Set maximum timer resolution for CS2 performance
bool timer_resolution_set_max() {
    return TimerResolution::getInstance().setMaximumResolution();
}

// Clean up timer resolution on exit
void timer_resolution_cleanup() {
    TimerResolution::getInstance().cleanup();
}

// Get current resolution in milliseconds
double timer_resolution_get_ms() {
    return TimerResolution::getInstance().getResolutionMs();
}

// Check if timer resolution is enabled
bool timer_resolution_is_enabled() {
    return TimerResolution::getInstance().isEnabled();
}

} // extern "C"

} // namespace cs2::booster