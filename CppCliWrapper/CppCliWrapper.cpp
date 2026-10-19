#include "pch.h"
#include "cs2booster.h"
#include <windows.h>
#include <string>
#include <vector>
#include <mutex>

namespace Cs2BoosterWrapper {

// Performance Manager wrapper class
public ref class PerformanceManagerWrapper {
public:
    PerformanceManagerWrapper() {
        _nativeMgr = std::make_unique<cs2::booster::PerformanceManager>();
        _nativeMgr->initialize();
    }

    ~PerformanceManagerWrapper() {
        this->!PerformanceManagerWrapper();
    }

    !PerformanceManagerWrapper() {
        if (_nativeMgr) {
            _nativeMgr->revertAll();
            _nativeMgr.reset();
        }
    }

    // Apply all optimizations
    bool applyAll() {
        std::lock_guard<std::mutex> lock(_mutex);
        return _nativeMgr->applyAll();
    }

    // Revert all optimizations
    void revertAll() {
        std::lock_guard<std::mutex> lock(_mutex);
        _nativeMgr->revertAll();
    }

    // Get current state
    cs2::booster::PerformanceState getState() {
        std::lock_guard<std::mutex> lock(_mutex);
        return _nativeMgr->getState();
    }

    // Check if CS2 is running
    bool isCs2Running() {
        std::lock_guard<std::mutex> lock(_mutex);
        return _nativeMgr->isCs2Running();
    }

    // Set CS2 process priority
    bool setCs2Priority(DWORD priority) {
        std::lock_guard<std::mutex> lock(_mutex);
        return _nativeMgr->setCs2Priority(priority);
    }

    // Get CS2 process info
    cs2::booster::Cs2ProcessInfo getCs2Info() {
        std::lock_guard<std::mutex> lock(_mutex);
        return _nativeMgr->getCs2Info();
    }

    // Apply specific tweak
    bool applyTweak(std::string tweakName) {
        std::lock_guard<std::mutex> lock(_mutex);
        auto result = _nativeMgr->applyTweak(tweakName);
        return result.success;
    }

    // Get available tweaks
    std::vector<std::string> getAvailableTweaks() {
        std::lock_guard<std::mutex> lock(_mutex);
        return _nativeMgr->getAvailableTweaks();
    }

    // Save configuration
    bool saveConfig(std::string path) {
        std::lock_guard<std::mutex> lock(_mutex);
        return _nativeMgr->saveConfig(path);
    }

    // Load configuration
    bool loadConfig(std::string path) {
        std::lock_guard<std::mutex> lock(_mutex);
        return _nativeMgr->loadConfig(path);
    }

    // Event callbacks
    void setProgressCallback(System::Action<cs2::booster::PerformanceState, System::String^>^ cb) {
        std::lock_guard<std::mutex> lock(_mutex);
        _progressCallback = cb;
    }

    void setCompleteCallback(System::Action<cs2::booster::PerformanceState, System::String^>^ cb) {
        std::lock_guard<std::mutex> lock(_mutex);
        _completeCallback = cb;
    }

internal:
    // Call from native code to raise callbacks
    void raiseProgressCallback(cs2::booster::PerformanceState state, const std::string& message) {
        if (_progressCallback) {
            System::String^ msg = gcnew System::String(message.c_str());
            _progressCallback(state, msg);
        }
    }

    void raiseCompleteCallback(cs2::booster::PerformanceState state, const std::string& message) {
        if (_completeCallback) {
            System::String^ msg = gcnew System::String(message.c_str());
            _completeCallback(state, msg);
        }
    }

private:
    std::unique_ptr<cs2::booster::PerformanceManager> _nativeMgr;
    std::mutex _mutex;
    System::Action<cs2::booster::PerformanceState, System::String^>^ _progressCallback = nullptr;
    System::Action<cs2::booster::PerformanceState, System::String^>^ _completeCallback = nullptr;
};

// Memory Optimizer wrapper class
public ref class MemoryOptimizerWrapper : public System::IDisposable {
public:
    MemoryOptimizerWrapper() {
        _nativeMgr = std::make_unique<cs2::booster::MemoryOptimizer>();
    }

    ~MemoryOptimizerWrapper() {
        this->!MemoryOptimizerWrapper();
    }

    !MemoryOptimizerWrapper() {
        if (_nativeMgr) {
            _nativeMgr.reset();
        }
    }

    // Apply memory optimizations
    bool apply() {
        std::lock_guard<std::mutex> lock(_mutex);
        auto result = _nativeMgr->apply();
        return result.success;
    }

    // Revert memory optimizations
    bool revert() {
        std::lock_guard<std::mutex> lock(_mutex);
        auto result = _nativeMgr->revert();
        return result.success;
    }

    // Get state
    cs2::booster::PerformanceState getState() {
        std::lock_guard<std::mutex> lock(_mutex);
        return _nativeMgr->getState();
    }

    // Optimize working set for a process
    bool optimizeWorkingSet(DWORD processId) {
        std::lock_guard<std::mutex> lock(_mutex);
        return _nativeMgr->optimizeWorkingSet(processId);
    }

    // Trim working set
    bool trimWorkingSet(DWORD processId) {
        std::lock_guard<std::mutex> lock(_mutex);
        return _nativeMgr->trimWorkingSet(processId);
    }

    // Enable large pages
    bool enableLargePages() {
        std::lock_guard<std::mutex> lock(_mutex);
        return _nativeMgr->enableLargePages();
    }

    // Set memory priority
    bool setMemoryPriority(DWORD processId) {
        std::lock_guard<std::mutex> lock(_mutex);
        return _nativeMgr->setMemoryPriority(processId);
    }

private:
    std::unique_ptr<cs2::booster::MemoryOptimizer> _nativeMgr;
    std::mutex _mutex;
};

// Network Tweaker wrapper class
public ref class NetworkTweakerWrapper : public System::IDisposable {
public:
    NetworkTweakerWrapper() {
        _nativeMgr = std::make_unique<cs2::booster::NetworkTweaker>();
    }

    ~NetworkTweakerWrapper() {
        this->!NetworkTweakerWrapper();
    }

    !NetworkTweakerWrapper() {
        if (_nativeMgr) {
            _nativeMgr.reset();
        }
    }

    // Apply network optimizations
    bool apply() {
        std::lock_guard<std::mutex> lock(_mutex);
        auto result = _nativeMgr->apply();
        return result.success;
    }

    // Revert network optimizations
    bool revert() {
        std::lock_guard<std::mutex> lock(_mutex);
        auto result = _nativeMgr->revert();
        return result.success;
    }

    // Get state
    cs2::booster::PerformanceState getState() {
        std::lock_guard<std::mutex> lock(_mutex);
        return _nativeMgr->getState();
    }

    // Optimize TCP/IP
    bool optimizeTcpIp() {
        std::lock_guard<std::mutex> lock(_mutex);
        return _nativeMgr->optimizeTcpIp();
    }

    // Enable gaming QoS
    bool enableGamingQoS() {
        std::lock_guard<std::mutex> lock(_mutex);
        return _nativeMgr->enableGamingQoS();
    }

    // Disable background network
    bool disableBackgroundNetwork() {
        std::lock_guard<std::mutex> lock(_mutex);
        return _nativeMgr->disableBackgroundNetwork();
    }

    // Get network adapters
    System::Collections::Generic::List<System::String^>^ getNetworkAdapters() {
        std::lock_guard<std::mutex> lock(_mutex);
        auto adapters = _nativeMgr->getNetworkAdapters();
        System::Collections::Generic::List<System::String^>^ result = gcnew System::Collections::Generic::List<System::String^>();
        for (const auto& adj : adapters) {
            result->Add(gcnew System::String(adj.c_str()));
        }
        return result;
    }

private:
    std::unique_ptr<cs2::booster::NetworkTweaker> _nativeMgr;
    std::mutex _mutex;
};

// GPU Optimizer wrapper class
public ref class GPOptimizerWrapper : public System::IDisposable {
public:
    GPOptimizerWrapper() {
        _nativeMgr = std::make_unique<cs2::booster::GPOptimizer>();
    }

    ~GPOptimizerWrapper() {
        this->!GPOptimizerWrapper();
    }

    !GPOptimizerWrapper() {
        if (_nativeMgr) {
            _nativeMgr.reset();
        }
    }

    // Apply GPU optimizations
    bool apply() {
        std::lock_guard<std::mutex> lock(_mutex);
        auto result = _nativeMgr->apply();
        return result.success;
    }

    // Revert GPU optimizations
    bool revert() {
        std::lock_guard<std::mutex> lock(_mutex);
        auto result = _nativeMgr->revert();
        return result.success;
    }

    // Get state
    cs2::booster::PerformanceState getState() {
        std::lock_guard<std::mutex> lock(_mutex);
        return _nativeMgr->getState();
    }

    // Set V-Sync
    bool setVsync(bool enabled) {
        std::lock_guard<std::mutex> lock(_mutex);
        return _nativeMgr->setVsync(enabled);
    }

    // Set max performance mode
    bool setMaxPerformance() {
        std::lock_guard<std::mutex> lock(_mutex);
        return _nativeMgr->setMaxPerformance();
    }

    // Enable DirectX 12 features
    bool enableDirectX12Features() {
        std::lock_guard<std::mutex> lock(_mutex);
        return _nativeMgr->enableDirectX12Features();
    }

    // Set texture filtering
    bool setTextureFiltering(System::String^ gpuKey, bool anisotropic) {
        std::lock_guard<std::mutex> lock(_mutex);
        std::wstring wKey = gcnew System::String(gpuKey->Data());
        return _nativeMgr->setTextureFiltering(wKey, anisotropic);
    }

    // Get GPU info
    System::String^ getGpuInfo() {
        std::lock_guard<std::mutex> lock(_mutex);
        std::wstring info = _nativeMgr->getGpuInfo();
        return gcnew System::String(info.c_str());
    }

    // Get current settings
    System::String^ getCurrentSettings() {
        std::lock_guard<std::mutex> lock(_mutex);
        std::wstring settings = _nativeMgr->getCurrentSettings();
        return gcnew System::String(settings.c_str());
    }

private:
    std::unique_ptr<cs2::booster::GPOptimizer> _nativeMgr;
    std::mutex _mutex;
};

// Profile Manager wrapper (simplified)
public ref class ProfileManagerWrapper : public System::IDisposable {
public:
    ProfileManagerWrapper() {
        _nativeMgr = std::make_unique<cs2::booster::profiles::ProfileManager>();
    }

    ~ProfileManagerWrapper() {
        this->!ProfileManagerWrapper();
    }

    !ProfileManagerWrapper() {
        if (_nativeMgr) {
            _nativeMgr.reset();
        }
    }

    // Create profile
    bool createProfile(cs2::booster::profiles::PerformanceProfile profile) {
        std::lock_guard<std::mutex> lock(_mutex);
        auto result = _nativeMgr->createProfile(profile);
        return result.success;
    }

    // Load profiles from file
    System::Collections::Generic::List<cs2::booster::profiles::PerformanceProfile>^ loadProfiles(System::String^ filePath) {
        std::lock_guard<std::mutex> lock(_mutex);
        auto profiles = _nativeMgr->loadProfiles(gcnew std::string(filePath->Data()));
        System::Collections::Generic::List<cs2::booster::profiles::PerformanceProfile>^ result = gcnew System::Collections::Generic::List<cs2::booster::profiles::PerformanceProfile>();
        for each (auto prop in profiles) {
            result->Add(prop);
        }
        return result;
    }

    // Save profiles to file
    bool saveProfiles(System::String^ filePath) {
        std::lock_guard<std::mutex> lock(_mutex);
        return _nativeMgr->saveProfiles(gcnew std::string(filePath->Data()));
    }

    // Get all profiles
    System::Collections::Generic::List<cs2::booster::profiles::PerformanceProfile>^ getAllProfiles() {
        std::lock_guard<std::mutex> lock(_mutex);
        auto profiles = _nativeMgr->getAllProfiles();
        System::Collections::Generic::List<cs2::booster::profiles::PerformanceProfile>^ result = gcnew System::Collections::Generic::List<cs2::booster::profiles::PerformanceProfile>();
        for each (auto prop in profiles) {
            result->Add(prop);
        }
        return result;
    }

    // Set active profile
    bool setActiveProfile(System::String^ name) {
        std::lock_guard<std::mutex> lock(_mutex);
        return _nativeMgr->setActiveProfile(gcnew std::string(name->Data()));
    }

    // Apply current profile
    bool applyCurrentProfile() {
        std::lock_guard<std::mutex> lock(_mutex);
        auto result = _nativeMgr->applyCurrentProfile();
        return result.success;
    }

    // Check if profile exists
    bool profileExists(System::String^ name) {
        std::lock_guard<std::mutex> lock(_mutex);
        return _nativeMgr->profileExists(gcnew std::string(name->Data()));
    }

    // Get profile count
    int getProfileCount() {
        std::lock_guard<std::mutex> lock(_mutex);
        return (int)_nativeMgr->getProfileCount();
    }

    // Export profile to JSON
    System::String^ exportProfileJson(cs2::booster::profiles::PerformanceProfile profile) {
        std::lock_guard<std::mutex> lock(_mutex);
        std::string json = _nativeMgr->exportProfileJson(profile);
        return gcnew System::String(json.c_str());
    }

    // Import profile from JSON
    cs2::booster::profiles::PerformanceProfile importProfileJson(System::String^ json) {
        std::lock_guard<std::mutex> lock(_mutex);
        return _nativeMgr->importProfileJson(gcnew std::string(json->Data()));
    }

    // Get active profile
    cs2::booster::profiles::PerformanceProfile getActiveProfile() {
        std::lock_guard<std::mutex> lock(_mutex);
        return _nativeMgr->getActiveProfile();
    }

private:
    std::unique_ptr<cs2::booster::profiles::ProfileManager> _nativeMgr;
    std::mutex _mutex;
};

// System Monitor wrapper
public ref class SystemMonitorWrapper : public System::IDisposable {
public:
    SystemMonitorWrapper() {
        _nativeMgr = std::make_unique<cs2::booster::monitoring::SystemMonitor>();
    }

    ~SystemMonitorWrapper() {
        this->!SystemMonitorWrapper();
    }

    !SystemMonitorWrapper() {
        if (_nativeMgr) {
            _nativeMgr.reset();
        }
    }

    // Update system info
    void update() {
        std::lock_guard<std::mutex> lock(_mutex);
        _nativeMgr->update();
    }

    // Get CPU info
    System::String^ getCpuInfo() {
        std::lock_guard<std::mutex> lock(_mutex);
        cs2::booster::monitoring::CpuInfo info = _nativeMgr->getCpuInfo();
        System::String^ result = gcnew System::String(L"");
        // Build string from CPU info
        return result;
    }

    // Get memory info
    System::String^ getMemoryInfo() {
        std::lock_guard<std::mutex> lock(_mutex);
        cs2::booster::monitoring::MemoryInfo info = _nativeMgr->getMemoryInfo();
        System::String^ result = gcnew System::String(L"");
        return result;
    }

    // Get GPU info
    System::String^ getGpuInfo() {
        std::lock_guard<std::mutex> lock(_mutex);
        cs2::booster::monitoring::GpuInfo info = _nativeMgr->getGpuInfo();
        System::String^ result = gcnew System::String(L"");
        return result;
    }

    // Get all data as key-value pairs
    System::Collections::Generic::Dictionary<System::String^, System::String^>^ getAllData() {
        std::lock_guard<std::mutex> lock(_mutex);
        auto data = _nativeMgr->getAllData();
        System::Collections::Generic::Dictionary<System::String^, System::String^>^ result = gcnew System::Collections::Generic::Dictionary<System::String^, System::String^>();
        for each (auto kvp in data) {
            result->Add(gcnew System::String(kvp.first.c_str()), gcnew System::String(kvp.second.c_str()));
        }
        return result;
    }

    // Get last update time
    System::String^ getLastUpdateTime() {
        std::lock_guard<std::mutex> lock(_mutex);
        std::wstring time = _nativeMgr->getLastUpdateTime();
        return gcnew System::String(time.c_str());
    }

private:
    std::unique_ptr<cs2::booster::monitoring::SystemMonitor> _nativeMgr;
    std::mutex _mutex;
};

// Main wrapper class that aggregates all functionality
public ref class Cs2BoosterEngine : public System::IDisposable {
public:
    Cs2BoosterEngine() {
        _perfMgr = gcnew PerformanceManagerWrapper();
        _memMgr = gcnew MemoryOptimizerWrapper();
        _netMgr = gcnew NetworkTweakerWrapper();
        _gpuMgr = gcnew GPOptimizerWrapper();
        _profileMgr = gcnew ProfileManagerWrapper();
        _systemMonitor = gcnew SystemMonitorWrapper();
    }

    ~Cs2BoosterEngine() {
        this->!Cs2BoosterEngine();
    }

    !Cs2BoosterEngine() {
        if (_perfMgr) { _perfMgr->Dispose(); _perfMgr = nullptr; }
        if (_memMgr) { _memMgr->Dispose(); _memMgr = nullptr; }
        if (_netMgr) { _netMgr->Dispose(); _netMgr = nullptr; }
        if (_gpuMgr) { _gpuMgr->Dispose(); _gpuMgr = nullptr; }
        if (_profileMgr) { _profileMgr->Dispose(); _profileMgr = nullptr; }
        if (_systemMonitor) { _systemMonitor->Dispose(); _systemMonitor = nullptr; }
    }

    // Performance management
    property bool IsCs2Running {
        bool get() { return _perfMgr->isCs2Running(); }
    }

    property cs2::booster::PerformanceState State {
        cs2::booster::PerformanceState get() { return _perfMgr->getState(); }
    }

    // Apply all optimizations
    void ApplyAll() { _perfMgr->applyAll(); }

    // Revert all optimizations
    void RevertAll() { _perfMgr->revertAll(); }

    // Set CS2 priority
    void SetCs2Priority(DWORD priority) { _perfMgr->setCs2Priority(priority); }

    // Memory operations
    void ApplyMemoryOptimization() { _memMgr->apply(); }
    void RevertMemoryOptimization() { _memMgr->revert(); }
    bool EnableLargePages() { return _memMgr->enableLargePages(); }

    // Network operations
    void ApplyNetworkOptimization() { _netMgr->apply(); }
    void EnableGamingQoS() { _netMgr->enableGamingQoS(); }

    // GPU operations
    void ApplyGPOptimization() { _gpuMgr->apply(); }
    void SetVsync(bool enabled) { _gpuMgr->setVsync(enabled); }
    void SetMaxPerformance() { _gpuMgr->setMaxPerformance(); }

    // Profile management
    void CreateProfile(cs2::booster::profiles::PerformanceProfile profile) { _profileMgr->createProfile(profile); }
    System::Collections::Generic::List<cs2::booster::profiles::PerformanceProfile>^ LoadProfiles(System::String^ path) { return _profileMgr->loadProfiles(path); }
    bool SaveProfiles(System::String^ path) { return _profileMgr->saveProfiles(path); }
    System::Collections::Generic::List<cs2::booster::profiles::PerformanceProfile>^ GetAllProfiles() { return _profileMgr->getAllProfiles(); }
    bool SetActiveProfile(System::String^ name) { return _profileMgr->setActiveProfile(name); }
    bool ApplyCurrentProfile() { return _profileMgr->applyCurrentProfile(); }
    bool ProfileExists(System::String^ name) { return _profileMgr->profileExists(name); }
    int GetProfileCount() { return _profileMgr->getProfileCount(); }
    System::String^ ExportProfileJson(cs2::booster::profiles::PerformanceProfile profile) { return _profileMgr->exportProfileJson(profile); }
    cs2::booster::profiles::PerformanceProfile ImportProfileJson(System::String^ json) { return _profileMgr->importProfileJson(json); }
    cs2::booster::profiles::PerformanceProfile GetActiveProfile() { return _profileMgr->getActiveProfile(); }

    // System monitoring
    void UpdateSystemMonitor() { _systemMonitor->update(); }
    System::String^ GetCpuInfo() { return _systemMonitor->getCpuInfo(); }
    System::String^ GetMemoryInfo() { return _systemMonitor->getMemoryInfo(); }
    System::String^ GetGpuInfo() { return _systemMonitor->getGpuInfo(); }
    System::Collections::Generic::Dictionary<System::String^, System::String^>^ GetAllSystemData() { return _systemMonitor->getAllData(); }
    System::String^ GetLastUpdateTime() { return _systemMonitor->getLastUpdateTime(); }

    // Convenience: Apply full profile config
    void ApplyProfile(cs2::booster::profiles::PerformanceProfile profile) {
        _profileMgr->applyCurrentProfile(); // Would use specific profile
    }

private:
    PerformanceManagerWrapper^ _perfMgr;
    MemoryOptimizerWrapper^ _memMgr;
    NetworkTweakerWrapper^ _netMgr;
    GPOptimizerWrapper^ _gpuMgr;
    ProfileManagerWrapper^ _profileMgr;
    SystemMonitorWrapper^ _systemMonitor;
};

} // namespace Cs2BoosterWrapper