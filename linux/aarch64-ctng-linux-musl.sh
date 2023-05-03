#!/usr/bin/env bash

set -e 

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        PRBUILT="/cross/aarch64-ctng-linux-musl"
        TOOLCHAIN_FILE="/toolchains/aarch64-ctng-linux-musl/toolchain.cmake"
elif [[ "$OSTYPE" == "darwin"* ]]; then
        PRBUILT="$HOME/clib-prebuilt/linux/aarch64"
        TOOLCHAIN_FILE="$(brew --prefix aarch64-ctng-linux-musl)/toolchain.cmake"
elif [[ "$OSTYPE" == "win32" ]]; then
    :
else
    :
fi

appPrefix="$PWD/dist/linux/aarch64"
PREFIX=${prefix:-$appPrefix}
dir="$PWD/_build/linux/aarch64"

cmake -GNinja -H"src" -B$dir \
-DCMAKE_TOOLCHAIN_FILE="$TOOLCHAIN_FILE" \
-DCMAKE_FIND_ROOT_PATH="$PREFIX;$PRBUILT" \
-DCMAKE_INSTALL_PREFIX=$appPrefix \
-DCMAKE_BUILD_TYPE=Release 

cmake --build $dir
cmake --install $dir

