#include "pch.h"
#include "cpu_affinity.h"
#include <windows.h>
#include <winbase.h>
#include <iostream>
#include <thread>
#include <chrono>

// Helper: Convert KAFFINITY (bitmask) to core index
static inline int GetFirstSetBit(KAFFINITY mask) {
    if (mask == 0) return -1;
    return __builtin_ctz64((unsigned long long)mask);
}

// Helper: Get NUMA node from PROCESSOR_RELATIONSHIP
static int GetNumaNodeFromRelation(PROCESSOR_GROUP_INFO* group_info) {
    // NUMA node info is embedded in the processor relationship
    // For simplicity, return 0 (primary node)
    // In a full implementation, this would parse the NUMA node relationship
    return 0;
}

// Helper: Convert KAFFINITY to core index range
static std::vector<int> KaffinityToCoreList(KAFFINITY mask) {
    std::vector<int> cores;
    while (mask) {
        int bit = GetFirstSetBit(mask);
        if (bit >= 0) {
            cores.push_back(bit);
            mask &= ~(KAFFINITY(1) << bit);
        }
    }
    return cores;
}

CpuAffinity::CpuAffinity() : topology_detected_(false) {}

CpuAffinity::~CpuAffinity() {}

bool CpuAffinity::detectTopology() {
    topology_detected_ = false;
    ZeroMemory(&topology_, sizeof(CpuTopology));

    // Get CPU vendor and basic info
    SYSTEM_INFO sys_info;
    GetNativeSystemInfo(&sys_info);

    topology_.logical_cores = sys_info.dwNumberOfProcessors;
    topology_.hyperthreading_enabled = (sys_info.dwNumberOfProcessors > sys_info.dwNumberOfProcessors * 2 / 3);

    // Determine vendor
    // Use CPUID or check registry, but we'll use a simple approach
    // Read processor topology via GetLogicalProcessorInformationEx
    // This is a simplified detection

    // Try to get detailed topology
    ULONG return_length = 0;
    if (GetLogicalProcessorInformationEx(RelationProcessorCore, nullptr, &return_length) == FALSE) {
        DWORD error = GetLastError();
        if (error != ERROR_INSUFFICIENT_BUFFER) {
            return false;
        }
    }

    // Allocate buffer for topology info
    std::vector<BYTE> buffer(return_length);
    PLOGICAL_PROCESSOR_CORE_RELATION relation =
        (PLOGICAL_PROCESSOR_CORE_RELATION)buffer.data();

    if (GetLogicalProcessorInformationEx(RelationProcessorCore, relation, &return_length) == FALSE) {
        return false;
    }

    topology_detected_ = true;

    // Parse the core relationship info
    for (int i = 0; i < relation->ProcessorCount; i++) {
        PROCESSOR_CORE_RELATION* core = &relation->ProcessorCore[i];

        // Mark each logical processor
        if (topology_.cores[i].logical_index < 256) {
            topology_.cores[i].logical_index = i;
            topology_.cores[i].physical_core_id = core->ProcessorSet.Core;
            topology_.cores[i].is_p_core = (core->Flags & PROCESSOR_CORE_FLAG_PERFORMANCE) != 0;

            // Determine if E-core or P-core
            // Flags indicate core type
            if (core->Flags & PROCESSOR_CORE_FLAG_EFFICIENCY) {
                topology_.cores[i].is_e_core = true;
                topology_.e_cores++;
            }
            else {
                topology_.cores[i].is_p_core = true;
                topology_.p_cores++;
            }
        }
    }

    // Count physical cores (unique core IDs)
    std::set<int> physical_set;
    for (int i = 0; i < topology_.logical_cores && i < 256; i++) {
        if (topology_.cores[i].physical_core_id >= 0) {
            physical_set.insert(topology_.cores[i].physical_core_id);
        }
    }
    topology_.physical_cores = (int)physical_set.size();

    // Determine vendor
    // Simple heuristic: check if we can detect Intel vs AMD
    // In practice, would use CPUID, but we'll mark as unknown for now
    topology_.vendor_id = L"Unknown";
    topology_.is_intel_architecture = false;
    topology_.is_amd_architecture = false;

    // Count unique CCX IDs for AMD (simplified)
    // This would require more detailed topology parsing
    topology_.ccx_count = 1;  // Default assumption
    topology_.max_ccx_id = 0;

    return true;
}

bool CpuAffinity::setPcoresAffinity(DWORD process_id) {
    if (!topology_detected_) {
        // Try to detect on the fly
        if (!detectTopology()) return false;
    }

    // Build affinity mask for P-Cores only
    // Collect all P-Core logical processor indices
    KAFFINITY pcore_mask = 0;
    for (int i = 0; i < topology_.logical_cores && i < 256; i++) {
        if (topology_.cores[i].is_p_core && topology_.cores[i].logical_index >= 0) {
            pcore_mask |= (KAFFINITY(1) << topology_.cores[i].logical_index);
        }
    }

    if (pcore_mask == 0) {
        // No P-Cores found, fall back to all logical processors
        // But this defeats the purpose, so return false
        return false;
    }

    // Set process affinity
    HANDLE hProcess = OpenProcess(PROCESS_SET_INFORMATION | PROCESS_QUERY_LIMITED_INFORMATION,
        FALSE, process_id);
    if (!hProcess) return false;

    BOOL result = SetProcessAffinityMask(hProcess, pcore_mask);
    CloseHandle(hProcess);

    return result != FALSE;
}

bool CpuAffinity::setCcxAffinity(DWORD process_id, int target_ccx_id) {
    if (!topology_detected_) {
        if (!detectTopology()) return false;
    }

    // For AMD with 3D V-Cache, we need to fix the process to a specific CCX
    // This requires more detailed topology info (CCX boundaries, Hypertransport etc.)
    // This is a simplified implementation

    // If target_ccx_id is -1, auto-select the CCX with most L3 cache or highest ID
    if (target_ccx_id < 0) {
        target_ccx_id = topology_.max_ccx_id;
    }

    // Build CCX affinity mask
    // This is highly simplified - real implementation would need
    // to parse CCX topology from GetLogicalProcessorInformationEx(RelationNumaNode)
    // or use platform-specific MSRs

    // For now, just set affinity to all processors (no CCX pinning)
    // Real implementation would require:
    // 1. Enumerating CCX boundaries
    // 2. Building per-CCX affinity masks
    // 3. Setting the appropriate mask

    // Placeholder: return false until full CCX implementation
    // TODO: Full AMD CCX topology parsing needed
    (void)process_id;
    (void)target_ccx_id;
    return false;
}

bool CpuAffinity::disableSmt(DWORD process_id) {
    if (!topology_detected_) {
        if (!detectTopology()) return false;
    }

    // SMT disabling is highly platform-specific and often requires
    // BIOS/UEFI settings or kernel-level modifications
    // User-mode applications cannot typically disable SMT

    // However, we can set affinity to only even-numbered logical processors
    // which effectively runs the process on one thread per physical core
    // (halving the logical processor count)

    // Build affinity mask with only even-numbered logical processors
    KAFFINITY smt_mask = 0;
    for (int i = 0; i < topology_.logical_cores && i < 256; i += 2) {
        if (topology_.cores[i].logical_index >= 0) {
            smt_mask |= (KAFFINITY(1) << topology_.cores[i].logical_index);
        }
    }

    if (smt_mask == 0) return false;

    HANDLE hProcess = OpenProcess(PROCESS_SET_INFORMATION | PROCESS_QUERY_LIMITED_INFORMATION,
        FALSE, process_id);
    if (!hProcess) return false;

    BOOL result = SetProcessAffinityMask(hProcess, smt_mask);
    CloseHandle(hProcess);

    return result != FALSE;
}

bool CpuAffinity::setCoreAffinity(DWORD process_id, DWORD core_mask) {
    HANDLE hProcess = OpenProcess(PROCESS_SET_INFORMATION | PROCESS_QUERY_LIMITED_INFORMATION,
        FALSE, process_id);
    if (!hProcess) return false;

    BOOL result = SetProcessAffinityMask(hProcess, core_mask);
    CloseHandle(hProcess);

    return result != FALSE;
}

DWORD CpuAffinity::getCurrentAffinity(DWORD process_id) const {
    // Cannot easily read back the affinity without another OpenProcess call
    // This is a placeholder
    return 0;
}

bool CpuAffinity::parseTopologyInfo() {
    // Detailed topology parsing - called from detectTopology
    // This would parse:
    // - RelationProcessorCore for core type (P/E)
    // - RelationNumaNode for NUMA boundaries
    // - RelationProcessorPackage for physical package ID
    // - RelationCache for L1/L2/L3 cache info

    // For now, return true to indicate skeleton is in place
    return detectTopology();
}

bool CpuAffinity::detectTopology() {
    if (topology_detected_) return true;

    return parseTopologyInfo();
}

bool CpuAffinity::detectVendor() {
    // In a full implementation, would use CPUID instruction
    // or read the registry HKEY_LOCAL_MACHINE\HARDWARE\DESCRIPTION\System\CentralProcessor\0
    // For now, return false (unknown)
    return false;
}

// Public API functions (C-linkage)
extern "C" {

// Detect and setup CPU topology
// Returns true if topology was detected successfully
bool cpu_affinity_detect_topology() {
    static CpuAffinity affinity;
    return affinity.detectTopology();
}

// Get detected CPU topology
const CpuTopology* cpu_affinity_get_topology() {
    static CpuAffinity affinity;
    // Note: static local has lifetime issues, but for simplicity
    // In production, use a proper singleton or global with init
    return &affinity.getTopology();
}

// Set process affinity to P-Cores only (Intel hybrid)
// process_id: PID of target process (cs2.exe)
// Returns true if affinity was set successfully
bool cpu_affinity_set_pcores(DWORD process_id) {
    static CpuAffinity affinity;
    // Ensure topology is detected first
    affinity.detectTopology();
    return affinity.setPcoresAffinity(process_id);
}

// Set process affinity to specific AMD CCX (3D V-Cache)
// process_id: PID of target process
// target_ccx_id: which CCX to fix to (-1 = auto-select best CCX)
// Returns true if affinity was set successfully
bool cpu_affinity_set_ccx(DWORD process_id, int target_ccx_id) {
    static CpuAffinity affinity;
    // Ensure topology is detected first
    affinity.detectTopology();
    return affinity.setCcxAffinity(process_id, target_ccx_id);
}

// Disable SMT/Hyper-Threading for the process
// process_id: PID of target process
// Returns true if SMT disable was attempted
bool cpu_affinity_disable_smt(DWORD process_id) {
    static CpuAffinity affinity;
    // Ensure topology is detected first
    affinity.detectTopology();
    return affinity.disableSmt(process_id);
}

// Get last error message
void cpu_affinity_get_last_error(std::wstring& error_msg) {
    // Get last system error
    DWORD error = GetLastError();
    if (error == 0) {
        error_msg = L"No error";
    }
    else {
        LPWSTR message_buffer = nullptr;
        size_t size = FormatMessageW(
            FORMAT_MESSAGE_ALLOCATE_BUFFER | FORMAT_MESSAGE_FROM_SYSTEM | FORMAT_MESSAGE_MAX_WIDTH_MASK,
            NULL,
            error,
            MAKELANGID(LANG_NEUTRAL, SUBLANG_DEFAULT),
            (LPWSTR)&message_buffer,
            0, NULL);
        if (size > 0 && message_buffer != nullptr) {
            error_msg = std::wstring(message_buffer, size);
            LocalFree(message_buffer);
        }
        else {
            error_msg = std::to_wstring(error) + L": Unknown error";
        }
    }
}

} // extern "C"