# Nokia — RQBBOX Bootloader Guide

## Supported Devices

### Feature Phones (S30+ / S40+)
- Nokia 105 (2017+), 106, 110, 125, 130, 150, 210, 215, 220, 225, 230, 3310 (2017), 8110 (4G), 2720 Flip

### Smart Feature Phones (KaiOS)
- Nokia 800 Tough, 8110 4G, 2720 Flip

### Historical (Symbian / Maemo / Meego)
- Nokia N95, N97, N8, E71, E72, 5800 XpressMusic, N900 (Maemo), N9 (MeeGo)

## Boot Methods

### For KaiOS Devices (800 Tough, 8110, 2720)

#### Method 1: Web App (Supported)
1. Open **Browser** app on your Nokia
2. Navigate to `http://<server-ip>:19777`
3. Bookmark as favorite for quick access
4. Works on KaiOS 2.5.1+

#### Method 2: KaiOS + WebIDE (Advanced)
1. Enable Developer Mode: `*#*#33284#*#*`
2. Connect via WebIDE
3. Side-load RQBBOX Web IDE package (coming soon)

### For S30+ / Feature Phones
**Not supported** — these phones run Java ME / proprietary RTOS.
Run RQBBOX on another device and use the Nokia as a controller via Bluetooth.

### For Symbian / Maemo / MeeGo
**Not supported** — these platforms are discontinued.
For historical interest only. Run RQBBOX on a modern device.

## Using Nokia as a Game Controller
- KaiOS devices: Bluetooth HID gamepad mode coming soon
- Feature phones: Use `System/Tools/nokia-controller/`
  - Connects via Bluetooth serial
  - Maps keypad to game inputs (2/4/6/8 = direction, 5 = action)
