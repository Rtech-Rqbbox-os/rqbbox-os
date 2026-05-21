# 💾 RQBBOX OS — Limbo PC Emulator Image

<p align="center">
  <img src="https://media.base44.com/images/public/6a0d64e743c742005c890c76/16da7f339_generated_image.png" width="100" alt="RQBBOX OS Logo"/>
</p>

<p align="center">
  <img src="https://media.base44.com/images/public/6a0d64e743c742005c890c76/dbaa9145d_generated_image.png" width="700" alt="RQBBOX OS Banner"/>
</p>

<p align="center">
  <strong>RQBBOX OS v2.6.0.4 — QCOW2 Virtual Disk for Limbo PC Emulator</strong><br/>
  Run RQBBOX OS on Android via Limbo PC — no PC required.
</p>

<p align="center">
  <a href="https://inquisitive-rqbbox-core-play.base44.app">
    <img src="https://img.shields.io/badge/▶%20RQBBOX%20App-00f5ff?style=for-the-badge&logo=google-chrome&logoColor=black"/>
  </a>
  <a href="https://github.com/Rtech-Rqbbox-os/rqbbox-os">
    <img src="https://img.shields.io/badge/GitHub-Repository-9b30ff?style=for-the-badge&logo=github&logoColor=white"/>
  </a>
</p>

---

## 📦 Download

| File | Size | Format |
|------|------|--------|
| `RQBBOX-OS-v2.6.0.4.qcow2` | ~448 KB (512 MB virtual) | QCOW2 v3 |
| `RQBBOX-OS-v2.6.0.4-limbo.zip` | Bundled ZIP with config | ZIP |

---

## 📱 What is Limbo PC Emulator?

[Limbo PC Emulator](https://play.google.com/store/apps/details?id=com.max2idea.android.limbo.free) is a free Android app that runs a full QEMU x86 virtual machine — meaning you can run a complete PC operating system on your Android phone or tablet.

With RQBBOX OS + Limbo, you get:
- 🖥️ Full RQBBOX OS desktop on your Android device
- 💻 Window manager, terminal, file manager, system info
- 🌐 Built-in RQBBOX App browser
- ⚙️ Settings, About, notification tray
- 🎮 Gaming OS experience — anywhere

---

## 🚀 Setup Guide (Android + Limbo PC)

### Step 1 — Install Limbo PC Emulator
1. Open Google Play Store
2. Search **"Limbo PC Emulator"** or go to:
   `https://play.google.com/store/apps/details?id=com.max2idea.android.limbo.free`
3. Install and open it

### Step 2 — Download the QCOW2 Image
1. Download `RQBBOX-OS-v2.6.0.4.qcow2` from this repo
2. Copy it to your Android device:
   - Recommended path: `/sdcard/limbo/` or `/storage/emulated/0/limbo/`
   - Or use a file manager app to place it anywhere accessible

### Step 3 — Configure Limbo PC
Open Limbo PC and set these settings:

| Setting | Value |
|---------|-------|
| **Machine** | PC / i386 |
| **CPU** | Core Duo |
| **RAM** | 512 MB (or more) |
| **HDD Image** | `RQBBOX-OS-v2.6.0.4.qcow2` |
| **VGA** | std |
| **Network** | User (NAT) |
| **Boot from** | Hard Disk (HDD) |
| **UI** | SDL (recommended) |

### Step 4 — Launch
Tap **▶ Start** in Limbo PC. RQBBOX OS will boot!

---

## 🖥️ RQBBOX OS Features (Inside the Image)

| Feature | Description |
|---------|-------------|
| 🚀 Boot Screen | Animated v2.6.0.4 boot sequence |
| 🖥️ Desktop | Full desktop with draggable windows |
| 📋 Taskbar | Start menu, clock, system tray |
| 🌐 RQBBOX App | Built-in browser → live app |
| 💻 Terminal | Working CLI (help, sysinfo, ls, echo...) |
| 📁 File Manager | USB/virtual file browser |
| 📊 System Info | Live CPU, RAM, screen, network info |
| 🛠️ Settings | Full settings panel with toggles |
| ℹ️ About | Build info, version, credits |
| 🔔 Notifications | Live tray notification system |
| 🔄 Reboot/Shutdown | Full power controls |

---

## ⚙️ QCOW2 Image Info

```
Format:         QCOW2 v3
Virtual Size:   512 MB
Cluster Size:   64 KB
Encryption:     None
Compression:    Deflate (filesystem ZIP)
Boot Sector:    FAT32 compatible
App:            RQBBOX OS v2.6.0.4
Developer:      RTech · GOTECH AI
Build:          2026-05-21
```

---

## 🔧 Limbo PC Recommended Settings

```
Architecture:   x86 (i386)
CPU Model:      coreduo
CPU Cores:      1-2
RAM:            512 MB
Disk Interface: IDE
HDD:            RQBBOX-OS-v2.6.0.4.qcow2
VGA:            std
Sound:          (optional) AC97
Network:        User (NAT) — enables RQBBOX App access
Boot Device:    Hard Disk
```

> **Tip:** Enable **Network → User** mode so the built-in RQBBOX App browser can reach `https://inquisitive-rqbbox-core-play.base44.app`

---

## 📁 Files in this Package

```
limbo-rqbbox/
├── RQBBOX-OS-v2.6.0.4.qcow2      ← Virtual disk image (main file)
├── limbo-config.json               ← Limbo PC settings reference
├── docs/
│   └── README.md                   ← This file
└── assets/
    ├── logo.png                    ← RQBBOX OS logo
    ├── banner.png                  ← Release banner
    └── usb-shot.png                ← Product imagery
```

---

## 🔗 Links

| Resource | URL |
|----------|-----|
| RQBBOX App | [inquisitive-rqbbox-core-play.base44.app](https://inquisitive-rqbbox-core-play.base44.app) |
| GitHub Repo | [github.com/Rtech-Rqbbox-os/rqbbox-os](https://github.com/Rtech-Rqbbox-os/rqbbox-os) |
| Limbo PC | [play.google.com](https://play.google.com/store/apps/details?id=com.max2idea.android.limbo.free) |

---

<p align="center">
  <sub>RQBBOX OS v2.6.0.4 · RTech · GOTECH AI · 21 May 2026</sub>
</p>
