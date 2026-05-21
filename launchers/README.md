# 🚀 RQBBOX OS Launchers — v2.6.0.4

Native platform wrappers for RQBBOX OS v2.6.0.4.

<p align="center">
  <img src="https://media.base44.com/images/public/6a0d64e743c742005c890c76/16da7f339_generated_image.png" width="80"/>
</p>

---

## Structure

```
launchers/
├── windows/   # Electron — loads os-shell-v2.html fullscreen
├── macos/     # Electron — loads os-shell-v2.html fullscreen
├── linux/     # Electron — loads os-shell-v2.html fullscreen
├── android/   # WebView → RQBBOX App / Limbo PC QCOW2
└── ios/       # WKWebView → RQBBOX App
```

---

## EZ Install (Recommended)

```powershell
# Windows — OS + QCOW2 VM
powershell -ExecutionPolicy Bypass -File usb-software\scripts\ez-install-qcow2.ps1
```

```bash
# macOS / Linux — OS + QCOW2 VM
./usb-software/scripts/ez-install-qcow2.sh
```

---

## Manual Launch (Dev)

```bash
# Windows / macOS / Linux
cd launchers/<platform>
npm install
npx electron .
```

---

## QCOW2 VM Launch

```bash
qemu-system-x86_64 -m 512 -hda limbo-rqbbox/RQBBOX-OS-v2.6.0.4.qcow2 -vga std -net user -net nic -boot c
```

---

## Live App (No Install)

**[https://inquisitive-rqbbox-core-play.base44.app](https://inquisitive-rqbbox-core-play.base44.app)**

> v2.6.0.4 · RTech · GOTECH AI
