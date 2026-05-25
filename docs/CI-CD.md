# ⚙️ CI/CD — RQBBOX OS v2.6.0.4

GitHub Actions automatically builds all platforms on every version tag.

---

## Trigger a Build

```bash
git tag v2.6.0.4
git push origin v2.6.0.4
```

---

## What Gets Built

| Platform | Output | Tool |
|----------|--------|------|
| 🪟 Windows | `.exe` installer | Electron Builder |
| 🍏 macOS | `.dmg` | Electron Builder |
| 🐧 Linux | `.AppImage` | Electron Builder |
| 📱 Android | `.apk` | Gradle |
| 🍎 iOS | `.ipa` | Xcode |
| 💾 QCOW2 | `.qcow2` virtual disk | Python/QEMU |
| 🌐 PWA | `manifest.json` + SW | Static deploy |

---

## Workflow File

`.github/workflows/build.yml` (in `packages/`)

---

## EZ Install Artifacts

The CI pipeline also validates:
- `usb-software/scripts/ez-install-qcow2.ps1`
- `usb-software/scripts/ez-install-qcow2.sh`
- `limbo-rqbbox/RQBBOX-OS-v2.6.0.4.qcow2`

---

## Release URLs

After a successful build, releases appear at:  
`https://github.com/Rtech-Rqbbox-os/rqbbox-os/releases`

Live app always available at:  
**[https://inquisitive-rqbbox-core-play.base44.app](https://inquisitive-rqbbox-core-play.base44.app)**

> RQBBOX OS v2.6.0.4 · RTech · GOTECH AI
