# Welcome to RQBBOX OS

**RQBBOX OS** is a high-performance, immersive gaming console operating system — designed for streamlined discovery, library management, and instant play. Powered by [Base44](https://base44.com).

---

## Quick Links

| Page | Description |
|------|-------------|
| [Getting Started](Getting-Started) | Install and launch RQBBOX OS |
| [Platform Launchers](Platform-Launchers) | Native launchers for all platforms |
| [Packages](Packages) | Package manager configs (Snap, Brew, Winget, etc.) |
| [Build Guide](Build-Guide) | How to build from source |
| [CI/CD](CI-CD) | GitHub Actions automation |
| [Changelog](Changelog) | Release history |
| [Contributing](Contributing) | How to contribute |

---

## Supported Platforms

| Platform | Format | Min Version |
|----------|--------|-------------|
| 📱 Android | APK + AAB | Android 8.0+ |
| 🍎 iOS | IPA | iOS 15.0+ |
| 🪟 Windows | EXE Installer | Windows 10 64-bit |
| 🍏 macOS | DMG (Universal) | macOS 12 Monterey |
| 🐧 Linux | AppImage / DEB / RPM / Snap | Ubuntu 20.04+ |
| 🌐 PWA | Browser Install | Any modern browser |

---

## Repository Structure

```
rqbbox-os/
├── launchers/        # Native app wrappers (WebView / Electron)
│   ├── android/      # Java + WebView
│   ├── ios/          # Swift + WKWebView
│   ├── windows/      # Electron
│   └── macos/        # Electron
├── packages/         # Production build & packaging configs
│   ├── android/      # Gradle (APK + AAB)
│   ├── ios/          # Swift Package Manager + Podfile
│   ├── windows/      # Electron Builder (NSIS + Portable)
│   ├── macos/        # Electron Builder (DMG + PKG)
│   ├── linux/        # Electron Builder (AppImage + DEB + RPM + Snap)
│   ├── snap/         # Snapcraft manifest
│   ├── brew/         # Homebrew Cask
│   ├── winget/       # Windows Package Manager manifest
│   ├── chocolatey/   # Chocolatey package
│   ├── flatpak/      # Flatpak manifest
│   └── pwa/          # PWA manifest + service worker
└── README.md
```

---

> Built with [Base44](https://base44.com) · [GitHub Repo](https://github.com/Rtech-Rqbbox-os/rqbbox-os)
