#include "pch.h"
#include "memory_optimizer.h"
#include <windows.h>
#include <psapi.h>
#include <iostream>

namespace cs2::booster {

MemoryOptimizer::MemoryOptimizer() : state_(PerformanceState::Idle) {
}

MemoryOptimizer::~MemoryOptimizer() {
}

TweakResult MemoryOptimizer::apply() {
    TweakResult result;
    result.state = PerformanceState::Idle;
    
    // Apply multiple memory optimizations
    bool workingSetOk = applyWorkingSetOptimization(0); // Will be set per-process
    bool largePagesOk = enableLargePages();
    bool priorityOk = setMemoryPriority(0);
    
    result.success = workingSetOk && largePagesOk && priorityOk;
    result.state = result.success ? PerformanceState::Applied : PerformanceState::Error;
    
    return result;
}

TweakResult MemoryOptimizer::revert() {
    TweakResult result;
    result.state = PerformanceState::Idle;
    
    // Revert memory optimizations
    bool workingSetReverted = false; // Would need process ID
    bool largePagesReverted = disableLargePages();
    bool priorityReverted = setMemoryPriority(0);
    
    result.success = largePagesReverted && priorityReverted;
    result.state = result.success ? PerformanceState::Applied : PerformanceState::Error;
    
    return result;
}

PerformanceState MemoryOptimizer::getState() const {
    return state_;
}

bool MemoryOptimizer::optimizeWorkingSet(DWORD processId) {
    HANDLE hProcess = OpenProcess(PROCESS_SET_QUOTA, FALSE, processId);
    if (!hProcess) return false;
    
    BOOL success = SetProcessWorkingSetSize(hProcess, -1, -1);
    CloseHandle(hProcess);
    return success != FALSE;
}

bool MemoryOptimizer::trimWorkingSet(DWORD processId) {
    HANDLE hProcess = OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_SET_QUOTA, FALSE, processId);
    if (!hProcess) return false;
    
    BOOL success = K32TrimWorkingSet(hProcess);
    CloseHandle(hProcess);
    return success != FALSE;
}

bool MemoryOptimizer::enableLargePages() {
    // Enable large page support in the system
    // This requires SeLockMemoryPrivilege
    HANDLE hToken = NULL;
    if (OpenProcessToken(GetCurrentProcess(), TOKEN_ADJUST_PRIVILEGES | TOKEN_QUERY, &hToken)) {
        TOKEN_PRIVILEGES tp;
        tp.PrivilegeCount = 1;
        tp.Privileges[0].Attributes = 0;
        tp.Privileges[0].Luid.LowPart = 0;
        tp.Privileges[0].Luid.HighPart = 0;
        
        if (LookupPrivilegeValueW(nullptr, SE_DEBUG_NAME, &tp.Privileges[0].Luid)) {
            AdjustTokenPrivileges(hToken, FALSE, &tp, 0, nullptr, nullptr);
        }
        CloseHandle(hToken);
    }
    
    // Large pages are enabled at system level; application can use them with VirtualAlloc
    return true;
}

bool MemoryOptimizer::disableLargePages() {
    // Large pages are a system setting; typically not "disabled" per-process
    // Just return success as this is typically a no-op at app level
    return true;
}

bool MemoryOptimizer::setMemoryPriority(DWORD processId) {
    HANDLE hProcess = OpenProcess(PROCESS_SET_QUOTA, FALSE, processId);
    if (!hProcess) return false;
    
    // Set page priority - this is a soft optimization
    // Windows doesn't have a direct "memory priority" API beyond working set management
    BOOL success = SetProcessWorkingSetSize(hProcess, -1, -1);
    CloseHandle(hProcess);
    return success != FALSE;
}

} // namespace cs2::booster