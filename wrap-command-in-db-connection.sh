#!/usr/bin/env bash

ssh -A nest.bocoup.com -L 5431:rds.bocoup.com:5432 -N &

ssh_pid=$!

function finish {
	echo "Killing SSH tunnel (PID: $ssh_pid)..."
	kill $ssh_pid
}

trap finish EXIT

"$@"
