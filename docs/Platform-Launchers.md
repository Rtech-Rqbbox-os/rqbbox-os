# Platform Launchers

Each launcher wraps the RQBBOX OS Base44 web app in a full-screen native shell.

**Source:** [`launchers/`](https://github.com/Rtech-Rqbbox-os/rqbbox-os/tree/main/launchers)

---

## Android
**Language:** Java | **Framework:** Android WebView | **Min SDK:** API 26 (Android 8.0)

Key features:
- Full-screen immersive mode
- JavaScript + DOM storage enabled
- Back button navigates in-app history
- Landscape orientation locked

**Build:**
```bash
cd launchers/android
./gradlew assembleRelease
# Output: app/build/outputs/apk/release/app-release.apk
```

---

## iOS
**Language:** Swift | **Framework:** WKWebView | **Min iOS:** 15.0

Key features:
- Full-screen, status bar hidden
- Inline media playback
- Landscape orientation locked
- Auto-layout constraints

**Build:**
1. Open `launchers/ios/RQBBOXOSLauncher.xcodeproj` in Xcode
2. Set your Team in Signing & Capabilities
3. Product → Archive → Distribute App

---

## Windows
**Framework:** Electron 29 | **Min OS:** Windows 10 64-bit

Key features:
- Full-screen, frameless window
- Menu bar hidden
- External links open in system browser
- Auto-updater via `electron-updater`

**Build:**
```bash
cd launchers/windows
npm install
npm start        # dev mode
npm run build    # production EXE
```

---

## macOS
**Framework:** Electron 29 | **Min OS:** macOS 12 Monterey | **Arch:** Universal

Key features:
- Full-screen, hidden title bar
- Universal binary (Apple Silicon + Intel)
- External links open in system browser
- Auto-updater via `electron-updater`

**Build:**
```bash
cd launchers/macos
npm install
npm start        # dev mode
npm run build    # production DMG
```
