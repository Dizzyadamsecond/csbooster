#pragma once

#include <windows.h>
#include <string>
#include <vector>
#include <map>
#include <mutex>
#include <memory>
#include <fstream>
#include <sstream>

namespace cs2::booster::profiles {

// Performance profile definition
struct PerformanceProfile {
    std::string name;
    std::wstring description;
    
    // Profile settings
    struct PowerSettings {
        bool highPerformancePlan = true;
        bool enableUltimatePerformance = false;
    } power;
    
    struct GpuSettings {
        bool enableAnisotropicFiltering = true;
        bool enableVsync = false;
        bool maxPerformanceMode = true;
        int anisotropicLevel = 16;
    } gpu;
    
    struct MemorySettings {
        bool enableLargePages = true;
        bool trimWorkingSet = true;
    } memory;
    
    struct NetworkSettings {
        bool optimizeTcp = true;
        bool enableQoS = true;
        bool disableBackgroundNetwork = true;
    } network;
    
    // Priority settings
    struct ProcessPriority {
        bool enablePriority = true;
        DWORD priorityClass = THREAD_PRIORITY_TIME_CRITICAL;
    } priority;
    
    // Profile metadata
    bool isActive = false;
    std::chrono::system_clock::time_point created = std::chrono::system_clock::now();
    std::chrono::system_clock::timePoint lastUsed = std::chrono::system_clock::now();
    int usageCount = 0;
};

// Profile result
struct ProfileResult {
    bool success = false;
    std::string message;
    PerformanceProfile profile;
};

// Profile Manager - manages performance profiles
class ProfileManager {
public:
    ProfileManager();
    ~ProfileManager();
    
    // Create a new profile
    ProfileResult createProfile(const PerformanceProfile& profile);
    
    // Load profiles from file
    std::vector<PerformanceProfile> loadProfiles(const std::string& filePath);
    
    // Save profiles to file
    bool saveProfiles(const std::string& filePath);
    
    // Get all profiles
    std::vector<PerformanceProfile> getAllProfiles() const;
    
    // Get active profile
    PerformanceProfile getActiveProfile() const;
    
    // Set active profile by name
    ProfileResult setActiveProfile(const std::string& name);
    
    // Delete a profile
    ProfileResult deleteProfile(const std::string& name);
    
    // Apply current profile's settings
    ProfileResult applyCurrentProfile();
    
    // Get profile by name
    PerformanceProfile getProfile(const std::string& name) const;
    
    // Rename a profile
    ProfileResult renameProfile(const std::string& oldName, const std::string& newName);
    
    // Check if profile exists
    bool profileExists(const std::string& name) const;
    
    // Get profile count
    size_t getProfileCount() const;
    
    // Export profile to JSON string
    std::string exportProfileJson(const PerformanceProfile& profile) const;
    
    // Import profile from JSON string
    PerformanceProfile importProfileJson(const std::string& json) const;
    
private:
    // Profile storage
    std::vector<PerformanceProfile> profiles_;
    std::mutex mutex_;
    
    // Default profile settings
    PerformanceProfile createDefaultProfile() const;
    
    // File operations
    bool writeProfileFile(const std::string& filePath, const std::vector<PerformanceProfile>& profiles);
    bool readProfileFile(const std::string& filePath, std::vector<PerformanceProfile>& profiles);
    
    // JSON helper methods
    std::string escapeJsonString(const std::string& str) const;
    std::string performanceProfileToJson(const PerformanceProfile& profile) const;
    PerformanceProfile jsonToPerformanceProfile(const std::string& json) const;
    
    // Apply individual settings from profile
    ProfileResult applyPowerSettings(const PerformanceProfile& profile);
    ProfileResult applyGpuSettings(const PerformanceProfile& profile);
    ProfileResult applyMemorySettings(const PerformanceProfile& profile);
    ProfileResult applyNetworkSettings(const PerformanceProfile& profile);
    ProfileResult applyProcessPrioritySettings(const PerformanceProfile& profile);
};

} // namespace cs2::booster::profiles