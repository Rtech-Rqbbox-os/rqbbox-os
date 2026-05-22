<p align="center">
  <img src="https://media.base44.com/images/public/6a0d64e743c742005c890c76/16da7f339_generated_image.png" alt="RQBBOX OS Logo" width="120"/>
</p>

<h1 align="center">RQBBOX OS</h1>

<p align="center">
  <strong>Plug In. Play Anywhere. No Boot Required.</strong><br/>
  High-performance gaming OS · RTech · GOTECH AI
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-2.6.0.4-00f5ff?style=flat-square"/>
  <img src="https://img.shields.io/badge/platforms-Android%20%7C%20iOS%20%7C%20Windows%20%7C%20macOS%20%7C%20Linux%20%7C%20PWA-9b30ff?style=flat-square"/>
  <img src="https://img.shields.io/badge/QCOW2-Limbo%20PC-9b30ff?style=flat-square"/>
  <img src="https://img.shields.io/badge/license-MIT-00f5ff?style=flat-square"/>
  <img src="https://img.shields.io/github/actions/workflow/status/Rtech-Rqbbox-os/rqbbox-os/build.yml?style=flat-square&color=9b30ff"/>
</p>

---

<p align="center">
  <img src="https://media.base44.com/images/public/6a0d64e743c742005c890c76/dbaa9145d_generated_image.png" alt="RQBBOX OS v2.6.0.4 Banner" width="100%"/>
</p>

---

## 🎮 What is RQBBOX OS?

RQBBOX OS is a plug-and-play desktop gaming OS — no bootable USB, no complicated setup. Flash a USB or run the EZ Installer and you have a full desktop environment in seconds. On mobile and browser, the RQBBOX App delivers the same experience in a lightweight format.

**Version 2.6.0.4** — biggest update ever. New OS shell, EZ Installer, QCOW2 virtual disk, Limbo PC support, notification tray, About app, and full v2 branding.

---

## 🚀 Quick Install

### EZ Install (Recommended — No bootable USB needed)

```powershell
# Windows — installs OS + QCOW2 VM + shortcuts
powershell -ExecutionPolicy Bypass -File scripts\ez-install-qcow2.ps1
```

```bash
# macOS / Linux — installs OS + QCOW2 VM + shortcuts
chmod +x usb-software/scripts/ez-install-qcow2.sh
./usb-software/scripts/ez-install-qcow2.sh
```

### Flash USB

```powershell
# Windows
.\usb-software\scripts\flash-usb.ps1 -UsbPath "E:\"
```

```bash
# macOS / Linux
./usb-software/scripts/flash-usb.sh /Volumes/RQBBOX
```

### Package Managers

```bash
brew install --cask rqbbox-os          # macOS
winget install RTech.RQBBOXos          # Windows
choco install rqbbox-os                # Windows (Chocolatey)
sudo snap install rqbbox-os            # Linux
flatpak install flathub com.rtech.RQBBOXos  # Linux
```

### QCOW2 Virtual Machine (Limbo PC / QEMU)

```bash
# Android — Limbo PC Emulator
# 1. Install Limbo PC from Play Store
# 2. Download RQBBOX-OS-v2.6.0.4.qcow2 below
# 3. Set CPU=coreduo, RAM=512MB, HDD=qcow2 file → Start

# Desktop — QEMU
qemu-system-x86_64 -m 512 -hda limbo-rqbbox/RQBBOX-OS-v2.6.0.4.qcow2 -vga std -net user -net nic
```

---

## 📦 Downloads

| Platform | File | Install |
|----------|------|---------|
| 🪟 **Windows** | EZ Install + QCOW2 | `ez-install-qcow2.ps1` |
| 🍏 **macOS** | EZ Install + QCOW2 | `ez-install-qcow2.sh` |
| 🐧 **Linux** | EZ Install + QCOW2 | `ez-install-qcow2.sh` |
| 📱 **Android** | Limbo PC + QCOW2 | [Play Store](https://play.google.com/store/apps/details?id=com.max2idea.android.limbo.free) |
| 🌐 **Browser** | RQBBOX App (no install) | [Launch](https://inquisitive-rqbbox-core-play.base44.app) |
| 💾 **QCOW2 Image** | 512MB virtual disk | `limbo-rqbbox/RQBBOX-OS-v2.6.0.4.qcow2` |

---

## 🖥️ OS Features (v2.6.0.4)

| Feature | Description |
|---------|-------------|
| 🚀 Boot Screen | Animated v2.6.0.4 boot sequence |
| 🖥️ Desktop | Draggable windows, icon grid |
| 📋 Taskbar | Start menu, clock, system tray |
| 🌐 RQBBOX App | Built-in browser → live rtech team / rtech studios app |
| 💻 Terminal | CLI: help, sysinfo, ls, echo, date... |
| 📁 File Manager | USB/virtual file browser |
| 📊 System Info | Live CPU, RAM, screen, network |
| 🛠️ Settings | Full settings panel + Auto-Update toggle |
| ℹ️ About | Build info, version, credits |
| 🔔 Notifications | Live tray notification system |
| 🔄 Power | Reboot + Shutdown |

---

## 🏗️ Repo Structure

```
rqbbox-os/
├── usb-software/          # USB software layer (non-bootable)
│   ├── core/              # OS shell HTML files
│   │   ├── os-shell-v2.html      ← Full desktop OS v2.6.0.4
│   │   └── index-v2.html         ← Mobile/browser splash
│   ├── launcher/          # Platform launchers (Electron/WebView)
│   ├── scripts/           # EZ install + flash scripts
│   │   ├── ez-install-qcow2.ps1  ← Windows EZ + QCOW2
│   │   ├── ez-install-qcow2.sh   ← macOS/Linux EZ + QCOW2
│   │   ├── ez-install.ps1
│   │   ├── ez-install.sh
│   │   ├── flash-usb.ps1
│   │   └── flash-usb.sh
│   └── RELEASE-v2.6.0.4.md
├── limbo-rqbbox/          # QCOW2 virtual disk for Limbo PC
│   ├── RQBBOX-OS-v2.6.0.4.qcow2 ← Virtual disk image
│   ├── limbo-config.json
│   └── docs/README.md
├── launchers/             # Native platform wrappers
├── packages/              # Package manager configs
├── docs/                  # Documentation
├── branding/              # Brand assets
└── rqbbox-releases/       # Release archives
```

---

## 🔨 Build & CI/CD

Tag a release to trigger automated builds across all platforms:

```bash
git tag v2.6.0.4 && git push origin v2.6.0.4
```

GitHub Actions will build Windows, macOS, Linux, Android, iOS, and PWA automatically. See [CI/CD docs](docs/CI-CD.md).

---

## 🔗 Links

| Resource | URL |
|----------|-----|
| RQBBOX App | [inquisitive-rqbbox-core-play.base44.app](https://inquisitive-rqbbox-core-play.base44.app) |
| GitHub | [github.com/Rtech-Rqbbox-os/rqbbox-os](https://github.com/Rtech-Rqbbox-os/rqbbox-os) |
| Limbo PC (Android) | [Play Store](https://play.google.com/store/apps/details?id=com.max2idea.android.limbo.free) |

---

<p align="center">
  <img src="https://media.base44.com/images/public/6a0d64e743c742005c890c76/af81b0c7e_generated_image.png" width="280" alt="RQBBOX USB"/>
  <br/><br/>
  <sub>RQBBOX OS v2.6.0.4 · RTech · GOTECH AI · 21 May 2026</sub>
</p>
