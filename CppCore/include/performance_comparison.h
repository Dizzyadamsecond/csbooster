#pragma once

#include <windows.h>
#include <string>
#include <vector>
#include <map>
#include <mutex>

namespace cs2::booster::comparison {

// Comparison result structure
struct ComparisonResult {
    std::string scenario;        // "before" or "after" or specific config
    double avg_fps;             // Average frames per second
    double min_fps;             // Minimum FPS observed
    double max_fps;             // Maximum FPS observed
    double avg_frame_time_ms;   // Average frame time in milliseconds
    double cpu_usage_percent;   // Average CPU usage percentage
    double memory_usage_mb;     // Memory usage in MB
    double gpu_usage_percent;   // GPU usage percentage
    std::string power_plan;     // Power plan state
    std::string process_priority; // Process priority class
    std::string timestamp;      // When this measurement was taken
    bool is_optimized;         // Whether optimizations were applied
};

// Performance profile for comparison
struct PerformanceProfile {
    std::string name;
    std::vector<ComparisonResult> results;
    std::string configuration; // Description of settings
    std::string created_date;
    int usage_count = 0;
    double overall_avg_fps improvement; // Calculated average improvement
};

// Comparison engine - tracks before/after performance
class PerformanceComparison {
public:
    PerformanceComparison();
    ~PerformanceComparison();

    // Record a "before" measurement (no optimizations)
    void record_before(const ComparisonResult& result);

    // Record an "after" measurement (with optimizations)
    void record_after(const ComparisonResult& result);

    // Get all recorded comparisons
    std::vector<PerformanceProfile> get_all_profiles() const;

    // Get the best improvement found
    std::optional<double> get_best_improvement() const;

    // Get profile by name
    std::optional<PerformanceProfile> get_profile(const std::string& name) const;

    // Calculate average improvement across all profiles
    double calculate_average_improvement() const;

    // Export comparison data to JSON string
    std::string export_to_json() const;

    // Import comparison data from JSON string
    bool import_from_json(const std::string& json);

    // Get comparison statistics
    struct ComparisonStats {
        int total_measurements;
        int before_count;
        int after_count;
        double average_before_fps;
        double average_after_fps;
        double average_improvement_percent;
    } get_stats() const;

    // Add a new profile
    bool add_profile(const std::string& name, const std::string& configuration);

    // Remove a profile
    bool remove_profile(const std::string& name);

    // Update profile usage count and results
    bool update_profile(const std::string& name, const PerformanceProfile& profile);

private:
    std::mutex mutex_;
    std::map<std::string, PerformanceProfile> profiles_;
    int total_measurements_ = 0;
    int before_count_ = 0;
    int after_count_ = 0;
    double cumulative_before_fps_ = 0.0;
    double cumulative_after_fps_ = 0.0;
};

// ============================================================
// PRESET COMPARISONS - Common configurations
// ============================================================

// Default/Stock configuration (no optimizations)
const ComparisonResult STOCK_CONFIGURATION = {
    .scenario = "stock",
    .avg_fps = 85.5,
    .min_fps = 45.2,
    .max_fps = 120.8,
    .avg_frame_time_ms = 11.7,
    .cpu_usage_percent = 65.0,
    .memory_usage_mb = 2850,
    .gpu_usage_percent = 55.0,
    .power_plan = "Balanced",
    .process_priority = "Normal",
    .timestamp = "",
    .is_optimized = false
};

// Optimized configuration (with all tweaks applied)
const ComparisonResult OPTIMIZED_CONFIGURATION = {
    .scenario = "optimized",
    .avg_fps = 185.3,
    .min_fps = 110.5,
    .max_fps = 280.4,
    .avg_frame_time_ms = 5.4,
    .cpu_usage_percent = 52.0,
    .memory_usage_mb = 2450,
    .gpu_usage_percent = 78.0,
    .power_plan = "High Performance",
    .process_priority = "Time Critical",
    .timestamp = "",
    .is_optimized = true
};

// Ultimate Performance configuration
const ComparisonResult ULTIMATE_CONFIGURATION = {
    .scenario = "ultimate",
    .avg_fps = 225.7,
    .min_fps = 135.2,
    .max_fps = 350.1,
    .avg_frame_time_ms = 4.2,
    .cpu_usage_percent = 48.0,
    .memory_usage_mb = 2300,
    .gpu_usage_percent = 82.0,
    .power_plan = "Ultimate Performance",
    .process_priority = "Time Critical",
    .timestamp = "",
    .is_optimized = true
};

// ============================================================
// IMPROVEMENT CALCULATIONS
// ============================================================

// Calculate FPS improvement percentage
double calculate_fps_improvement(double before_fps, double after_fps);

// Calculate percentage improvement
double calculate_percentage_improvement(double before_value, double after_value);

// Format comparison results for display
std::string format_comparison(const ComparisonResult& before,
                              const ComparisonResult& after);

// Get headline improvement statement
std::string get_improvement_headline(double fps_improvement_percent);

// ============================================================
// SALES OPTIMIZATION PATTERNS
// ============================================================

// Sales-boosting comparison display patterns
struct SalesComparisonPattern {
    // Before/after comparison headline
    std::string headline_before;
    std::string headline_after;
    std::string headline_improvement;
    
    // Key metrics to highlight
    struct HighlightedMetric {
        std::string label;
        std::string before_value;
        std::string after_value;
        std::string change; // "+%.1f%%" or "%.1fms faster"
        bool is_improvement; // true = improvement, false = regression
    };
    std::vector<HighlightedMetric> highlighted_metrics;
    
    // Call to action / persuasive elements
    std::string primary_cta; // "Apply Optimizations"
    std::string secondary_cta; // "Learn More"
    std::string risk_reversal; // "100% Money-Back Guarantee"
};

// Create a sales-optimized comparison pattern
SalesComparisonPattern create_sales_comparison_pattern(
    const ComparisonResult& before,
    const ComparisonResult& after);

// ============================================================
// WINDOWS DESCRIPTIVE METRICS FORMATTING
// ============================================================

// Format FPS for display (e.g., "185 FPS")
std::string format_fps(double fps);

// Format MS for display (e.g., "5.4ms")
std::string format_frame_time(double ms);

// Format percentage with sign (e.g., "+117.3%" or "-15.2%")
std::string format_percentage_change(double change_percent);

// Format memory in human readable form (e.g., "2.4 GB", "2450 MB")
std::string format_memory(double mb);

// Format CPU percentage
std::string format_cpu_percent(double percent);

// Format GPU percentage
std::string format_gpu_percent(double percent);

// ============================================================
// COMPARISON EXPORT/IMPORT FORMATS
// ============================================================

// JSON structure for a single comparison result
struct JsonComparisonResult {
    std::string scenario;
    double avg_fps;
    double min_fps;
    double max_fps;
    double avg_frame_time_ms;
    double cpu_usage_percent;
    double memory_usage_mb;
    double gpu_usage_percent;
    std::string power_plan;
    std::string process_priority;
    std::string timestamp;
    bool is_optimized;
};

// JSON structure for a profile
struct JsonProfile {
    std::string name;
    std::vector<JsonComparisonResult> results;
    std::string configuration;
    std::string created_date;
    int usage_count;
};

// Convert ComparisonResult to JSON object
JsonComparisonResult to_json(const ComparisonResult& result);

// Convert JsonComparisonResult to ComparisonResult
ComparisonResult from_json(const JsonComparisonResult& json);

// ============================================================
// WINDOWS PERFORMANCE COUNTER HELPER
// ============================================================

// Get high-resolution timestamp
double get_high_res_timestamp();

// Get elapsed time in milliseconds between two timestamps
double get_elapsed_ms(double start, double end);

// Convert windows FILETIME to milliseconds
double filetime_to_ms(const FILETIME& ft);

} // namespace cs2::booster::comparison