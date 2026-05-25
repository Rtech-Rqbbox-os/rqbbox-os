# RQBBOX OS Portable USB — Background Monitor
# Watches for USB drive, auto-launches on plug-in, auto-closes on unplug
param([string]$DriveLetter = "H")

$LauncherScript = Join-Path $PSScriptRoot "..\Launch-RQBBOX.ps1"
$LauncherUrl = "http://127.0.0.1:19777/"
$LogPath = Join-Path $PSScriptRoot "..\rqbbox-monitor.log"
$Port = 19777

function Log($m) {
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content $LogPath "[$ts] $m" -ErrorAction SilentlyContinue
}

function Is-USB-Present {
    $drive = Get-Volume -DriveLetter $DriveLetter -ErrorAction SilentlyContinue
    if ($drive -and $drive.DriveType -eq "Removable" -and $drive.Size -gt 0) { return $true }
    $di = Get-PSDrive -Name $DriveLetter -ErrorAction SilentlyContinue
    if ($di -and $di.Used -gt 0) { return $true }
    return $false
}

function Is-RQBBOX-Running {
    try {
        $r = Invoke-WebRequest -Uri $LauncherUrl -TimeoutSec 1 -UseBasicParsing -ErrorAction Stop
        return $r.StatusCode -eq 200
    } catch { return $false }
}

function Close-RQBBOX {
    $procs = Get-Process -Name "msedge", "powershell" -ErrorAction SilentlyContinue
    $procs | Where-Object { $_.CommandLine -match "19777|rqbbox" } | Stop-Process -Force -ErrorAction SilentlyContinue
}

Log "Monitor started for drive $DriveLetter`:"

$lastState = $false
while ($true) {
    $present = Is-USB-Present
    if ($present -and -not $lastState) {
        Log "USB detected — launching RQBBOX"
        & $LauncherScript -DriveLetter $DriveLetter -Port $Port
    }
    elseif (-not $present -and $lastState) {
        Log "USB removed — closing RQBBOX"
        Close-RQBBOX
    }
    $lastState = $present
    Start-Sleep -Seconds 3
}
