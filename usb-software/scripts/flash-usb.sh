#!/bin/bash
# =============================================================
# RQBBOX OS USB Flash Script
# Copies RQBBOX OS software onto a USB drive
# Usage: ./flash-usb.sh /dev/sdX (Linux/macOS)
# =============================================================

set -e

RQBBOX_VERSION="1.0.0"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo ""
echo "╔══════════════════════════════════════╗"
echo "║       RQBBOX OS USB Flash Tool       ║"
echo "║         v${RQBBOX_VERSION} — RTech Team          ║"
echo "╚══════════════════════════════════════╝"
echo ""

# Check for target drive argument
if [ -z "$1" ]; then
  echo "Usage: $0 <usb-drive-path>"
  echo "Example: $0 /Volumes/RQBBOX (macOS)"
  echo "Example: $0 /mnt/usb (Linux)"
  exit 1
fi

USB_PATH="$1"

if [ ! -d "$USB_PATH" ]; then
  echo "❌ Error: USB path '$USB_PATH' not found."
  echo "Please mount your USB drive first."
  exit 1
fi

echo "📋 Preparing to flash RQBBOX OS to: $USB_PATH"
echo ""

# Create directory structure on USB
echo "📁 Creating RQBBOX OS folder structure..."
mkdir -p "$USB_PATH/RQBBOX-OS/launcher/windows"
mkdir -p "$USB_PATH/RQBBOX-OS/launcher/macos"
mkdir -p "$USB_PATH/RQBBOX-OS/launcher/linux"
mkdir -p "$USB_PATH/RQBBOX-OS/assets"
mkdir -p "$USB_PATH/RQBBOX-OS/core"

# Copy launcher files
echo "🚀 Copying launcher files..."
cp -r "$ROOT_DIR/launcher/windows/"* "$USB_PATH/RQBBOX-OS/launcher/windows/" 2>/dev/null || true
cp -r "$ROOT_DIR/launcher/macos/"* "$USB_PATH/RQBBOX-OS/launcher/macos/" 2>/dev/null || true
cp -r "$ROOT_DIR/launcher/linux/"* "$USB_PATH/RQBBOX-OS/launcher/linux/" 2>/dev/null || true

# Copy core files
echo "📦 Copying core files..."
cp -r "$ROOT_DIR/core/"* "$USB_PATH/RQBBOX-OS/core/" 2>/dev/null || true

# Copy config
cp "$ROOT_DIR/autorun/autorun-config.json" "$USB_PATH/RQBBOX-OS/" 2>/dev/null || true

# Write version file
echo "$RQBBOX_VERSION" > "$USB_PATH/RQBBOX-OS/VERSION"

echo ""
echo "✅ RQBBOX OS v${RQBBOX_VERSION} successfully flashed to USB!"
echo "📍 Location: $USB_PATH/RQBBOX-OS"
echo ""
echo "🎮 Plug this USB into any device and launch RQBBOX OS instantly."
echo ""
