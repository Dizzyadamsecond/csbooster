#pragma once

#include <windows.h>
#include <string>
#include <vector>
#include <mutex>
#include <memory>
#include <chrono>

namespace cs2::booster::overlay {

// Overlay text element
struct OverlayText {
    std::wstring text;
    int x = 0;
    int y = 0;
    int fontSize = 12;
    COLORREF color = RGB(255, 255, 255);
    bool bold = false;
    bool italic = false;
};

// Overlay style configuration
struct OverlayStyle {
    bool enabled = true;
    bool topMost = true;
    bool transparent = true;
    bool showFps = true;
    bool showGpu = true;
    bool showMemory = true;
    bool showPing = true;
    bool showFpsHistory = false;
    int updateInterval = 1000; // milliseconds
    COLORREF backgroundColor = RGB(0, 0, 0);
    COLORREF textColor = RGB(255, 255, 255);
    int backgroundAlpha = 128; // 0-255
    int padding = 10;
    bool showTimestamp = false;
};

// Overlay position
enum class OverlayPosition {
    TopLeft,
    TopRight,
    BottomLeft,
    BottomRight,
    Center
};

// In-game Overlay class
class InGameOverlay {
public:
    InGameOverlay();
    ~InGameOverlay();

    // Initialize the overlay
    bool initialize(HWND parentWindow);

    // Clean up resources
    void shutdown();

    // Update overlay data (call from main loop)
    void updateData(double fps, double gpuUsage, double memoryUsage, 
                    const std::wstring& playerName = L"", 
                    const std::wstring& mapName = L"");

    // Render the overlay
    void render(HDC hdc);

    // Set overlay position
    void setPosition(OverlayPosition position);

    // Set overlay style
    void setStyle(const OverlayStyle& style);

    // Check if overlay is enabled
    bool isEnabled() const;

    // Toggle overlay on/off
    void toggle();

    // Get overlay style
    OverlayStyle getStyle() const;

    // Add custom text element
    void addText(const OverlayText& text);

    // Clear all text elements
    void clearText();

    // Set parent window handle
    void setParentWindow(HWND hWnd);

    // Get parent window handle
    HWND getParentWindow() const;

private:
    // Window procedure for overlay
    static LRESULT CALLBACK overlayWndProc(HWND hWnd, UINT uMsg, WPARAM wParam, LPARAM lParam);
    LRESULT handleMessage(UINT uMsg, WPARAM wParam, LPARAM lParam);

    // Update overlay text based on data
    void updateOverlayText(double fps, double gpuUsage, double memoryUsage,
                           const std::wstring& playerName,
                           const std::wstring& mapName);

    // Draw text on DC
    void drawText(HDC hdc, const std::wstring& text, int x, int y,
                  int fontSize, COLORREF color, bool bold, bool italic);

    // Get system metric info
    RECT getClientRect() const;

    // Handles
    HWND hOverlayWnd_ = NULL;
    HINSTANCE hInstance_ = NULL;

    // State
    bool enabled_ = true;
    OverlayPosition position_ = OverlayPosition::TopLeft;
    OverlayStyle style_;
    
    // FPS tracking
    double currentFps_ = 0.0;
    double averageFps_ = 0.0;
    double minFps_ = 0.0;
    double maxFps_ = 0.0;
    double gpuUsage_ = 0.0;
    double memoryUsage_ = 0.0;
    std::wstring playerName_ = L"";
    std::wstring mapName_ = L"";

    // Timestamp
    std::wstring lastUpdate_;

    // Text elements
    std::vector<OverlayText> textElements_;
    std::mutex textMutex_;

    // Font handling
    HFONT hFont_ = NULL;
    LOGFONTW logFont_;
};

// Global overlay instance
extern std::unique_ptr<InGameOverlay> g_overlay;

} // namespace cs2::booster::overlay