#!/bin/bash
# RQBBOX OS — macOS Launcher
# Double-click this file in Finder to launch

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR/../.."

echo "============================================"
echo "  RQBBOX OS Portable USB"
echo "  Plug In. Play Anywhere. — by RhysTech"
echo "  macOS Edition"
echo "============================================"
echo ""

# Ensure Node.js is available
if ! command -v node &> /dev/null; then
    echo "Node.js is required. Download from https://nodejs.org"
    echo "Or install via: brew install node"
    read -p "Press Enter to open download page..."
    open "https://nodejs.org"
    exit 1
fi

echo "Starting RQBBOX Server..."
node "System/Server/server.js" &
SERVER_PID=$!
sleep 2

echo "Opening RQBBOX in your browser..."
open "http://127.0.0.1:19777/"

echo ""
echo "RQBBOX OS is running!"
echo "To stop: press Ctrl+C in Terminal"
echo ""

# Wait for server
trap "kill $SERVER_PID 2>/dev/null; echo 'RQBBOX stopped.'" EXIT
wait $SERVER_PID
