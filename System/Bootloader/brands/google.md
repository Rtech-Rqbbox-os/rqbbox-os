# Google Pixel — RQBBOX Bootloader Guide

## Supported Devices
- Pixel 2/2 XL through Pixel 9/9 Pro/9 Pro XL
- Pixel Tablet
- Pixel Fold

## Boot Methods

### Method 1: Termux (Recommended)
1. Install [Termux](https://f-droid.org/repo/com.termux_118.apk) from F-Droid
2. `pkg update && pkg upgrade`
3. `pkg install nodejs git`
4. `git clone https://github.com/Rtech-Rqbbox-os/rqbbox-os.git`
5. `cd rqbbox-os`
6. `node System/Server/server.js`
7. Open `http://localhost:19777` in Chrome

### Method 2: Termux Boot (Auto-start)
1. Install `Termux:Boot` from F-Droid
2. `mkdir -p ~/.termux/boot`
3. Create `~/.termux/boot/rqbbox.sh`:
```
#!/data/data/com.termux/files/usr/bin/sh
termux-wake-lock
cd ~/rqbbox-os
node System/Server/server.js
```

### Method 3: Chrome PWA
1. Open `http://<your-server>:19777` in Chrome
2. Tap menu → "Add to Home screen"
3. Launches like a native app

## Performance Tips
- Enable Developer Options → Force GPU rendering
- Disable battery optimization for Termux
- Use a USB-C OTG for external storage
- For Pixel 6+: Enable "Performance mode" in game dashboard
