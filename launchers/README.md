# RQBBOX OS — App Launchers

Native app launchers for RQBBOX OS across all platforms. Each launcher loads the Base44 web app in a full-screen native wrapper.

**App URL:** https://app.base44.com/apps/6a0d383fda804251a27464a9

---

## 📱 Android

**Location:** `android/`
**Min SDK:** Android 8.0 (API 26)
**Language:** Java

### Build
```bash
cd android
./gradlew assembleRelease
```
The APK will be at `app/build/outputs/apk/release/app-release.apk`

---

## 🍎 iOS

**Location:** `ios/`
**Min iOS:** 15.0
**Language:** Swift

### Build
1. Open `ios/RQBBOXOSLauncher.xcodeproj` in Xcode
2. Select your team in Signing & Capabilities
3. Build & Archive → Distribute App

---

## 🪟 Windows

**Location:** `windows/`
**Min OS:** Windows 10 64-bit
**Framework:** Electron

### Build
```bash
cd windows
npm install
npm run build
```
Installer will be at `dist/RQBBOX OS Setup 1.0.0.exe`

---

## 🍏 macOS

**Location:** `macos/`
**Min OS:** macOS 12 Monterey (Universal — Apple Silicon + Intel)
**Framework:** Electron

### Build
```bash
cd macos
npm install
npm run build
```
DMG will be at `dist/RQBBOX OS-1.0.0.dmg`

---

Built with Base44 — https://base44.com
