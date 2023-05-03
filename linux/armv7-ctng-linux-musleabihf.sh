#!/usr/bin/env bash

set -e 
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        PRBUILT="/cross/armv7-ctng-linux-musleabihf"
        TOOLCHAIN_FILE="/toolchains/armv7-ctng-linux-musleabihf/toolchain.cmake"
elif [[ "$OSTYPE" == "darwin"* ]]; then
        PRBUILT="$HOME/clib-prebuilt/linux/armv7"
        TOOLCHAIN_FILE="$(brew --prefix armv7-ctng-linux-musleabihf)/toolchain.cmake"
elif [[ "$OSTYPE" == "win32" ]]; then
    :
else
    :
fi

appPrefix="$PWD/dist/linux/armv7"
PREFIX=${prefix:-$appPrefix}
dir="$PWD/_build/linux/armv7"


cmake -GNinja -H"src" -B$dir \
-DCMAKE_TOOLCHAIN_FILE="$TOOLCHAIN_FILE" \
-DCMAKE_FIND_ROOT_PATH="$PREFIX;$PRBUILT" \
-DCMAKE_INSTALL_PREFIX=$appPrefix \
-DCMAKE_BUILD_TYPE=Release 

cmake --build $dir
cmake --install $dir
