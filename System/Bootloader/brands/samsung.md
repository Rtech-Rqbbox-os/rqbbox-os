# Samsung — RQBBOX Bootloader Guide

## Supported Devices
- Galaxy S2 through S25 Ultra
- Galaxy Note 1 through Note 20
- Galaxy A, M, F series
- Galaxy Z Fold/Fold 2/3/4/5/6
- Galaxy Z Flip/Flip 3/4/5/6
- Galaxy Tab series (all models)
- Galaxy S series (S2–S25)

## Boot Methods

### Method 1: Good Lock + Termux (Best Experience)
1. Install [Good Lock](https://galaxystore.samsung.com/detail/com.samsung.android.goodlock) from Galaxy Store
2. Install **Sound Assistant** → Set individual app volume
3. Install **Game Booster Plus**  
4. Install **MultiStar** → Enable "Multi focus" for split-screen
5. Install Termux from F-Droid
6. `pkg install nodejs` then `node System/Server/server.js`

### Method 2: Samsung DeX (Desktop Mode)
1. Connect phone to monitor/TV via USB-C or Smart View
2. DeX launches automatically
3. Open Chrome in DeX mode
4. Navigate to `http://localhost:19777`
5. Full desktop RQBBOX experience on your TV/monitor

### Method 3: Samsung Internet PWA
1. Open Samsung Internet Browser
2. Navigate to `http://<server-ip>:19777`
3. Tap menu → "Add page to" → "Home screen"
4. Launches like a native app with edge panel support

## Performance Tips
- Game Booster: Add RQBBOX to Game Launcher
- Enable "Alternative game performance" in Game Booster settings
- Samsung Galaxy S22+: Enable "Light performance profile" for sustained gaming
- Galaxy Z Fold: Use Flex mode for bottom-screen controls
- Exynos models: Higher CPU governor in Game Booster settings
- Snapdragon models: Enable Ray Tracing support if available
