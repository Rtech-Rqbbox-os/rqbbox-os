# 💾 RQBBOX OS USB Software

> **Plug In. Play Anywhere.**
> No booting. No installs. Just plug in your RQBBOX USB and your gaming system is instantly ready.

---

## 🔌 Compatible Devices

| Device | Connection | Status |
|--------|------------|--------|
| 💻 Laptop | USB-A / USB-C | ✅ Supported |
| 📺 Smart TV | USB-A | ✅ Supported |
| 🖥️ PC / Desktop | USB-A / USB-C | ✅ Supported |
| 📱 Android Mobile | USB-C OTG | ✅ Supported |
| 📱 iPhone / iPad | USB-C / Lightning | ✅ Supported |

---

## 📁 Folder Structure

```
usb-software/
├── autorun/
│   └── autorun-config.json     # USB autolaunch config
├── core/
│   └── index.html              # Splash screen + app redirect
├── launcher/
│   ├── windows/                # Electron launcher (Windows)
│   │   ├── RQBBOXLauncher.js
│   │   ├── preload.js
│   │   └── package.json
│   ├── macos/                  # Electron launcher (macOS)
│   │   ├── RQBBOXLauncher.js
│   │   ├── preload.js
│   │   └── package.json
│   ├── linux/                  # Electron launcher (Linux)
│   │   ├── RQBBOXLauncher.js
│   │   ├── preload.js
│   │   └── package.json
│   ├── android/
│   │   └── MainActivity.java   # Android USB OTG launcher
│   └── ios/
│       └── RQBBOXUSBLauncher.swift  # iOS launcher
├── scripts/
│   ├── flash-usb.sh            # Flash script (macOS/Linux)
│   └── flash-usb.ps1           # Flash script (Windows)
└── docs/
    └── README.md               # This file
```

---

## 🚀 How to Flash Your USB

### Windows
```powershell
.\scripts\flash-usb.ps1 -UsbPath "E:\"
```

### macOS / Linux
```bash
chmod +x scripts/flash-usb.sh
./scripts/flash-usb.sh /Volumes/RQBBOX
```

---

## 🎮 How It Works

1. **Plug** the RQBBOX USB into any compatible device
2. **Open** the RQBBOX-OS folder on the USB
3. **Run** the launcher for your platform (Windows/macOS/Linux) or open `core/index.html` in a browser
4. **RQBBOX OS launches instantly** — no install, no boot, no setup

---

## 🛠️ Building the Launchers

```bash
# Windows
cd launcher/windows && npm install && npm run build

# macOS
cd launcher/macos && npm install && npm run build

# Linux
cd launcher/linux && npm install && npm run build
```

---

*RQBBOX OS USB — Powered by RTech & GOTECH AI*
