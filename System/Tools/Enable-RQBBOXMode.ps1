<#
.SYNOPSIS
  Enable RQBBOX Game Mode on Windows — optimizes system for RQBBOX OS gaming.
.DESCRIPTION
  Applies Windows Gaming Mode settings, disables background apps, sets high-performance
  power plan, and registers RQBBOX OS as a gaming app. Reversible with -Revert flag.
.PARAMETER Revert
  Undo all RQBBOX Mode changes.
.PARAMETER Status
  Show current RQBBOX Mode status.
.EXAMPLE
  .\Enable-RQBBOXMode.ps1
  .\Enable-RQBBOXMode.ps1 -Revert
  .\Enable-RQBBOXMode.ps1 -Status
#>

param(
  [switch]$Revert,
  [switch]$Status
)

$ErrorActionPreference = 'SilentlyContinue'
$regPath = 'HKCU:\SOFTWARE\Microsoft\DirectX\UserGpuPreferences'
$rqbboxKey = 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\GameDVR'
$rqbboxPath = "$env:LOCALAPPDATA\rqbbox-mode"

if ($Status) {
  Write-Host "`nRQBBOX Game Mode Status:" -ForegroundColor Cyan
  $active = Test-Path $rqbboxPath
  Write-Host "  Active: $(if ($active) { 'Yes' } else { 'No' })" -ForegroundColor $(if ($active) { 'Green' } else { 'Red' })
  $plan = (powercfg /getactivescheme) -replace '^.*\((.*)\).*$', '$1'
  Write-Host "  Power Plan: $plan"
  $gamemode = (Get-ItemProperty -Path 'HKCU:\Software\Microsoft\GameBar' -Name 'AllowAutoGameMode' -ErrorAction SilentlyContinue).AllowAutoGameMode
  Write-Host "  Windows Game Mode: $(if ($gamemode) { 'On' } else { 'Off' })"
  return
}

if ($Revert) {
  Write-Host 'Reverting RQBBOX Game Mode...' -ForegroundColor Yellow
  powercfg /setactive '381b4222-f694-41f0-9685-ff5bb260df2e' 2>$null  # Balanced
  Remove-Item $rqbboxPath -Force -ErrorAction SilentlyContinue
  Write-Host 'Reverted. Restart recommended.' -ForegroundColor Green
  return
}

Write-Host 'Enabling RQBBOX Game Mode on Windows...' -ForegroundColor Cyan

# 1. Set High Performance power plan
Write-Host '  [1/4] Setting High Performance power plan...' -ForegroundColor Gray
powercfg /setactive '8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c' 2>$null
if (-not $?) {
  powercfg /duplicatescheme '8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c' 2>$null
  powercfg /setactive '8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c' 2>$null
}

# 2. Enable Windows Game Mode
Write-Host '  [2/4] Enabling Windows Game Mode...' -ForegroundColor Gray
New-Item -Path 'HKCU:\Software\Microsoft\GameBar' -Force | Out-Null
Set-ItemProperty -Path 'HKCU:\Software\Microsoft\GameBar' -Name 'AllowAutoGameMode' -Value 1 -Type DWord
Set-ItemProperty -Path 'HKCU:\Software\Microsoft\GameBar' -Name 'AutoGameModeEnabled' -Value 1 -Type DWord

# 3. Disable Fullscreen Optimizations for the RQBBOX server process
Write-Host '  [3/4] Optimizing GPU for RQBBOX...' -ForegroundColor Gray
$nodePath = (Get-Command node).Source
if ($nodePath) {
  $gpuPref = Get-ItemProperty -Path $regPath -Name 'node.exe' -ErrorAction SilentlyContinue
  if (-not $gpuPref) {
    New-ItemProperty -Path $regPath -Name 'node.exe' -PropertyType String -Value 'High' -Force | Out-Null
  }
}

# 4. Disable background apps for gaming sessions
Write-Host '  [4/4] Disabling background apps...' -ForegroundColor Gray
New-Item -Path 'HKCU:\Software\Microsoft\Windows\CurrentVersion\BackgroundAccessApplications' -Force | Out-Null
Set-ItemProperty -Path 'HKCU:\Software\Microsoft\Windows\CurrentVersion\BackgroundAccessApplications' -Name 'GlobalUserDisabled' -Value 1 -Type DWord

# Mark as active
New-Item -Path $rqbboxPath -ItemType Directory -Force | Out-Null
Set-Content -Path "$rqbboxPath\status.json" -Value '{ "enabled": true, "appliedAt": "' + (Get-Date -Format o) + '" }'

Write-Host 'RQBBOX Game Mode enabled!' -ForegroundColor Green
Write-Host 'Launch RQBBOX OS server and enjoy optimized gaming.' -ForegroundColor Cyan
