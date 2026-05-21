# 🤝 Contributing — RQBBOX OS v2.6.0.4

Thanks for contributing to RQBBOX OS!

---

## How to Contribute

1. Fork the repo
2. Create a branch: `git checkout -b feat/your-feature`
3. Make changes
4. Test locally: `open usb-software/core/os-shell-v2.html`
5. Push + open a Pull Request

---

## Key Files to Know

| File | What it does |
|------|-------------|
| `usb-software/core/os-shell-v2.html` | Full OS desktop shell |
| `usb-software/scripts/ez-install-qcow2.ps1` | Windows EZ + QCOW2 installer |
| `usb-software/scripts/ez-install-qcow2.sh` | macOS/Linux EZ + QCOW2 installer |
| `limbo-rqbbox/RQBBOX-OS-v2.6.0.4.qcow2` | Virtual disk image |
| `launchers/windows/main.js` | Windows Electron launcher |

---

## Style Guide

- Neon Cyan `#00f5ff` + Electric Purple `#9b30ff` on Deep Black `#0a0a0a`
- Font: Segoe UI / Inter / Arial
- All new features must work in: Chrome, Firefox, Electron, Limbo PC

---

## Testing

```bash
# Test OS shell in browser
open usb-software/core/os-shell-v2.html

# Test EZ installer (macOS/Linux)
./usb-software/scripts/ez-install-qcow2.sh

# Test QCOW2 image
qemu-system-x86_64 -m 512 -hda limbo-rqbbox/RQBBOX-OS-v2.6.0.4.qcow2 -vga std -net user -net nic -boot c
```

> RQBBOX OS v2.6.0.4 · RTech · GOTECH AI
