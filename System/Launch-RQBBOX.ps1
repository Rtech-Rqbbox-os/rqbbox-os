# RQBBOX OS Portable USB - Fullscreen Launcher
# Starts local API server + Edge kiosk pointed at localhost

param(
    [string]$DriveLetter = "H",
    [int]$Port = 19777
)

$ErrorActionPreference = "SilentlyContinue"
$RQBRoot = "${DriveLetter}:\RQBBOX_OS"
$NodeServer = Join-Path $RQBRoot "System\Server\server.js"
$PwshServer = Join-Path $RQBRoot "System\RQBBOX-Server.ps1"
$ServerPidFile = Join-Path $RQBRoot "System\rqbbox-server.pid"
$LogPath = Join-Path $RQBRoot "System\rqbbox.log"
$LaunchUrl = "http://127.0.0.1:$Port/"

function Write-RQBLog($msg) {
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content -Path $LogPath -Value "[$ts] $msg"
}

if (-not (Test-Path $RQBRoot)) {
    Write-Host "RQBBOX OS not found at $RQBRoot" -ForegroundColor Red
    exit 1
}

# Start API server — try Node.js first (cross-platform), fallback to PowerShell
$serverRunning = $false
if (Test-Path $ServerPidFile) {
    $spid = Get-Content $ServerPidFile -ErrorAction SilentlyContinue
    if ($spid -and (Get-Process -Id $spid -ErrorAction SilentlyContinue)) { $serverRunning = $true }
}

if (-not $serverRunning) {
    $nodeInstalled = (Get-Command node -ErrorAction SilentlyContinue) -ne $null
    if ($nodeInstalled -and (Test-Path $NodeServer)) {
        Write-RQBLog "Starting Node.js server on port $Port (cross-platform)"
        Start-Process -FilePath node -ArgumentList "`"$NodeServer`"" -WindowStyle Hidden
        Start-Sleep -Seconds 3
    } elseif (Test-Path $PwshServer) {
        Write-RQBLog "Starting PowerShell server on port $Port (Windows)"
        Start-Process powershell -ArgumentList @(
            '-ExecutionPolicy', 'Bypass', '-WindowStyle', 'Hidden',
            '-File', "`"$PwshServer`"", '-DriveLetter', $DriveLetter, '-Port', $Port
        ) -WindowStyle Hidden
        Start-Sleep -Seconds 2
    }
}

Write-RQBLog "Launching RQBBOX OS at $LaunchUrl"

$edgePaths = @(
    "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
    "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe"
)

$launched = $false
foreach ($edge in $edgePaths) {
    if (Test-Path $edge) {
        Start-Process -FilePath $edge -ArgumentList @(
            "--app=$LaunchUrl",
            "--start-fullscreen",
            "--disable-extensions",
            "--no-first-run",
            "--edge-kiosk-type=fullscreen"
        ) -WindowStyle Maximized
        $launched = $true
        break
    }
}

if (-not $launched) {
    Start-Process $LaunchUrl
}

Write-Host "RQBBOX OS Portable USB launched!" -ForegroundColor Cyan
Write-Host "Server: $LaunchUrl" -ForegroundColor Gray
Write-Host "Plug In. Play Anywhere. - RhysTech" -ForegroundColor Magenta
