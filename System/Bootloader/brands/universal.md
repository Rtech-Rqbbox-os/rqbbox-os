# Generic / Other Android — RQBBOX Bootloader Guide

## Supported Brands
- **ASUS** — Zenfone, ROG Phone (see also: [OnePlus guide](oneplus.md))
- **OPPO** — Find, Reno, F series
- **Vivo** — X, V, Y, iQOO series
- **Huawei** — P series, Mate series (no Google Services)
- **Honor** — Magic, 50/60/70/80/90 series
- **Sony** — Xperia 1, 5, 10 series
- **Motorola** — Moto G, Edge, Razr
- **LG** — G series, V series, Wing (discontinued)
- **HTC** — U series, Desire (discontinued)
- **Realme** — GT, Number, C series
- **Nothing** — Phone (1), (2), (3)
- **Fairphone** — Fairphone 3+, 4, 5
- **Lenovo** — Legion Phone (gaming), Moto brand

## Boot Methods

### Universal: Termux (All Android)
1. Install [Termux](https://f-droid.org/repo/com.termux_118.apk) (DO NOT use Play Store version)
2. `pkg update && pkg upgrade`
3. `pkg install nodejs git`
4. `git clone https://github.com/Rtech-Rqbbox-os/rqbbox-os.git`
5. `cd rqbbox-os`
6. `node System/Server/server.js`
7. Open Chrome/Browser to `http://localhost:19777`

### Huawei / Honor (No Google Services)
1. Install Termux from [AppGallery](https://appgallery.huawei.com/) or Aurora Store
2. Use **Phone Clone** to transfer RQBBOX files
3. Run via Termux as above
4. Install PWA via Huawei Browser → "Add to home screen"

### ROG Phone / Legion Phone (Gaming Phones)
1. Open **Armoury Crate** (ASUS) or **Legion Realm** (Lenovo)
2. Add RQBBOX as a custom game shortcut
3. Enable X-Mode / Performance Mode for max FPS
4. Use AirTriggers (ROG) or shoulder buttons (Legion) as game controls

### Motorola Razr / Galaxy Z Flip (Foldables)
- Use cover screen for quick RQBBOX controls
- Flip open for full launcher experience
- Flex View / Cover Screen optimization coming soon

## General Performance Tips (All Brands)
- **Developer Options:**
  - Force 4x MSAA (better visuals)
  - Disable HW overlays (smoother UI)
  - Background process limit: 2 (more RAM for games)
- **Battery:**
  - Disable battery optimization for Termux
  - Set screen timeout to 30 min (gaming sessions)
- **Storage:**
  - Use SD card for game storage (if available)
  - Format as adopted storage for seamless integration
- **Root Users:**
  - Use `systemless` hosts for ad-blocking
  - Kernel adiutor: Set CPU governor to `performance` during gameplay
