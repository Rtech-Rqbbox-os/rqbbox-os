# =============================================================
# RQBBOX OS v2.6.0.4 — QCOW2 + EZ Install (Windows)
# =============================================================
# Installs RQBBOX OS AND sets up the QCOW2 virtual machine.
# No bootable USB required.
#
# Usage:
#   Right-click → Run with PowerShell
#   OR: powershell -ExecutionPolicy Bypass -File ez-install-qcow2.ps1
#
# RTech — GOTECH AI
# =============================================================

$Version    = "2.6.0.4"
$AppUrl     = "https://inquisitive-rqbbox-core-play.base44.app"
$GitHub     = "https://github.com/Rtech-Rqbbox-os/rqbbox-os"
$InstallDir = "$env:LOCALAPPDATA\RQBBOX-OS"
$QcowName   = "RQBBOX-OS-v$Version.qcow2"
$ScriptDir  = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir    = Split-Path -Parent $ScriptDir

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   RQBBOX OS v$Version — QCOW2 + EZ Installer      ║" -ForegroundColor Cyan
Write-Host "║   RTech · GOTECH AI                                ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Installs RQBBOX OS + QCOW2 virtual machine." -ForegroundColor Green
Write-Host "  No bootable USB required." -ForegroundColor Green
Write-Host ""

# ── Check / Install QEMU ──
Write-Host "🔍 Checking for QEMU..." -ForegroundColor Yellow
$QemuBin = ""
$qemuPaths = @(
    "C:\Program Files\qemu\qemu-system-x86_64.exe",
    "C:\Program Files (x86)\qemu\qemu-system-x86_64.exe",
    "$env:LOCALAPPDATA\Programs\qemu\qemu-system-x86_64.exe"
)
foreach ($p in $qemuPaths) {
    if (Test-Path $p) { $QemuBin = $p; break }
}
if (-not $QemuBin) {
    $qemuCheck = Get-Command qemu-system-x86_64 -ErrorAction SilentlyContinue
    if ($qemuCheck) { $QemuBin = $qemuCheck.Source }
}

if (-not $QemuBin) {
    Write-Host "📦  QEMU not found." -ForegroundColor Yellow
    Write-Host "    Checking for Chocolatey..." -ForegroundColor Gray
    $chocoCheck = Get-Command choco -ErrorAction SilentlyContinue
    if ($chocoCheck) {
        Write-Host "    Installing QEMU via Chocolatey..." -ForegroundColor Yellow
        choco install qemu -y
        $QemuBin = "qemu-system-x86_64"
    } else {
        Write-Host "    → Download QEMU from https://www.qemu.org/download/#windows" -ForegroundColor Yellow
        $open = Read-Host "    Open qemu.org now? [Y/n]"
        if ($open -ne 'n') { Start-Process "https://www.qemu.org/download/#windows" }
        Write-Host "    Re-run this script after installing QEMU." -ForegroundColor Yellow
        # Continue without QEMU — Electron shell still works
        $QemuBin = "qemu-system-x86_64"
    }
} else {
    Write-Host "  ✓ QEMU: $QemuBin" -ForegroundColor Green
}

# ── Check Node.js ──
Write-Host ""
Write-Host "🔍 Checking for Node.js..." -ForegroundColor Yellow
$nodeCheck = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCheck) {
    Write-Host "📦  Node.js not found — download from https://nodejs.org" -ForegroundColor Yellow
    $open = Read-Host "    Open nodejs.org? [Y/n]"
    if ($open -ne 'n') { Start-Process "https://nodejs.org" }
    exit 1
}
Write-Host "  ✓ Node.js $(node -v)" -ForegroundColor Green

# ── Create directories ──
Write-Host ""
Write-Host "📁  Installing to: $InstallDir" -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null
New-Item -ItemType Directory -Force -Path "$InstallDir\qcow2" | Out-Null

# ── Copy OS files ──
Write-Host "🚀  Copying RQBBOX OS files..."
foreach ($d in @("core","assets")) {
    if (Test-Path "$RootDir\$d") {
        Copy-Item -Path "$RootDir\$d" -Destination "$InstallDir\$d" -Recurse -Force
        Write-Host "    ✓ $d" -ForegroundColor Green
    }
}

# ── Copy / locate QCOW2 ──
Write-Host ""
Write-Host "💾  Setting up QCOW2 virtual disk..." -ForegroundColor Yellow
$qcowSrc = $null
$searchPaths = @(
    "$RootDir\..\limbo-rqbbox\$QcowName",
    "$RootDir\qcow2\$QcowName",
    "$ScriptDir\..\limbo-rqbbox\$QcowName",
    "$(Get-Location)\$QcowName"
)
foreach ($p in $searchPaths) {
    if (Test-Path $p) { $qcowSrc = $p; break }
}

if ($qcowSrc) {
    Copy-Item -Path $qcowSrc -Destination "$InstallDir\qcow2\$QcowName" -Force
    Write-Host "  ✓ QCOW2 copied" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  QCOW2 not found locally — downloading from GitHub..." -ForegroundColor Yellow
    try {
        $dlUrl = "https://github.com/Rtech-Rqbbox-os/rqbbox-os/raw/main/limbo-rqbbox/$QcowName"
        Invoke-WebRequest -Uri $dlUrl -OutFile "$InstallDir\qcow2\$QcowName" -UseBasicParsing
        Write-Host "  ✓ QCOW2 downloaded" -ForegroundColor Green
    } catch {
        Write-Host "  → Place $QcowName in $InstallDir\qcow2\ manually." -ForegroundColor Yellow
    }
}

# ── Install Electron launcher ──
Write-Host ""
Write-Host "📦  Installing Electron launcher..." -ForegroundColor Yellow
$launcherSrc = "$RootDir\launcher\windows"
if (Test-Path $launcherSrc) {
    Copy-Item -Path $launcherSrc -Destination "$InstallDir\launcher" -Recurse -Force
}
Push-Location "$InstallDir\launcher"
npm install --silent
Pop-Location

# ── Write version + config ──
Set-Content -Path "$InstallDir\VERSION" -Value $Version
Set-Content -Path "$InstallDir\APP_URL.txt" -Value $AppUrl

$cfg = @{
    version    = $Version
    qemu_bin   = $QemuBin
    qcow2      = $QcowName
    cpu        = "coreduo"
    ram_mb     = 512
    vga        = "std"
    network    = "user"
    app_url    = $AppUrl
} | ConvertTo-Json
Set-Content -Path "$InstallDir\qcow2\limbo-config.json" -Value $cfg

# ── Launch scripts ──
$launchBat = "@echo off`ncd /d `"$InstallDir\launcher`"`nnpx electron ."
Set-Content -Path "$InstallDir\Launch RQBBOX OS.bat" -Value $launchBat

$qcowBat = @"
@echo off
echo Starting RQBBOX OS v$Version (QCOW2 VM)...
"$QemuBin" ^
  -name "RQBBOX OS v$Version" ^
  -machine pc ^
  -cpu coreduo ^
  -m 512 ^
  -hda "$InstallDir\qcow2\$QcowName" ^
  -vga std ^
  -netdev user,id=n0 -device e1000,netdev=n0 ^
  -boot c ^
  -full-screen
"@
Set-Content -Path "$InstallDir\Launch RQBBOX OS (QCOW2).bat" -Value $qcowBat

# ── Shortcuts ──
$WshShell = New-Object -ComObject WScript.Shell

# Desktop — Electron shell
$s1 = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\RQBBOX OS.lnk")
$s1.TargetPath = "$InstallDir\Launch RQBBOX OS.bat"
$s1.Description = "RQBBOX OS v$Version — Desktop Shell"
$s1.Save()

# Desktop — QCOW2 VM
$s2 = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\RQBBOX OS (QCOW2 VM).lnk")
$s2.TargetPath = "$InstallDir\Launch RQBBOX OS (QCOW2).bat"
$s2.Description = "RQBBOX OS v$Version — QCOW2 Virtual Machine"
$s2.Save()

# Start Menu
$sm = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs"
$s3 = $WshShell.CreateShortcut("$sm\RQBBOX OS.lnk")
$s3.TargetPath = "$InstallDir\Launch RQBBOX OS.bat"
$s3.Save()
$s4 = $WshShell.CreateShortcut("$sm\RQBBOX OS (QCOW2 VM).lnk")
$s4.TargetPath = "$InstallDir\Launch RQBBOX OS (QCOW2).bat"
$s4.Save()
Write-Host "  ✓ Desktop + Start Menu shortcuts created (Shell + QCOW2)" -ForegroundColor Green

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  ✅  RQBBOX OS v$Version installed!               ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "  📍 Location   : $InstallDir"        -ForegroundColor Cyan
Write-Host "  💾 QCOW2      : $InstallDir\qcow2\$QcowName" -ForegroundColor Cyan
Write-Host "  🌐 App URL    : $AppUrl"             -ForegroundColor Cyan
Write-Host "  🔗 GitHub     : $GitHub"             -ForegroundColor Cyan
Write-Host ""
Write-Host "  ▶  Desktop shortcut    → 'RQBBOX OS' on your Desktop"           -ForegroundColor White
Write-Host "  ▶  QCOW2 VM shortcut   → 'RQBBOX OS (QCOW2 VM)' on Desktop"    -ForegroundColor White
Write-Host ""

$choice = Read-Host "  Launch now? [1] Desktop Shell  [2] QCOW2 VM  [N] Skip"
switch ($choice) {
    "1" { Write-Host ""; Write-Host "🚀 Launching..." -ForegroundColor Cyan; Start-Process "$InstallDir\Launch RQBBOX OS.bat" }
    "2" { Write-Host ""; Write-Host "🚀 Launching QCOW2 VM..." -ForegroundColor Cyan; Start-Process "$InstallDir\Launch RQBBOX OS (QCOW2).bat" }
    default { Write-Host "  Skipping launch." }
}
