#!/usr/bin/env bash

set -e 
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        PRBUILT="/cross/x86_64-ctng-linux-musl"
        TOOLCHAIN_FILE="/toolchains/x86_64-ctng-linux-musl/toolchain.cmake"
elif [[ "$OSTYPE" == "darwin"* ]]; then
        PRBUILT="$HOME/clib-prebuilt/linux/x86_64"
        TOOLCHAIN_FILE="$(brew --prefix x86_64-ctng-linux-musl)/toolchain.cmake"
elif [[ "$OSTYPE" == "win32" ]]; then
    :
else
    :
fi

appPrefix="$PWD/dist/linux/x86_64"
PREFIX=${prefix:-$appPrefix}
dir="$PWD/_build/linux/x86_64"

cmake -GNinja -H"src" -B$dir \
-DCMAKE_TOOLCHAIN_FILE="$TOOLCHAIN_FILE" \
-DCMAKE_FIND_ROOT_PATH="$PREFIX;$PRBUILT" \
-DCMAKE_INSTALL_PREFIX=$appPrefix \
-DCMAKE_BUILD_TYPE=Release 

cmake --build $dir
cmake --install $dir

