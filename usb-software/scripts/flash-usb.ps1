# =============================================================
# RQBBOX OS USB Flash Script — Windows PowerShell
# =============================================================
# Copies RQBBOX OS USB software onto a USB drive
#
# Usage:
#   .\flash-usb.ps1 -UsbPath "E:\"
#   .\flash-usb.ps1 -UsbPath "D:\" -Force
#
# App URL: https://inquisitive-rqbbox-core-play.base44.app
# GitHub:  https://github.com/Rtech-Rqbbox-os/rqbbox-os
# RTech    — GOTECH AI
# =============================================================

param(
    [Parameter(Mandatory=$true)]
    [string]$UsbPath,

    [switch]$Force
)

$Version   = "1.0.0"
$AppUrl    = "https://inquisitive-rqbbox-core-play.base44.app"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir   = Split-Path -Parent $ScriptDir

Write-Host ""
Write-Host "╔══════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║        RQBBOX OS USB Flash Tool              ║" -ForegroundColor Cyan
Write-Host "║        v$Version — RTech · GOTECH AI          ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ── Validate USB path ──
if (-not (Test-Path $UsbPath)) {
    Write-Host "❌  USB path '$UsbPath' not found." -ForegroundColor Red
    Write-Host "    Insert your USB drive and try again."
    exit 1
}

# ── Check free space ──
$drive = Split-Path -Qualifier $UsbPath
$disk  = Get-PSDrive -Name ($drive.TrimEnd(':')) -ErrorAction SilentlyContinue
if ($disk -and $disk.Free -lt 100MB) {
    Write-Host "⚠️  Warning: Less than 100MB free on USB drive." -ForegroundColor Yellow
}

Write-Host "📋  Flashing RQBBOX OS v$Version to: $UsbPath" -ForegroundColor Yellow
Write-Host ""

# ── Create folder structure ──
Write-Host "📁  Creating folder structure..."
$dirs = @(
    "$UsbPath\RQBBOX-OS\launcher\windows",
    "$UsbPath\RQBBOX-OS\launcher\macos",
    "$UsbPath\RQBBOX-OS\launcher\linux",
    "$UsbPath\RQBBOX-OS\launcher\android",
    "$UsbPath\RQBBOX-OS\launcher\ios",
    "$UsbPath\RQBBOX-OS\assets",
    "$UsbPath\RQBBOX-OS\core",
    "$UsbPath\RQBBOX-OS\scripts"
)
foreach ($dir in $dirs) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

# ── Copy launcher files ──
Write-Host "🚀  Copying launcher files..."
$platforms = @("windows", "macos", "linux", "android", "ios")
foreach ($platform in $platforms) {
    $src = "$RootDir\launcher\$platform"
    if (Test-Path $src) {
        Copy-Item -Path "$src\*" -Destination "$UsbPath\RQBBOX-OS\launcher\$platform\" -Recurse -Force
        Write-Host "    ✓ $platform" -ForegroundColor Green
    }
}

# ── Copy core splash ──
Write-Host "📦  Copying core files..."
if (Test-Path "$RootDir\core") {
    Copy-Item -Path "$RootDir\core\*" -Destination "$UsbPath\RQBBOX-OS\core\" -Recurse -Force
    Write-Host "    ✓ core" -ForegroundColor Green
}

# ── Copy autorun config ──
if (Test-Path "$RootDir\autorun\autorun-config.json") {
    Copy-Item "$RootDir\autorun\autorun-config.json" "$UsbPath\RQBBOX-OS\" -Force
    Write-Host "    ✓ autorun-config.json" -ForegroundColor Green
}

# ── Copy scripts ──
Copy-Item -Path "$ScriptDir\flash-usb.ps1" -Destination "$UsbPath\RQBBOX-OS\scripts\" -Force -ErrorAction SilentlyContinue
Copy-Item -Path "$ScriptDir\flash-usb.sh"  -Destination "$UsbPath\RQBBOX-OS\scripts\" -Force -ErrorAction SilentlyContinue

# ── Write version + app URL ──
Set-Content -Path "$UsbPath\RQBBOX-OS\VERSION"     -Value $Version
Set-Content -Path "$UsbPath\RQBBOX-OS\APP_URL.txt" -Value $AppUrl

# ── Create Windows .url shortcut ──
$shortcutContent = "[InternetShortcut]`r`nURL=$AppUrl`r`nIconFile=shell32.dll`r`nIconIndex=14"
Set-Content -Path "$UsbPath\RQBBOX-OS\Launch RQBBOX OS.url" -Value $shortcutContent
Write-Host "    ✓ Launch RQBBOX OS.url (shortcut)" -ForegroundColor Green

Write-Host ""
Write-Host "✅  RQBBOX OS v$Version successfully flashed!" -ForegroundColor Green
Write-Host "📍  Location : $UsbPath\RQBBOX-OS" -ForegroundColor Green
Write-Host "🌐  App URL  : $AppUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎮  Plug into any device and run the launcher for your platform:" -ForegroundColor Cyan
Write-Host "    Windows → launcher\windows\RQBBOXLauncher.exe"
Write-Host "    macOS   → launcher\macos\RQBBOXLauncher.app"
Write-Host "    Linux   → launcher\linux\RQBBOXLauncher.AppImage"
Write-Host "    Android → launcher\android\  (sideload APK)"
Write-Host "    iOS     → launcher\ios\       (sideload IPA)"
Write-Host "    Browser → open APP_URL.txt in any browser"
Write-Host ""
