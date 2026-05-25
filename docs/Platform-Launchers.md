# 🖥️ Platform Launchers — RQBBOX OS v2.6.0.4

Each platform has a native launcher that loads the RQBBOX OS v2.6.0.4 desktop shell.

---

## Windows (Electron)

**File:** `launchers/windows/main.js`  
**Installer:** `usb-software/scripts/ez-install-qcow2.ps1`

```powershell
# EZ Install + QCOW2 VM
powershell -ExecutionPolicy Bypass -File usb-software\scripts\ez-install-qcow2.ps1
```

Loads `usb-software/core/os-shell-v2.html` as a fullscreen Electron app. Creates Desktop + Start Menu shortcuts for both the shell and the QCOW2 VM.

---

## macOS (Electron)

**File:** `launchers/macos/main.js`  
**Installer:** `usb-software/scripts/ez-install-qcow2.sh`

```bash
./usb-software/scripts/ez-install-qcow2.sh
```

Auto-installs QEMU via Homebrew. Creates `Launch RQBBOX OS.command` and `Launch RQBBOX OS (QCOW2).command` in the install directory.

---

## Linux (Electron)

**File:** `launchers/linux/main.js`  
**Installer:** `usb-software/scripts/ez-install-qcow2.sh`

```bash
./usb-software/scripts/ez-install-qcow2.sh
```

Creates `.desktop` entries for both the Electron shell and QCOW2 VM (appears in app launcher).

---

## Android (Limbo PC / WebView)

**File:** `launchers/android/MainActivity.java`  
**QCOW2:** `limbo-rqbbox/RQBBOX-OS-v2.6.0.4.qcow2`

Two modes:
1. **WebView mode** — loads `https://inquisitive-rqbbox-core-play.base44.app`
2. **Limbo PC mode** — run full QCOW2 VM (CPU: coreduo, RAM: 512MB)

---

## iOS (WKWebView)

**File:** `launchers/ios/LauncherViewController.swift`

Loads `https://inquisitive-rqbbox-core-play.base44.app` in a full-screen WKWebView.

---

## QCOW2 Virtual Machine (All Platforms)

**File:** `limbo-rqbbox/RQBBOX-OS-v2.6.0.4.qcow2`

| Platform | App | Command |
|----------|-----|---------|
| Android | Limbo PC Emulator | Load QCOW2, CPU=coreduo, RAM=512MB |
| Windows | QEMU / VirtualBox | `qemu-system-x86_64 -hda RQBBOX-OS-v2.6.0.4.qcow2 -m 512` |
| macOS | QEMU / UTM | Same QEMU command |
| Linux | QEMU / virt-manager | Same QEMU command |

---

## Browser / PWA

No install needed. Works on all devices:

**[https://inquisitive-rqbbox-core-play.base44.app](https://inquisitive-rqbbox-core-play.base44.app)**

> RQBBOX OS v2.6.0.4 · RTech · GOTECH AI
