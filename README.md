# RQBBOX OS Portable USB

**Plug In. Play Anywhere.** — by **RhysTech**

A portable fullscreen gaming and app platform that runs from a USB drive.
**Not a bootable OS** — runs as a kiosk launcher on top of your existing OS.

## USB Drive

- **Label:** RQBBOX 0
- **Root folder:** `RQBBOX_OS/`

## How It Works

RQBBOX runs a **local API server** on `http://[your-ip]:19777` that:
- Serves the launcher UI
- Reads/writes files on the USB (profiles, notes, AI images, uploads)
- Installs store packages to `Games/` and `Apps/`
- Reports real USB storage

Games and apps launch **inside the OS** via the runtime overlay (fullscreen iframe with Back button).

## Cross-Platform Quick Start

### Windows
| Method | What to do |
|--------|-----------|
| **Manual** | Double-click `RQBBOX.exe` or `Launch RQBBOX.bat` |
| **Auto-launch** | Run `Setup RQBBOX.bat` once — auto-starts when USB plugged in |
| **Node.js** | `node System/Server/server.js` |

### macOS
```bash
# Requires Node.js (https://nodejs.org)
bash System/Launchers/launch-macos.command
# Or double-click launch-macos.command in Finder
```

### Linux / ChromeOS (Linux container)
```bash
# Requires Node.js
bash System/Launchers/launch-chromeos.sh
```

### Android (via Termux)
```bash
# 1. Install Termux from F-Droid
# 2. pkg install nodejs
# 3. bash System/Launchers/launch-android.sh
```

### iOS / iPadOS
Open Safari, navigate to the RQBBOX server running on another device on your network.

### Android TV / Apple TV
Open the browser on your TV and navigate to:
```
http://[computer-ip]:19777/tv/
```
The TV-optimized interface works with TV remote controls (arrow keys, Enter, Back).

### Any Device with a Browser
Once RQBBOX is running on any computer, open a browser on any device on the same network and go to:
```
http://[computer-ip]:19777/
```
The launcher shows the network address in the **Connect from Other Devices** section on the Home page.

### PWA (Progressive Web App)
On mobile devices, open the launcher URL and select **Add to Home Screen** for an app-like experience.

## Folder Structure

```
RQBBOX_OS/
├── Games/          Installed games & saves
├── Apps/           Portable applications
├── Store/          RhysTech Store catalog
├── Profiles/       Multi-user profiles & saves
├── Settings/       System configuration
├── AI/             AI images & wallpapers
├── Media/          Music, video, screenshots
├── Downloads/      Store downloads
└── System/         Launcher, server, branding
    ├── Server/     Cross-platform Node.js API server
    ├── Launcher/   Fullscreen UI (HTML/CSS/JS)
    ├── Launchers/  Platform-specific start scripts
    ├── TV/         TV-optimized interface
    ├── Branding/   RQBBOX & RhysTech logos
    └── USBMonitor/ Auto-launch scripts (Windows)
```

## Features

- Fullscreen console-style launcher with neon UI
- Boot splash, sign-in, profiles, home dashboard
- **RhysTech Store** — install games & apps
- File manager with drag & drop
- AI image generator, assistant, voice input
- Controller, keyboard, mouse, touchscreen support
- Notifications, screenshot, screen recorder
- Themes, performance mode, FPS monitor
- **TV Mode** (`/tv/`) — remote-optimized interface
- **PWA** — install to home screen on mobile
- **Cross-network** — access from any device on LAN
- Offline support — all data on USB

## Adding Games & Apps

1. Install from **RhysTech Store** in the launcher, or
2. Place executables in `Games/<name>/` or `Apps/<name>/`

## Requirements

- **Any OS** (Windows, macOS, Linux, ChromeOS, Android)
- **Node.js v16+** for the cross-platform server
- A browser (Chrome, Edge, Safari, Firefox)
- USB 2.0+ drive with ~500 MB free

## Exit

Click **Exit** in the sidebar or close the server terminal.
On Windows, unplug the USB (with monitor installed) to auto-close.

---

© RhysTech — RQBBOX OS Portable USB v1.0.0
