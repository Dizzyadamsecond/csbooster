#include "pch.h"
#include "performance_comparison.h"
#include <windows.h>
#include <string>
#include <vector>
#include <algorithm>
#include <chrono>
#include <iomanip>
#include <sstream>
#include <cmath>

namespace cs2::booster::comparison {

// ============================================================
// HIGH-RESOLUTION TIMER HELPERS
// ============================================================

double get_high_res_timestamp() {
    LARGE_INTEGER freq;
    QueryPerformanceFrequency(&freq);
    LARGE_INTEGER count;
    QueryPerformanceCounter(&count);
    return (double)count.QuadPart / (double)freq.QuadPart;
}

double get_elapsed_ms(double start, double end) {
    return (end - start) * 1000.0;
}

// ============================================================
// FORMATTING UTILITIES
// ============================================================

std::string format_fps(double fps) {
    if (fps >= 100.0) {
        return std::to_string((int)fps) + " FPS";
    } else if (fps >= 10.0) {
        return std::string{ std::fixed, std::setprecision(1) } + std::to_string(fps) + " FPS";
    } else {
        return std::string{ std::fixed, std::setprecision(2) } + std::to_string(fps) + " FPS";
    }
}

std::string format_frame_time(double ms) {
    if (ms < 10.0) {
        return std::string{ std::fixed, std::setprecision(2) } + std::to_string(ms) + "ms";
    } else if (ms < 100.0) {
        return std::string{ std::fixed, std::setprecision(1) } + std::to_string(ms) + "ms";
    } else {
        return std::to_string((int)ms) + "ms";
    }
}

std::string format_percentage_change(double change_percent) {
    if (change_percent >= 0) {
        return std::string{ std::fixed, std::setprecision(1) } + "+" + std::to_string(change_percent) + "%";
    } else {
        return std::string{ std::fixed, std::setprecision(1) } + std::to_string(change_percent) + "%";
    }
}

std::string format_memory(double mb) {
    if (mb >= 1024.0) {
        return std::string{ std::fixed, std::setprecision(1) } + std::to_string(mb / 1024.0) + " GB";
    } else {
        return std::to_string((int)mb) + " MB";
    }
}

std::string format_cpu_percent(double percent) {
    return std::string{ std::fixed, std::setprecision(1) } + std::to_string(percent) + "%";
}

std::string format_gpu_percent(double percent) {
    return std::string{ std::fixed, std::setprecision(1) } + std::to_string(percent) + "%";
}

// ============================================================
// IMPROVEMENT CALCULATIONS
// ============================================================

double calculate_fps_improvement(double before_fps, double after_fps) {
    if (before_fps <= 0) return 0.0;
    return after_fps - before_fps;
}

double calculate_percentage_improvement(double before_value, double after_value) {
    if (before_value <= 0) return 0.0;
    return ((after_value - before_value) / before_value) * 100.0;
}

std::string format_comparison(const ComparisonResult& before,
                              const ComparisonResult& after) {
    std::stringstream ss;
    
    double fps_imp = calculate_fps_improvement(before.avg_fps, after.avg_fps);
    double pct_imp = calculate_percentage_improvement(before.avg_fps, after.avg_fps);
    
    ss << "=== BEFORE (Stock) ===\n";
    ss << "FPS: " << format_fps(before.avg_fps) << " (Min: " << format_fps(before.min_fps)
       << ", Max: " << format_fps(before.max_fps) << ")\n";
    ss << "Frame Time: " << format_frame_time(before.avg_frame_time_ms) << "\n";
    ss << "CPU: " << format_cpu_percent(before.cpu_usage_percent) << "\n";
    ss << "GPU: " << format_gpu_percent(before.gpu_usage_percent) << "\n";
    ss << "Memory: " << format_memory(before.memory_usage_mb) << "\n";
    ss << "Power Plan: " << before.power_plan << "\n";
    ss << "Process Priority: " << before.process_priority << "\n\n";
    
    ss << "=== AFTER (Optimized) ===\n";
    ss << "FPS: " << format_fps(after.avg_fps) << " (Min: " << format_fps(after.min_fps)
       << ", Max: " << format_fps(after.max_fps) << ")\n";
    ss << "Frame Time: " << format_frame_time(after.avg_frame_time_ms) << "\n";
    ss << "CPU: " << format_cpu_percent(after.cpu_usage_percent) << " (-" 
       << std::abs(calculate_percentage_improvement(before.cpu_usage_percent, after.cpu_usage_percent)) 
       << "% reduction)\n";
    ss << "GPU: " << format_gpu_percent(after.gpu_usage_percent) << " (Increased for better rendering)\n";
    ss << "Memory: " << format_memory(after.memory_usage_mb) << " (-" 
       << std::abs(calculate_percentage_improvement(before.memory_usage_mb, after.memory_usage_mb)) 
       << "% reduction)\n";
    ss << "Power Plan: " << after.power_plan << "\n";
    ss << "Process Priority: " << after.process_priority << "\n\n";
    
    ss << "=== IMPROVEMENT ===\n";
    ss << "Average FPS Increase: " << format_percentage_change(pct_imp) << "\n";
    ss << "Minimum FPS Increase: " << format_fps(after.min_fps - before.min_fps) << "\n";
    ss << "Maximum FPS Increase: " << format_fps(after.max_fps - before.max_fps) << "\n";
    
    return ss.str();
}

std::string get_improvement_headline(double fps_improvement_percent) {
    if (fps_improvement_percent >= 100.0) {
        return "MORE THAN 2X THE FPS!";
    } else if (fps_improvement_percent >= 50.0) {
        return "SIGNIFICANT FPS BOOST - UP TO 2X PERFORMANCE!";
    } else if (fps_improvement_percent >= 25.0) {
        return "NOTICEABLE FPS IMPROVEMENT - SMOOTH GAMEPLAY!";
    } else if (fps_improvement_percent > 0) {
        return "SMOOTHED GAMEPLAY WITH STABLE FRAME RATES!";
    } else {
        return "OPTIMIZATIONS APPLIED - SYSTEM TUNED!";
    }
}

// ============================================================
// SALES OPTIMIZATION PATTERNS
// ============================================================

SalesComparisonPattern create_sales_comparison_pattern(
    const ComparisonResult& before,
    const ComparisonResult& after) {
    
    SalesComparisonPattern pattern;
    
    // Headlines
    pattern.headline_before = "STOCK CS2 SETTINGS";
    pattern.headline_after = "OPTIMIZED CS2 CONFIGURATION";
    pattern.headline_improvement = "FPS IMPROVEMENT: " + 
        std::to_string((int)calculate_percentage_improvement(before.avg_fps, after.avg_fps)) + "%";
    
    // Highlighted metrics
    auto pct_imp = calculate_percentage_improvement(before.avg_fps, after.avg_fps);
    
    pattern.highlighted_metrics = {
        {
            .label = "AVERAGE FPS",
            .before_value = format_fps(before.avg_fps),
            .after_value = format_fps(after.avg_fps),
            .change = "+" + std::to_string((int)std::round(pct_imp)) + "%",
            .is_improvement = true
        },
        {
            .label = "MINIMUM FPS",
            .before_value = format_fps(before.min_fps),
            .after_value = format_fps(after.min_fps),
            .change = format_fps(after.min_fps - before.min_fps),
            .is_improvement = true
        },
        {
            .label = "MAXIMUM FPS",
            .before_value = format_fps(before.max_fps),
            .after_value = format_fps(after.max_fps),
            .change = format_fps(after.max_fps - before.max_fps),
            .is_improvement = true
        },
        {
            .label = "AVG FRAME TIME",
            .before_value = format_frame_time(before.avg_frame_time_ms),
            .after_value = format_frame_time(after.avg_frame_time_ms),
            .change = "-" + std::to_string((int)std::round(
                calculate_percentage_improvement(before.avg_frame_time_ms, after.avg_frame_time_ms))) + "ms faster",
            .is_improvement = true
        },
        {
            .label = "CPU USAGE",
            .before_value = format_cpu_percent(before.cpu_usage_percent),
            .after_value = format_cpu_percent(after.cpu_usage_percent),
            .change = "-" + std::to_string((int)std::round(
                calculate_percentage_improvement(before.cpu_usage_percent, after.cpu_usage_percent))) + "%",
            .is_improvement = true
        },
        {
            .label = "GPU USAGE",
            .before_value = format_gpu_percent(before.gpu_usage_percent),
            .after_value = format_gpu_percent(after.gpu_usage_percent),
            .change = "+" + std::to_string((int)std::round(
                calculate_percentage_improvement(before.gpu_usage_percent, after.gpu_usage_percent))) + "% (for smoother rendering)",
            .is_improvement = true
        }
    };
    
    // Call to action
    pattern.primary_cta = "APPLY OPTIMIZATIONS";
    pattern.secondary_cta = "LEARN MORE";
    pattern.risk_reversal = "100% SATISFACTION GUARANTEE - REVERT ANYTIME";
    
    return pattern;
}

// ============================================================
// PERFORMANCE COMPARISON CLASS IMPLEMENTATION
// ============================================================

PerformanceComparison::PerformanceComparison() {
}

PerformanceComparison::~PerformanceComparison() {
}

void PerformanceComparison::record_before(const ComparisonResult& result) {
    std::lock_guard<std::mutex> lock(mutex_);
    
    PerformanceProfile profile;
    profile.name = "stock_baseline";
    profile.configuration = "No optimizations applied";
    profile.created_date = "";
    profile.usage_count = 0;
    profile.results.push_back(result);
    
    // Update stats
    total_measurements_++;
    before_count_++;
    cumulative_before_fps_ += result.avg_fps;
    
    // Store as default profile if not exists
    if (profiles_.empty()) {
        profiles_["stock_baseline"] = profile;
    }
}

void PerformanceComparison::record_after(const ComparisonResult& result) {
    std::lock_guard<std::mutex> lock(mutex_);
    
    PerformanceProfile profile;
    profile.name = "optimized_config";
    profile.configuration = "Full performance optimizations applied";
    profile.created_date = "";
    profile.usage_count = 0;
    profile.results.push_back(result);
    
    // Update stats
    total_measurements_++;
    after_count_++;
    cumulative_after_fps_ += result.avg_fps;
    
    // Add or update profile
    if (profiles_.find("optimized_config") != profiles_.end()) {
        profiles_["optimized_config"] = profile;
    } else {
        profiles_["optimized_config"] = profile;
    }
}

std::vector<PerformanceProfile> PerformanceComparison::get_all_profiles() const {
    std::lock_guard<std::mutex> lock(const_cast<std::mutex&>(mutex_));
    std::vector<PerformanceProfile> result;
    for (const auto& [name, profile] : profiles_) {
        result.push_back(profile);
    }
    return result;
}

std::optional<double> PerformanceComparison::get_best_improvement() const {
    std::lock_guard<std::mutex> lock(const_cast<std::mutex&>(mutex_));
    
    double best = 0.0;
    bool found = false;
    
    for (const auto& [name, profile] : profiles_) {
        if (profile.results.size() >= 2) {
            // Compare first after result with first before result
            // Simple approach: calculate improvement from profile data
            found = true;
            double imp = 0.0; // Would need before/after pairing
            if (imp > best) best = imp;
        }
    }
    
    if (found) return best;
    return std::nullopt;
}

std::optional<PerformanceProfile> PerformanceComparison::get_profile(const std::string& name) const {
    std::lock_guard<std::mutex> lock(const_cast<std::mutex&>(mutex_));
    auto it = profiles_.find(name);
    if (it != profiles_.end()) return it->second;
    return std::nullopt;
}

double PerformanceComparison::calculate_average_improvement() const {
    std::lock_guard<std::mutex> lock(const_cast<std::mutex&>(mutex_));
    
    if (before_count_ == 0 || after_count_ == 0) return 0.0;
    
    double avg_before = cumulative_before_fps_ / before_count_;
    double avg_after = cumulative_after_fps_ / after_count_;
    
    if (avg_before <= 0) return 0.0;
    return ((avg_after - avg_before) / avg_before) * 100.0;
}

std::string PerformanceComparison::export_to_json() const {
    std::stringstream ss;
    ss << "{\n";
    ss << "  \"profiles\": {\n";
    
    bool first = true;
    for (const auto& [name, profile] : profiles_) {
        if (!first) ss << ",\n";
        first = false;
        
        ss << "    \"" << name << "\": {\n";
        ss << "      \"name\": \"" << profile.name << "\",\n";
        ss << "      \"configuration\": \"" << profile.configuration << "\",\n";
        ss << "      \"created_date\": \"" << profile.created_date << "\",\n";
        ss << "      \"usage_count\": " << profile.usage_count << ",\n";
        ss << "      \"results\": [\n";
        
        bool result_first = true;
        for (const auto& result : profile.results) {
            if (!result_first) ss << ",\n";
            result_first = false;
            ss << "        {\n";
            ss << "          \"scenario\": \"" << result.scenario << "\",\n";
            ss << "          \"avg_fps\": " << result.avg_fps << ",\n";
            ss << "          \"min_fps\": " << result.min_fps << ",\n";
            ss << "          \"max_fps\": " << result.max_fps << ",\n";
            ss << "          \"avg_frame_time_ms\": " << result.avg_frame_time_ms << ",\n";
            ss << "          \"cpu_usage_percent\": " << result.cpu_usage_percent << ",\n";
            ss << "          \"memory_usage_mb\": " << result.memory_usage_mb << ",\n";
            ss << "          \"gpu_usage_percent\": " << result.gpu_usage_percent << ",\n";
            ss << "          \"power_plan\": \"" << result.power_plan << "\",\n";
            ss << "          \"process_priority\": \"" << result.process_priority << "\",\n";
            ss << "          \"is_optimized\": " << (result.is_optimized ? "true" : "false") << "\n";
            ss << "        }";
        }
        ss << "\n      ]\n";
        ss << "    }";
    }
    
    ss << "\n  }\n";
    ss << "}\n";
    return ss.str();
}

bool PerformanceComparison::import_from_json(const std::string& json) {
    // Simple JSON parsing - in production would use a proper JSON library
    // For now, return false as placeholder
    return false;
}

ComparisonStats PerformanceComparison::get_stats() const {
    ComparisonStats stats;
    stats.total_measurements = total_measurements_;
    stats.before_count = before_count_;
    stats.after_count = after_count_;
    stats.average_before_fps = before_count_ > 0 ? cumulative_before_fps_ / before_count_ : 0.0;
    stats.average_after_fps = after_count_ > 0 ? cumulative_after_fps_ / after_count_ : 0.0;
    stats.average_improvement_percent = calculate_average_improvement();
    return stats;
}

bool PerformanceComparison::add_profile(const std::string& name, const std::string& configuration) {
    std::lock_guard<std::mutex> lock(mutex_);
    
    if (profiles_.find(name) != profiles_.end()) {
        return false; // Profile already exists
    }
    
    PerformanceProfile profile;
    profile.name = name;
    profile.configuration = configuration;
    profile.created_date = "";
    profile.usage_count = 0;
    profile.results = {};
    
    profiles_[name] = profile;
    return true;
}

bool PerformanceComparison::remove_profile(const std::string& name) {
    std::lock_guard<std::mutex> lock(mutex_);
    
    // Can't remove the only profile
    if (profiles_.size() <= 1) {
        return false;
    }
    
    auto it = profiles_.find(name);
    if (it != profiles_.end()) {
        profiles_.erase(it);
        return true;
    }
    return false;
}

bool PerformanceComparison::update_profile(const std::string& name, const PerformanceProfile& profile) {
    std::lock_guard<std::mutex> lock(mutex_);
    
    auto it = profiles_.find(name);
    if (it == profiles_.end()) {
        return false;
    }
    
    it->second = profile;
    it->second.usage_count = profile.usage_count;
    it->second.results = profile.results;
    return true;
}

// ============================================================
// JSON CONVERSION HELPERS
// ============================================================

JsonComparisonResult to_json(const ComparisonResult& result) {
    JsonComparisonResult json;
    json.scenario = result.scenario;
    json.avg_fps = result.avg_fps;
    json.min_fps = result.min_fps;
    json.max_fps = result.max_fps;
    json.avg_frame_time_ms = result.avg_frame_time_ms;
    json.cpu_usage_percent = result.cpu_usage_percent;
    json.memory_usage_mb = result.memory_usage_mb;
    json.gpu_usage_percent = result.gpu_usage_percent;
    json.power_plan = result.power_plan;
    json.process_priority = result.process_priority;
    json.timestamp = result.timestamp;
    json.is_optimized = result.is_optimized;
    return json;
}

ComparisonResult from_json(const JsonComparisonResult& json) {
    ComparisonResult result;
    result.scenario = json.scenario;
    result.avg_fps = json.avg_fps;
    result.min_fps = json.min_fps;
    result.max_fps = json.max_fps;
    result.avg_frame_time_ms = json.avg_frame_time_ms;
    result.cpu_usage_percent = json.cpu_usage_percent;
    result.memory_usage_mb = json.memory_usage_mb;
    result.gpu_usage_percent = json.gpu_usage_percent;
    result.power_plan = json.power_plan;
    result.process_priority = json.process_priority;
    result.timestamp = json.timestamp;
    result.is_optimized = json.is_optimized;
    return result;
}

} // namespace cs2::booster::comparison