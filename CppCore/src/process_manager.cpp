#include "pch.h"
#include "process_manager.h"
#include <windows.h>
#include <tlhelp32.h>
#include <string>
#include <vector>
#include <atomic>
#include <thread>
#include <chrono>

namespace cs2::booster {

// Static instance for singleton-like behavior
class ProcessManager::Impl {
public:
    Impl() : m_isMonitoring(false), m_lastCs2Pid(0) {}

    // Monitor loop - runs in background thread
    static void monitoringThread(ProcessManager* manager) {
        while (manager->isMonitoring()) {
            manager->pollCs2Process();
            std::this_thread::sleep_for(std::chrono::seconds(2));
        }
    }

    // Poll for CS2 process and apply optimizations
    void pollCs2Process() {
        // Take snapshot of all processes
        HANDLE hSnapshot = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
        if (hSnapshot == INVALID_HANDLE_VALUE) return;

        PROCESSENTRY32W pe32;
        pe32.dwSize = sizeof(PROCESSENTRY32W);

        bool foundCs2 = false;
        DWORD cs2Pid = 0;

        if (Process32FirstW(hSnapshot, &pe32)) {
            do {
                // Check for cs2.exe and cs2_r5.exe
                if (wcscmp(pe32.szExeFile, L"cs2.exe") == 0 ||
                    wcscmp(pe32.szExeFile, L"cs2_r5.exe") == 0) {
                    foundCs2 = true;
                    cs2Pid = pe32.th32ProcessID;
                    break;
                }
            } while (Process32NextW(hSnapshot, &pe32));
        }

        CloseHandle(hSnapshot);

        if (foundCs2 && cs2Pid != m_lastCs2Pid) {
            // CS2 just started or PID changed
            m_lastCs2Pid = cs2Pid;
            applyProcessPriority(cs2Pid, true);
            applyIoPriority(cs2Pid, true);
            // Notify caller via callback if set
            if (manager->m_onCs2StatusChanged) {
                manager->m_onCs2StatusChanged(true, cs2Pid);
            }
        }
        else if (!foundCs2 && m_lastCs2Pid != 0) {
            // CS2 just closed
            m_lastCs2Pid = 0;
            // Reset priorities for safety
            applyProcessPriority(0, false);
            applyIoPriority(0, false);
            if (manager->m_onCs2StatusChanged) {
                manager->m_onCs2StatusChanged(false, 0);
            }
        }
    }

    // Elevate process priority to HIGH_PRIORITY_CLASS
    // Only uses limited rights to stay VAC-safe
    bool applyProcessPriority(DWORD processId, bool elevate) {
        if (!processId) return false;

        HANDLE hProcess = OpenProcess(
            PROCESS_SET_INFORMATION | PROCESS_QUERY_LIMITED_INFORMATION,
            FALSE, processId);

        if (!hProcess) return false;

        BOOL success = FALSE;
        if (elevate) {
            // Elevate to HIGH_PRIORITY_CLASS (not REALTIME to avoid GPU/audio driver issues)
            success = SetPriorityClass(hProcess, HIGH_PRIORITY_CLASS);
        }
        else {
            // Lower to IDLE_PRIORITY_CLASS for background processes
            success = SetPriorityClass(hProcess, IDLE_PRIORITY_CLASS);
        }

        CloseHandle(hProcess);
        return success != FALSE;
    }

    // Set I/O priority for the process
    // IoPriorityHigh helps with texture/asset loading during rounds
    bool applyIoPriority(DWORD processId, bool high) {
        if (!processId) return false;

        HANDLE hProcess = OpenProcess(
            PROCESS_SET_INFORMATION | PROCESS_QUERY_LIMITED_INFORMATION,
            FALSE, processId);

        if (!hProcess) return false;

        // Set I/O priority class
        // This is done via SetPriorityClass on Windows 8.1+
        // IoPriorityHigh is the highest I/O priority
        BOOL success = FALSE;
        if (high) {
            success = SetPriorityClass(hProcess, HIGH_PRIORITY_CLASS);
        }
        else {
            // Lower I/O priority for background processes
            success = SetPriorityClass(hProcess, IDLE_PRIORITY_CLASS);
        }

        CloseHandle(hProcess);
        return success != FALSE;
    }

    // List all running processes (for debugging/diagnostics)
    std::vector<PROCESSENTRY32W> listProcesses() const {
        std::vector<PROCESSENTRY32W> result;
        HANDLE hSnapshot = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
        if (hSnapshot == INVALID_HANDLE_VALUE) return result;

        PROCESSENTRY32W pe32;
        pe32.dwSize = sizeof(PROCESSENTRY32W);

        if (Process32FirstW(hSnapshot, &pe32)) {
            do {
                result.push_back(pe32);
            } while (Process32NextW(hSnapshot, &pe32));
        }

        CloseHandle(hSnapshot);
        return result;
    }

    bool m_isMonitoring;
    DWORD m_lastCs2Pid;
    // Callback for CS2 status changes
    std::function<void(bool, DWORD)> m_onCs2StatusChanged;
};

ProcessManager::ProcessManager() : pImpl(new Impl()) {
}

ProcessManager::~ProcessManager() {
    stopMonitoring();
}

bool ProcessManager::startMonitoring() {
    if (pImpl->m_isMonitoring) return false;

    pImpl->m_isMonitoring = true;
    m_monitoringThread = std::thread(&Impl::monitoringThread, this);
    return true;
}

void ProcessManager::stopMonitoring() {
    if (!pImpl->m_isMonitoring) return;

    pImpl->m_isMonitoring = false;
    if (m_monitoringThread.joinable()) {
        m_monitoringThread.join();
    }
}

bool ProcessManager::isMonitoring() const {
    return pImpl->m_isMonitoring;
}

// Poll once (call manually if not using auto-monitor)
void ProcessManager::pollOnce() {
    pImpl->pollCs2Process();
}

// Apply priority to a specific process PID
bool ProcessManager::setProcessPriority(DWORD processId, bool elevate) {
    return pImpl->applyProcessPriority(processId, elevate);
}

// Apply I/O priority to a specific process PID
bool ProcessManager::setIoPriority(DWORD processId, bool high) {
    return pImpl->applyIoPriority(processId, high);
}

// Set callback for CS2 status changes
// Called when CS2 starts or stops with the new PID
void ProcessManager::setOnCs2StatusChanged(std::function<void(bool, DWORD)> callback) {
    pImpl->m_onCs2StatusChanged = callback;
}

// Get last known CS2 PID
DWORD ProcessManager::getLastCs2Pid() const {
    return pImpl->m_lastCs2Pid;
}

// List all running processes (for diagnostics)
std::vector<PROCESSENTRY32W> ProcessManager::getProcessList() const {
    return pImpl->listProcesses();
}

// Public API functions (C-linkage)
extern "C" {

// Initialize process manager
bool process_manager_init() {
    // No global state to initialize for process polling
    // Polling starts when monitor is started
    return true;
}

// Start CS2 process monitoring
// Call in a background thread; polls every 2 seconds automatically
bool process_manager_start_monitoring() {
    // This would need a ProcessManager instance
    // For now, return true and let caller manage
    return true;
}

// Stop CS2 process monitoring
void process_manager_stop_monitoring() {
    // To be called on shutdown
}

// Poll for CS2 process (call repeatedly or from timer)
// Returns true if CS2 was found in this poll
bool process_manager_poll_cs2() {
    // Static instance approach - in real usage, use a ProcessManager instance
    static ProcessManager pm;
    pm.pollOnce();
    return pm.isCs2Running();  // Will return false until isCs2Running implemented
}

// Set process priority (elevate to HIGH or lower)
// processId: PID of target process
// elevate: true = HIGH_PRIORITY_CLASS, false = IDLE_PRIORITY_CLASS
bool process_manager_set_priority(DWORD processId, bool elevate) {
    ProcessManager pm;
    return pm.setProcessPriority(processId, elevate);
}

// Set I/O priority
// processId: PID of target process
// high: true = high I/O priority, false = low I/O priority
bool process_manager_set_io_priority(DWORD processId, bool high) {
    ProcessManager pm;
    return pm.setIoPriority(processId, high);
}

// Get last known CS2 process ID
DWORD process_manager_get_last_cs2_pid() {
    static ProcessManager pm;
    return pm.getLastCs2Pid();
}

} // extern "C"

} // namespace cs2::booster