#!/usr/bin/env bash
set -e 
# This script supposed to be called by github action
appName="$1"
echo "appName=$appName"
./linux_build.sh
./macos-build-on-linux.sh
cd spa && npm i && npm run build && cd ..

mkdir -p $appName
mv -v dist/www $appName/
cp -v install-systemd-service.sh $appName/
cat > $appName/readme.txt << EOF
1. run ./app
P.S: 
If blocked on macos, you can open it in[System Settings --> Privacy & Security] Click "open anyway"
If run on linux with systemd init system, you can install it as a service by run ./install-systemd-service.sh

2. use web browser open http://this-machine-ip:listening-port to use it

EOF
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

ls -lh *.7z