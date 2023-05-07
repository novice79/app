#!/bin/sh
# set -x
set -e 

scirptName=$0

ostype=$(uname)
if [[ "$ostype" == "Linux"* ]]; then
    PRBUILT="/data/clib-prebuilt/linux/x86_64"
elif [[ "$ostype" == "Darwin"* ]]; then
    PRBUILT="$HOME/clib-prebuilt/macos"
else
    :
fi
dir="$PWD/_build"
[[ $# > 0 ]] && echo "rebuild app" && rm -rf $dir
PREFIX="$PWD/dist"

# build app
cmake -GNinja -H"src" -B$dir \
-DCMAKE_FIND_ROOT_PATH="$PRBUILT" \
-DCMAKE_INSTALL_PREFIX=$PREFIX \
-DCMAKE_BUILD_TYPE=Release 

cmake --build $dir
cmake --install $dir

cd spa && npm i && npm run build && cd -
[ -x ./copy-www.sh ] && ./copy-www.sh
cp -r $PWD/dist/www $PWD/dist/bin/
printf "\nFYI:\n"
echo "please run: ./dist/bin/app"
echo "and then use browser open http://localhost:7777/ to test spa app"
