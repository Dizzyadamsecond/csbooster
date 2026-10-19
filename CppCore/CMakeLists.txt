cmake_minimum_required(VERSION 3.20)
project(Cs2Booster CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Performance optimizations
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -O3 -march=native -flto -ffast-math")

add_library(cs2core STATIC)

# Core modules
target_sources(cs2core PRIVATE
    src/performance.cpp
    src/memory_optimizer.cpp
    src/network_tweaker.cpp
    src/gpu_optimizer.cpp
    src/utils.cpp
    
    # Advanced features
    src/advanced/profiler.cpp
    src/monitoring/system_monitor.cpp
    src/profiles/profile_manager.cpp
    src/overlay/overlay.cpp
    
    # Performance comparison
    src/performance_comparison.cpp
)

# Include directories
target_include_directories(cs2core PUBLIC
    include
    include/advanced
    include/monitoring
    include/profiles
    include/overlay
)

# Platform-specific settings
if(WIN32)
    set(CMAKE_WINDOWS_EXPORT_ALL_SYMBOLS ON)
    target_compile_definitions(cs2core PRIVATE _WIN32_WINNT=0x0A00)
    
    # Link required Windows libraries
    target_link_libraries(cs2core PRIVATE
        user32
        gdi32
        shell32
        ole32
        psapi
        winhttp
    )
endif()