# Build Guide

How to build RQBBOX OS from source for each platform.

---

## Prerequisites

| Tool | Version | Required For |
|------|---------|-------------|
| Node.js | 20+ | Windows, macOS, Linux |
| npm | 10+ | Windows, macOS, Linux |
| JDK | 17 | Android |
| Android Studio / SDK | Latest | Android |
| Xcode | 15+ | iOS, macOS |
| CocoaPods | Latest | iOS |
| Python | 3.8+ | Build scripts |

---

## Android

```bash
cd packages/android

# Debug build
./gradlew assembleDebug

# Release APK
./gradlew assembleRelease

# Release AAB (Google Play)
./gradlew bundleRelease
```

**Signing:** Set environment variables before building:
```bash
export KEYSTORE_PATH=/path/to/rqbboxos.jks
export KEYSTORE_PASSWORD=yourpassword
export KEY_ALIAS=rqbboxos
export KEY_PASSWORD=yourkeypassword
```

**Output:**
- APK: `app/build/outputs/apk/release/app-release.apk`
- AAB: `app/build/outputs/bundle/release/app-release.aab`

---

## iOS

```bash
cd packages/ios
pod install
```

Then in Xcode:
1. Open `RQBBOXOSLauncher.xcworkspace`
2. Set your Apple Developer Team
3. **Product → Archive**
4. **Distribute App → App Store Connect** or **Ad Hoc**

---

## Windows

```bash
cd packages/windows
npm install

# Development
npm run dev

# Production (x64)
npm run build

# All architectures (x64, ia32, arm64)
npm run build:all
```

**Output:** `dist/RQBBOX OS Setup x.x.x.exe`

---

## macOS

```bash
cd packages/macos
npm install

# Development
npm run dev

# Production Universal DMG
npm run build:all
```

**Notarization:** Set before building:
```bash
export APPLE_ID=your@apple.id
export APPLE_APP_SPECIFIC_PASSWORD=xxxx-xxxx-xxxx-xxxx
export APPLE_TEAM_ID=XXXXXXXXXX
```

**Output:** `dist/RQBBOX OS-x.x.x.dmg`

---

## Linux

```bash
cd packages/linux
npm install

# All formats (AppImage + DEB + RPM + Snap)
npm run build:all
```

**Output:**
- `dist/RQBBOX OS-x.x.x.AppImage`
- `dist/rqbbox-os_x.x.x_amd64.deb`
- `dist/rqbbox-os-x.x.x.x86_64.rpm`
