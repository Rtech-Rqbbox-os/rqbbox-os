# Packages

Production-ready packaging configurations for all platforms.

**Source:** [`packages/`](https://github.com/Rtech-Rqbbox-os/rqbbox-os/tree/main/packages)

---

## Native Platform Packages

| Platform | Output | Location |
|----------|--------|----------|
| Android  | APK + AAB | `packages/android/` |
| iOS      | IPA | `packages/ios/` |
| Windows  | EXE + Portable + ZIP | `packages/windows/` |
| macOS    | DMG + PKG + ZIP | `packages/macos/` |
| Linux    | AppImage + DEB + RPM + Snap | `packages/linux/` |

---

## Package Manager Configs

### 🍺 Homebrew (macOS)
```bash
brew install --cask rqbbox-os
```
Config: [`packages/brew/rqbbox-os.rb`](https://github.com/Rtech-Rqbbox-os/rqbbox-os/tree/main/packages/brew)

---

### 🪟 Winget (Windows)
```powershell
winget install RTech.RQBBOXos
```
Config: [`packages/winget/RTech.RQBBOXos.yaml`](https://github.com/Rtech-Rqbbox-os/rqbbox-os/tree/main/packages/winget)

---

### 🍫 Chocolatey (Windows)
```powershell
choco install rqbbox-os
```
Config: [`packages/chocolatey/`](https://github.com/Rtech-Rqbbox-os/rqbbox-os/tree/main/packages/chocolatey)

---

### 🐧 Snap (Linux)
```bash
sudo snap install rqbbox-os
```
Config: [`packages/snap/snapcraft.yaml`](https://github.com/Rtech-Rqbbox-os/rqbbox-os/tree/main/packages/snap)

---

### 📦 Flatpak (Linux)
```bash
flatpak install flathub com.rtech.RQBBOXos
```
Config: [`packages/flatpak/`](https://github.com/Rtech-Rqbbox-os/rqbbox-os/tree/main/packages/flatpak)

---

### 🌐 PWA
Config: [`packages/pwa/manifest.json`](https://github.com/Rtech-Rqbbox-os/rqbbox-os/tree/main/packages/pwa)

Includes:
- `manifest.json` — installable web app manifest
- `sw.js` — service worker with offline caching
- `offline.html` — offline fallback page
