# RQBBOX OS — Packages & Distribution

<p align="center">
  <img src="https://media.base44.com/images/public/6a0d64e743c742005c890c76/7bd37856b_generated_image.png" width="100" alt="RQBBOX OS Logo"/>
</p>

<p align="center">
  <img src="https://media.base44.com/images/public/6a0d64e743c742005c890c76/e8cbd346c_generated_image.png" width="700" alt="RQBBOX OS Banner"/>
</p>

<p align="center">
  Build and distribute RQBBOX OS across every platform and package manager.
</p>

<p align="center">
  <a href="https://inquisitive-rqbbox-core-play.base44.app"><img src="https://img.shields.io/badge/▶%20Launch%20RQBBOX%20OS-00f5ff?style=for-the-badge&logo=google-chrome&logoColor=black" alt="Launch App"/></a>
</p>

---

## 🌐 Live App

> **[https://inquisitive-rqbbox-core-play.base44.app](https://inquisitive-rqbbox-core-play.base44.app)**

---

## ⬇️ Download & Install

### One-click installs via Package Manager

```bash
# 🍏 macOS — Homebrew
brew install --cask rqbbox-os

# 🪟 Windows — Winget
winget install RTech.RQBBOXos

# 🪟 Windows — Chocolatey
choco install rqbbox-os

# 🐧 Linux — Snap
sudo snap install rqbbox-os

# 🐧 Linux — Flatpak
flatpak install flathub com.rtech.RQBBOXos
```

---

### Direct Downloads

| Platform | Package | Download |
|----------|---------|----------|
| 🪟 Windows | `.exe` Installer | [Download](https://inquisitive-rqbbox-core-play.base44.app) |
| 🍏 macOS | `.dmg` (Universal) | [Download](https://inquisitive-rqbbox-core-play.base44.app) |
| 🐧 Linux | `.AppImage` | [Download](https://inquisitive-rqbbox-core-play.base44.app) |
| 🐧 Linux | `.deb` (Debian/Ubuntu) | [Download](https://inquisitive-rqbbox-core-play.base44.app) |
| 🐧 Linux | `.rpm` (Fedora/RHEL) | [Download](https://inquisitive-rqbbox-core-play.base44.app) |
| 📱 Android | `.apk` | [Download](https://inquisitive-rqbbox-core-play.base44.app) |
| 📱 iOS | `.ipa` | [Download](https://inquisitive-rqbbox-core-play.base44.app) |
| 🌐 PWA | Install from browser | [Open App](https://inquisitive-rqbbox-core-play.base44.app) |

---

## 🚀 Build Instructions

### 🪟 Windows
```bash
cd windows
npm install
npm run build
# Output: dist/RQBBOX OS Setup 1.0.0.exe
```

### 🍏 macOS
```bash
cd macos
npm install
npm run build
# Output: dist/RQBBOX OS-1.0.0.dmg
```

### 🐧 Linux
```bash
cd linux
npm install
npm run build
# Output: dist/rqbbox-os.AppImage, .deb, .rpm
```

### 📱 Android
```bash
cd android
./gradlew assembleRelease
# Output: app/build/outputs/apk/release/app-release.apk
```

### 📱 iOS
```
1. Open ios/RQBBOXOSLauncher.xcodeproj in Xcode
2. Select your Team under Signing & Capabilities
3. Product → Archive → Distribute App → Ad Hoc / App Store
```

### 🌐 PWA
The PWA is auto-served from the live app URL. Users can install it via their browser's **"Add to Home Screen"** or **"Install App"** prompt.

---

## 📦 Package Manager Configs

| Manager | Config Location |
|---------|----------------|
| 🍺 Homebrew | `pkg-managers/brew/rqbbox-os.rb` |
| 🍫 Chocolatey | `pkg-managers/chocolatey/` |
| 📦 Winget | `pkg-managers/winget/RTech.RQBBOXos.yaml` |
| 🫙 Snap | `pkg-managers/snap/snapcraft.yaml` |
| 📦 Flatpak | `pkg-managers/flatpak/com.rtech.RQBBOXos.yaml` |
| 🌐 PWA | `pkg-managers/pwa/manifest.json` |

---

## ⚙️ CI/CD

GitHub Actions automatically builds all platform packages on every push to `main`:

```
.github/workflows/build.yml
```

Releases are published automatically to the [GitHub Releases](https://github.com/Rtech-Rqbbox-os/rqbbox-os/releases) page.

---

<p align="center">
  <img src="https://media.base44.com/images/public/6a0d64e743c742005c890c76/d7ee00918_generated_image.png" width="60" alt="RQBBOX Icon"/>
  <br/>
  <sub>RQBBOX OS · Powered by RTech & GOTECH AI · <a href="https://inquisitive-rqbbox-core-play.base44.app">inquisitive-rqbbox-core-play.base44.app</a></sub>
</p>
