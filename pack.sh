#!/usr/bin/env bash
set -e 
./linux_build.sh
./macos-build-on-linux.sh
cd spa && npm i && npm run build && cd ..
appName="$(git branch --show-current)"
mkdir -p $appName
mv -v dist/www $appName/
cp -f dist/linux/armv7/bin/app $appName/
7z a $appName-linux-armv7.7z $appName
cp -f dist/linux/aarch64/bin/app $appName/
7z a $appName-linux-aarch64.7z $appName
cp -f dist/linux/x86_64/bin/app $appName/
7z a $appName-linux-x86_64.7z $appName
cp -f dist/macos-aarch64/bin/app $appName/
7z a $appName-macos-aarch64.7z $appName
cp -f dist/macos-x86_64/bin/app $appName/
7z a $appName-macos-x86_64.7z $appName