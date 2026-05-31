<p align="center">
  <img src="https://raw.githubusercontent.com/Rtech-Rqbbox-os/rqbbox-os/main/System/Branding/rqbbox-logo.svg" alt="RQBBOX OS Logo" width="120"/>
</p>

<h1 align="center">RQBBOX OS ®</h1>

<p align="center">
  <strong>Plug Into Gaming. ® Portable Power Anywhere.</strong><br/>
  A portable USB gaming operating system by RhysTech — no installation, no emulators, no boot required.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-2.0-00d4ff?style=flat-square"/>
  <img src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux%20%7C%20Android%20%7C%20iOS-9d4edd?style=flat-square"/>
  <img src="https://img.shields.io/badge/license-MIT-00d4ff?style=flat-square"/>
  <img src="https://img.shields.io/badge/PWA-ready-00ffc8?style=flat-square"/>
  <img src="https://img.shields.io/badge/GitHub_Packages-npm-00d4ff?style=flat-square&logo=npm"/>
  <a href="https://rtech-rqbbox-os.github.io/rqbbox-os/System/Website/os-info-card.html"><img src="https://img.shields.io/badge/Google_Knowledge_Panel-View-00d4ff?style=flat-square&logo=google"/></a>
</p>

---

## 🚀 Overview

RQBBOX OS is a portable gaming OS that runs entirely from a USB drive. Plug it into any PC, start the server, and instantly access your games, apps, settings, and saves — no installation required. Powered by the **RQBBOX Kernel**, a modular microkernel with process management, memory management, virtual file system, device drivers, and system call API. View the [RQBBOX OS Knowledge Panel info card](https://rtech-rqbbox-os.github.io/rqbbox-os/System/Website/os-info-card.html) for structured details.

**Developer:** RhysTech (📧 [rhyscotton20@gmail.com](mailto:rhyscotton20@gmail.com))
**Website:** [rtech-rqbbox-os.github.io/rqbbox-os](https://rtech-rqbbox-os.github.io/rqbbox-os/)
**GitHub:** [github.com/Rtech-Rqbbox-os/rqbbox-os](https://github.com/Rtech-Rqbbox-os/rqbbox-os)
**Packages:** [github.com/Rtech-Rqbbox-os/rqbbox-os/packages](https://github.com/Rtech-Rqbbox-os/rqbbox-os/packages)
**Support:** 📧 [rqbbox.support@groups.outlook.com](mailto:rqbbox.support@groups.outlook.com)
**YouTube:** ▶ [@RQBBOX-REAL](https://www.youtube.com/@RQBBOX-REAL)

© 2026 RhysTech. RQBBOX® is a trademark of RhysTech. All rights reserved.

---

## ✨ Features

- **RQBBOX Kernel** — Modular microkernel: process manager, memory manager, virtual file system, device drivers, system call API, GUI + CLI interfaces
- **6 Native Games** — Neon Drift Racing, Pixel Quest, Star Fighter X, Void Craft Sandbox, Retro Zone, Cube Runner 3D
- **12 Web App Integrations** — YouTube, Netflix, Spotify, Twitch, Reddit, X/Twitter, Discord, Wikipedia, Gmail, Google Drive, GitHub, Stack Overflow
- **Full Launcher Console** — Sidebar navigation, runtime overlay, notifications, search, dark/neon UI
- **RhysTech Store** — Browse, install, and launch games/apps directly to USB
- **Plugin & Theme Engine** — Extend with JavaScript plugins, customize with CSS themes
- **Editions System** — Lite / Pro / Creator with feature gating
- **10-Step Setup Wizard** — First-boot configuration with language, network, account, theme, controller setup, privacy, and quick install
- **QR Code Sharing** — Share app/game links via QR codes
- **Profile System** — Multi-user support with sign-in, PIN auth, cloud sync
- **File Manager** — Browse USB files, upload, copy, paste, delete
- **Media Player** — Play audio/video directly in the OS
- **AI Tools** — AI chat and image generation
- **WiFi, Bluetooth, Controller Monitoring** — Hardware status dashboard
- **Service Worker** — Offline PWA support
- **Developer Hub** — SDK downloads, API reference, tutorials, Plugin API docs
- **Marketing Website** — `/website/` with editions grid, store showcase, community, FAQ, auth

## ⚙️ Kernel Architecture

RQBBOX OS is powered by the **RQBBOX Kernel** — a modular microkernel running as a Node.js HTTP server with an in-process event bus. Each subsystem runs independently and communicates through the kernel's message bus, ensuring stability (one component failure never brings down the entire OS).

| Component | Description |
|-----------|-------------|
| **Kernel (Core)** | Central orchestrator — boot sequence, inter-component messaging, service registry, subsystem lifecycle |
| **Process Manager** | Game/app lifecycle (launch/stop/restart), PID allocation, resource limits, crash recovery |
| **Memory Manager** | Per-process RAM tracking, cache allocation, garbage collection scheduling, memory quotas |
| **File System** | Virtual file system over USB — asset loading, user data, package installs, config management |
| **Device Drivers** | Hardware abstraction — Audio (Web Audio API), Controller (Gamepad API), Display (CSS/Canvas), Network (HTTP/WebSocket), Storage (File API) |
| **System Calls (API)** | RQBAudio, RQBAuth, RQBStore, RQBFiles, RQBProcess, RQBDevice, RQBNetwork — apps never access hardware directly |
| **User Interface** | PS5-inspired GUI (primary) + CLI terminal (secondary) — both call kernel services through the same API |

---

## 📦 Quick Start

### Windows
```
1. Plug in your RQBBOX USB drive
2. Double-click "Launch RQBBOX.bat"
3. The server starts at http://127.0.0.1:19777/
4. Open in your browser
```

### Phone Bootloader (Android / iOS / KaiOS)
```sh
# Open in-browser → boots RQBBOX on any brand phone
# Android: Install Termux → pkg install nodejs → run server
# iOS: Open in Safari → "Add to Home Screen" as PWA
# Full guides at: http://<server>:19777/bootloader/
```
Supported brands: Google Pixel, Samsung Galaxy, OnePlus, Xiaomi, Nokia, Microsoft Lumia, and more.

### macOS / Linux
```sh
./System/Launchers/launch-macos.command  # macOS
./System/Launchers/rqbbox-server.sh      # Linux
```

### Manual Server Start
```sh
cd System/Server
node server.js
# Server listens on http://0.0.0.0:19777
```

---

## 🏗️ Project Structure

```
RQBBOX_OS/
├── Apps/                    # Web app wrappers (YouTube, Netflix, etc.)
├── Games/                   # Native HTML5 games
│   ├── neon-drift/
│   ├── pixel-quest/
│   ├── star-fighter/
│   ├── void-craft/
│   ├── retro-zone/
│   └── cube-runner/
├── Store/
│   ├── catalog/store.json   # Store manifest
│   └── packages/            # 24 installable packages
├── System/
│   ├── Launcher/            # Main OS console (HTML/CSS/JS)
│   │   ├── index.html
│   │   ├── js/              # Core JS modules
│   │   ├── css/             # Stylesheets
│   │   └── assets/          # Sounds, wallpapers, icons
│   ├── Server/server.js     # HTTP backend (Node.js)
│   ├── Website/             # Marketing site
│   ├── SDK/                 # Developer documentation
│   └── Branding/            # Logos and icons
├── Profiles/                # User profiles and config
├── Settings/                # System configuration
├── Media/                   # Screenshots, recordings
└── AI/                      # AI-generated wallpapers
```

---

## 🛠️ Development

Technologies: **Node.js** (server), **Vanilla JS** (launcher), **HTML5 Canvas** (games), **CSS3** (UI)

All games are self-contained HTML files with inline JavaScript — zero dependencies.

### Server API
- `GET /api/store` — Store catalog
- `GET /api/profiles` — User profiles
- `GET /api/status/all` — Hardware status (battery, network, bluetooth, controller)
- `POST /api/auth` — Sign in
- `POST /api/register` — Create account
- `POST /api/install` — Install app/game to USB
- `GET /api/files` — File explorer
- `POST /api/file/read`, `/api/file/write`, `/api/file/copy`, `/api/file/move`, `/api/file/delete` — File operations
- `POST /api/screenshot` — Save screenshot
- `GET /sdk/` — SDK documentation

Full API reference at `/sdk/` or `System/SDK/index.html`.

---

## 📱 Editions

| Feature | Lite | Pro | Creator |
|---------|------|-----|---------|
| Games | 10 max | Unlimited | Unlimited |
| Apps | 5 max | Unlimited | Unlimited |
| Cloud Sync | — | ✅ | ✅ |
| Performance Tools | — | ✅ | ✅ |
| SDK Access | — | — | ✅ |
| Plugin/Theme Editor | — | — | ✅ |

---

## 📦 GitHub Packages

RQBBOX OS publishes npm packages to GitHub Packages. Authenticate with your GitHub token:

```sh
npm login --registry=https://npm.pkg.github.com/ --scope=@rtech-rqbbox-os
```

### Available Packages

| Package | Description | Install |
|---------|-------------|---------|
| `@rtech-rqbbox-os/rqbbox-os` | Root metapackage | `npm install @rtech-rqbbox-os/rqbbox-os` |
| `@rtech-rqbbox-os/rqbbox-server` | USB HTTP server | `npm install @rtech-rqbbox-os/rqbbox-server` |
| `@rtech-rqbbox-os/rqbbox-sdk` | Developer SDK docs | `npm install @rtech-rqbbox-os/rqbbox-sdk` |

Packages auto-publish on every GitHub Release via [GitHub Actions](.github/workflows/publish-packages.yml).

---

## 🔧 Plugin & Theme System

Plugins go in `Plugins/`, themes in `Themes/` on your USB. Each plugin needs a `plugin.json` manifest. See the [Plugin API docs](System/SDK/index.html) for details.

---

## 📄 License

MIT License

---

<p align="center">
  <a href="https://rtech-rqbbox-os.github.io/rqbbox-os/">Website</a> ·
  <a href="https://github.com/Rtech-Rqbbox-os/rqbbox-os">GitHub</a> ·
  <a href="https://github.com/Rtech-Rqbbox-os/rqbbox-os/packages">Packages</a> ·
  <a href="https://github.com/Rtech-Rqbbox-os/rqbbox-os/issues">Issues</a> ·
  <a href="https://github.com/Rtech-Rqbbox-os/rqbbox-os/discussions">Discussions</a> ·
  <a href="support.html">Support</a> ·
  <a href="https://www.youtube.com/@RQBBOX-REAL">YouTube</a>
</p>

<p align="center" style="color:#5a6a8a;font-size:0.8rem;">
  © 2026 RhysTech. RQBBOX® is a trademark of RhysTech. All rights reserved.
</p>
