# 📦 Packages — RQBBOX OS v2.6.0.4

All package manager configs are in `packages/`. They install RQBBOX OS v2.6.0.4.

---

## Homebrew (macOS)

```bash
brew install --cask rqbbox-os
```
Config: `packages/brew/rqbbox-os.rb`

---

## Winget (Windows)

```powershell
winget install RTech.RQBBOXos
```
Config: `packages/winget/RTech.RQBBOXos.yaml`

---

## Chocolatey (Windows)

```powershell
choco install rqbbox-os
```
Config: `packages/chocolatey/rqbbox-os.nuspec`

---

## Snap (Linux)

```bash
sudo snap install rqbbox-os
```
Config: `packages/snap/snapcraft.yaml`

---

## Flatpak (Linux)

```bash
flatpak install flathub com.rtech.RQBBOXos
```
Config: `packages/flatpak/com.rtech.RQBBOXos.yaml`

---

## PWA (All Browsers)

Install via browser prompt or visit:  
**[https://inquisitive-rqbbox-core-play.base44.app](https://inquisitive-rqbbox-core-play.base44.app)**

Config: `packages/pwa/manifest.json`

---

## EZ Install Scripts (No Package Manager Needed)

```powershell
# Windows — installs OS + QCOW2 VM
powershell -ExecutionPolicy Bypass -File usb-software\scripts\ez-install-qcow2.ps1
```

```bash
# macOS / Linux — installs OS + QCOW2 VM
./usb-software/scripts/ez-install-qcow2.sh
```

---

## QCOW2 Virtual Disk

Download: `limbo-rqbbox/RQBBOX-OS-v2.6.0.4.qcow2`

Works with: **Limbo PC (Android)**, **QEMU**, **VirtualBox**, **UTM (macOS)**, **virt-manager (Linux)**

> RQBBOX OS v2.6.0.4 · RTech · GOTECH AI
