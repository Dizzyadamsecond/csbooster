#include "pch.h"
#include "cs2ui.h"
#include "performance_manager.h"
#include <windowsx.h>
#include <commctrl.h>
#include <string>
#include <sstream>
#include <iomanip>
#include <chrono>
#include <thread>

namespace cs2::ui {

Cs2UiWindow::Cs2UiWindow() 
    : hWnd_(NULL), perfManager_(nullptr) {
    ZeroMemory(&trayData_, sizeof(trayData_));
}

Cs2UiWindow::~Cs2UiWindow() {
    if (hWnd_) {
        DestroyWindow(hWnd_);
    }
    if (trayData_.hIcon) {
        DestroyIcon(trayData_.hIcon);
    }
}

bool Cs2UiWindow::createWindow(HINSTANCE hInstance, int nCmdShow) {
    if (!registerWindowClass(hInstance)) {
        return false;
    }

    hWnd_ = CreateWindowW(
        L"Cs2BoosterUi",
        L"CS2 Booster Performance Suite",
        WS_OVERLAPPEDWINDOW | WS_VISIBLE,
        CW_USEDEFAULT, CW_USEDEFAULT,
        1024, 768,
        nullptr, nullptr, hInstance, this);

    if (!hWnd_) {
        return false;
    }

    ShowWindow(hWnd_, nCmdShow);
    UpdateWindow(hWnd_);

    return true;
}

void Cs2UiWindow::runMessageLoop() {
    MSG msg;
    while (GetMessage(&msg, nullptr, 0, 0)) {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }
}

void Cs2UiWindow::setPerformanceManager(std::shared_ptr<cs2::booster::PerformanceManager> manager) {
    perfManager_ = manager;
}

UiState Cs2UiWindow::getState() const {
    return currentState_;
}

void Cs2UiWindow::updateState(PerformanceState state, const std::vector<TweakStatus>& tweakStatuses) {
    currentState_ = UiState::OptimizationStatus;
    tweakStatuses_ = tweakStatuses;
    
    // Force a redraw of the status area
    if (hWnd_) {
        InvalidateRect(hWnd_, nullptr, FALSE);
        UpdateWindow(hWnd_);
    }
}

void Cs2UiWindow::onApplyOptimizations() {
    if (!perfManager_) return;
    
    // Apply all optimizations
    if (perfManager_->applyAll()) {
        // Show success
        MessageBox(hWnd_, L"Optimizações aplicadas com sucesso!", L"Sucesso", MB_OK | MB_ICONINFORMATION);
    } else {
        // Show error
        MessageBox(hWnd_, L"Falha ao aplicar algumas optimizações.", L"Erro", MB_OK | MB_ICONERROR);
    }
}

void Cs2UiWindow::onRevertOptimizations() {
    if (!perfManager_) return;
    
    // Revert all optimizations
    perfManager_->revertAll();
    updateState(PerformanceState::Idle, {});
    MessageBox(hWnd_, L"Optimizações revertidas.", L"Revertido", MB_OK | MB_ICONINFORMATION);
}

void Cs2UiWindow::onConfigure() {
    // Show configuration dialog
    // For now, just show a message
    CONFIGDLG dlg;
    dlg.doModal(hWnd_);
}

void Cs2UiWindow::onAbout() {
    showAboutDialog(hWnd_);
}

void Cs2UiWindow::setupTrayIcon() {
    trayData_.cbSize = sizeof(NOTIFYICONDATA);
    trayData_.hWnd = hWnd_;
    trayData_.uID = 1;
    trayData_.uFlags = NIF_ICON | NIF_MESSAGE | NIF_TIP;
    trayData_.uCallbackMessage = WM_USER_TRAY;
    
    // Load default icon
    trayData_.hIcon = LoadIcon(nullptr, IDI_APPLICATION);
    wcscpy_s(trayData_.szTip, L"CS2 Booster");
    
    Shell_NotifyIcon(NIM_ADD, &trayData_);
}

void Cs2UiWindow::handleTrayIconMessage(UINT message, WPARAM wParam, LPARAM lParam) {
    if (message == WM_USER_TRAY && lParam == WM_RBUTTONUP) {
        // Show tray menu
        HMENU hMenu = CreatePopupMenu();
        AppendMenu(hMenu, MF_STRING, (UINT)MainMenuIds::ApplyOptimizations, L"Aplicar Otimizações");
        AppendMenu(hMenu, MF_STRING, (UINT)MainMenuIds::RevertOptimizations, L"Reverter Otimizações");
        AppendMenu(hMenu, MF_SEPARATOR, 0, nullptr);
        AppendMenu(hMenu, MF_STRING, (UINT)MainMenuIds::Exit, Sair);
        
        SetForegroundWindow(hWnd_);
        
        POINT pt;
        GetCursorPos(&pt);
        TrackPopupMenu(hMenu, TPM_BOTTOMALIGN, pt.x, pt.y, 0, hWnd_, nullptr);
        DestroyMenu(hMenu);
    }
}

LRESULT CALLBACK Cs2UiWindow::windowProc(HWND hWnd, UINT uMsg, WPARAM wParam, LPARAM lParam) {
    return Cs2UiWindow::windowProc(hWnd, uMsg, wParam, lParam);
}

LRESULT Cs2UiWindow::handleMessage(HWND hWnd, UINT uMsg, WPARAM wParam, LPARAM lParam) {
    switch (uMsg) {
        case WM_COMMAND:
        {
            int wmId = LOWORD(wParam);
            switch (wmId) {
                case (int)MainMenuIds::ApplyOptimizations:
                    onApplyOptimizations();
                    break;
                case (int)MainMenuIds::RevertOptimizations:
                    onRevertOptimizations();
                    break;
                case (int)MainMenuIds::Configure:
                    onConfigure();
                    break;
                case (int)MainMenuIds::About:
                    onAbout();
                    break;
                case (int)MainMenuIds::Exit:
                    PostQuitMessage(0);
                    break;
                default:
                    return DefWindowProc(hWnd, uMsg, wParam, lParam);
            }
            break;
        }
        case WM_CLOSE:
            DestroyWindow(hWnd);
            break;
        case WM_DESTROY:
            // Clean up tray icon
            if (trayData_.hIcon) {
                Shell_NotifyIcon(NIM_DELETE, &trayData_);
                DestroyIcon(trayData_.hIcon);
            }
            PostQuitMessage(0);
            break;
        case WM_USER_TRAY:
            handleTrayIconMessage(uMsg, wParam, lParam);
            break;
        case WM_PAINT:
        {
            PAINTSTRUCT ps;
            HDC hdc = BeginPaint(hWnd, &ps);
            
            // Draw UI based on current state
            drawInterface(hdc, ps.rcPaint);
            
            EndPaint(hWnd, &ps);
            break;
        }
        default:
            return DefWindowProc(hWnd, uMsg, wParam, lParam);
    }
    return 0;
}

bool Cs2UiWindow::registerWindowClass(HINSTANCE hInstance) {
    WNDCLASSEXW wcex;
    
    wcex.cbSize = sizeof(WNDCLASSEXW);
    wcex.style = CS_HREDRAW | CS_VREDRAW;
    wcex.lpfnWndProc = windowProc;
    wcex.cbClsExtra = 0;
    wcex.cbWndExtra = 0;
    wcex.hInstance = hInstance;
    wcex.hIcon = LoadIcon(hInstance, MAKEINTRESOURCE(IDI_CS2BOOSTER));
    wcex.hCursor = LoadCursor(nullptr, IDC_ARROW);
    wcex.hbrBackground = (HBRUSH)(COLOR_WINDOW + 1);
    wcex.lpszMenuName = MAKEINTRESOURCEW(IDR_MAIN_MENU);
    wcex.lpszClassName = L"Cs2BoosterUi";
    wcex.hIconSm = LoadIcon(wcex.hInstance, MAKEINTRESOURCE(IDI_SMALL));
    
    return RegisterClassExW(&wcex) != 0;
}

void Cs2UiWindow::createControls(HWND hWnd) {
    // Create status bar
    HWND hStatus = CreateWindowW(
        STATUSCLASSW, nullptr,
        WS_CHILD | WS_VISIBLE | SBARS_SIZEGRIP,
        0, 0, 0, 0, hWnd, (HMENU)1, GetWindowLong(hWnd, GWL_HINSTANCE), nullptr);

    if (hStatus) {
        SendMessage(hStatus, WM_SIZE, 0, 0);
    }

    // Create rebar to hold status bar
    // ... (simplified for now)
}

void Cs2UiWindow::updateTweaksDisplay(HWND hWnd, const std::vector<TweakStatus>& tweakStatuses) {
    // Update the status display with current tweak states
    // This will populate a list or grid of tweak statuses
    tweakStatuses_ = tweakStatuses;
    
    if (hWnd) {
        InvalidateRect(hWnd, nullptr, FALSE);
        UpdateWindow(hWnd);
    }
}

void Cs2UiWindow::showAboutDialog(HWND hWnd) {
    DialogBoxW(nullptr, MAKEINTRESOURCEW(IDD_ABOUT), hWnd, [](HWND hDlg, UINT uMsg, WPARAM wParam, LPARAM lParam) -> INT_PTR {
        switch (uMsg) {
            case WM_INITDIALOG:
                return (INT_PTR)TRUE;
            case WM_COMMAND:
                if (LOWORD(wParam) == IDOK || LOWORD(wParam) == IDCANCEL) {
                    EndDialog(hDlg, LOWORD(wParam));
                    return (INT_PTR)TRUE;
                }
                break;
        }
        return (INT_PTR)FALSE;
    });
}

void Cs2UiWindow::drawInterface(HDC hdc, RECT& rect) {
    // Draw the main interface based on current state
    // Background
    HBRUSH brush = CreateSolidBrush(RGB(10, 10, 20));
    FillRect(hdc, &rect, brush);
    DeleteObject(brush);
    
    // Set text color
    SetBkMode(hdc, TRANSPARENT);
    SetTextColor(hdc, RGB(255, 255, 255));
    
    // Draw title
    SetBkMode(hdc, OPAQUE);
    SetBkColor(hdc, RGB(10, 10, 20));
    
    std::wstring title = L"CS2 Booster Performance Suite";
    RECT textRect = { 20, 20, rect.right - 20, 50 };
    DrawTextW(hdc, title.c_str(), (int)title.length(), &textRect, DT_LEFT | DT_VCENTER);
    
    // Draw status based on state
    if (perfManager_) {
        auto state = perfManager_->getState();
        std::wstring statusText;
        
        switch (state) {
            case PerformanceState::Idle:
                statusText = L"Estado: Ocioso";
                break;
            case PerformanceState::Optimizing:
                statusText = L"Estado: Otimizando...";
                break;
            case PerformanceState::Applied:
                statusText = L"Estado: Otimizações aplicadas";
                break;
            case PerformanceState::Error:
                statusText = L"Estado: Erro";
                break;
        }
        
        textRect.top = 80;
        textRect.bottom = textRect.top + 20;
        DrawTextW(hdc, statusText.c_str(), (int)statusText.length(), &textRect, DT_LEFT | DT_VCENTER);
    }
    
    // Draw tweak statuses
    int yPos = 120;
    for (const auto& tweak : tweakStatuses_) {
        std::wstring tweakName = std::wstring(tweak.name.begin(), tweak.name.end());
        std::wstring tweakState;
        
        switch (tweak.state) {
            case PerformanceState::Idle:
                tweakState = L"Pendente";
                break;
            case PerformanceState::Applied:
                tweakState = L"Aplicado";
                break;
            case PerformanceState::Error:
                tweakState = L"Erro";
                break;
            case PerformanceState::Skipped:
                tweakState = L"Pulado";
                break;
        }
        
        textRect.top = yPos;
        textRect.bottom = yPos + 20;
        DrawTextW(hdc, tweakName.c_str(), (int)tweakName.length(), &textRect, DT_LEFT | DT_VCENTER);
        
        textRect.top = yPos;
        textRect.bottom = yPos + 20;
        textRect.left = rect.right - 150;
        DrawTextW(hdc, tweakState.c_str(), (int)tweakState.length(), &textRect, DT_RIGHT | DT_VCENTER);
        
        yPos += 30;
    }
}

// Helper function for dialog
INT_PTR CALLBACK Cs2UiWindow::configDlgProc(HWND hDlg, UINT uMsg, WPARAM wParam, LPARAM lParam) {
    switch (uMsg) {
        case WM_INITDIALOG:
            return TRUE;
        case WM_COMMAND:
            if (LOWORD(wParam) == IDOK || LOWORD(wParam) == IDCANCEL) {
                EndDialog(hDlg, LOWORD(wParam));
                return TRUE;
            }
            break;
    }
    return FALSE;
}

} // namespace cs2::ui