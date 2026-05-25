# 📋 RQBBOX OS Changelog

## v2.6.0.4 — 21 May 2026 *(Current)*

### ✨ New Features
- Full OS desktop shell v2 (`os-shell-v2.html`)
- **EZ Install** — no bootable USB needed, one command installs everything
- **QCOW2 virtual disk** — run RQBBOX OS in Limbo PC (Android), QEMU, VirtualBox, UTM
- Windows EZ Installer: Desktop + Start Menu shortcuts, QEMU auto-install
- macOS/Linux EZ Installer: .command/.desktop shortcuts, Homebrew QEMU install
- Notification tray — live system bell with auto-dismiss
- **About RQBBOX OS** app with full build info and credits
- `ez-install-qcow2.ps1` — combined OS + QCOW2 VM installer (Windows)
- `ez-install-qcow2.sh` — combined OS + QCOW2 VM installer (macOS/Linux)

### 🔧 Improvements
- Boot sequence updated to v2.6.0.4 branding + messages
- Terminal: added `ls` command, updated prompt
- Settings: Auto-Update toggle added
- All launchers now load local OS shell (not web redirect)
- index-v2.html: QCOW2 download button, platform install cards
- OS vs App architecture fully separated

### 🎨 Design
- New logo, banner & USB product imagery (AI-generated)
- Neon cyan + electric purple branding throughout

### 🏗️ Architecture
- Desktop platforms (Windows/macOS/Linux): full local OS experience
- Mobile/browser: RQBBOX App at inquisitive-rqbbox-core-play.base44.app

---

## v2.0.0 — May 2026

- USB software layer (non-bootable, plug-and-play)
- Windows/macOS/Linux/Android/iOS launchers
- Flash USB scripts for all platforms
- Autorun config, OS shell HTML

---

## v1.0.0 — May 2026

- Initial release
- Basic launcher structure
- Package manager configs (Snap, Homebrew, Winget, Chocolatey, Flatpak)
- Android + iOS native wrappers
- CI/CD GitHub Actions workflow

---

> RQBBOX OS · RTech · GOTECH AI
