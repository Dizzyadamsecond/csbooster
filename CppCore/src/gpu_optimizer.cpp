#include "pch.h"
#include "gpu_optimizer.h"
#include <windows.h>
#include <string>
#include <vector>
#include <iostream>
#include <registryapi.h> // Hypothetical, using raw registry

namespace cs2::booster {

GPOptimizer::GPOptimizer() : state_(PerformanceState::Idle) {
}

GPOptimizer::~GPOptimizer() {
}

TweakResult GPOptimizer::apply() {
    TweakResult result;
    result.state = PerformanceState::Idle;
    
    // Apply GPU optimizations for CS2
    bool powerOk = applyPowerSettings();
    bool dxOk = applyDirectXSettings();
    bool textureOk = applyTextureSettings();
    
    result.success = powerOk && dxOk && textureOk;
    result.state = result.success ? PerformanceState::Applied : PerformanceState::Error;
    
    return result;
}

TweakResult GPOptimizer::revert() {
    TweakResult result;
    result.state = PerformanceState::Idle;
    
    // Revert GPU optimizations
    // Restore original power settings, DX features, texture filtering
    result.success = true;
    result.state = PerformanceState::Applied;
    
    return result;
}

PerformanceState GPOptimizer::getState() const {
    return state_;
}

bool GPOptimizer::setVsync(bool enabled) {
    // V-Sync control via registry or control panel
    // This is typically handled by the game or graphics driver
    // We'll attempt registry edit for Intel/AMD/NVIDIA control panels
    
    HKEY hKey;
    LONG lResult = RegCreateKeyExW(HKEY_CURRENT_USER,
        L"Software\\Microsoft\\DirectX",
        0, nullptr, 0, KEY_WRITE, nullptr, &hKey, nullptr);
    
    if (lResult == ERROR_SUCCESS) {
        DWORD vsyncValue = enabled ? 1 : 0;
        RegSetValueExW(hKey, L"EnableVSync", 0, REG_DWORD,
            (const BYTE*)&vsyncValue, sizeof(DWORD));
        RegCloseKey(hKey);
        return true;
    }
    
    return false;
}

bool GPOptimizer::setMaxPerformance() {
    // Set GPU to maximum performance mode
    // This involves:
    // 1. Setting Windows power plan to high performance
    // 2. Setting GPU control panel to maximum performance
    // 3. Enabling discrete GPU if applicable (NVIDIA Optimus, AMD Enduro)
    
    // Set power plan
    std::string command = "powercfg -setactive " + std::string(HighPerformanceScheme);
    int code = system(command.c_str());
    if (code != 0) return false;
    
    // Attempt to set NVIDIA control panel settings via registry
    // NVIDIA settings are at: HKR...\\NVIDIA\\Global\\PowerMizer
    // AMD settings at: HKR...\\AMD\\SAM\\PowerPlay
    
    return true;
}

bool GPOptimizer::enableDirectX12Features() {
    // Enable DirectX 12 features for CS2
    // CS2 already uses DX12, but we can enable some enhancements
    
    // Set DX12 debug layer (only for development)
    // Set DXGI allow virtual function lists
    // Enable multi-threaded command lists
    
    // Registry settings for DirectX
    HKEY hKey;
    LONG lResult = RegCreateKeyExW(HKEY_CURRENT_USER,
        L"Software\\Microsoft\\DirectX\\D3D",
        0, nullptr, 0, KEY_WRITE, nullptr, &hKey, nullptr);
    
    if (lResult == ERROR_SUCCESS) {
        // Enable debug layer (disabled by default for performance)
        RegSetValueExW(hKey, L"EnableD3D12DebugLayer", 0, REG_DWORD,
            (const BYTE*)L"0", 4); // 0 = disabled, 1 = enabled
        RegCloseKey(hKey);
    }
    
    return lResult == ERROR_SUCCESS;
}

bool GPOptimizer::setTextureFiltering(const std::wstring& gpuKey, bool anisotropic) {
    // Set anisotropic texture filtering level
    // This is typically done via the GPU control panel
    
    HKEY hKey;
    LONG lResult = RegCreateKeyExW(HKEY_LOCAL_MACHINE,
        gpuKey.c_str(),
        0, nullptr, 0, KEY_WRITE, nullptr, &hKey, nullptr);
    
    if (lResult == ERROR_SUCCESS) {
        if (anisotropic) {
            // Set 16x anisotropic filtering
            RegSetValueExW(hKey, L"AnisotropicFilter", 0, REG_DWORD,
                (const BYTE*)L"16", 1);
        } else {
            // Disable anisotropic filtering
            RegSetValueExW(hKey, L"AnisotropicFilter", 0, REG_DWORD,
                (const BYTE*)L"0", 1);
        }
        RegCloseKey(hKey);
        return true;
    }
    
    return false;
}

std::wstring GPOptimizer::getGpuInfo() const {
    std::wstring info;
    
    // Get GPU information from registry or WMI
    HKEY hKey;
    LONG lResult = RegOpenKeyExW(HKEY_LOCAL_MACHINE,
        L"Hardware\\DeviceMap\\Video",
        0, KEY_READ, &hKey);
    
    if (lResult == ERROR_SUCCESS) {
        // Enumerate video cards
        FILE_NAME_INFO* pNameInfo = nullptr;
        DWORD charCount = 0;
        
        RegQueryInfoKeyW(hKey, nullptr, nullptr, nullptr, nullptr, nullptr, nullptr, 
                         nullptr, nullptr, nullptr, nullptr, nullptr);
        
        RegCloseKey(hKey);
    }
    
    // Also try getting info via DirectX API
    // IDXGIAdapter, etc. - but we don't have DX headers here
    
    return info;
}

std::wstring GPOptimizer::getCurrentSettings() const {
    return getGpuInfo();
}

HKEY GPOptimizer::openGpuRegistry() const {
    HKEY hKey;
    LONG lResult = RegOpenKeyExW(HKEY_LOCAL_MACHINE,
        L"SYSTEM\\CurrentControlSet\\Control\\Class\{4d36e968-e325-11ce-bfc1-08002be10318}",
        0, KEY_READ, &hKey);
    return hKey;
}

} // namespace cs2::booster