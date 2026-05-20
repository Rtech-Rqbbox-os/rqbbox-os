# 💾 RQBBOX OS — USB Software

<p align="center">
  <img src="https://media.base44.com/images/public/6a0d64e743c742005c890c76/7bd37856b_generated_image.png" width="100" alt="RQBBOX OS Logo"/>
</p>

<p align="center">
  <img src="https://media.base44.com/images/public/6a0d64e743c742005c890c76/e8cbd346c_generated_image.png" width="700" alt="RQBBOX OS Banner"/>
</p>

<p align="center">
  <strong style="color:#00f5ff;">Plug In. Play Anywhere.</strong><br/>
  No booting. No installs. Plug in and RQBBOX OS launches instantly on any device.
</p>

<p align="center">
  <a href="https://inquisitive-rqbbox-core-play.base44.app"><img src="https://img.shields.io/badge/▶%20Launch%20RQBBOX%20OS-00f5ff?style=for-the-badge&logo=google-chrome&logoColor=black" alt="Launch App"/></a>
</p>

---

## 🌐 App

> **Live URL:** [https://inquisitive-rqbbox-core-play.base44.app](https://inquisitive-rqbbox-core-play.base44.app)

Open this link on **any device** to launch RQBBOX OS instantly in your browser — no install needed.

---

## ⬇️ Download by Platform

| Platform | Download | Instructions |
|----------|----------|--------------|
| 🪟 **Windows** | [Download Windows Launcher](https://inquisitive-rqbbox-core-play.base44.app) | [See below ↓](#-windows) |
| 🍏 **macOS** | [Download macOS Launcher](https://inquisitive-rqbbox-core-play.base44.app) | [See below ↓](#-macos) |
| 🐧 **Linux** | [Download Linux Launcher](https://inquisitive-rqbbox-core-play.base44.app) | [See below ↓](#-linux) |
| 📱 **Android** | [Download APK](https://inquisitive-rqbbox-core-play.base44.app) | [See below ↓](#-android) |
| 📱 **iOS** | [Download IPA](https://inquisitive-rqbbox-core-play.base44.app) | [See below ↓](#-ios) |
| 🌐 **Browser (Any Device)** | [Open in Browser](https://inquisitive-rqbbox-core-play.base44.app) | Just click and play! |

---

## 🔌 Compatible Devices

| Device | Connection | Status |
|--------|------------|--------|
| 💻 Laptop | USB-A / USB-C | ✅ Supported |
| 📺 Smart TV | USB-A | ✅ Supported |
| 🖥️ PC / Desktop | USB-A / USB-C | ✅ Supported |
| 📱 Android Mobile | USB-C OTG | ✅ Supported |
| 📱 iPhone / iPad | USB-C / Lightning | ✅ Supported |

---

## 🚀 Installation Instructions

### 🪟 Windows
1. Download the Windows Launcher from the link above
2. Run `RQBBOX-OS-Setup.exe`
3. Follow the installer — RQBBOX OS will appear in your Start Menu
4. Launch and enjoy!

> Or flash to USB:
```powershell
.\scripts\flash-usb.ps1 -UsbPath "E:\"
```

---

### 🍏 macOS
1. Download the macOS DMG from the link above
2. Open `RQBBOX-OS.dmg`
3. Drag **RQBBOX OS** to your Applications folder
4. Open from Applications (right-click → Open on first launch)

> Or flash to USB:
```bash
chmod +x scripts/flash-usb.sh
./scripts/flash-usb.sh /Volumes/RQBBOX
```

---

### 🐧 Linux
1. Download the AppImage / DEB / RPM from the link above
2. **AppImage:** `chmod +x RQBBOX-OS.AppImage && ./RQBBOX-OS.AppImage`
3. **DEB:** `sudo dpkg -i rqbbox-os.deb`
4. **RPM:** `sudo rpm -i rqbbox-os.rpm`

> Or install via Snap / Flatpak:
```bash
# Snap
sudo snap install rqbbox-os

# Flatpak
flatpak install flathub com.rtech.RQBBOXos
```

---

### 📱 Android
1. Download the APK from the link above
2. On your device: **Settings → Security → Allow Unknown Sources**
3. Open the downloaded APK and tap **Install**
4. Launch **RQBBOX OS** from your app drawer

> USB OTG: Plug your RQBBOX USB into your Android device via USB-C OTG adapter — the launcher opens automatically.

---

### 📱 iOS
1. Download the IPA from the link above
2. Install via **AltStore** or **Sideloadly**
3. Trust the developer certificate: **Settings → General → VPN & Device Management**
4. Launch **RQBBOX OS** from your home screen

> USB: Connect via USB-C or Lightning — RQBBOX OS launches via the Files app.

---

### 🌐 Browser (Universal)
No download needed. Just open:

**[https://inquisitive-rqbbox-core-play.base44.app](https://inquisitive-rqbbox-core-play.base44.app)**

Works on any browser on any device — laptop, tablet, phone, smart TV.

---

## 💾 Flash Your USB (One Command)

### Windows
```powershell
.\scripts\flash-usb.ps1 -UsbPath "E:\"
```

### macOS / Linux
```bash
chmod +x scripts/flash-usb.sh
./scripts/flash-usb.sh /Volumes/RQBBOX
```

---

## 📁 Project Structure

```
usb-software/
├── autorun/
│   └── autorun-config.json       # USB autolaunch config
├── core/
│   └── index.html                # Splash screen + app redirect
├── launcher/
│   ├── windows/                  # Electron launcher (Windows)
│   ├── macos/                    # Electron launcher (macOS)
│   ├── linux/                    # Electron launcher (Linux)
│   ├── android/                  # Android USB OTG launcher (Java)
│   └── ios/                      # iOS launcher (Swift)
├── scripts/
│   ├── flash-usb.sh              # Flash script (macOS/Linux)
│   └── flash-usb.ps1             # Flash script (Windows)
└── docs/
    └── README.md
```

---

## 🛠️ Build Launchers from Source

```bash
# Windows
cd launcher/windows && npm install && npm run build

# macOS
cd launcher/macos && npm install && npm run build

# Linux
cd launcher/linux && npm install && npm run build
```

---

<p align="center">
  <img src="https://media.base44.com/images/public/6a0d64e743c742005c890c76/d7ee00918_generated_image.png" width="60" alt="RQBBOX Icon"/>
  <br/>
  <sub>RQBBOX OS · Powered by RTech & GOTECH AI · <a href="https://inquisitive-rqbbox-core-play.base44.app">inquisitive-rqbbox-core-play.base44.app</a></sub>
</p>
