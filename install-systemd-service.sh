#!/usr/bin/env bash
dir=$(dirname -- "$(readlink -f -- "$0")")
# https://unix.stackexchange.com/questions/308311/systemd-service-runs-without-exiting
# simple - A long-running process that does not background its self and stays attached to the shell.
# forking - A typical daemon that forks itself detaching it from the process that ran it, effectively backgrounding itself.
# oneshot - A short-lived process that is expected to exit.
# dbus - Like simple, but notification of processes startup finishing is sent over dbus.
# notify - Like simple, but notification of processes startup finishing is sent over inotify.
# idle - Like simple, but the binary is started after the job has been dispatched.
config=/etc/systemd/system/pyapp.service
if [[ -f $config ]]; then
    sudo systemctl stop pyapp
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
sudo systemctl enable pyapp.service
sudo systemctl start pyapp
sudo systemctl status pyapp.service


# journalctl -u pyapp

# uninstall script
: <<'END_COMMENT'
sudo systemctl stop pyapp
sudo systemctl disable pyapp
sudo rm -f /etc/systemd/system/pyapp.service
sudo systemctl daemon-reload
sudo systemctl reset-failed
END_COMMENT