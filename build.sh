#!/bin/sh
# set -x
set -e 

scirptName=$0

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        PRBUILT="/data/clib-prebuilt/linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
        PRBUILT="$HOME/clib-prebuilt/macos"
elif [[ "$OSTYPE" == "win32" ]]; then
    :
else
    :
fi
dir="_build/$OSTYPE"
PREFIX="dist/$OSTYPE"

# build app
cmake -GNinja -H"src" -B$dir \
-DCMAKE_FIND_ROOT_PATH="$PRBUILT" \
-DCMAKE_INSTALL_PREFIX=$PREFIX \
-DCMAKE_BUILD_TYPE=Release 

cmake --build $dir
cmake --install $dir

cd spa && npm i && npm run build
cd -

printf "\nFYI:\n"
echo "please run: ./dist/$OSTYPE/bin/ebook"
echo "and then use browser open http://localhost:8888/ to test spa app"
