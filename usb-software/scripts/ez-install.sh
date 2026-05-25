#!/bin/bash
# =============================================================
# RQBBOX OS v2.6.0.4 — EZ Install Script (macOS / Linux)
# =============================================================
# One command to install RQBBOX OS on your machine.
# No bootable USB required. Just run this script.
#
# Usage:
#   chmod +x ez-install.sh && ./ez-install.sh
#
# RTech — GOTECH AI
# =============================================================

set -e

VERSION="2.6.0.4"
APP_URL="https://inquisitive-rqbbox-core-play.base44.app"
GITHUB="https://github.com/Rtech-Rqbbox-os/rqbbox-os"
INSTALL_DIR="$HOME/.rqbbox-os"
OS_TYPE="$(uname -s)"

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║     RQBBOX OS v${VERSION} — EZ Installer          ║"
echo "║     RTech · GOTECH AI                            ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""
echo "  No bootable USB required."
echo "  Flash USB + EZ Install — done in seconds."
echo ""

# ── Detect OS ──
case "$OS_TYPE" in
  Darwin) PLATFORM="macOS" ;;
  Linux)  PLATFORM="Linux" ;;
  *)      echo "❌ Unsupported OS: $OS_TYPE"; exit 1 ;;
esac
echo "🖥️  Detected: $PLATFORM"

# ── Check Node.js ──
if ! command -v node &>/dev/null; then
  echo ""
  echo "📦  Node.js not found. Installing..."
  if [ "$PLATFORM" = "macOS" ]; then
    if command -v brew &>/dev/null; then
      brew install node
    else
      echo "  → Install Node.js from https://nodejs.org then re-run this script."
      exit 1
    fi
  elif [ "$PLATFORM" = "Linux" ]; then
    if command -v apt-get &>/dev/null; then
      sudo apt-get install -y nodejs npm
    elif command -v dnf &>/dev/null; then
      sudo dnf install -y nodejs npm
    else
      echo "  → Install Node.js from https://nodejs.org then re-run this script."
      exit 1
    fi
  fi
fi
NODE_VER=$(node -v)
echo "✓  Node.js $NODE_VER found"

# ── Check npm ──
NPM_VER=$(npm -v)
echo "✓  npm v$NPM_VER found"

# ── Create install directory ──
echo ""
echo "📁  Installing to: $INSTALL_DIR"
mkdir -p "$INSTALL_DIR"

# ── Copy files ──
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo "🚀  Copying RQBBOX OS files..."
cp -r "$ROOT_DIR/core"    "$INSTALL_DIR/" 2>/dev/null || true
cp -r "$ROOT_DIR/assets"  "$INSTALL_DIR/" 2>/dev/null || true

# ── Install Electron launcher ──
echo "📦  Installing Electron launcher..."
if [ "$PLATFORM" = "macOS" ]; then
  LAUNCHER_DIR="$ROOT_DIR/launcher/macos"
elif [ "$PLATFORM" = "Linux" ]; then
  LAUNCHER_DIR="$ROOT_DIR/launcher/linux"
fi

cp -r "$LAUNCHER_DIR" "$INSTALL_DIR/launcher"
cd "$INSTALL_DIR/launcher"
npm install --silent

# ── Write version ──
echo "$VERSION" > "$INSTALL_DIR/VERSION"
echo "$APP_URL"  > "$INSTALL_DIR/APP_URL.txt"

# ── Create launch script ──
cat > "$INSTALL_DIR/launch.sh" << EOL
#!/bin/bash
cd "$INSTALL_DIR/launcher"
npx electron . "\$@"
EOL
chmod +x "$INSTALL_DIR/launch.sh"

# ── Desktop shortcut ──
if [ "$PLATFORM" = "Linux" ]; then
  DESKTOP_FILE="$HOME/.local/share/applications/rqbbox-os.desktop"
  mkdir -p "$(dirname $DESKTOP_FILE)"
  cat > "$DESKTOP_FILE" << EOL
[Desktop Entry]
Name=RQBBOX OS
Comment=v${VERSION} — Plug In. Play Anywhere.
Exec=$INSTALL_DIR/launch.sh
Icon=$INSTALL_DIR/assets/rqbbox-icon.png
Terminal=false
Type=Application
Categories=Game;
EOL
  echo "  ✓ Desktop shortcut created"
elif [ "$PLATFORM" = "macOS" ]; then
  cat > "$INSTALL_DIR/Launch RQBBOX OS.command" << EOL
#!/bin/bash
cd "$INSTALL_DIR/launcher"
npx electron .
EOL
  chmod +x "$INSTALL_DIR/Launch RQBBOX OS.command"
  echo "  ✓ Launch command created"
fi

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║  ✅  RQBBOX OS v${VERSION} installed!             ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""
echo "  📍 Location : $INSTALL_DIR"
echo "  🌐 App URL  : $APP_URL"
echo "  🔗 GitHub   : $GITHUB"
echo ""
echo "  To launch:  $INSTALL_DIR/launch.sh"
echo ""

# ── Ask to launch now ──
read -rp "  Launch RQBBOX OS now? [Y/n]: " choice
choice="${choice:-Y}"
if [[ "$choice" =~ ^[Yy]$ ]]; then
  echo ""
  echo "🚀  Launching RQBBOX OS v${VERSION}..."
  "$INSTALL_DIR/launch.sh" &
fi
