# Microsoft / Nokia Lumia — RQBBOX Bootloader Guide

## Supported Devices
- Lumia 430, 435, 535, 540, 635, 640, 640 XL, 650, 730, 735, 830, 920, 925, 930, 950, 950 XL
- Microsoft Surface Duo (1 & 2)

## Boot Methods

### For Windows Phone (Lumia)

#### Method 1: Browser Access
- Windows Phone 8.1: Open Internet Explorer
- Windows 10 Mobile: Open Microsoft Edge
- Navigate to `http://<your-server-ip>:19777`
- Pin to Start for quick access

#### Method 2: Interop Unlock + Custom App (Advanced)
1. Install [Interop Tools](https://github.com/gus33000/InteropTools/releases)
2. Enable capabilities: `ID_CAP_INTEROPSERVICES`
3. Side-load the RQBBOX bridge app (coming soon)

### For Surface Duo (Android)

#### Method: Termux
- Follow the [Google Pixel guide](google.md) — same steps apply
- Dual-screen optimized view coming in RQBBOX v2.0

## Historical Devices
- Lumia running Windows RT? Use the [Nokia guide](nokia.md)
- Nokia N-series / E-series? Use the [Nokia guide](nokia.md)

## Limitations
- Windows Phone 8.x: No Node.js runtime — must run server on another device
- Windows 10 Mobile: Limited app sandbox — use browser mode
- No camera passthrough for game capture
