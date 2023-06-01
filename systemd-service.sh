#!/usr/bin/env bash

dir=$(dirname -- "$(readlink -f -- "$0")")
serviceName="py-app"
# https://unix.stackexchange.com/questions/308311/systemd-service-runs-without-exiting
# simple - A long-running process that does not background its self and stays attached to the shell.
# forking - A typical daemon that forks itself detaching it from the process that ran it, effectively backgrounding itself.
# oneshot - A short-lived process that is expected to exit.
# dbus - Like simple, but notification of processes startup finishing is sent over dbus.
# notify - Like simple, but notification of processes startup finishing is sent over inotify.
# idle - Like simple, but the binary is started after the job has been dispatched.
config=/etc/systemd/system/$serviceName.service
function install {
if [[ -f $config ]]; then
    sudo systemctl stop $serviceName
fi
sudo tee $config << END
[Unit]
Description=PiaoYun SPA App created by novice79
Wants=network-online.target
After=network-online.target

[Service]
Type=simple
ExecStart=$dir/app

[Install]
WantedBy=multi-user.target
END

sudo systemctl daemon-reload 
sudo systemctl enable $serviceName.service
sudo systemctl start $serviceName
sudo systemctl status $serviceName.service

}

function uninstall {
if sudo systemctl --all --type service | grep -q "$serviceName";then
    echo "$serviceName exists, remove it"
else
    echo "$serviceName does NOT exist, do nothing"
    return
fi
sudo systemctl stop $serviceName
sudo systemctl disable $serviceName
sudo rm -f /etc/systemd/system/$serviceName.service
sudo systemctl daemon-reload
sudo systemctl reset-failed
}

case "$1" in
    uninstall)
      uninstall
      ;;
    -h | --help | help)
      echo "install or uninstall app as a systemd service"
      echo "$0 install "
      echo "or"
      echo "$0 uninstall "
      exit 0
      ;;
    *)
      install
esac

: <<'END_COMMENT'
journalctl -u $serviceName
END_COMMENT