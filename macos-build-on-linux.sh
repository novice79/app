#!/usr/bin/env bash
set -e

scirptName=$0
target=( 
    aarch64
    x86_64
)
for i in "${target[@]}";do

PRBUILT="/cross/${i}-apple-darwin21.4;/toolchains/apple-darwin21.4/SDK/MacOSX12.3.sdk/"
TOOLCHAIN_FILE="/toolchains/apple-darwin21.4/${i}-toolchain.cmake"
dir="$PWD/_build/macos-${i}"
appPrefix="$PWD/dist/macos-${i}"
PREFIX=${prefix:-$appPrefix}

# build app exe
cmake -GNinja -H"src" -B$dir \
-DCMAKE_TOOLCHAIN_FILE="$TOOLCHAIN_FILE" \
-DCMAKE_FIND_ROOT_PATH="$PREFIX;$PRBUILT" \
-DCMAKE_INSTALL_PREFIX=$appPrefix \
-DCMAKE_BUILD_TYPE=Release 

cmake --build $dir
cmake --install $dir

done
