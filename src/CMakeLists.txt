cmake_minimum_required(VERSION 3.20)

project(ebook)

set(CMAKE_C_STANDARD 17)
set(CMAKE_CXX_STANDARD 20)
# use all static lib
set(CMAKE_FIND_LIBRARY_SUFFIXES ".a")
if(${CMAKE_SYSTEM_NAME} MATCHES "Darwin") 
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -fvisibility=hidden -fvisibility-inlines-hidden")
endif()

# include_directories(${CMAKE_SOURCE_DIR})
file(GLOB_RECURSE SOURCE_FILES  "*.cpp")
add_executable(${PROJECT_NAME} ${SOURCE_FILES})

if(${CMAKE_SYSTEM_NAME} MATCHES "iOS")
    set_target_properties(${PROJECT_NAME} PROPERTIES
        BUNDLE True
        MACOSX_BUNDLE_GUI_IDENTIFIER piaoyun.dev.${PROJECT_NAME}
        MACOSX_BUNDLE_BUNDLE_NAME ${PROJECT_NAME}
        MACOSX_BUNDLE_BUNDLE_VERSION "0.1"
        MACOSX_BUNDLE_SHORT_VERSION_STRING "0.1"
        MACOSX_BUNDLE_INFO_PLIST ${CMAKE_SOURCE_DIR}/../misc/customtemplate.plist.in
    )
    # This little macro lets you set any XCode specific property
    macro (set_xcode_property TARGET XCODE_PROPERTY XCODE_VALUE)
        set_property (TARGET ${TARGET} PROPERTY XCODE_ATTRIBUTE_${XCODE_PROPERTY} ${XCODE_VALUE})
    endmacro (set_xcode_property)
    macro (unset_xcode_property TARGET XCODE_PROPERTY)
    set_property (TARGET ${TARGET} PROPERTY XCODE_ATTRIBUTE_${XCODE_PROPERTY})
    endmacro (unset_xcode_property)
    set_xcode_property(${PROJECT_NAME} CODE_SIGN_IDENTITY "iPhone Developer")
    # grep DEVELOPMENT_TEAM _build_ios/main.xcodeproj/project.pbxproj
    set_xcode_property(${PROJECT_NAME} DEVELOPMENT_TEAM W8L2TKP6RD)
endif()

# message(FATAL_ERROR "You can not do this at all, CMake will exit." )

find_package(bhttp REQUIRED)
get_target_property(bhttp_INCLUDE_DIRS bhttp::bhttp INTERFACE_INCLUDE_DIRECTORIES )
message("bhttp_INCLUDE_DIRS=${bhttp_INCLUDE_DIRS}")
get_target_property(bhttp_LIBRARIES bhttp::bhttp IMPORTED_LOCATION_RELEASE )
message("bhttp_LIBRARIES=${bhttp_LIBRARIES}")
message("bhttp_VERSION=${bhttp_VERSION}")
include_directories(${bhttp_INCLUDE_DIRS})
target_link_libraries(
    ${PROJECT_NAME} 
    bhttp::bhttp
    ${CMAKE_DL_LIBS} 
)
if(WIN32)
    target_link_libraries(${PROJECT_NAME} ws2_32 wsock32)
endif()
if(${CMAKE_SYSTEM_NAME} MATCHES "iOS")
    install(TARGETS ${PROJECT_NAME} BUNDLE DESTINATION bin)
else()
    install(TARGETS ${PROJECT_NAME} RUNTIME DESTINATION bin)
endif()
find_library(lib7z NAMES 7za REQUIRED)
message("lib7z=${lib7z}")
if (CMAKE_CXX_COMPILER_ID STREQUAL "Clang")
        # using Clang
        target_link_libraries(${PROJECT_NAME} -Wl,-force_load,${lib7z} )
elseif (CMAKE_CXX_COMPILER_ID STREQUAL "GNU")
    # using GCC
    target_link_libraries(${PROJECT_NAME} -Wl,--whole-archive ${lib7z} -Wl,--no-whole-archive )
elseif (CMAKE_CXX_COMPILER_ID STREQUAL "Intel")
    # using Intel C++
elseif (CMAKE_CXX_COMPILER_ID STREQUAL "MSVC")
    # using Visual Studio C++
    set_target_properties(${PROJECT_NAME} PROPERTIES LINK_FLAGS "/WHOLEARCHIVE" )
endif()
# install(FILES "${CMAKE_CURRENT_LIST_DIR}/../misc/magic.mgc" DESTINATION bin)



