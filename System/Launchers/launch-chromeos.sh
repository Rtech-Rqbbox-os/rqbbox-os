#!/bin/bash
# RQBBOX OS — ChromeOS Launcher (Linux container)
# Run from ChromeOS Linux terminal (Terminal app → penguin)

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR/../.."

echo "=== RQBBOX OS Portable USB — ChromeOS ==="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "Installing Node.js (requires sudo)..."
    sudo apt-get update && sudo apt-get install -y nodejs npm
fi

echo "Starting RQBBOX server..."
node "System/Server/server.js" &
sleep 2

echo "Opening RQBBOX in Chrome..."
# ChromeOS uses the host browser via xdg-open
xdg-open "http://127.0.0.1:19777/" 2>/dev/null || true

echo ""
echo "RQBBOX running at http://127.0.0.1:19777/"
echo "Close this terminal to stop."
echo ""

wait
