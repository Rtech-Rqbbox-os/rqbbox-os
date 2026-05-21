# 🔨 Build Guide — RQBBOX OS v2.6.0.4

---

## Prerequisites

- Node.js v18+
- npm v9+
- QEMU (for QCOW2 testing)
- Git

---

## Clone the Repo

```bash
git clone https://github.com/Rtech-Rqbbox-os/rqbbox-os.git
cd rqbbox-os
```

---

## Run the OS Shell (No Build Needed)

```bash
# Open directly in browser
open usb-software/core/os-shell-v2.html
```

---

## Build Desktop App (Electron)

### Windows
```powershell
cd launchers\windows
npm install
npm run build
# Output: dist\RQBBOX-OS-Setup.exe
```

### macOS
```bash
cd launchers/macos
npm install
npm run build
# Output: dist/RQBBOX-OS.dmg
```

### Linux
```bash
cd launchers/linux
npm install
npm run build
# Output: dist/RQBBOX-OS.AppImage
```

---

## Build Mobile

### Android
```bash
cd launchers/android
./gradlew assembleRelease
# Output: app/build/outputs/apk/release/app-release.apk
```

### iOS
```bash
cd launchers/ios
pod install
xcodebuild -scheme RQBBOXOSLauncher -configuration Release archive
```

---

## Build QCOW2 Image

```bash
# Requires qemu-img
qemu-img create -f qcow2 RQBBOX-OS-v2.6.0.4.qcow2 512M
# Then use ez-install scripts to populate the filesystem
```

---

## EZ Installers

```bash
# Test Windows installer (in PowerShell)
powershell -ExecutionPolicy Bypass -File usb-software\scripts\ez-install-qcow2.ps1

# Test macOS/Linux installer
./usb-software/scripts/ez-install-qcow2.sh
```

---

## Tag a Release

```bash
git tag v2.6.0.4
git push origin v2.6.0.4
# Triggers GitHub Actions CI/CD for all platforms
```

> RQBBOX OS v2.6.0.4 · RTech · GOTECH AI
