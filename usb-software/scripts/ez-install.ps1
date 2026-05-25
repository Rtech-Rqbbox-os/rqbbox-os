# =============================================================
# RQBBOX OS v2.6.0.4 — EZ Install Script (Windows PowerShell)
# =============================================================
# One command to install RQBBOX OS on Windows.
# No bootable USB required. Just run this script.
#
# Usage:
#   Right-click → Run with PowerShell
#   OR: powershell -ExecutionPolicy Bypass -File ez-install.ps1
#
# RTech — GOTECH AI
# =============================================================

$Version    = "2.6.0.4"
$AppUrl     = "https://inquisitive-rqbbox-core-play.base44.app"
$GitHub     = "https://github.com/Rtech-Rqbbox-os/rqbbox-os"
$InstallDir = "$env:LOCALAPPDATA\RQBBOX-OS"
$ScriptDir  = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir    = Split-Path -Parent $ScriptDir

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     RQBBOX OS v$Version — EZ Installer          ║" -ForegroundColor Cyan
Write-Host "║     RTech · GOTECH AI                            ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "  No bootable USB required." -ForegroundColor Green
Write-Host "  Flash USB + EZ Install — done in seconds." -ForegroundColor Green
Write-Host ""

# ── Check Node.js ──
$nodeCheck = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCheck) {
    Write-Host "📦  Node.js not found." -ForegroundColor Yellow
    Write-Host "    Download from https://nodejs.org and re-run this script." -ForegroundColor Yellow
    Write-Host ""
    $open = Read-Host "    Open nodejs.org now? [Y/n]"
    if ($open -ne 'n') { Start-Process "https://nodejs.org" }
    exit 1
}
$nodeVer = node -v
Write-Host "  ✓ Node.js $nodeVer found" -ForegroundColor Green

$npmVer = npm -v
Write-Host "  ✓ npm v$npmVer found" -ForegroundColor Green

# ── Create install directory ──
Write-Host ""
Write-Host "📁  Installing to: $InstallDir" -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null

# ── Copy files ──
Write-Host "🚀  Copying RQBBOX OS files..."
$dirs = @("core", "assets")
foreach ($d in $dirs) {
    if (Test-Path "$RootDir\$d") {
        Copy-Item -Path "$RootDir\$d" -Destination "$InstallDir\$d" -Recurse -Force
        Write-Host "    ✓ $d" -ForegroundColor Green
    }
}

# ── Install Electron launcher ──
Write-Host "📦  Installing Electron launcher..."
$launcherSrc = "$RootDir\launcher\windows"
if (Test-Path $launcherSrc) {
    Copy-Item -Path $launcherSrc -Destination "$InstallDir\launcher" -Recurse -Force
}
Push-Location "$InstallDir\launcher"
npm install --silent
Pop-Location

# ── Write version ──
Set-Content -Path "$InstallDir\VERSION"     -Value $Version
Set-Content -Path "$InstallDir\APP_URL.txt" -Value $AppUrl

# ── Create launch batch file ──
$launchBat = @"
@echo off
cd /d "$InstallDir\launcher"
npx electron .
"@
Set-Content -Path "$InstallDir\Launch RQBBOX OS.bat" -Value $launchBat

# ── Desktop shortcut ──
$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\RQBBOX OS.lnk")
$Shortcut.TargetPath   = "$InstallDir\Launch RQBBOX OS.bat"
$Shortcut.WorkingDirectory = "$InstallDir\launcher"
$Shortcut.Description  = "RQBBOX OS v$Version"
$Shortcut.Save()
Write-Host "  ✓ Desktop shortcut created" -ForegroundColor Green

# ── Start Menu shortcut ──
$startMenu = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\RQBBOX OS.lnk"
$Shortcut2 = $WshShell.CreateShortcut($startMenu)
$Shortcut2.TargetPath   = "$InstallDir\Launch RQBBOX OS.bat"
$Shortcut2.WorkingDirectory = "$InstallDir\launcher"
$Shortcut2.Description  = "RQBBOX OS v$Version"
$Shortcut2.Save()
Write-Host "  ✓ Start Menu shortcut created" -ForegroundColor Green

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  ✅  RQBBOX OS v$Version installed!             ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "  📍 Location : $InstallDir" -ForegroundColor Cyan
Write-Host "  🌐 App URL  : $AppUrl"    -ForegroundColor Cyan
Write-Host "  🔗 GitHub   : $GitHub"    -ForegroundColor Cyan
Write-Host ""
Write-Host "  Launch: Double-click 'RQBBOX OS' on your Desktop" -ForegroundColor White
Write-Host ""

$launch = Read-Host "  Launch RQBBOX OS now? [Y/n]"
if ($launch -ne 'n') {
    Write-Host ""
    Write-Host "🚀  Launching RQBBOX OS v$Version..." -ForegroundColor Cyan
    Start-Process "$InstallDir\Launch RQBBOX OS.bat"
}
