# 📦 RQBBOX OS Packages — v2.6.0.4

Package manager configs and platform-specific build manifests.

<p align="center">
  <img src="https://media.base44.com/images/public/6a0d64e743c742005c890c76/16da7f339_generated_image.png" width="80"/>
</p>

---

## Structure

```
packages/
├── brew/          # Homebrew cask (macOS)
├── winget/        # Winget manifest (Windows)
├── chocolatey/    # Chocolatey package (Windows)
├── snap/          # Snapcraft config (Linux)
├── flatpak/       # Flatpak manifest (Linux)
├── pwa/           # PWA manifest + service worker
├── android/       # Android build files
├── ios/           # iOS build files
├── windows/       # Windows Electron build
├── macos/         # macOS Electron build
└── linux/         # Linux Electron build
```

---

## Quick Install

```bash
# macOS
brew install --cask rqbbox-os

# Windows
winget install RTech.RQBBOXos
choco install rqbbox-os

# Linux
sudo snap install rqbbox-os
flatpak install flathub com.rtech.RQBBOXos
```

---

## EZ Install + QCOW2 (No Package Manager)

```powershell
# Windows
powershell -ExecutionPolicy Bypass -File usb-software\scripts\ez-install-qcow2.ps1
```

```bash
# macOS / Linux
./usb-software/scripts/ez-install-qcow2.sh
```

---

## QCOW2 Virtual Machine

File: `../limbo-rqbbox/RQBBOX-OS-v2.6.0.4.qcow2`

Compatible: Limbo PC (Android), QEMU, VirtualBox, UTM, virt-manager

---

## Live App

**[https://inquisitive-rqbbox-core-play.base44.app](https://inquisitive-rqbbox-core-play.base44.app)**

> v2.6.0.4 · RTech · GOTECH AI
