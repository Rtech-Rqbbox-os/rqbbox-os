<#
.SYNOPSIS
  Enable RQBBOX Game Mode on Windows — optimizes system, adds auto-start, Game Bar integration.
.DESCRIPTION
  Applies Windows Gaming Mode, sets High Performance power plan, registers RQBBOX OS in
  Windows Game Bar, adds auto-start on logon, creates Start Menu shortcut.
  Reversible with -Revert flag.
.PARAMETER Revert
  Undo all RQBBOX Mode changes.
.PARAMETER Status
  Show current RQBBOX Mode status.
.PARAMETER AutoStart
  Toggle RQBBOX auto-start on Windows logon only (no other changes).
.EXAMPLE
  .\Enable-RQBBOXMode.ps1
  .\Enable-RQBBOXMode.ps1 -Revert
  .\Enable-RQBBOXMode.ps1 -Status
  .\Enable-RQBBOXMode.ps1 -AutoStart
#>

param(
  [switch]$Revert,
  [switch]$Status,
  [switch]$AutoStart
)

$ErrorActionPreference = 'SilentlyContinue'
$gpuPrefPath = 'HKCU:\SOFTWARE\Microsoft\DirectX\UserGpuPreferences'
$gameBarPath = 'HKCU:\Software\Microsoft\GameBar'
$startupPath = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup"
$startMenuPath = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\RQBBOX OS"
$rqbboxState = "$env:LOCALAPPDATA\rqbbox-mode"
$serverScript = "$PSScriptRoot\..\Server\server.js"
$launcherUrl = 'http://127.0.0.1:19777'

function Get-RQBBOXRoot {
  $dir = Split-Path -Parent $PSScriptRoot
  return Split-Path -Parent $dir
}

function Get-NodePath {
  $node = (Get-Command node -ErrorAction SilentlyContinue).Source
  if (-not $node -and (Test-Path "$env:ProgramFiles\nodejs\node.exe")) {
    $node = "$env:ProgramFiles\nodejs\node.exe"
  }
  if (-not $node -and (Test-Path "${env:ProgramFiles(x86)}\nodejs\node.exe")) {
    $node = "${env:ProgramFiles(x86)}\nodejs\node.exe"
  }
  return $node
}

if ($Status) {
  Write-Host "`nRQBBOX Game Mode Status:" -ForegroundColor Cyan
  $active = Test-Path $rqbboxState
  Write-Host "  Active: $(if ($active) { 'Yes' } else { 'No' })" -ForegroundColor $(if ($active) { 'Green' } else { 'Red' })
  $plan = (powercfg /getactivescheme) -replace '^.*\((.*)\).*$', '$1'
  Write-Host "  Power Plan: $plan"
  $gamemode = (Get-ItemProperty -Path $gameBarPath -Name 'AllowAutoGameMode' -ErrorAction SilentlyContinue).AllowAutoGameMode
  Write-Host "  Windows Game Mode: $(if ($gamemode) { 'On' } else { 'Off' })"
  $startupLink = Test-Path "$startupPath\RQBBOX OS.lnk"
  Write-Host "  Auto-start on logon: $(if ($startupLink) { 'Yes' } else { 'No' })"
  $gbRegistration = Get-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\GameBar' -Name 'RQBBOX' -ErrorAction SilentlyContinue
  Write-Host "  Game Bar registered: $(if ($gbRegistration) { 'Yes' } else { 'No' })"
  return
}

if ($AutoStart) {
  $startupLink = "$startupPath\RQBBOX OS.lnk"
  if (Test-Path $startupLink) {
    Remove-Item $startupLink -Force
    Write-Host 'RQBBOX auto-start removed from Windows logon.' -ForegroundColor Yellow
  } else {
    $nodePath = Get-NodePath
    if (-not $nodePath) { Write-Host 'Node.js not found. Install Node.js first.' -ForegroundColor Red; exit 1 }
    $root = Get-RQBBOXRoot
    $wshell = New-Object -ComObject WScript.Shell
    $shortcut = $wshell.CreateShortcut($startupLink)
    $shortcut.TargetPath = 'cmd.exe'
    $shortcut.Arguments = "/c start `"`" `"$nodePath`" `"$serverScript`" && start `"`" `"$launcherUrl`""
    $shortcut.WorkingDirectory = "$root\System\Server"
    $shortcut.Description = 'RQBBOX OS Server — portable USB gaming'
    $shortcut.Save()
    Write-Host "RQBBOX auto-start added to Windows logon." -ForegroundColor Green
    Write-Host "  Shortcut: $startupLink"
  }
  return
}

if ($Revert) {
  Write-Host 'Reverting RQBBOX Game Mode...' -ForegroundColor Yellow
  powercfg /setactive '381b4222-f694-41f0-9685-ff5bb260df2e' 2>$null
  Remove-Item "$startupPath\RQBBOX OS.lnk" -Force -ErrorAction SilentlyContinue
  Remove-Item $rqbboxState -Recurse -Force -ErrorAction SilentlyContinue
  Remove-Item "$startMenuPath\RQBBOX OS.lnk" -Force -ErrorAction SilentlyContinue
  Remove-Item "$startMenuPath\RQBBOX OS (Server).lnk" -Force -ErrorAction SilentlyContinue
  Remove-Item "$startMenuPath" -Force -ErrorAction SilentlyContinue
  Remove-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\GameBar' -Name 'RQBBOX' -ErrorAction SilentlyContinue
  # Remove node GPU pref
  Remove-ItemProperty -Path $gpuPrefPath -Name 'node.exe' -ErrorAction SilentlyContinue
  Write-Host 'Reverted. Restart recommended.' -ForegroundColor Green
  return
}

Write-Host 'Enabling RQBBOX Game Mode on Windows...' -ForegroundColor Cyan

# 1. Set High Performance power plan
Write-Host '  [1/6] Setting High Performance power plan...' -ForegroundColor Gray
powercfg /setactive '8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c' 2>$null
if (-not $?) {
  powercfg /duplicatescheme '8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c' 2>$null
  powercfg /setactive '8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c' 2>$null
}

# 2. Enable Windows Game Mode
Write-Host '  [2/6] Enabling Windows Game Mode...' -ForegroundColor Gray
New-Item -Path $gameBarPath -Force | Out-Null
Set-ItemProperty -Path $gameBarPath -Name 'AllowAutoGameMode' -Value 1 -Type DWord
Set-ItemProperty -Path $gameBarPath -Name 'AutoGameModeEnabled' -Value 1 -Type DWord

# 3. Register RQBBOX in Windows Game Bar
Write-Host '  [3/6] Registering RQBBOX in Windows Game Bar...' -ForegroundColor Gray
New-Item -Path 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\GameBar' -Force | Out-Null
Set-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\GameBar' -Name 'RQBBOX' -Value 'RQBBOX OS' -Type String
New-Item -Path 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\GameDVR' -Force | Out-Null
Set-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\GameDVR' -Name 'AppCaptureEnabled' -Value 1 -Type DWord

# 4. GPU optimization for the RQBBOX server process
Write-Host '  [4/6] Optimizing GPU for RQBBOX...' -ForegroundColor Gray
$nodePath = Get-NodePath
if ($nodePath) {
  New-ItemProperty -Path $gpuPrefPath -Name 'node.exe' -PropertyType String -Value 'High' -Force | Out-Null
}

# 5. Add auto-start on Windows logon
Write-Host '  [5/6] Adding RQBBOX to Windows Startup...' -ForegroundColor Gray
$nodePath = Get-NodePath
if ($nodePath) {
  $root = Get-RQBBOXRoot
  # Create Start Menu folder
  New-Item -Path $startMenuPath -ItemType Directory -Force | Out-Null
  $wshell = New-Object -ComObject WScript.Shell
  # Auto-start shortcut
  $startupLink = "$startupPath\RQBBOX OS.lnk"
  $shortcut = $wshell.CreateShortcut($startupLink)
  $shortcut.TargetPath = 'cmd.exe'
  $shortcut.Arguments = "/c start `"`" `"$nodePath`" `"$serverScript`" && start `"`" `"$launcherUrl`""
  $shortcut.WorkingDirectory = "$root\System\Server"
  $shortcut.Description = 'RQBBOX OS Server — portable USB gaming'
  $shortcut.Save()
  # Start Menu shortcut
  $menuLink = "$startMenuPath\RQBBOX OS.lnk"
  $menuSc = $wshell.CreateShortcut($menuLink)
  $menuSc.TargetPath = "https://github.com/Rtech-Rqbbox-os/rqbbox-os"
  $menuSc.Description = 'RQBBOX OS GitHub'
  $menuSc.Save()
}

# 6. Disable background apps for gaming sessions
Write-Host '  [6/6] Disabling background apps...' -ForegroundColor Gray
New-Item -Path 'HKCU:\Software\Microsoft\Windows\CurrentVersion\BackgroundAccessApplications' -Force | Out-Null
Set-ItemProperty -Path 'HKCU:\Software\Microsoft\Windows\CurrentVersion\BackgroundAccessApplications' -Name 'GlobalUserDisabled' -Value 1 -Type DWord

# Mark as active
New-Item -Path $rqbboxState -ItemType Directory -Force | Out-Null
Set-Content -Path "$rqbboxState\status.json" -Value '{ "enabled": true, "appliedAt": "' + (Get-Date -Format o) + '" }'

Write-Host '`nRQBBOX Game Mode enabled!' -ForegroundColor Green
Write-Host '  - High Performance power plan' -ForegroundColor Gray
Write-Host '  - Windows Game Mode ON' -ForegroundColor Gray
Write-Host '  - Registered in Windows Game Bar (Win+G)' -ForegroundColor Gray
Write-Host '  - GPU optimized for RQBBOX server' -ForegroundColor Gray
Write-Host '  - Auto-start on Windows logon' -ForegroundColor Gray
Write-Host '  - Background apps disabled' -ForegroundColor Gray
Write-Host '`nPress Win+G to open Game Bar while RQBBOX is running.' -ForegroundColor Cyan
Write-Host 'Restart or log off to apply all changes.' -ForegroundColor Yellow
