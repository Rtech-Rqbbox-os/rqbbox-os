#!/bin/bash
# =============================================================
# RQBBOX OS USB Flash Script — macOS / Linux
# =============================================================
# Copies RQBBOX OS USB software onto a USB drive
#
# Usage:
#   chmod +x flash-usb.sh
#   ./flash-usb.sh /Volumes/RQBBOX          (macOS)
#   ./flash-usb.sh /mnt/usb                 (Linux)
#
# App URL: https://inquisitive-rqbbox-core-play.base44.app
# GitHub:  https://github.com/Rtech-Rqbbox-os/rqbbox-os
# RTech    — GOTECH AI
# =============================================================

set -e

RQBBOX_VERSION="1.0.0"
APP_URL="https://inquisitive-rqbbox-core-play.base44.app"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║        RQBBOX OS USB Flash Tool              ║"
echo "║        v${RQBBOX_VERSION} — RTech · GOTECH AI          ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# ── Check argument ──
if [ -z "$1" ]; then
  echo "Usage: $0 <usb-mount-path>"
  echo ""
  echo "  macOS example:  ./flash-usb.sh /Volumes/RQBBOX"
  echo "  Linux example:  ./flash-usb.sh /mnt/usb"
  echo ""
  exit 1
fi

USB_PATH="$1"

# ── Validate USB path ──
if [ ! -d "$USB_PATH" ]; then
  echo "❌  USB path '$USB_PATH' not found."
  echo "    Mount your USB drive first, then run this script."
  exit 1
fi

# ── Check free space (need ~100MB) ──
AVAILABLE=$(df -m "$USB_PATH" | awk 'NR==2 {print $4}')
if [ "$AVAILABLE" -lt 100 ]; then
  echo "⚠️  Warning: Less than 100MB free on USB ($AVAILABLE MB available)."
  echo "   Some files may not copy correctly."
fi

echo "📋  Flashing RQBBOX OS v${RQBBOX_VERSION} to: $USB_PATH"
echo ""

# ── Create directory structure ──
echo "📁  Creating folder structure..."
mkdir -p "$USB_PATH/RQBBOX-OS/launcher/windows"
mkdir -p "$USB_PATH/RQBBOX-OS/launcher/macos"
mkdir -p "$USB_PATH/RQBBOX-OS/launcher/linux"
mkdir -p "$USB_PATH/RQBBOX-OS/launcher/android"
mkdir -p "$USB_PATH/RQBBOX-OS/launcher/ios"
mkdir -p "$USB_PATH/RQBBOX-OS/assets"
mkdir -p "$USB_PATH/RQBBOX-OS/core"
mkdir -p "$USB_PATH/RQBBOX-OS/scripts"

# ── Copy launcher files ──
echo "🚀  Copying launcher files..."
for platform in windows macos linux android ios; do
  if [ -d "$ROOT_DIR/launcher/$platform" ]; then
    cp -r "$ROOT_DIR/launcher/$platform/." "$USB_PATH/RQBBOX-OS/launcher/$platform/"
    echo "    ✓ $platform"
  fi
done

# ── Copy core splash / redirect ──
echo "📦  Copying core files..."
if [ -d "$ROOT_DIR/core" ]; then
  cp -r "$ROOT_DIR/core/." "$USB_PATH/RQBBOX-OS/core/"
  echo "    ✓ core"
fi

# ── Copy autorun config ──
if [ -f "$ROOT_DIR/autorun/autorun-config.json" ]; then
  cp "$ROOT_DIR/autorun/autorun-config.json" "$USB_PATH/RQBBOX-OS/"
  echo "    ✓ autorun-config.json"
fi

# ── Copy flash scripts ──
cp "$SCRIPT_DIR/flash-usb.sh"  "$USB_PATH/RQBBOX-OS/scripts/" 2>/dev/null || true
cp "$SCRIPT_DIR/flash-usb.ps1" "$USB_PATH/RQBBOX-OS/scripts/" 2>/dev/null || true

# ── Write version + app URL ──
echo "$RQBBOX_VERSION" > "$USB_PATH/RQBBOX-OS/VERSION"
echo "$APP_URL" > "$USB_PATH/RQBBOX-OS/APP_URL.txt"

# ── Create quick-launch shortcut (Linux .desktop) ──
if [[ "$(uname)" == "Linux" ]]; then
  cat > "$USB_PATH/RQBBOX-OS/RQBBOX-OS.desktop" << EOL
[Desktop Entry]
Name=RQBBOX OS
Comment=Plug In. Play Anywhere.
Exec=xdg-open $APP_URL
Icon=rqbbox-icon
Terminal=false
Type=Application
Categories=Game;
EOL
  chmod +x "$USB_PATH/RQBBOX-OS/RQBBOX-OS.desktop"
  echo "    ✓ RQBBOX-OS.desktop (Linux shortcut)"
fi

# ── macOS alias ──
if [[ "$(uname)" == "Darwin" ]]; then
  cat > "$USB_PATH/RQBBOX-OS/Launch RQBBOX OS.command" << EOL
#!/bin/bash
open "$APP_URL"
EOL
  chmod +x "$USB_PATH/RQBBOX-OS/Launch RQBBOX OS.command"
  echo "    ✓ Launch RQBBOX OS.command (macOS shortcut)"
fi

echo ""
echo "✅  RQBBOX OS v${RQBBOX_VERSION} successfully flashed!"
echo "📍  Location : $USB_PATH/RQBBOX-OS"
echo "🌐  App URL  : $APP_URL"
echo ""
echo "🎮  Plug this USB into any device and run the launcher for your platform:"
echo "    Windows → launcher/windows/RQBBOXLauncher.exe"
echo "    macOS   → launcher/macos/RQBBOXLauncher.app"
echo "    Linux   → launcher/linux/RQBBOXLauncher.AppImage"
echo "    Android → launcher/android/  (sideload APK)"
echo "    iOS     → launcher/ios/       (sideload IPA)"
echo "    Browser → open APP_URL.txt in any browser"
echo ""
