# RQBBOX OS — Platform Packages

Production-ready packaging configurations for RQBBOX OS across all platforms.

**Base44 App:** https://app.base44.com/apps/6a0d383fda804251a27464a9

---

## Platform Support

| Platform | Format           | Min Version        | Arch              |
|----------|------------------|--------------------|-------------------|
| Android  | APK + AAB        | Android 8.0 (API 26) | arm64, x86_64   |
| iOS      | IPA              | iOS 15.0           | arm64             |
| Windows  | EXE + Portable   | Windows 10 64-bit  | x64, ia32         |
| macOS    | DMG + PKG        | macOS 12 Monterey  | Universal (arm64 + x64) |
| Linux    | AppImage + DEB + RPM + Snap | Ubuntu 20.04+ | x64, arm64  |

---

## Quick Start

### Android
```bash
cd packages/android
./gradlew assembleRelease
# APK: app/build/outputs/apk/release/app-release.apk
# AAB: app/build/outputs/bundle/release/app-release.aab
```

### iOS
```bash
cd packages/ios
pod install
open RQBBOXOSLauncher.xcworkspace
# Build → Archive → Distribute in Xcode
```

### Windows
```bash
cd packages/windows
npm install
npm run build       # x64 only
npm run build:all   # x64 + ia32 + arm64
```

### macOS
```bash
cd packages/macos
npm install
npm run build:all   # Universal (Apple Silicon + Intel)
```

### Linux
```bash
cd packages/linux
npm install
npm run build:all   # AppImage + DEB + RPM + Snap
```

---

## CI/CD

Automated builds run via GitHub Actions (`.github/workflows/build.yml`).

Push a tag like `v1.0.1` to trigger a full build across all platforms and auto-publish a GitHub Release.

```bash
git tag v1.0.1
git push origin v1.0.1
```

### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `WIN_CERT_PATH` | Path to Windows code signing certificate |
| `WIN_CERT_PASSWORD` | Windows cert password |
| `APPLE_ID` | Apple ID for notarization |
| `APPLE_APP_SPECIFIC_PASSWORD` | App-specific password |
| `APPLE_TEAM_ID` | Apple Developer Team ID |
| `KEYSTORE_PATH` | Android keystore path |
| `KEYSTORE_PASSWORD` | Android keystore password |
| `KEY_ALIAS` | Android key alias |
| `KEY_PASSWORD` | Android key password |
| `RTECH_TEAM_ID` | RTech Apple Team ID |

---

Built with Base44 — https://base44.com
