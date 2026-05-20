# =============================================================
# RQBBOX OS USB Flash Script — Windows PowerShell
# Copies RQBBOX OS software onto a USB drive
# Usage: .\flash-usb.ps1 -UsbPath "E:\"
# =============================================================

param(
    [Parameter(Mandatory=$true)]
    [string]$UsbPath
)

$Version = "1.0.0"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir = Split-Path -Parent $ScriptDir

Write-Host ""
Write-Host "╔══════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║       RQBBOX OS USB Flash Tool       ║" -ForegroundColor Cyan
Write-Host "║         v$Version — RTech Team          ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $UsbPath)) {
    Write-Host "❌ Error: USB path '$UsbPath' not found." -ForegroundColor Red
    Write-Host "Please insert your USB drive and try again."
    exit 1
}

Write-Host "📋 Flashing RQBBOX OS to: $UsbPath" -ForegroundColor Yellow
Write-Host ""

# Create folder structure
Write-Host "📁 Creating folder structure..."
$dirs = @(
    "$UsbPath\RQBBOX-OS\launcher\windows",
    "$UsbPath\RQBBOX-OS\launcher\macos",
    "$UsbPath\RQBBOX-OS\launcher\linux",
    "$UsbPath\RQBBOX-OS\assets",
    "$UsbPath\RQBBOX-OS\core"
)
foreach ($dir in $dirs) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

# Copy launcher files
Write-Host "🚀 Copying launcher files..."
if (Test-Path "$RootDir\launcher\windows") {
    Copy-Item -Path "$RootDir\launcher\windows\*" -Destination "$UsbPath\RQBBOX-OS\launcher\windows\" -Recurse -Force
}
if (Test-Path "$RootDir\launcher\macos") {
    Copy-Item -Path "$RootDir\launcher\macos\*" -Destination "$UsbPath\RQBBOX-OS\launcher\macos\" -Recurse -Force
}
if (Test-Path "$RootDir\launcher\linux") {
    Copy-Item -Path "$RootDir\launcher\linux\*" -Destination "$UsbPath\RQBBOX-OS\launcher\linux\" -Recurse -Force
}

# Copy core
Write-Host "📦 Copying core files..."
if (Test-Path "$RootDir\core") {
    Copy-Item -Path "$RootDir\core\*" -Destination "$UsbPath\RQBBOX-OS\core\" -Recurse -Force
}

# Copy config
if (Test-Path "$RootDir\autorun\autorun-config.json") {
    Copy-Item "$RootDir\autorun\autorun-config.json" "$UsbPath\RQBBOX-OS\" -Force
}

# Write version file
Set-Content -Path "$UsbPath\RQBBOX-OS\VERSION" -Value $Version

Write-Host ""
Write-Host "✅ RQBBOX OS v$Version successfully flashed to USB!" -ForegroundColor Green
Write-Host "📍 Location: $UsbPath\RQBBOX-OS" -ForegroundColor Green
Write-Host ""
Write-Host "🎮 Plug this USB into any device and launch RQBBOX OS instantly." -ForegroundColor Cyan
Write-Host ""
