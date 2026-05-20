# CI/CD

RQBBOX OS uses GitHub Actions to automatically build and release all platforms.

**Workflow:** [`.github/workflows/build.yml`](https://github.com/Rtech-Rqbbox-os/rqbbox-os/blob/main/packages/.github/workflows/build.yml)

---

## Triggering a Release

Push a version tag to trigger a full build + release:

```bash
git tag v1.0.1
git push origin v1.0.1
```

This will:
1. Build Android (APK + AAB)
2. Build iOS (IPA)
3. Build Windows (EXE x64 + ia32)
4. Build macOS (DMG Universal)
5. Build Linux (AppImage + DEB + RPM)
6. Create a GitHub Release with all artifacts attached

---

## Jobs

| Job | Runner | Output |
|-----|--------|--------|
| `build-android` | `ubuntu-latest` | `.apk`, `.aab` |
| `build-ios` | `macos-latest` | `.ipa` |
| `build-windows` | `windows-latest` | `.exe` |
| `build-macos` | `macos-latest` | `.dmg` |
| `build-linux` | `ubuntu-latest` | `.AppImage`, `.deb`, `.rpm` |
| `release` | `ubuntu-latest` | GitHub Release |

---

## Required Secrets

Go to **Settings → Secrets and variables → Actions** and add:

| Secret | Description |
|--------|-------------|
| `WIN_CERT_PATH` | Path to Windows code-signing certificate (.pfx) |
| `WIN_CERT_PASSWORD` | Windows certificate password |
| `APPLE_ID` | Apple ID email for notarization |
| `APPLE_APP_SPECIFIC_PASSWORD` | App-specific password from appleid.apple.com |
| `APPLE_TEAM_ID` | 10-character Apple Developer Team ID |
| `KEYSTORE_PATH` | Path to Android keystore (.jks) |
| `KEYSTORE_PASSWORD` | Android keystore password |
| `KEY_ALIAS` | Android signing key alias |
| `KEY_PASSWORD` | Android signing key password |
| `RTECH_TEAM_ID` | RTech Apple Team ID for iOS builds |
