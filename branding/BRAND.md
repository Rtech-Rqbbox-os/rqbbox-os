# RQBBOX OS — Brand Guide

A reference for colors, typography, logos, and visual identity.

---

## Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| **Deep Black** | `#0a0a0a` | Primary background |
| **Dark Void** | `#0d0d1a` | Secondary background, cards |
| **Deep Purple** | `#1a0a2e` | Gradient backgrounds |
| **Neon Cyan** | `#00f5ff` | Primary accent, glows, CTAs |
| **Electric Purple** | `#9b30ff` | Secondary accent, gradients |
| **Soft Cyan** | `#7efcff` | Hover states, highlights |
| **Pure White** | `#ffffff` | Primary text |
| **Muted Grey** | `#888888` | Secondary text, captions |
| **Alert Red** | `#ff4444` | Errors, offline indicators |

### Gradient
```css
/* Primary brand gradient */
background: linear-gradient(135deg, #00f5ff 0%, #9b30ff 100%);

/* Background gradient */
background: linear-gradient(180deg, #0a0a0a 0%, #1a0a2e 100%);
```

---

## Typography

| Role | Font | Weight | Size |
|------|------|--------|------|
| Heading | `'Rajdhani', sans-serif` | 700 | 2–4rem |
| Subheading | `'Rajdhani', sans-serif` | 600 | 1.25–2rem |
| Body | `'Inter', sans-serif` | 400 | 1rem |
| UI Labels | `'Inter', sans-serif` | 500 | 0.875rem |
| Code | `'JetBrains Mono', monospace` | 400 | 0.875rem |

---

## Logo

| File | Usage |
|------|-------|
| `assets/logo.png` | Full logo — website, docs, splash |
| `assets/app-icon.png` | App icon — stores, taskbars |
| `assets/hero-banner.png` | Hero sections, README |
| `assets/splash-screen.png` | App loading screen |

### Clear Space
Always maintain a minimum clear space of **1× the logo height** around the logo.

### Don'ts
- ❌ Don't place on light backgrounds
- ❌ Don't stretch or distort
- ❌ Don't change colors
- ❌ Don't add drop shadows to the logo itself

---

## UI Components

### Buttons
```css
/* Primary */
background: linear-gradient(135deg, #00f5ff, #9b30ff);
color: #0a0a0a;
border-radius: 8px;
font-weight: 600;

/* Secondary */
background: transparent;
border: 1px solid #00f5ff;
color: #00f5ff;
border-radius: 8px;
```

### Cards
```css
background: #0d0d1a;
border: 1px solid rgba(0, 245, 255, 0.15);
border-radius: 12px;
box-shadow: 0 0 20px rgba(0, 245, 255, 0.05);
```

### Glow Effect
```css
box-shadow: 0 0 20px rgba(0, 245, 255, 0.3),
            0 0 40px rgba(155, 48, 255, 0.2);
```

---

## Platform Icon Sizes

| Platform | Size |
|----------|------|
| Android launcher | 192×192 |
| iOS App Store | 1024×1024 |
| Windows taskbar | 256×256 |
| macOS Dock | 512×512 |
| Linux desktop | 256×256 |
| PWA maskable | 512×512 |
| Snap Store | 256×256 |
| Flatpak | 256×256 |
