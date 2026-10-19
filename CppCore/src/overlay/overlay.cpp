#include "pch.h"
#include "overlay/overlay.h"
#include <windows.h>
#include <string>
#include <vector>
#include <mutex>
#include <sstream>
#include <iomanip>
#include <chrono>

namespace cs2::booster::overlay {

// Static global instance
std::unique_ptr<InGameOverlay> g_overlay;

InGameOverlay::InGameOverlay()
    : enabled_(true), position_(OverlayPosition::TopLeft) {
    ZeroMemory(&logFont_, sizeof(logFont_));
    logFont_.lfWidth = 12;
    logFont_.lfHeight = -MulDiv(12, GetDeviceContext(NULL), GetStockObject(DEFAULT_GUI_FONT));
    lstrcpyW(logFont_.lfFaceName, L"Arial");
}

InGameOverlay::~InGameOverlay() {
    shutdown();
}

bool InGameOverlay::initialize(HWND parentWindow) {
    hInstance_ = GetModuleHandle(NULL);

    // Create overlay window
    WNDCLASSEXW wc;
    wc.cbSize = sizeof(WNDCLASSEXW);
    wc.style = CS_HREDRAW | CS_VREDRAW;
    wc.lpfnWndProc = overlayWndProc;
    wc.cbClsExtra = 0;
    wc.cbWndExtra = 0;
    wc.hInstance = hInstance_;
    wc.hCursor = LoadCursor(NULL, IDC_ARROW);
    wc.hbrBackground = NULL; // Transparent
    wc.lpszMenuName = NULL;
    wc.cxCursor = 0;
    wc.cyCursor = 0;
    wc.lpszClassName = L"Cs2BoosterOverlay";
    wc.hIconSm = NULL;

    if (!RegisterClassExW(&wc)) {
        return false;
    }

    // Calculate window size based on content
    // We'll create a small window that stays on top

    hOverlayWnd_ = CreateWindowExW(
        WS_EX_LAYERED | WS_EX_TOPMOST | WS_EX_TRANSPARENT | WS_EX_TOOLWINDOW,
        L"Cs2BoosterOverlay",
        L"CS2 Booster Overlay",
        0, // No standard WS_ styles, we use ex styles
        0, 0, 200, 100, // Initial size, will be repositioned
        parentWindow, NULL, hInstance_, this);

    if (!hOverlayWnd_) {
        return false;
    }

    // Set up layered window with alpha
    SetLayeredWindowAttributes(hOverlayWnd_, RGB(0, 0, 0), style_.backgroundAlpha, LWA_ALPHA);

    // Initialize font
    hFont_ = CreateFontW(
        logFont_.lfHeight,
        logFont_.lfWidth,
        0, 0,
        FW_BOLD,
        FALSE, // italic
        FALSE, // underline
        0,
        DEFAULT_CHARSET,
        OUT_OUTLINE_PRECIS,
        CLIP_DEFAULT_PRECIS,
        CLEARTYPE_NATURAL_QUALITY,
        VARIABLE_PITCH,
        logFont_.lfFaceName);

    // Set initial style
    setStyle(style_);

    return true;
}

void InGameOverlay::shutdown() {
    if (hFont_) {
        DeleteObject(hFont_);
        hFont_ = NULL;
    }
    if (hOverlayWnd_) {
        DestroyWindow(hOverlayWnd_);
        hOverlayWnd_ = NULL;
    }
}

void InGameOverlay::updateData(double fps, double gpuUsage, double memoryUsage,
                               const std::wstring& playerName,
                               const std::wstring& mapName) {
    std::lock_guard<std::mutex> lock(textMutex_);

    currentFps_ = fps;
    gpuUsage_ = gpuUsage;
    memoryUsage_ = memoryUsage;
    playerName_ = playerName;
    mapName_ = mapName;

    auto now = std::chrono::system_clock::now();
    auto time_t_now = std::chrono::system_clock::to_time_t(now);
    std::wstringstream ss;
    ss << std::put_time(std::localtime(&time_t_now), L"%H:%M:%S");
    lastUpdate_ = ss.str();

    // Update overlay text elements
    updateOverlayText(fps, gpuUsage, memoryUsage, playerName, mapName);
}

void InGameOverlay::updateOverlayText(double fps, double gpuUsage, double memoryUsage,
                                       const std::wstring& playerName,
                                       const std::wstring& mapName) {
    textElements_.clear();

    int yOffset = style_.padding;

    // FPS text
    if (style_.showFps) {
        std::wstring fpsText;
        if (style_.showFpsHistory || !averageFps_) {
            fpsText = L"FPS: " + std::to_wstring((int)fps) + L" (Avg: " + std::to_wstring((int)averageFps_) + L")";
        } else {
            fpsText = L"FPS: " + std::to_wstring((int)fps);
        }
        textElements_.push_back({ fpsText, 10, yOffset, 14, style_.textColor });
        yOffset += 25;
    }

    // GPU text
    if (style_.showGpu) {
        std::wstring gpuText = L"GPU: " + std::to_wstring((int)gpuUsage) + L"%";
        textElements_.push_back({ gpuText, 10, yOffset, 14, style_.textColor });
        yOffset += 25;
    }

    // Memory text
    if (style_.showMemory) {
        std::wstring memText = L"RAM: " + std::to_wstring((int)memoryUsage) + L"%";
        textElements_.push_back({ memText, 10, yOffset, 14, style_.textColor });
        yOffset += 25;
    }

    // Player name
    if (!playerName.empty()) {
        std::wstring playerText = L"Player: " + playerName;
        textElements_.push_back({ playerText, 10, yOffset, 14, RGB(255, 255, 0) }); // Yellow
        yOffset += 25;
    }

    // Map name
    if (!mapName.empty()) {
        std::wstring mapText = L"Map: " + mapName;
        textElements_.push_back({ mapText, 10, yOffset, 14, RGB(173, 216, 230) }); // Light blue
    }

    // Timestamp
    if (style_.showTimestamp) {
        std::wstring timeText = L"Updated: " + lastUpdate_;
        textElements_.push_back({ timeText, 10, yOffset, 12, RGB(128, 128, 128) }); // Gray
    }
}

void InGameOverlay::render(HDC hdc) {
    if (!enabled_ || textElements_.empty()) return;

    // Set up background if not transparent
    if (!style_.transparent) {
        RECT rect = getClientRect();
        HBRUSH brush = CreateSolidBrush(style_.backgroundColor);
        FillRect(hdc, &rect, brush);
        DeleteObject(brush);
    }

    // Draw text elements
    SetBkMode(hdc, TRANSPARENT);
    SetTextColor(hdc, style_.textColor);

    if (hFont_) {
        SelectObject(hdc, hFont_);
    }

    for (const auto& text : textElements_) {
        TextOutW(hdc, text.x, text.y, text.text.c_str(), (int)text.text.length());
    }
}

void InGameOverlay::setPosition(OverlayPosition position) {
    position_ = position;

    // Reposition window based on position and parent size
    if (hOverlayWnd_ && GetParent(hOverlayWnd_)) {
        RECT parentRect;
        GetClientRect(GetParent(hOverlayWnd_), &parentRect);

        int x = 0, y = 0;

        switch (position) {
            case OverlayPosition::TopLeft:
                x = style_.padding;
                y = style_.padding;
                break;
            case OverlayPosition::TopRight:
                x = parentRect.right - 200 - style_.padding;
                y = style_.padding;
                break;
            case OverlayPosition::BottomLeft:
                x = style_.padding;
                y = parentRect.bottom - 200 - style_.padding;
                break;
            case OverlayPosition::BottomRight:
                x = parentRect.right - 200 - style_.padding;
                y = parentRect.bottom - 200 - style_.padding;
                break;
            case OverlayPosition::Center:
                x = (parentRect.right - 200) / 2;
                y = (parentRect.bottom - 200) / 2;
                break;
        }

        // Set window position
        SetWindowPos(hOverlayWnd_, NULL, x, y, 0, 0, SWP_NOSIZE | SWP_NOZORDER);
    }
}

void InGameOverlay::setStyle(const OverlayStyle& style) {
    style_ = style;

    // Apply to window
    if (hOverlayWnd_) {
        SetWindowLongPtrW(hOverlayWnd_, GWL_STYLE, WS_EX_LAYERED | WS_EX_TOPMOST | WS_EX_TRANSPARENT | WS_EX_TOOLWINDOW);
        SetLayeredWindowAttributes(hOverlayWnd_, RGB(0, 0, 0), style.backgroundAlpha, LWA_ALPHA);
    }
}

bool InGameOverlay::isEnabled() const {
    return enabled_;
}

void InGameOverlay::toggle() {
    enabled_ = !enabled_;
    if (hOverlayWnd_) {
        ShowWindow(hOverlayWnd_, enabled_ ? SW_SHOW : SW_HIDE);
    }
}

OverlayStyle InGameOverlay::getStyle() const {
    return style_;
}

void InGameOverlay::addText(const OverlayText& text) {
    std::lock_guard<std::mutex> lock(textMutex_);
    textElements_.push_back(text);
}

void InGameOverlay::clearText() {
    std::lock_guard<std::mutex> lock(textMutex_);
    textElements_.clear();
}

void InGameOverlay::setParentWindow(HWND hWnd) {
    // If we already have a window, reposition it
    if (hOverlayWnd_) {
        setPosition(position_);
    }
}

HWND InGameOverlay::getParentWindow() const {
    return hOverlayWnd_;
}

LRESULT CALLBACK InGameOverlay::overlayWndProc(HWND hWnd, UINT uMsg, WPARAM wParam, LPARAM lParam) {
    return InGameOverlay::windowProc(hWnd, uMsg, wParam, lParam);
}

LRESULT InGameOverlay::handleMessage(UINT uMsg, WPARAM wParam, LPARAM lParam) {
    switch (uMsg) {
        case WM_PAINT: {
            PAINTSTRUCT ps;
            HDC hdc = BeginPaint(hWnd, &ps);
            render(hdc);
            EndPaint(hWnd, &ps);
            return 0;
        }
        case WM_DESTROY:
            PostQuitMessage(0);
            return 0;
        case WM_SIZE:
            // Reposition when size changes
            setPosition(position_);
            return 0;
        default:
            return DefWindowProc(hWnd, uMsg, wParam, lParam);
    }
}

RECT InGameOverlay::getClientRect() const {
    RECT rect = { 0, 0, 200, 200 };
    if (hOverlayWnd_) {
        GetClientRect(hOverlayWnd_, &rect);
    }
    return rect;
}

void InGameOverlay::drawText(HDC hdc, const std::wstring& text, int x, int y,
                              int fontSize, COLORREF color, bool bold, bool italic) {
    SetTextColor(hdc, color);

    // Create font if needed with specific parameters
    if (hFont_) {
        DeleteObject(hFont_);
    }

    int weight = bold ? FW_BOLD : FW_NORMAL;
    LOGFONTW lf = logFont_;
    lf.lfHeight = -MulDiv(fontSize, GetDeviceCaps(hdc, LOGPIXELSY), 72);
    lf.lfWeight = weight;
    lf.lfItalic = italic;

    HFONT hNewFont = CreateFontW(&lf);
    if (hNewFont) {
        SelectObject(hdc, hNewFont);
    }

    TextOutW(hdc, x, y, text.c_str(), (int)text.length());

    if (hNewFont) {
        DeleteObject(hNewFont);
    }
}

void InGameOverlay::updateOverlayText(double fps, double gpuUsage, double memoryUsage,
                                       const std::wstring& playerName,
                                       const std::wstring& mapName) {
    // This is called from the public updateData method
    // Actual text update happens there
}

// Global accessor
std::unique_ptr<InGameOverlay> getOverlayInstance() {
    return std::move(g_overlay);
}

} // namespace cs2::booster::overlay