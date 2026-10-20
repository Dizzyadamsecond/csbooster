#pragma once

#include <windows.h>
#include <string>
#include <vector>
#include <map>
#include <array>

// CPU Topology Structure
struct CpuTopology {
    bool hyperthreading_enabled = true;
    bool is_intel_architecture = false;
    bool is_amd_architecture = false;
    int physical_cores = 0;
    int logical_cores = 0;
    int p_cores = 0;      // Performance cores (Intel E-cores disabled or AMD P-cores)
    int e_cores = 0;      // Efficiency cores (Intel only)
    int ccx_count = 0;    // AMD Core Complex Count (3D V-Cache)
    int max_ccx_id = -1;  // Highest CCX ID detected

    // Core info per logical thread
    struct CoreInfo {
        int logical_index = -1;
        int physical_core_id = -1;
        bool is_p_core = false;     // Performance core
        bool is_e_core = false;     // Efficiency core (Intel)
        int ccx_id = -1;            // AMD CCX identifier
        int die_id = -1;            // NUMA die identifier
    };

    // Detected cores (indexed by logical index)
    std::array<CoreInfo, 256> cores;  // Max 256 logical processors

    // Processor topology strings
    std::wstring vendor_id;       // "GenuineIntel" or "AuthenticAMD"
    std::wstring architecture_name;
};

// CPU Affinity Mask Manager
class CpuAffinity {
public:
    CpuAffinity();
    ~CpuAffinity();

    // Detect full CPU topology
    // Returns true if topology was successfully detected
    bool detectTopology();

    // Get the detected topology
    const CpuTopology& getTopology() const { return topology_; }

    // Set process affinity to specific P-Cores only (Intel 12th/13th/14th Gen)
    // Forces cs2.exe to run exclusively on Performance Cores, masking E-Cores
    // Returns true if affinity was set successfully
    bool setPcoresAffinity(DWORD process_id);

    // Set process affinity to specific CCX (AMD with 3D V-Cache)
    // Fixes process strictly to the CCX with 3D L3 cache, eliminating IF latency
    // Returns true if affinity was set successfully
    bool setCcxAffinity(DWORD process_id, int target_ccx_id);

    // Disable SMT (Simultaneous Multithreading) / Hyper-Threading sibling threads
    // For CPUs with low L3 cache count to avoid cache thrashing
    // Returns true if SMT disable was attempted
    bool disableSmt(DWORD process_id);

    // Set process to run on specific core(s)
    // core_mask: bitmask of cores to allow (bit 0 = core 0, bit 1 = core 1, etc.)
    bool setCoreAffinity(DWORD process_id, DWORD core_mask);

    // Get current process affinity mask
    DWORD getCurrentAffinity(DWORD process_id) const;

private:
    CpuTopology topology_;
    bool topology_detected_ = false;

    // Parse NUMA and topology info from Windows
    bool parseTopologyInfo();

    // Detect if running on Intel or AMD
    bool detectVendor();

    // Get logical processor info via GetLogicalProcessorInformationEx
    bool getLogicalProcessorInfo();

    // Disable copy/move
    CpuAffinity(const CpuAffinity&) = delete;
    CpuAffinity& operator=(const CpuAffinity&) = delete;
};

// Public API functions (C-linkage)
extern "C" {

// Detect and setup CPU topology
// Returns true if topology was detected successfully
bool cpu_affinity_detect_topology();

// Get detected CPU topology
const CpuTopology* cpu_affinity_get_topology();

// Set process affinity to P-Cores only (Intel hybrid)
// process_id: PID of target process (cs2.exe)
// Returns true if affinity was set successfully
bool cpu_affinity_set_pcores(DWORD process_id);

// Set process affinity to specific AMD CCX (3D V-Cache)
// process_id: PID of target process
// target_ccx_id: which CCX to fix to (-1 = auto-select best CCX)
// Returns true if affinity was set successfully
bool cpu_affinity_set_ccx(DWORD process_id, int target_ccx_id);

// Disable SMT/Hyper-Threading for the process
// process_id: PID of target process
// Returns true if SMT disable was attempted
bool cpu_affinity_disable_smt(DWORD process_id);

// Get last error message
void cpu_affinity_get_last_error(std::wstring& error_msg);

} // extern "C"

#endif // CPU_AFFINITY_H