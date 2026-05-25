#!/bin/bash
# RQBBOX OS Portable USB — Cross-platform launcher (macOS, Linux, ChromeOS)
# Usage: bash rqbbox-server.sh
# Requires: Node.js (v16+)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RQBBOX_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
SERVER_SCRIPT="$SCRIPT_DIR/../Server/server.js"
PORT=19777
LAUNCH_URL="http://127.0.0.1:$PORT/"

echo "=== RQBBOX OS Portable USB ==="
echo "Root: $RQBBOX_ROOT"
echo "Port: $PORT"

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js not found. Install from https://nodejs.org"
    exit 1
fi

# Start the server
echo "Starting RQBBOX server..."
node "$SERVER_SCRIPT" &
SERVER_PID=$!
echo "Server PID: $SERVER_PID"
sleep 2

# Open browser
echo "Opening $LAUNCH_URL..."
case "$(uname -s)" in
    Darwin)
        # macOS — open in kiosk-like mode (fullscreen)
        open -a "Safari" "$LAUNCH_URL"
        # Alternative: use Chrome in kiosk mode if available
        if command -v /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome &> /dev/null; then
            /Applications/Google\ Chrome.app/Contents/MacOS/Google/ Chrome \
                --app="$LAUNCH_URL" --start-fullscreen --no-first-run &
        fi
        ;;
    Linux)
        # Linux / ChromeOS — use Chrome or default browser
        if command -v google-chrome &> /dev/null; then
            google-chrome --app="$LAUNCH_URL" --start-fullscreen --no-first-run &
        elif command -v chromium-browser &> /dev/null; then
            chromium-browser --app="$LAUNCH_URL" --start-fullscreen --no-first-run &
        else
            xdg-open "$LAUNCH_URL"
        fi
        ;;
    *)
        xdg-open "$LAUNCH_URL"
        ;;
esac

echo "RQBBOX OS running at $LAUNCH_URL"
echo "Press Ctrl+C to stop."

# Wait for server
wait $SERVER_PID
