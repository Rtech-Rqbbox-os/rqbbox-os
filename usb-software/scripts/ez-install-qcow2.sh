#!/bin/bash
# =============================================================
# RQBBOX OS v2.6.0.4 — QCOW2 + EZ Install (macOS / Linux)
# =============================================================
# Installs RQBBOX OS AND sets up the QCOW2 virtual machine.
# No bootable USB required.
#
# Usage:
#   chmod +x ez-install-qcow2.sh && ./ez-install-qcow2.sh
#
# RTech — GOTECH AI
# =============================================================

set -e

VERSION="2.6.0.4"
APP_URL="https://inquisitive-rqbbox-core-play.base44.app"
GITHUB="https://github.com/Rtech-Rqbbox-os/rqbbox-os"
INSTALL_DIR="$HOME/.rqbbox-os"
QCOW2_NAME="RQBBOX-OS-v${VERSION}.qcow2"
OS_TYPE="$(uname -s)"

echo ""
echo "╔════════════════════════════════════════════════════╗"
echo "║   RQBBOX OS v${VERSION} — QCOW2 + EZ Installer     ║"
echo "║   RTech · GOTECH AI                                ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""
echo "  Installs RQBBOX OS + QCOW2 virtual machine."
echo "  No bootable USB required."
echo ""

case "$OS_TYPE" in
  Darwin) PLATFORM="macOS" ;;
  Linux)  PLATFORM="Linux" ;;
  *)      echo "❌ Unsupported OS: $OS_TYPE"; exit 1 ;;
esac
echo "🖥️  Detected: $PLATFORM"

# ── Check / Install QEMU ──
echo ""
echo "🔍 Checking for QEMU..."
if ! command -v qemu-system-i386 &>/dev/null && ! command -v qemu-system-x86_64 &>/dev/null; then
  echo "📦  QEMU not found. Installing..."
  if [ "$PLATFORM" = "macOS" ]; then
    if command -v brew &>/dev/null; then
      brew install qemu
    else
      echo "  → Install Homebrew first: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
      exit 1
    fi
  elif [ "$PLATFORM" = "Linux" ]; then
    if command -v apt-get &>/dev/null; then
      sudo apt-get install -y qemu-system-x86 qemu-utils
    elif command -v dnf &>/dev/null; then
      sudo dnf install -y qemu-kvm qemu-img
    elif command -v pacman &>/dev/null; then
      sudo pacman -S --noconfirm qemu
    else
      echo "  → Install QEMU manually: https://www.qemu.org/download/"
      exit 1
    fi
  fi
fi

QEMU_BIN=""
command -v qemu-system-x86_64  &>/dev/null && QEMU_BIN="qemu-system-x86_64"
command -v qemu-system-i386    &>/dev/null && [ -z "$QEMU_BIN" ] && QEMU_BIN="qemu-system-i386"
echo "✓  QEMU: $QEMU_BIN"

# ── Check Node.js ──
echo ""
echo "🔍 Checking for Node.js..."
if ! command -v node &>/dev/null; then
  echo "📦  Node.js not found. Installing..."
  if [ "$PLATFORM" = "macOS" ]; then
    brew install node
  elif [ "$PLATFORM" = "Linux" ]; then
    if command -v apt-get &>/dev/null; then
      sudo apt-get install -y nodejs npm
    fi
  fi
fi
echo "✓  Node.js $(node -v)"

# ── Create install directory ──
echo ""
echo "📁  Installing to: $INSTALL_DIR"
mkdir -p "$INSTALL_DIR/qcow2"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# ── Copy OS files ──
echo "🚀  Copying RQBBOX OS files..."
cp -r "$ROOT_DIR/core"    "$INSTALL_DIR/" 2>/dev/null || true
cp -r "$ROOT_DIR/assets"  "$INSTALL_DIR/" 2>/dev/null || true

# ── Copy / locate QCOW2 ──
echo ""
echo "💾  Setting up QCOW2 virtual disk..."
QCOW2_SRC=""
# Check common locations
for loc in \
  "$ROOT_DIR/../limbo-rqbbox/${QCOW2_NAME}" \
  "$ROOT_DIR/qcow2/${QCOW2_NAME}" \
  "$SCRIPT_DIR/../limbo-rqbbox/${QCOW2_NAME}" \
  "$(pwd)/${QCOW2_NAME}"; do
  if [ -f "$loc" ]; then
    QCOW2_SRC="$loc"
    break
  fi
done

if [ -n "$QCOW2_SRC" ]; then
  cp "$QCOW2_SRC" "$INSTALL_DIR/qcow2/${QCOW2_NAME}"
  echo "  ✓ QCOW2 copied from $QCOW2_SRC"
else
  echo "  ⚠️  QCOW2 not found locally — downloading from GitHub..."
  curl -L -o "$INSTALL_DIR/qcow2/${QCOW2_NAME}" \
    "https://github.com/Rtech-Rqbbox-os/rqbbox-os/raw/main/limbo-rqbbox/${QCOW2_NAME}" \
    2>&1 | tail -3 || {
      echo "  → Download failed. Place ${QCOW2_NAME} in $INSTALL_DIR/qcow2/ manually."
    }
fi
echo "  ✓ QCOW2: $INSTALL_DIR/qcow2/${QCOW2_NAME}"

# ── Install Electron launcher ──
echo ""
echo "📦  Installing Electron launcher..."
if [ "$PLATFORM" = "macOS" ]; then
  LAUNCHER_SRC="$ROOT_DIR/launcher/macos"
elif [ "$PLATFORM" = "Linux" ]; then
  LAUNCHER_SRC="$ROOT_DIR/launcher/linux"
fi
[ -d "$LAUNCHER_SRC" ] && cp -r "$LAUNCHER_SRC" "$INSTALL_DIR/launcher"
cd "$INSTALL_DIR/launcher" 2>/dev/null && npm install --silent && cd - >/dev/null

# ── Write version + config ──
echo "$VERSION" > "$INSTALL_DIR/VERSION"
echo "$APP_URL"  > "$INSTALL_DIR/APP_URL.txt"

cat > "$INSTALL_DIR/qcow2/limbo-config.json" << JEOF
{
  "version": "${VERSION}",
  "qemu_bin": "${QEMU_BIN}",
  "qcow2_image": "${QCOW2_NAME}",
  "cpu": "coreduo",
  "ram_mb": 512,
  "vga": "std",
  "network": "user",
  "app_url": "${APP_URL}"
}
JEOF

# ── Write launch scripts ──
cat > "$INSTALL_DIR/launch-qcow2.sh" << EOLQ
#!/bin/bash
# RQBBOX OS v${VERSION} — Launch via QEMU (QCOW2)
echo "🚀 Starting RQBBOX OS v${VERSION} (QCOW2 VM)..."
${QEMU_BIN} \\
  -name "RQBBOX OS v${VERSION}" \\
  -machine pc \\
  -cpu coreduo \\
  -m 512 \\
  -hda "${INSTALL_DIR}/qcow2/${QCOW2_NAME}" \\
  -vga std \\
  -net user \\
  -net nic \\
  -boot c \\
  -display sdl \\
  -full-screen 2>/dev/null || \\
${QEMU_BIN} \\
  -name "RQBBOX OS v${VERSION}" \\
  -machine pc \\
  -cpu coreduo \\
  -m 512 \\
  -hda "${INSTALL_DIR}/qcow2/${QCOW2_NAME}" \\
  -vga std \\
  -netdev user,id=n0 -device e1000,netdev=n0 \\
  -boot c
EOLQ
chmod +x "$INSTALL_DIR/launch-qcow2.sh"

cat > "$INSTALL_DIR/launch.sh" << EOLB
#!/bin/bash
# RQBBOX OS v${VERSION} — Launch Electron Desktop Shell
cd "${INSTALL_DIR}/launcher"
npx electron . "\$@"
EOLB
chmod +x "$INSTALL_DIR/launch.sh"

# ── Desktop shortcuts ──
if [ "$PLATFORM" = "Linux" ]; then
  mkdir -p "$HOME/.local/share/applications"
  cat > "$HOME/.local/share/applications/rqbbox-os.desktop" << EOD
[Desktop Entry]
Name=RQBBOX OS
Comment=v${VERSION} · Plug In. Play Anywhere.
Exec=$INSTALL_DIR/launch.sh
Icon=$INSTALL_DIR/assets/rqbbox-icon.png
Terminal=false
Type=Application
Categories=Game;
EOD
  cat > "$HOME/.local/share/applications/rqbbox-os-qcow2.desktop" << EOD2
[Desktop Entry]
Name=RQBBOX OS (QCOW2 VM)
Comment=v${VERSION} · Run via QEMU virtual machine
Exec=$INSTALL_DIR/launch-qcow2.sh
Icon=$INSTALL_DIR/assets/rqbbox-icon.png
Terminal=true
Type=Application
Categories=Game;Emulator;
EOD2
  echo "  ✓ Desktop shortcuts created (OS + QCOW2 VM)"
elif [ "$PLATFORM" = "macOS" ]; then
  cat > "$INSTALL_DIR/Launch RQBBOX OS.command"      << EOLM
#!/bin/bash
cd "$INSTALL_DIR/launcher" && npx electron .
EOLM
  cat > "$INSTALL_DIR/Launch RQBBOX OS (QCOW2).command" << EOLQ2
#!/bin/bash
"$INSTALL_DIR/launch-qcow2.sh"
EOLQ2
  chmod +x "$INSTALL_DIR/Launch RQBBOX OS.command"
  chmod +x "$INSTALL_DIR/Launch RQBBOX OS (QCOW2).command"
  echo "  ✓ Launch commands created (OS + QCOW2 VM)"
fi

echo ""
echo "╔════════════════════════════════════════════════════╗"
echo "║  ✅  RQBBOX OS v${VERSION} installed!              ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""
echo "  📍 Location   : $INSTALL_DIR"
echo "  💾 QCOW2      : $INSTALL_DIR/qcow2/${QCOW2_NAME}"
echo "  🌐 App URL    : $APP_URL"
echo "  🔗 GitHub     : $GITHUB"
echo ""
echo "  ▶  Desktop shell :  $INSTALL_DIR/launch.sh"
echo "  ▶  QCOW2 VM      :  $INSTALL_DIR/launch-qcow2.sh"
echo ""

read -rp "  How would you like to launch? [1] Desktop Shell  [2] QCOW2 VM  [N] Skip: " choice
case "$choice" in
  1) echo ""; echo "🚀 Launching Desktop Shell..."; "$INSTALL_DIR/launch.sh" & ;;
  2) echo ""; echo "🚀 Launching QCOW2 VM..."; "$INSTALL_DIR/launch-qcow2.sh" ;;
  *) echo "  Skipping launch." ;;
esac
