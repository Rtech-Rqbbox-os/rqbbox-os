# 🚀 Getting Started — RQBBOX OS v2.6.0.4

<p align="center">
  <img src="https://media.base44.com/images/public/6a0d64e743c742005c890c76/16da7f339_generated_image.png" width="80"/>
</p>

Get RQBBOX OS v2.6.0.4 running in under 2 minutes. No bootable USB required.

---

## Option 1 — EZ Install (Fastest)

### Windows
```powershell
powershell -ExecutionPolicy Bypass -File usb-software\scripts\ez-install-qcow2.ps1
```
- Installs RQBBOX OS desktop shell
- Installs QCOW2 virtual machine (QEMU)
- Creates Desktop + Start Menu shortcuts for both modes
- Asks to launch at the end

### macOS / Linux
```bash
chmod +x usb-software/scripts/ez-install-qcow2.sh
./usb-software/scripts/ez-install-qcow2.sh
```
- Auto-installs Node.js + QEMU if missing
- Creates `.command` / `.desktop` shortcuts

---

## Option 2 — QCOW2 Virtual Machine

Run RQBBOX OS as a full VM on any device.

### Desktop (QEMU)
```bash
qemu-system-x86_64 \
  -m 512 \
  -hda limbo-rqbbox/RQBBOX-OS-v2.6.0.4.qcow2 \
  -vga std \
  -netdev user,id=n0 -device e1000,netdev=n0 \
  -boot c -full-screen
```

### Android (Limbo PC)
1. Install **Limbo PC Emulator** from Google Play
2. Copy `RQBBOX-OS-v2.6.0.4.qcow2` to `/sdcard/limbo/`
3. Configure: CPU=Core Duo, RAM=512MB, HDD=qcow2, Network=User
4. Tap ▶ Start

### VirtualBox
1. New VM → Other/Unknown (32-bit)
2. RAM: 512MB
3. Use existing disk → select `RQBBOX-OS-v2.6.0.4.qcow2`
4. Start

---

## Option 3 — Flash USB

```powershell
# Windows
.\usb-software\scripts\flash-usb.ps1 -UsbPath "E:\"
```
```bash
# macOS / Linux
./usb-software/scripts/flash-usb.sh /Volumes/RQBBOX
```
Plug into any laptop/PC/TV and it launches automatically.

---

## Option 4 — Package Managers

```bash
brew install --cask rqbbox-os          # macOS (Homebrew)
winget install RTech.RQBBOXos          # Windows
choco install rqbbox-os                # Windows (Chocolatey)
sudo snap install rqbbox-os            # Linux
flatpak install flathub com.rtech.RQBBOXos  # Linux
```

---

## Option 5 — Browser / Mobile (No Install)

Open directly in any browser or mobile device:

**[https://inquisitive-rqbbox-core-play.base44.app](https://inquisitive-rqbbox-core-play.base44.app)**

---

## What Happens When You Launch

1. Boot screen animates through v2.6.0.4 startup sequence
2. Desktop loads with icon grid + taskbar + clock
3. Double-click any app to open it in a draggable window
4. RQBBOX App opens the live Base44 app in-OS
5. Terminal, File Manager, System Info, Settings all work

---

> RQBBOX OS v2.6.0.4 · RTech · GOTECH AI
