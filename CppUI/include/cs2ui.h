#pragma once

#include <windows.h>
#include <string>
#include <vector>
#include <memory>

namespace cs2::ui {

// UI State enumeration
enum class UiState {
    MainMenu,
    OptimizationStatus,
    Configuration,
    About
};

// Configuration structure
struct UiConfiguration {
    bool autoApplyOptimizations = true;
    bool showFpsOverlay = false;
    bool minimizeToTray = true;
    DWORD refreshInterval = 1000; // milliseconds
};

// Tweak status for UI display
struct TweakStatus {
    std::string name;
    std::string description;
    PerformanceState state;
    bool isApplicable;
};

// Main UI Window class
class Cs2UiWindow {
public:
    Cs2UiWindow();
    ~Cs2UiWindow();

    // Create and show the main window
    bool createWindow(HINSTANCE hInstance, int nCmdShow);

    // Message loop
    void runMessageLoop();

    // Set the performance manager reference
    void setPerformanceManager(std::shared_ptr<cs2::booster::PerformanceManager> manager);

    // Get current UI state
    UiState getState() const;

    // Update UI from performance manager
    void updateState(PerformanceState state, const std::vector<TweakStatus>& tweakStatuses);

    // Handle menu commands
    void onApplyOptimizations();
    void onRevertOptimizations();
    void onConfigure();
    void onAbout();

    // Tray icon support
    void setupTrayIcon();
    void handleTrayIconMessage(UINT message, WPARAM wParam, LPARAM lParam);

private:
    // Window procedure
    static LRESULT CALLBACK windowProc(HWND hWnd, UINT uMsg, WPARAM wParam, LPARAM lParam);
    LRESULT handleMessage(HWND hWnd, UINT uMsg, WPARAM wParam, LPARAM lParam);

    // Initialize window class
    bool registerWindowClass(HINSTANCE hInstance);

    // Create controls
    void createControls(HWND hWnd);

    // Update status display
    void updateTweaksDisplay(HWND hWnd, const std::vector<TweakStatus>& tweakStatuses);

    // Show about dialog
    void showAboutDialog(HWND hWnd);

    // Window handle
    HWND hWnd_ = NULL;

    // UI State
    UiState currentState_ = UiState::MainMenu;

    // Performance manager
    std::shared_ptr<cs2::booster::PerformanceManager> perfManager_;

    // Configuration
    UiConfiguration config_;

    // Tweak statuses for display
    std::vector<TweakStatus> tweakStatuses_;

    // Tray icon
    NOTIFYICONDATA trayData_;
};

// Main menu resource IDs
enum class MainMenuIds {
    ApplyOptimizations = 1,
    RevertOptimizations,
    Configure,
    About,
    Exit
};

// Status bar panels
enum class StatusPanels {
    State,
    Fps,
    Latency,
    LastUpdated
};

} // namespace cs2::ui