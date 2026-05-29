$SERVER = "http://127.0.0.1:19777"

# RQBBOX OS — Play Store App Installer
# Run this script to install Play Store apps to your RQBBOX USB
# Usage: .\play-store-installer.ps1 -AppId "com.example.app"

param(
  [string]$AppId = "",
  [switch]$ListInstalled,
  [switch]$ListAvailable
)

if ($ListInstalled) {
  Write-Host "📋 Installed RQBBOX Play Store Apps:" -ForegroundColor Cyan
  try {
    $r = Invoke-RestMethod -Uri "$SERVER/api/play-store/installed" -Method GET -ErrorAction Stop
    if ($r.installed.Count -eq 0) {
      Write-Host "  No apps installed yet." -ForegroundColor Yellow
    } else {
      $r.installed | ForEach-Object { Write-Host "  $($_.icon) $($_.title) ($($_.category))" -ForegroundColor Green }
      Write-Host "Total: $($r.count)" -ForegroundColor Cyan
    }
  } catch {
    Write-Host "  ❌ Server not running at $SERVER" -ForegroundColor Red
    Write-Host "  Start RQBBOX OS server first." -ForegroundColor Yellow
  }
  return
}

if ($ListAvailable) {
  Write-Host "📦 Available RQBBOX Play Store Packages:" -ForegroundColor Cyan
  try {
    $r = Invoke-RestMethod -Uri "$SERVER/api/play-store/packages" -Method GET -ErrorAction Stop
    $r | ForEach-Object { Write-Host "  $($_.icon) $($_.title) ($($_.category))" -ForegroundColor Green }
  } catch {
    Write-Host "  ❌ Server not running at $SERVER" -ForegroundColor Red
  }
  return
}

if ([string]::IsNullOrEmpty($AppId)) {
  Write-Host "Usage:" -ForegroundColor Yellow
  Write-Host "  .\play-store-installer.ps1 -AppId ""com.example.app""" -ForegroundColor Gray
  Write-Host "  .\play-store-installer.ps1 -ListInstalled" -ForegroundColor Gray
  Write-Host "  .\play-store-installer.ps1 -ListAvailable" -ForegroundColor Gray
  Write-Host ""
  Write-Host "Example: .\play-store-installer.ps1 -AppId ""com.activision.callofduty.shooter""" -ForegroundColor Gray
  return
}

Write-Host "⬇ Installing $AppId to RQBBOX OS..." -ForegroundColor Cyan
try {
  $body = @{ id = $AppId } | ConvertTo-Json
  $r = Invoke-RestMethod -Uri "$SERVER/api/play-store/install" -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
  if ($r.ok) {
    Write-Host "  ✅ $($r.message)" -ForegroundColor Green
    if ($r.playStoreUrl) {
      Write-Host "  🌐 Opening Play Store: $($r.playStoreUrl)" -ForegroundColor Cyan
      Start-Process $r.playStoreUrl
    }
  } else {
    Write-Host "  ❌ $($r.error)" -ForegroundColor Red
  }
} catch {
  Write-Host "  ❌ Server not running at $SERVER" -ForegroundColor Red
  Write-Host "  Start RQBBOX OS server first, or download from: https://github.com/Rtech-Rqbbox-os/rqbbox-os/releases" -ForegroundColor Yellow
}
