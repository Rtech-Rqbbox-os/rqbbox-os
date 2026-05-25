# 💾 RQBBOX OS — USB Software

<p align="center">
  <img src="https://media.base44.com/images/public/6a0d64e743c742005c890c76/d7ee00918_generated_image.png" width="100" alt="RQBBOX OS Logo"/>
</p>

<p align="center">
  <img src="https://media.base44.com/images/public/6a0d64e743c742005c890c76/e8cbd346c_generated_image.png" width="700" alt="RQBBOX OS Banner"/>
</p>

<p align="center">
  <strong>Plug In. Play Anywhere.</strong><br/>
  Desktop & USB = full OS experience · Mobile & Browser = RQBBOX App
</p>

<p align="center">
  <a href="https://inquisitive-rqbbox-core-play.base44.app">
    <img src="https://img.shields.io/badge/▶%20RQBBOX%20App%20(Mobile%20%26%20Browser)-00f5ff?style=for-the-badge&logo=google-chrome&logoColor=black" alt="Launch App"/>
  </a>
</p>

---

## 🧠 Architecture

| Where you run it | What you get |
|-----------------|--------------|
| 💻 Windows / macOS / Linux (USB or installed) | **Full RQBBOX OS** — desktop shell, window manager, terminal, file manager, settings |
| 📱 Android / iOS | **RQBBOX App** — mobile-optimised web app |
| 🌐 Browser (any device) | **RQBBOX App** — instant access, no install needed |

> The desktop OS loads **locally** from `core/os-shell.html` via Electron — no internet required to boot.  
> The RQBBOX App (web) is available inside the OS as a built-in browser window, and directly at the URL below.

---

## 🌐 RQBBOX App (Mobile & Browser)

> **Live URL:** [https://inquisitive-rqbbox-core-play.base44.app](https://inquisitive-rqbbox-core-play.base44.app)

Open on **any mobile or browser** to launch RQBBOX App instantly — no install needed.

---

## ⬇️ Downloads

| Platform | Type | Download |
|----------|------|----------|
| 🪟 **Windows** | Full OS (EXE) | [Download ↗](https://github.com/Rtech-Rqbbox-os/rqbbox-os) |
| 🍏 **macOS** | Full OS (DMG) | [Download ↗](https://github.com/Rtech-Rqbbox-os/rqbbox-os) |
| 🐧 **Linux** | Full OS (AppImage/DEB/RPM) | [Download ↗](https://github.com/Rtech-Rqbbox-os/rqbbox-os) |
| 📱 **Android** | App (APK) | [Download ↗](https://inquisitive-rqbbox-core-play.base44.app) |
| 📱 **iOS** | App (IPA) | [Download ↗](https://inquisitive-rqbbox-core-play.base44.app) |
| 🌐 **Browser** | App (Web) | [Open Now ↗](https://inquisitive-rqbbox-core-play.base44.app) |

---

## 🔌 Compatible Devices

| Device | Connection | Experience |
|--------|------------|-----------|
| 💻 Laptop | USB-A / USB-C | Full OS |
| 🖥️ PC / Desktop | USB-A / USB-C | Full OS |
| 📺 Smart TV | USB-A | Full OS |
| 📱 Android | USB-C OTG | App |
| 📱 iPhone / iPad | USB-C / Lightning | App |
| 🌐 Any browser | Internet | App |

---

## 🚀 Installation

### 🪟 Windows — Full OS
```powershell
# Flash to USB first:
.\scripts\flash-usb.ps1 -UsbPath "E:\"

# Then run the launcher:
E:\RQBBOX-OS\launcher\windows\RQBBOXLauncher.exe
```
Or install directly:
```powershell
# Build from source:
cd launcher/windows
npm install
npm run build
# Output: dist/RQBBOX-OS-USB-1.0.0-Windows-Setup.exe
```

---

### 🍏 macOS — Full OS
```bash
# Flash to USB:
chmod +x scripts/flash-usb.sh
./scripts/flash-usb.sh /Volumes/RQBBOX

# Run the launcher:
open /Volumes/RQBBOX/RQBBOX-OS/launcher/macos/RQBBOXLauncher.app
```
Or build from source:
```bash
cd launcher/macos
npm install
npm run build
# Output: dist/RQBBOX-OS-USB-1.0.0-macOS.dmg
```

---

### 🐧 Linux — Full OS
```bash
# Flash to USB:
chmod +x scripts/flash-usb.sh
./scripts/flash-usb.sh /mnt/usb

# Run the AppImage:
chmod +x /mnt/usb/RQBBOX-OS/launcher/linux/RQBBOXLauncher.AppImage
/mnt/usb/RQBBOX-OS/launcher/linux/RQBBOXLauncher.AppImage
```
Or install via package manager:
```bash
# DEB (Ubuntu/Debian)
sudo dpkg -i dist/RQBBOX-OS-USB-1.0.0-Linux.deb

# RPM (Fedora/RHEL)
sudo rpm -i dist/RQBBOX-OS-USB-1.0.0-Linux.rpm

# Snap
sudo snap install rqbbox-os

# Flatpak
flatpak install flathub com.rtech.RQBBOXos
```

---

### 📱 Android — App
1. Download the APK
2. **Settings → Security → Allow Unknown Sources**
3. Install APK → Launch **RQBBOX OS** from app drawer

> USB OTG: Plug RQBBOX USB into Android via USB-C OTG — app launches automatically.

---

### 📱 iOS — App
1. Download the IPA
2. Install via **AltStore** or **Sideloadly**
3. Trust certificate: **Settings → General → VPN & Device Management**
4. Launch from home screen

---

### 🌐 Browser — App
No install. Just open:

**[https://inquisitive-rqbbox-core-play.base44.app](https://inquisitive-rqbbox-core-play.base44.app)**

---

## 💾 Flash Your USB

### Windows
```powershell
.\scripts\flash-usb.ps1 -UsbPath "E:\"
```

### macOS / Linux
```bash
chmod +x scripts/flash-usb.sh
./scripts/flash-usb.sh /Volumes/RQBBOX
```

After flashing, plug into any device and run the launcher for that platform.

---

## 🖥️ RQBBOX OS Features (Desktop)

The full OS shell (`core/os-shell.html`) includes:

| Feature | Description |
|---------|-------------|
| 🚀 Boot Screen | Animated boot sequence with progress bar |
| 🖥️ Desktop | Icon grid, draggable windows, wallpaper |
| 📋 Taskbar | Start menu, open app list, clock, tray |
| 🌐 RQBBOX App | Built-in browser window to the live app |
| 💻 Terminal | Working command-line (help, sysinfo, echo, date, clear...) |
| 📁 File Manager | USB file structure browser |
| ⚙️ System Info | Live display of CPU, RAM, screen, network |
| 🛠️ Settings | Toggles for fullscreen, kiosk, auto-launch, sound |
| 🔄 Reboot / Shutdown | Full OS power controls |

---

## 🛠️ Build from Source

```bash
# Install dependencies for all platforms
cd launcher/windows && npm install
cd launcher/macos  && npm install
cd launcher/linux  && npm install

# Build Windows (.exe + NSIS installer)
cd launcher/windows && npm run build

# Build macOS (Universal .dmg)
cd launcher/macos && npm run build:all

# Build Linux (AppImage + DEB + RPM + Snap)
cd launcher/linux && npm run build:all
```

---

## 📁 Project Structure

```
usb-software/
├── core/
│   ├── os-shell.html             ← Full RQBBOX OS desktop (loads on Windows/macOS/Linux)
│   └── index.html                ← Splash/redirect (mobile & browser fallback)
├── launcher/
│   ├── windows/
│   │   ├── RQBBOXLauncher.js     ← Electron main (loads os-shell.html)
│   │   ├── preload.js
│   │   └── package.json
│   ├── macos/
│   │   ├── RQBBOXLauncher.js
│   │   ├── preload.js
│   │   └── package.json
│   ├── linux/
│   │   ├── RQBBOXLauncher.js
│   │   ├── preload.js
│   │   └── package.json
│   ├── android/
│   │   └── MainActivity.java     ← WebView app (loads RQBBOX App URL)
│   └── ios/
│       └── RQBBOXUSBLauncher.swift ← WKWebView app (loads RQBBOX App URL)
├── scripts/
│   ├── flash-usb.sh              ← Flash to USB (macOS/Linux)
│   └── flash-usb.ps1             ← Flash to USB (Windows)
├── autorun/
│   └── autorun-config.json
└── docs/
    └── README.md
```

---

<p align="center">
  <img src="https://media.base44.com/images/public/6a0d64e743c742005c890c76/d7ee00918_generated_image.png" width="60" alt="RQBBOX Icon"/>
  <br/>
  <sub>RQBBOX OS · Powered by RTech & GOTECH AI</sub>
</p>
