#!/data/data/com.termux/files/usr/bin/sh
# RQBBOX Phone Bootloader — Termux Auto-Start Script
# Place in ~/.termux/boot/rqbbox.sh

# Acquire wake lock to prevent sleep
termux-wake-lock

# Directory (change if different)
RQBBOX_DIR="$HOME/rqbbox-os"

# Check if repo exists
if [ ! -d "$RQBBOX_DIR" ]; then
  echo "[RQBBOX] Cloning repository..."
  pkg install -y nodejs git 2>/dev/null
  git clone https://github.com/Rtech-Rqbbox-os/rqbbox-os.git "$RQBBOX_DIR"
fi

# Update repo every 7 days
UPDATE_FILE="$RQBBOX_DIR/.last_update"
if [ -f "$UPDATE_FILE" ]; then
  LAST=$(cat "$UPDATE_FILE")
  NOW=$(date +%s)
  DIFF=$(( (NOW - LAST) / 86400 ))
  if [ "$DIFF" -ge 7 ]; then
    echo "[RQBBOX] Checking for updates..."
    cd "$RQBBOX_DIR" && git pull --ff-only
    date +%s > "$UPDATE_FILE"
  fi
else
  date +%s > "$UPDATE_FILE"
fi

# Create data directories if needed
mkdir -p "$RQBBOX_DIR/Data/Users"
mkdir -p "$RQBBOX_DIR/Data/Saves"
mkdir -p "$RQBBOX_DIR/Data/Logs"

# Start RQBBOX server
echo "[RQBBOX] Starting RQBBOX server..."
cd "$RQBBOX_DIR"
node System/Server/server.js
