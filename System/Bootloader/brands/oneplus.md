# OnePlus — RQBBOX Bootloader Guide

## Supported Devices
- OnePlus 1 through OnePlus 13
- OnePlus Nord series (Nord, Nord 2/3/4, Nord CE, Nord N series)
- OnePlus Open (Foldable)
- OnePlus Pad / Pad 2

## Boot Methods

### Method 1: Termux (Best)
1. Install Termux from F-Droid
2. `pkg update && pkg upgrade`
3. `pkg install nodejs git`
4. `git clone https://github.com/Rtech-Rqbbox-os/rqbbox-os.git`
5. `cd rqbbox-os && node System/Server/server.js`

### Method 2: OxygenOS Gaming Mode
1. Open **Game Space** (pre-installed)
2. Tap + to add RQBBOX shortcut
3. Enable "Pro Gaming Mode" for:
   - CPU boost
   - Touch optimization
   - Notification blocking
   - FPS stabilization
4. Launch RQBBOX from Game Space

### Method 3: Shelf + Widget
1. Open **OnePlus Shelf** (swipe down from top-right)
2. Tap "+" to add RQBBOX web shortcut
3. One-tap launch from any screen

## Performance Tips
- OnePlus 9+: Use "HyperBoost" GPU driver update in Developer settings
- OnePlus Open: Optimized dual-screen layout coming in RQBBOX v2.0
- OnePlus 13: Snapdragon 8 Elite 3D rendering support
- FNatic mode in Game Space locks CPU/GPU to max frequencies
