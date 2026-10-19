#pragma once

#include <windows.h>
#include <string>
#include <map>
#include <variant>

namespace cs2::ui::design {

// ============================================================
// COLOR TOKENS - Windows Desktop Application Palette
// ============================================================

// Primitive color tokens (raw RGB values)
struct ColorTokens {
    // Background colors
    COLORREF window_background = RGB(10, 10, 20);       // Dark navy base
    COLORREF panel_background = RGB(15, 15, 25);       // Card background
    COLORREF surface_elevated = RGB(20, 20, 35);       // Elevated surfaces
    COLORREF surface_hover = RGB(30, 30, 50);          // Hover state
    COLORREF surface_activated = RGB(40, 45, 65);      // Active window border
    
    // Text colors
    COLORREF text_primary = RGB(255, 255, 255);       // Primary text
    COLORREF text_secondary = RGB(180, 180, 200);     // Secondary text
    COLORREF text_muted = RGB(100, 100, 120);         // Muted text
    COLORREF text_accent = RGB(255, 220, 100);        // Accent/caution text
    
    // UI element colors
    COLORREF border_default = RGB(60, 60, 80);         // Default borders
    COLORREF border_focus = RGB(255, 215, 0);          // Focus border (gold)
    COLORREF border_disabled = RGB(40, 40, 50);       // Disabled borders
    
    // Action colors
    COLORREF action_primary = RGB(0, 180, 215);        // Primary actions (cyan)
    COLORREF action_secondary = RGB(0, 150, 135);      // Secondary actions (teal)
    COLORREF action_danger = RGB(255, 80, 80);         // Danger/negative (red)
    COLORREF action_success = RGB(80, 200, 120);       // Success/positive (green)
    
    // Status colors
    COLORREF status_optimizing = RGB(255, 215, 0);     // Optimizing (gold)
    COLORREF status_applied = RGB(80, 200, 120);       // Applied (green)
    COLORREF status_error = RGB(255, 80, 80);          // Error (red)
    COLORREF status_idle = RGB(100, 100, 130);         // Idle state
};

// ============================================================
// TYPOGRAPHY TOKENS
// ============================================================

struct TypographyTokens {
    // Font families
    std::wstring font_family_primary = L"Segoe UI";
    std::wstring font_family_monospace = L"Consolas";
    
    // Font sizes (in pixels)
    int font_size_xs = 8;
    int font_size_sm = 10;
    int font_size_md = 12;
    int font_size_lg = 14;
    int font_size_xl = 16;
    int font_size_2xl = 20;
    
    // Font weights
    int font_weight_normal = FW_NORMAL;
    int font_weight_medium = FW_SEMIBOLD;
    int font_weight_bold = FW_BOLD;
    
    // Line heights
    double line_height_tight = 1.2;
    double line_height_normal = 1.5;
    double line_height_relaxed = 1.8;
};

// ============================================================
// SPACING TOKENS
// ============================================================

struct SpacingTokens {
    int spacing_xs = 4;
    int spacing_sm = 8;
    int spacing_md = 16;
    int spacing_lg = 24;
    int spacing_xl = 32;
    int spacing_2xl = 48;
    int spacing_3xl = 64;
};

// ============================================================
// BORDER RADIUS TOKENS
// ============================================================

struct BorderRadiusTokens {
    int radius_none = 0;
    int radius_sm = 4;
    int radius_md = 8;
    int radius_lg = 12;
    int radius_full = 9999; // For pills/fully rounded
};

// ============================================================
// SHADOW TOKENS
// ============================================================

struct ShadowTokens {
    // None
    std::wstring shadow_none = L"";
    
    // Small shadow (for buttons, inputs)
    std::wstring shadow_sm = L"0 1 2 3 rgba(0,0,0,0.15)";
    
    // Medium shadow (for cards, panels)
    std::wstring shadow_md = L"0 4 12 5 rgba(0,0,0,0.25)";
    
    // Large shadow (for modals, dropdowns)
    std::wstring shadow_lg = L"0 12 30 10 rgba(0,0,0,0.35)";
    
    // Extra large (for emphasis)
    std::wstring shadow_xl = L"0 25 55 15 rgba(0,0,0,0.45)";
};

// ============================================================
// ICON/IMG SIZE TOKENS
// ============================================================

struct IconTokens {
    int size_sm = 12;
    int size_md = 16;
    int size_lg = 24;
    int size_xl = 32;
    int size_2xl = 48;
};

// ============================================================
// COMPONENT-SPECIFIC TOKENS
// ============================================================

// Button tokens
struct ButtonTokens {
    COLORREF background_default = COLOR_TOKENS.action_primary;
    COLORREF background_hover = COLOR_TOKENS.surface_hover;
    COLORREF background_pressed = RGB(0, 150, 180);
    COLORREF background_disabled = RGB(40, 40, 50);
    COLORREF text_color = RGB(255, 255, 255);
    COLORREF text_hover = RGB(255, 255, 255);
    COLORREF text_disabled = RGB(120, 120, 140);
    int padding_h = 12;
    int padding_v = 6;
    int border_radius = BorderRadiusTokens.radius_md;
    int min_height = 32;
};

// Progress bar tokens
struct ProgressBarTokens {
    COLORREF background = RGB(40, 40, 55);
    COLORREF progress = COLOR_TOKENS.action_primary;
    COLORREF progress_success = COLOR_TOKENS.action_success;
    int height = 8;
    int border_radius = BorderRadiusTokens.radius_sm;
};

// Status indicator tokens
struct StatusIndicatorTokens {
    COLORREF idle = COLORREF(RGB(100, 100, 130));
    COLORREF optimizing = COLORREF(RGB(255, 215, 0));
    COLORREF applied = COLORREF(RGB(80, 200, 120));
    COLORREF error = COLORREF(RGB(255, 80, 80));
    COLORREF disconnected = COLORREF(RGB(150, 150, 180));
};

// ============================================================
// THEME VARIANTS (Light/Dark for Desktop App)
// ============================================================

struct ThemeVariant {
    std::wstring name;
    ColorTokens colors;
    TypographyTokens typography;
    SpacingTokens spacing;
    BorderRadiusTokens border_radius;
    ShadowTokens shadows;
    
    // Apply theme to window
    void apply(HWND hWnd) const;
};

// Light theme (for Windows high contrast or user preference)
const ThemeVariant LIGHT_THEME = {
    .name = L"Light",
    .colors = ColorTokens(), // Will be overridden with light-specific values
    .typography = TypographyTokens(),
    .spacing = SpacingTokens(),
    .border_radius = BorderRadiusTokens(),
    .shadows = ShadowTokens()
};

// Dark theme (default for Cs2Booster)
const ThemeVariant DARK_THEME = {
    .name = L"Dark",
    .colors = ColorTokens(), // Already set up for dark palette
    .typography = TypographyTokens(),
    .spacing = SpacingTokens(),
    .border_radius = BorderRadiusTokens(),
    .shadows = ShadowTokens()
};

// ============================================================
// COMPONENT LAYOUT PATTERNS
// ============================================================

// Main window layout
struct MainWindowLayout {
    int menu_height = 30;
    int status_bar_height = 28;
    int client_padding_top = 8;
    int client_padding_left = 16;
    int client_padding_right = 16;
    int client_padding_bottom = 8;
    
    // Status panel items
    int status_item_min_width = 80;
    int status_item_gap = 12;
};

// Sidebar/layout patterns
struct SidebarLayout {
    int width_collapsed = 40;
    int width_expanded = 200;
    int min_content_area = 300;
};

// ============================================================
// PATTERN REGISTRY - Reusable UI Patterns
// ============================================================

// Card pattern with header/content/footer
struct CardPattern {
    std::wstring header_text;
    std::wstring title;
    std::wstring subtitle;
    bool has_border = true;
    bool has_shadow = true;
    bool hover_highlight = true;
};

// Button pattern with states
struct ButtonPattern {
    std::wstring text;
    std::function<void()> on_click;
    bool enabled = true;
    bool auto_default = false; // Windows auto-default button
    int default_result = IDOK; // For dialog boxes
};

// Tooltip pattern
struct TooltipPattern {
    std::wstring text;
    POINT preferred_location; // Near mouse or element
    int delay_ms = 500;
    int fade_in_ms = 150;
    int fade_out_ms = 100;
    bool follow_mouse = false;
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

// Convert COLORREF to hex string
std::string color_to_hex(COLORREF color);

// Convert hex string to COLORREF
COLORREF hex_to_color(const std::string& hex);

// Get token value from map with fallback
template<typename T>
T get_token(const std::map<std::string, T>& tokens, const std::string& key, const T& fallback) {
    auto it = tokens.find(key);
    if (it != tokens.end()) return it->second;
    return fallback;
}

// Validate COLORREF is valid
bool is_valid_color(COLORREF color);

} // namespace cs2::ui::design