#include "pch.h"
#include "utils.h"
#include <windows.h>
#include <string>
#include <vector>
#include <algorithm>
#include <iostream>

// Utility functions for the Cs2Booster project

namespace cs2::booster::utils {

// Get current module file path
std::wstring getModuleFileName(HMODULE hModule) {
    wchar_t buffer[MAX_PATH];
    GetModuleFileNameW(hModule, buffer, MAX_PATH);
    return std::wstring(buffer);
}

// Extract directory from path
std::wstring getDirectoryName(const std::wstring& path) {
    size_t pos = path.find_last_of(L"\\/");
    if (pos != std::wstring::npos) {
        return path.substr(0, pos);
    }
    return L"";
}

// Extract file name from path
std::wstring getFileName(const std::wstring& path) {
    size_t pos = path.find_last_of(L"\\/");
    if (pos != std::wstring::npos) {
        return path.substr(pos + 1);
    }
    return path;
}

// Convert string to lowercase
std::string toLower(const std::string& str) {
    std::string result = str;
    std::transform(result.begin(), result.end(), result.begin(),
        [](unsigned char c) { return std::tolower(c); });
    return result;
}

// Convert string to uppercase
std::string toUpper(const std::string& str) {
    std::string result = str;
    std::transform(result.begin(), result.end(), result.begin(),
        [](unsigned char c) { return std::toupper(c); });
    return result;
}

// Format time duration
std::string formatDuration(std::chrono::milliseconds duration) {
    int totalSeconds = static_cast<int>(duration.count()) / 1000;
    int minutes = totalSeconds / 60;
    int seconds = totalSeconds % 60;
    
    if (minutes > 0) {
        return std::to_string(minutes) + ":" + (seconds < 10 ? "0" : "") + std::to_string(seconds);
    }
    return std::to_string(seconds) + "s";
}

// Check if running as administrator
bool isRunningAsAdmin() {
    BOOL isAdmin = FALSE;
    OpenProcessToken(GetCurrentProcess(), TOKEN_QUERY, &hToken);
    CheckTokenMembership(NULL, &isAdmin);
    return isAdmin != FALSE;
}

// Get system info string
std::wstring getSystemInfo() {
    SYSTEM_INFO sysInfo;
    GetNativeSystemInfo(&sysInfo);
    
    std::wstring info;
    info += L"Processors: " + std::to_wstring(sysInfo.dwNumberOfProcessors) + L"\n";
    info += L"Page Size: " + std::to_wstring(sysInfo.dwPageSize) + L"\n";
    info += L"Minimum Application Address: " + std::to_wstring((uintptr_t)sysInfo.lpMinimumApplicationAddress) + L"\n";
    info += L"Maximum Application Address: " + std::to_wstring((uintptr_t)sysInfo.lpMaximumApplicationAddress) + L"\n";
    
    return info;
}

} // namespace cs2::booster::utils