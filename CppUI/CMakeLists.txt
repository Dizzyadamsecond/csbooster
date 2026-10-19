cmake_minimum_required(VERSION 3.20)
project(Cs2BoosterUI CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Add the core library as a dependency
add_subdirectory(${CMAKE_SOURCE_DIR}/CppCore)

# UI executable
add_executable(cs2ui ui.cpp)

# Link against core library
target_link_libraries(cs2ui PRIVATE cs2core)

# Windows-specific settings
if(WIN32)
    target_compile_definitions(cs2ui PRIVATE _WIN32_WINNT=0x0A00)
    target_link_libraries(cs2ui PRIVATE shell32 uuid user32 comctl32)
    
    # Initialize Common Controls
    set(CMAKE_POST_BUILD_COMMAND "initcontrols.exe")
endif()