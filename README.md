<p align="center">
  <img src="https://media.base44.com/images/public/6a0d64e743c742005c890c76/d7ee00918_generated_image.png" alt="RQBBOX OS Logo" width="200"/>
</p>

<h1 align="center">RQBBOX OS</h1>

<p align="center">
  <strong>High-performance, immersive gaming console operating system</strong><br/>
  Powered by <a href="https://base44.com">Base44</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-00f5ff?style=flat-square" />
  <img src="https://img.shields.io/badge/platforms-Android%20%7C%20iOS%20%7C%20Windows%20%7C%20macOS%20%7C%20Linux%20%7C%20PWA-9b30ff?style=flat-square" />
  <img src="https://img.shields.io/badge/license-MIT-00f5ff?style=flat-square" />
  <img src="https://img.shields.io/github/actions/workflow/status/Rtech-Rqbbox-os/rqbbox-os/build.yml?style=flat-square&color=9b30ff" />
</p>

---

<p align="center">
  <img src="https://media.base44.com/images/public/6a0d64e743c742005c890c76/75777fb02_generated_image.png" alt="RQBBOX OS Hero" width="100%"/>
</p>

---

## 🎮 What is RQBBOX OS?

RQBBOX OS is a next-gen gaming console operating system — designed for streamlined game discovery, library management, and instant play. Built on Base44's cloud platform, it runs natively on every major platform.

---

## 📦 Download

| Platform | Download |
|----------|----------|
| 🪟 Windows | [Download EXE](https://github.com/Rtech-Rqbbox-os/rqbbox-os/releases/latest) |
| 🍏 macOS | [Download DMG](https://github.com/Rtech-Rqbbox-os/rqbbox-os/releases/latest) |
| 🐧 Linux | [Download AppImage](https://github.com/Rtech-Rqbbox-os/rqbbox-os/releases/latest) |
| 📱 Android | [Download APK](https://github.com/Rtech-Rqbbox-os/rqbbox-os/releases/latest) |
| 🍎 iOS | [Download IPA](https://github.com/Rtech-Rqbbox-os/rqbbox-os/releases/latest) |
| 🌐 Web | [Launch in Browser](https://app.base44.com/apps/6a0d383fda804251a27464a9) |

---

## 🚀 Quick Install

```bash
# Homebrew (macOS)
brew install --cask rqbbox-os

# Winget (Windows)
winget install RTech.RQBBOXos

# Chocolatey (Windows)
choco install rqbbox-os

# Snap (Linux)
sudo snap install rqbbox-os

# Flatpak (Linux)
flatpak install flathub com.rtech.RQBBOXos
```

---

## 🏗️ Repo Structure

```
rqbbox-os/
├── launchers/   # Native app wrappers (Android, iOS, Windows, macOS)
├── packages/    # Build configs + package manager manifests
├── docs/        # Wiki & documentation
└── branding/    # Logos, colors, brand guide
```

---

## 🔨 Build & CI/CD

Push a version tag to trigger automated builds across all platforms:

```bash
git tag v1.0.1 && git push origin v1.0.1
```

GitHub Actions will build all 5 platforms and publish a release automatically. See [CI/CD docs](docs/CI-CD.md).

---

<p align="center">
  <img src="https://media.base44.com/images/public/6a0d64e743c742005c890c76/c5c3e29ca_generated_image.png" alt="RQBBOX OS Icon" width="80"/>
  <br/>
  <sub>Built with ❤️ by RTech · Powered by Base44</sub>
</p>
