#pragma once

#include "Cs2BoosterWrapper.g.h"

namespace Cs2BoosterWrapper {

    // Main engine class
    public ref class Cs2BoosterEngine : public System::IDisposable {
    public:
        Cs2BoosterEngine();
        ~Cs2BoosterEngine();
        !Cs2BoosterEngine();

        // Performance management
        property bool IsCs2Running {
            bool get();
        }

        property cs2::booster::PerformanceState State {
            cs2::booster::PerformanceState get();
        }

        // Apply all optimizations
        void ApplyAll();

        // Revert all optimizations
        void RevertAll();

        // Set CS2 priority
        void SetCs2Priority(DWORD priority);

        // Memory operations
        void ApplyMemoryOptimization();
        void RevertMemoryOptimization();
        bool EnableLargePages();

        // Network operations
        void ApplyNetworkOptimization();
        void EnableGamingQoS();

        // GPU operations
        void ApplyGPOptimization();
        void SetVsync(bool enabled);
        void SetMaxPerformance();

        // Profile management
        void CreateProfile(cs2::booster::profiles::PerformanceProfile profile);
        System::Collections::Generic::List<cs2::booster::profiles::PerformanceProfile>^ LoadProfiles(System::String^ path);
        bool SaveProfiles(System::String^ path);
        System::Collections::Generic::List<cs2::booster::profiles::PerformanceProfile>^ GetAllProfiles();
        bool SetActiveProfile(System::String^ name);
        bool ApplyCurrentProfile();
        bool ProfileExists(System::String^ name);
        int GetProfileCount();
        System::String^ ExportProfileJson(cs2::booster::profiles::PerformanceProfile profile);
        cs2::booster::profiles::PerformanceProfile ImportProfileJson(System::String^ json);
        cs2::booster::profiles::PerformanceProfile GetActiveProfile();

        // System monitoring
        void UpdateSystemMonitor();
        System::String^ GetCpuInfo();
        System::String^ GetMemoryInfo();
        System::String^ GetGpuInfo();
        System::Collections::Generic::Dictionary<System::String^, System::String^>^ GetAllSystemData();
        System::String^ GetLastUpdateTime();

        // Convenience: Apply full profile config
        void ApplyProfile(cs2::booster::profiles::PerformanceProfile profile);

    internal:
        // Expose native methods for callback raising
        void raiseProgressCallback(cs2::booster::PerformanceState state, const std::string& message);
        void raiseCompleteCallback(cs2::booster::PerformanceState state, const std::string& message);

    private:
        class PerformanceManagerWrapper : public System::IDisposable {
        public:
            PerformanceManagerWrapper();
            ~PerformanceManagerWrapper();
            !PerformanceManagerWrapper();

            bool applyAll();
            void revertAll();
            cs2::booster::PerformanceState getState();
            bool isCs2Running();
            bool setCs2Priority(DWORD priority);
            cs2::booster::Cs2ProcessInfo getCs2Info();
            bool applyTweak(std::string tweakName);
            std::vector<std::string> getAvailableTweaks();
            bool saveConfig(std::string path);
            bool loadConfig(std::string path);
            void setProgressCallback(System::Action<cs2::booster::PerformanceState, System::String^>^ cb);
            void setCompleteCallback(System::Action<cs2::booster::PerformanceState, System::String^>^ cb);
            internal:
                void raiseProgressCallback(cs2::booster::PerformanceState state, const std::string& message);
                void raiseCompleteCallback(cs2::booster::PerformanceState state, const std::string& message);
        private:
            std::unique_ptr<cs2::booster::PerformanceManager> _nativeMgr;
            std::mutex _mutex;
            System::Action<cs2::booster::PerformanceState, System::String^>^ _progressCallback = nullptr;
            System::Action<cs2::booster::PerformanceState, System::String^>^ _completeCallback = nullptr;
        };

        class MemoryOptimizerWrapper : public System::IDisposable {
        public:
            MemoryOptimizerWrapper();
            ~MemoryOptimizerWrapper();
            !MemoryOptimizerWrapper();
            bool apply();
            bool revert();
            cs2::booster::PerformanceState getState();
            bool optimizeWorkingSet(DWORD processId);
            bool trimWorkingSet(DWORD processId);
            bool enableLargePages();
            bool setMemoryPriority(DWORD processId);
        private:
            std::unique_ptr<cs2::booster::MemoryOptimizer> _nativeMgr;
            std::mutex _mutex;
        };

        class NetworkTweakerWrapper : public System::IDisposable {
        public:
            NetworkTweakerWrapper();
            ~NetworkTweakerWrapper();
            !NetworkTweakerWrapper();
            bool apply();
            bool revert();
            cs2::booster::PerformanceState getState();
            bool optimizeTcpIp();
            bool enableGamingQoS();
            bool disableBackgroundNetwork();
            System::Collections::Generic::List<System::String^>^ getNetworkAdapters();
        private:
            std::unique_ptr<cs2::booster::NetworkTweaker> _nativeMgr;
            std::mutex _mutex;
        };

        class GPOptimizerWrapper : public System::IDisposable {
        public:
            GPOptimizerWrapper();
            ~GPOptimizerWrapper();
            !GPOptimizerWrapper();
            bool apply();
            bool revert();
            cs2::booster::PerformanceState getState();
            bool setVsync(bool enabled);
            bool setMaxPerformance();
            bool enableDirectX12Features();
            bool setTextureFiltering(System::String^ gpuKey, bool anisotropic);
            System::String^ getGpuInfo();
            System::String^ getCurrentSettings();
        private:
            std::unique_ptr<cs2::booster::GPOptimizer> _nativeMgr;
            std::mutex _mutex;
        };

        class ProfileManagerWrapper : public System::IDisposable {
        public:
            ProfileManagerWrapper();
            ~ProfileManagerWrapper();
            !ProfileManagerWrapper();
            bool createProfile(cs2::booster::profiles::PerformanceProfile profile);
            System::Collections::Generic::List<cs2::booster::profiles::PerformanceProfile>^ loadProfiles(System::String^ filePath);
            bool saveProfiles(System::String^ filePath);
            System::Collections::Generic::List<cs2::booster::profiles::PerformanceProfile>^ getAllProfiles();
            bool setActiveProfile(System::String^ name);
            bool applyCurrentProfile();
            bool profileExists(System::String^ name);
            int getProfileCount();
            System::String^ exportProfileJson(cs2::booster::profiles::PerformanceProfile profile);
            cs2::booster::profiles::PerformanceProfile importProfileJson(System::String^ json);
            cs2::booster::profiles::PerformanceProfile getActiveProfile();
        private:
            std::unique_ptr<cs2::booster::profiles::ProfileManager> _nativeMgr;
            std::mutex _mutex;
        };

        class SystemMonitorWrapper : public System::IDisposable {
        public:
            SystemMonitorWrapper();
            ~SystemMonitorWrapper();
            !SystemMonitorWrapper();
            void update();
            System::String^ getCpuInfo();
            System::String^ getMemoryInfo();
            System::String^ getGpuInfo();
            System::Collections::Generic::Dictionary<System::String^, System::String^>^ getAllData();
            System::String^ getLastUpdateTime();
        private:
            std::unique_ptr<cs2::booster::monitoring::SystemMonitor> _nativeMgr;
            std::mutex _mutex;
        };

        std::unique_ptr<PerformanceManagerWrapper> _perfMgr;
        std::unique_ptr<MemoryOptimizerWrapper> _memMgr;
        std::unique_ptr<NetworkTweakerWrapper> _netMgr;
        std::unique_ptr<GPOptimizerWrapper> _gpuMgr;
        std::unique_ptr<ProfileManagerWrapper> _profileMgr;
        std::unique_ptr<SystemMonitorWrapper> _systemMonitor;
    };

} // namespace Cs2BoosterWrapper