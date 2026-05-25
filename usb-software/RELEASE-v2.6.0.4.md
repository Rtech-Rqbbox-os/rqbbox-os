# 🎮 RQBBOX OS v2.6.0.4 — Official Release

<p align="center">
  <img src="https://media.base44.com/images/public/6a0d64e743c742005c890c76/16da7f339_generated_image.png" width="100" alt="RQBBOX OS v2.6.0.4 Logo"/>
</p>

<p align="center">
  <img src="https://media.base44.com/images/public/6a0d64e743c742005c890c76/dbaa9145d_generated_image.png" width="700" alt="RQBBOX OS v2.6.0.4 Banner"/>
</p>

<p align="center">
  <img src="https://media.base44.com/images/public/6a0d64e743c742005c890c76/af81b0c7e_generated_image.png" width="300" alt="RQBBOX OS USB"/>
</p>

<p align="center">
  <strong>v2.6.0.4 · Official Release · 21 May 2026</strong><br/>
  Plug In. Play Anywhere. No bootable USB required.
</p>

<p align="center">
  <a href="https://github.com/Rtech-Rqbbox-os/rqbbox-os">
    <img src="https://img.shields.io/badge/GitHub-Repository-00f5ff?style=for-the-badge&logo=github&logoColor=black"/>
  </a>
  <a href="https://inquisitive-rqbbox-core-play.base44.app">
    <img src="https://img.shields.io/badge/▶%20RQBBOX%20App-9b30ff?style=for-the-badge&logo=google-chrome&logoColor=white"/>
  </a>
</p>

---

## 🆕 What's New in v2.6.0.4

| # | Change | Type |
|---|--------|------|
| 1 | New full OS desktop shell (`os-shell-v2.html`) | ✨ Feature |
| 2 | EZ Install scripts — no bootable USB needed | ✨ Feature |
| 3 | Updated boot sequence with v2.6.0.4 branding | ✨ Feature |
| 4 | New logo, banner & USB product imagery | 🎨 Design |
| 5 | About app with full build info | ✨ Feature |
| 6 | Notification system (tray bell) | ✨ Feature |
| 7 | Terminal updated — added `ls` command | 🔧 Improvement |
| 8 | Settings — added Auto-Update toggle | 🔧 Improvement |
| 9 | Flash USB scripts updated for all 5 platforms | 🔧 Improvement |
| 10| OS vs App architecture fully separated | 🏗️ Architecture |

---

## 🚀 EZ Install — No Bootable USB Needed

### Windows
```powershell
# Right-click → Run with PowerShell
# OR:
powershell -ExecutionPolicy Bypass -File scripts\ez-install.ps1
```

### macOS / Linux
```bash
chmod +x scripts/ez-install.sh
./scripts/ez-install.sh
```

The EZ installer will:
- ✅ Check for Node.js (install if missing)
- ✅ Copy RQBBOX OS to your local machine
- ✅ Install Electron dependencies
- ✅ Create a Desktop + Start Menu shortcut
- ✅ Offer to launch immediately

---

## 💾 Flash USB

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

## 🖥️ OS Features

| Feature | v1.x | v2.6.0.4 |
|---------|------|----------|
| Boot screen | ✅ | ✅ Enhanced |
| Desktop + window manager | ✅ | ✅ |
| Taskbar + Start menu | ✅ | ✅ |
| RQBBOX App browser | ✅ | ✅ |
| Terminal | ✅ | ✅ + `ls` |
| File manager | ✅ | ✅ |
| System info | ✅ | ✅ |
| Settings | ✅ | ✅ + Auto-Update |
| About app | ❌ | ✅ New |
| Notification tray | ❌ | ✅ New |
| EZ Installer | ❌ | ✅ New |
| Version branding | v1.0.0 | **v2.6.0.4** |

---

## 🌐 RQBBOX App (Mobile & Browser)

**[https://inquisitive-rqbbox-core-play.base44.app](https://inquisitive-rqbbox-core-play.base44.app)**

For Android, iOS, and any browser — no install needed.

---

## 📁 New Files in v2.6.0.4

```
usb-software/
├── core/
│   ├── os-shell-v2.html          ← NEW: Full OS v2.6.0.4 desktop
│   └── index-v2.html             ← NEW: Mobile/browser splash v2
├── launcher/
│   └── windows/
│       └── RQBBOXLauncher-v2.js  ← NEW: v2.6.0.4 Windows launcher
├── scripts/
│   ├── ez-install.sh             ← NEW: EZ Install (macOS/Linux)
│   └── ez-install.ps1            ← NEW: EZ Install (Windows)
└── RELEASE-v2.6.0.4.md           ← This file
```

---

<p align="center">
  <img src="https://media.base44.com/images/public/6a0d64e743c742005c890c76/16da7f339_generated_image.png" width="50"/>
  <br/>
  <sub>RQBBOX OS v2.6.0.4 · RTech · GOTECH AI · 21 May 2026</sub>
</p>
