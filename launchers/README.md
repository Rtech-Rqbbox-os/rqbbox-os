# RQBBOX OS — App Launchers

<p align="center">
  <img src="https://media.base44.com/images/public/6a0d64e743c742005c890c76/7bd37856b_generated_image.png" width="100" alt="RQBBOX OS Logo"/>
</p>

<p align="center">
  <img src="https://media.base44.com/images/public/6a0d64e743c742005c890c76/e8cbd346c_generated_image.png" width="700" alt="RQBBOX OS Banner"/>
</p>

<p align="center">
  Native app launchers for RQBBOX OS — full-screen, fast, and available on every platform.
</p>

<p align="center">
  <a href="https://inquisitive-rqbbox-core-play.base44.app"><img src="https://img.shields.io/badge/▶%20Launch%20RQBBOX%20OS-00f5ff?style=for-the-badge&logo=google-chrome&logoColor=black" alt="Launch App"/></a>
</p>

---

## 🌐 Live App

> **[https://inquisitive-rqbbox-core-play.base44.app](https://inquisitive-rqbbox-core-play.base44.app)**

---

## ⬇️ Downloads

| Platform | Download | Min Version |
|----------|----------|-------------|
| 🪟 **Windows** | [Download](https://inquisitive-rqbbox-core-play.base44.app) | Windows 10 64-bit |
| 🍏 **macOS** | [Download](https://inquisitive-rqbbox-core-play.base44.app) | macOS 12 Monterey |
| 🐧 **Linux** | [Download](https://inquisitive-rqbbox-core-play.base44.app) | Ubuntu 20.04+ |
| 📱 **Android** | [Download APK](https://inquisitive-rqbbox-core-play.base44.app) | Android 8.0+ |
| 📱 **iOS** | [Download IPA](https://inquisitive-rqbbox-core-play.base44.app) | iOS 15.0+ |
| 🌐 **Browser** | [Open Now](https://inquisitive-rqbbox-core-play.base44.app) | Any modern browser |

---

## 🚀 Installation Instructions

### 🪟 Windows
1. Download the Windows `.exe` installer from the link above
2. Run `RQBBOX-OS-Setup.exe` and follow the prompts
3. RQBBOX OS will appear in your Start Menu
4. Launch and play!

```bash
# Or build from source:
cd windows
npm install
npm run build
# Output: dist/RQBBOX OS Setup 1.0.0.exe
```

---

### 🍏 macOS
1. Download `RQBBOX-OS.dmg` from the link above
2. Open the DMG and drag **RQBBOX OS** to Applications
3. On first launch: right-click → **Open** to bypass Gatekeeper
4. Or install via Homebrew:

```bash
brew install --cask rqbbox-os
```

```bash
# Build from source:
cd macos
npm install
npm run build
# Output: dist/RQBBOX OS-1.0.0.dmg
```

---

### 🐧 Linux
```bash
# AppImage
chmod +x RQBBOX-OS.AppImage && ./RQBBOX-OS.AppImage

# DEB (Debian/Ubuntu)
sudo dpkg -i rqbbox-os.deb

# RPM (Fedora/RHEL)
sudo rpm -i rqbbox-os.rpm

# Snap
sudo snap install rqbbox-os

# Flatpak
flatpak install flathub com.rtech.RQBBOXos

# Winget (Windows Package Manager)
winget install RTech.RQBBOXos
```

```bash
# Build from source:
cd linux  # (inside rqbbox-packages/)
npm install
npm run build
```

---

### 📱 Android
1. Download the APK from the link above
2. Enable **Unknown Sources**: Settings → Security → Unknown Sources
3. Tap the downloaded APK → **Install**
4. Launch **RQBBOX OS** from your app drawer

```bash
# Build from source:
cd android
./gradlew assembleRelease
# Output: app/build/outputs/apk/release/app-release.apk
```

---

### 📱 iOS
1. Download the IPA from the link above
2. Install via **AltStore** or **Sideloadly** on your Mac/PC
3. On device: **Settings → General → VPN & Device Management** → Trust developer
4. Launch **RQBBOX OS** from your home screen

```bash
# Build from source:
# 1. Open ios/RQBBOXOSLauncher.xcodeproj in Xcode
# 2. Set your Team in Signing & Capabilities
# 3. Product → Archive → Distribute App
```

---

### 🌐 Browser
No install. Works everywhere:

**[https://inquisitive-rqbbox-core-play.base44.app](https://inquisitive-rqbbox-core-play.base44.app)**

---

## 📁 Structure

```
rqbbox-launcher/
├── android/          # Java / WebView launcher
├── ios/              # Swift / WKWebView launcher
├── macos/            # Electron launcher (Universal)
└── windows/          # Electron launcher
```

---

<p align="center">
  <img src="https://media.base44.com/images/public/6a0d64e743c742005c890c76/675a24b4f_generated_image.png" width="300" alt="RQBBOX USB"/>
  <br/><br/>
  <img src="https://media.base44.com/images/public/6a0d64e743c742005c890c76/d7ee00918_generated_image.png" width="60" alt="RQBBOX Icon"/>
  <br/>
  <sub>RQBBOX OS · RTech · <a href="https://inquisitive-rqbbox-core-play.base44.app">inquisitive-rqbbox-core-play.base44.app</a></sub>
</p>
