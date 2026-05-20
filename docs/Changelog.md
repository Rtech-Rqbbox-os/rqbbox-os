# Changelog

All notable changes to RQBBOX OS are documented here.

---

## v1.0.0 — 2026-05-20

### 🎉 Initial Release

**Launchers**
- Android launcher (Java + WebView, full-screen, landscape)
- iOS launcher (Swift + WKWebView, full-screen, landscape)
- Windows launcher (Electron 29, frameless, auto-updater)
- macOS launcher (Electron 29, Universal, hidden title bar)

**Packages**
- Android: Gradle build with APK + AAB, ProGuard, signing config
- iOS: Swift Package Manager + Podfile + Xcode config
- Windows: Electron Builder — NSIS installer, portable, ZIP
- macOS: Electron Builder — DMG, PKG, Universal binary, notarization
- Linux: Electron Builder — AppImage, DEB, RPM, Snap

**Package Managers**
- Homebrew Cask (`brew install --cask rqbbox-os`)
- Winget manifest (`winget install RTech.RQBBOXos`)
- Chocolatey package (`choco install rqbbox-os`)
- Snap (`snap install rqbbox-os`)
- Flatpak (`flatpak install com.rtech.RQBBOXos`)
- PWA manifest + service worker + offline support

**CI/CD**
- GitHub Actions workflow — builds all 5 platforms on tag push
- Auto-creates GitHub Release with all artifacts

---

_Future releases will be listed here._
