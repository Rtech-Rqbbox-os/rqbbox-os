#!/bin/bash
# RQBBOX OS — Android Launcher (via Termux)
# Install Termux from F-Droid, then:
# pkg install nodejs
# bash launch-android.sh

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR/../.."

echo "=== RQBBOX OS — Android (Termux) ==="

if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    pkg update && pkg install -y nodejs
fi

echo "Starting RQBBOX server..."
node "System/Server/server.js" &
sleep 2

IP=$(ip -4 addr show wlan0 2>/dev/null | grep -oP 'inet \K[\d.]+' || echo "127.0.0.1")
echo ""
echo "RQBBOX running!"
echo "On this device: http://127.0.0.1:19777/"
echo "On LAN: http://$IP:19777/"
echo ""
echo "Open in a browser or create a home screen shortcut."
echo "To stop: Close Termux or press Ctrl+C"
echo ""

wait
